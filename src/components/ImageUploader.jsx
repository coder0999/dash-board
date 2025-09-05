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

  const processImages = async () => {
    if (uploadedImages.length === 0) {
      showAlert('الرجاء رفع صورة واحدة على الأقل.');
      return;
    }

    showLoading();

    try {
      const base64Images = await Promise.all(uploadedImages.map(item => imageToBase64(item.file)));
      
      const textPrompt = `
          استخرج الأسئلة والإجابات والخيارات من هذه الصور بالترتيب الذي تم تحميله. يجب أن يكون الناتج مصفوفة من الكائنات، كل كائن يمثل سؤالاً. يجب أن يحتوي كل كائن على الحقول التالية: "text" (نص السؤال), "options" (مصفوفة من الخيارات), و "correctAnswer" (فهرس الخيار الصحيح يبدأ من 0).
      `;

      const imageParts = base64Images.map(data => ({
          inlineData: {
              mimeType: 'image/png', 
              data: data
          }
      }));

      const parts = [
          { text: textPrompt },
          ...imageParts 
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

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result && result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
          
          const jsonText = result.candidates[0].content.parts[0].text;
          const parsedQuestions = JSON.parse(jsonText);
          
          const newQuestions = parsedQuestions.map((q, index) => ({
              id: `q-image-${Date.now()}-${index}`,
              text: q.text,
              type: 'multiple-choice',
              options: q.options,
              correctAnswer: q.correctAnswer,
              points: parseFloat(defaultPoints) || 1,
          }));

          onQuestionsExtracted(newQuestions);
          showAlert('تم استخراج الأسئلة بنجاح! يمكنك الآن مراجعتها وحفظها.');
      } else {
          showAlert('فشل استخراج الأسئلة. الرجاء المحاولة مرة أخرى.');
      }

    } catch (error) {
      console.error("Image processing failed:", error);
      showAlert('حدث خطأ أثناء تحليل الصور. الرجاء التأكد من أن الصور تحتوي على أسئلة واضحة.');
    } finally {
      hideLoading();
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