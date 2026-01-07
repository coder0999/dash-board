import React, { useState } from 'react';
import { useUI } from '../context/UIContext';
import { GEMINI_API_KEY } from '../firebase';

const ImageUploader = ({ onQuestionsExtracted, defaultPoints }) => {
  const { showAlert, showLoading, hideLoading } = useUI();
  const [uploadedImages, setUploadedImages] = useState([]);

  const imageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file: file,
      preview: URL.createObjectURL(file)
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const processSingleImage = async (base64Image) => {
    const textPrompt = `
        استخرج الأسئلة والخيارات من هذه الصور بالترتيب.
        الأهم من ذلك، بعد تحليل كل سؤال وخياراته، حدد الإجابة الصحيحة.
        يجب أن يكون الناتج مصفوفة من الكائنات، كل كائن يمثل سؤالاً. 
        يجب أن يحتوي كل كائن على الحقول التالية:
        - "text": نص السؤال.
        - "options": مصفوفة من الخيارات النصية.
        - "correctAnswer": فهرس الإجابة الصحيحة ضمن مصفوفة الخيارات (يبدأ من 0).
        فكر بعناية لتحديد الإجابة الصحيحة لكل سؤال.
    `;

    const imagePart = {
      inlineData: {
        mimeType: 'image/png',
        data: base64Image
      }
    };

    const parts = [
      { text: textPrompt },
      imagePart
    ];

    const payload = {
      contents: [{
        role: "user",
        parts: parts
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              "text": { "type": "STRING" },
              "options": {
                "type": "ARRAY",
                "items": { "type": "STRING" }
              },
              "correctAnswer": { "type": "INTEGER" }
            }
          }
        }
      }
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();

    if (result && result.candidates && result.candidates.length > 0 &&
      result.candidates[0].content && result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0) {

      const jsonText = result.candidates[0].content.parts[0].text;
      return JSON.parse(jsonText);
    } else {
      throw new Error('Failed to extract questions from image.');
    }
  };

  const processImages = async () => {
    if (uploadedImages.length === 0) {
      showAlert('الرجاء رفع صورة واحدة على الأقل.');
      return;
    }

    alert(`بدأ تحليل ${uploadedImages.length} صورة. قد تستغرق هذه العملية بعض الوقت.`);
    showLoading();
    let allQuestions = [];

    try {
      for (let i = 0; i < uploadedImages.length; i++) {
        alert(`Entering loop for image ${i + 1}`);
        const image = uploadedImages[i];
        showAlert(`جاري تحليل الصورة ${i + 1} من ${uploadedImages.length}...`);
        const base64Image = await imageToBase64(image.file);
        const parsedQuestions = await processSingleImageWithRetry(base64Image);

        if (!Array.isArray(parsedQuestions)) {
          showAlert('فشل تحليل الأسئلة من الصورة. استجابة غير متوقعة من الـ API.');
          continue; // Skip to the next image
        }

        const newQuestions = parsedQuestions.map((q, index) => ({
          id: `q-image-${Date.now()}-${i}-${index}`,
          text: q.text,
          type: 'multiple-choice',
          options: q.options,
          correctAnswer: q.correctAnswer,
          points: parseFloat(defaultPoints) || 1,
        }));
        allQuestions = [...allQuestions, ...newQuestions];
        showAlert(`تم تحليل الصورة ${i + 1} بنجاح. ${uploadedImages.length - (i + 1)} متبقي.`);

        // Add a delay between each request to avoid hitting the rate limit
        if (i < uploadedImages.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }

      onQuestionsExtracted(allQuestions);
      showAlert('تم استخراج الأسئلة بنجاح! يمكنك الآن مراجعتها وحفظها.');

    } catch (error) {
      console.error("Image processing failed:", error);
      showAlert('حدث خطأ أثناء تحليل الصور. الرجاء التأكد من أن الصور تحتوي على أسئلة واضحة.');
    } finally {
      hideLoading();
    }
  };

  const processSingleImageWithRetry = async (base64Image, retries = 5, delay = 2000) => {
    try {
      return await processSingleImage(base64Image);
    } catch (error) {
      if (error.message === 'Rate limit exceeded' && retries > 0) {
        showAlert(`تم تجاوز حد المعدل. إعادة المحاولة خلال ${delay / 1000} ثانية...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return await processSingleImageWithRetry(base64Image, retries - 1, delay * 2);
      } else {
        throw error;
      }
    }
  };

  return (
    <div id="image-content">
      <div className="flex items-center justify-center w-full">
        <label id="image-upload-label" htmlFor="image-upload" className="relative flex flex-col items-center justify-center w-full h-96 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 transition-colors">
          <div id="image-preview-container" className="absolute inset-0 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto">
            {uploadedImages.map(image => (
              <div key={image.id} className="relative image-preview-item">
                <img src={image.preview} alt="preview" className="w-full h-full object-cover rounded-lg shadow-md" />
                <button onClick={() => removeImage(image.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-75 hover:opacity-100 transition-opacity">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
          {uploadedImages.length === 0 && (
            <div id="upload-placeholder" className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span className="text-gray-500 mt-2">انقر لرفع الصور</span>
            </div>
          )}
          <input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg" multiple onChange={handleImageUpload} />
        </label>
      </div>
      <div className="mt-4 flex justify-center">
        <button 
          id="process-image-btn" 
          onClick={processImages}
          className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform active:scale-105" 
          disabled={uploadedImages.length === 0}
        >
          تحليل الصور واستخراج الأسئلة
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;