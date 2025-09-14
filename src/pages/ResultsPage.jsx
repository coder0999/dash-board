import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { db } from '../firebase';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';

// --- Helper Components ---
const SummaryCard = ({ title, value, icon }) => (
  <div className="bg-white p-5 rounded-xl shadow-md flex items-center space-x-4 space-x-reverse">
    <div className="bg-blue-100 p-3 rounded-full">
      <i className={`fas ${icon} text-blue-600 text-xl`}></i>
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-gray-900 text-2xl font-bold">{value}</p>
    </div>
  </div>
);

import TabButton from '../components/TabButton';

const CustomizedAxisTick = (props) => {
  const { x, y, payload } = props;
  const maxChars = 10; // Max characters to show before truncating
  const fullText = payload.value;
  const truncatedText = fullText.length > maxChars ? `${fullText.substring(0, maxChars)}...` : fullText;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#6B7280" fontSize="12">
        <title>{fullText}</title> {/* This creates the hover tooltip */}
        {truncatedText}
      </text>
    </g>
  );
};

// --- Content Components ---
const OverviewContent = ({ results }) => {
  if (results.length === 0) {
    return <div className="text-center text-gray-500">No submission data available.</div>;
  }
  const totalStudents = results.length;
  const averageScore = (results.reduce((acc, curr) => acc + curr.score, 0) / totalStudents).toFixed(1);
  const highestScore = Math.max(...results.map(r => r.score));
  const lowestScore = Math.min(...results.map(r => r.score));
  const scoreDistribution = results.reduce((acc, curr) => {
    if (curr.score >= 90) acc['90-100']++; else if (curr.score >= 80) acc['80-89']++;
    else if (curr.score >= 70) acc['70-79']++; else if (curr.score >= 60) acc['60-69']++;
    else acc['<60']++; return acc;
  }, { '90-100': 0, '80-89': 0, '70-79': 0, '60-69': 0, '<60': 0 });
  const chartData = Object.keys(scoreDistribution).map(key => ({ name: key, الطلاب: scoreDistribution[key] }));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard title="متوسط الدرجات" value={`${averageScore}%`} icon="fa-percentage" />
        <SummaryCard title="أعلى درجة" value={`${highestScore}%`} icon="fa-arrow-up" />
        <SummaryCard title="أقل درجة" value={`${lowestScore}%`} icon="fa-arrow-down" />
        <SummaryCard title="عدد الطلاب" value={totalStudents} icon="fa-users" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-900">توزيع الدرجات</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" allowDecimals={false} />
              <YAxis type="category" dataKey="name" stroke="#6B7280" width={80} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }} />
              <Legend />
              <Bar dataKey="الطلاب" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-900">قائمة النتائج</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {results.sort((a, b) => b.score - a.score).map((result, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg">
                <span className="font-medium text-gray-800">{result.name}</span>
                <span className={`font-bold text-lg ${result.score >= 80 ? 'text-green-600' : result.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{result.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const DetailedAnalysisContent = ({ questions, results }) => {
    if (results.length === 0) {
        return <div className="text-center text-gray-500">No submission data available for detailed analysis.</div>;
    }
  const analysisData = useMemo(() => {
    return questions.map(question => {
      const answerCounts = question.options.reduce((acc, option) => {
        const optionText = typeof option === 'string' ? option : option.text;
        acc[optionText] = 0;
        return acc;
      }, {});

      results.forEach(result => {
        const studentAnswer = result.answers.find(a => a.qId === question.id);
        if (studentAnswer && answerCounts.hasOwnProperty(studentAnswer.answer)) {
          answerCounts[studentAnswer.answer]++;
        }
      });

      return {
        ...question,
        chartData: Object.keys(answerCounts).map(option => ({ name: option, عدد: answerCounts[option] }))
      };
    });
  }, [questions, results]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {analysisData.map((q) => (
        <div key={q.id} className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{`السؤال ${q.number}: ${q.text}`}</h3>
          <div className="w-full h-80 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={q.chartData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" interval={0} tick={<CustomizedAxisTick />} height={60} />
                  <YAxis allowDecimals={false} stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }} />
                  <Bar dataKey="عدد" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Main Page Component ---
function ResultsPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [submissions, setSubmissions] = useState([]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Fetch exam details once
    const fetchExam = async () => {
      try {
        const examRef = doc(db, 'exams', examId);
        const examSnap = await getDoc(examRef);
        if (examSnap.exists()) {
          setExam({ id: examSnap.id, ...examSnap.data() });
        } else {
          throw new Error("Exam not found");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching exam data: ", err);
      }
    };

    fetchExam();

    // Listen for real-time updates on submissions
    const submissionsRef = collection(db, 'exam_results', examId, 'submissions');
    const unsubscribe = onSnapshot(submissionsRef, (querySnapshot) => {
      const submissionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubmissions(submissionsData);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      console.error("Error fetching real-time results: ", err);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [examId]);

  const { processedResults, processedQuestions } = useMemo(() => {
    if (!exam) return { processedResults: [], processedQuestions: [] };

    const results = submissions.map(sub => ({
      name: sub.email, // Use email for name
      score: sub.percentage, // Use percentage for score
      answers: (exam.questions || []).map((q, index) => ({
        qId: q.id || `q${index}`, // Make sure question has an id
        answer: sub.userAnswers[index]
      }))
    }));

    const questions = (exam.questions || []).map((q, index) => ({
      ...q,
      id: q.id || `q${index}`, // Ensure id exists
      number: String(index + 1),
      options: q.options.map(opt => typeof opt === 'string' ? opt : opt.text)
    }));

    return { processedResults: results, processedQuestions: questions };
  }, [submissions, exam]);


  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><div className="text-xl font-semibold">Loading results...</div></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen"><div className="text-xl font-semibold text-red-600">Error: {error}</div></div>;
  }

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إحصائيات الامتحان</h1>
          <p className="text-gray-500">الامتحان: {exam?.title || examId}</p>
        </div>
        <button onClick={() => navigate(-1)} className="bg-white hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors border border-gray-300 flex items-center shadow-sm">
          <i className="fas fa-arrow-right ml-2"></i>
          <span>رجوع</span>
        </button>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6 space-x-reverse">
          <TabButton title="نظرة عامة" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <TabButton title="تحليل تفصيلي" isActive={activeTab === 'details'} onClick={() => setActiveTab('details')} />
        </nav>
      </div>

      <div>
        {activeTab === 'overview' && <OverviewContent results={processedResults} />}
        {activeTab === 'details' && <DetailedAnalysisContent questions={processedQuestions} results={processedResults} />}
      </div>
    </div>
  );
}

export default ResultsPage;
