import React, { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import JobApplicationForm from './components/JobApplicationForm';
import JobApplicationCard from './components/JobApplicationCard';
import { fetchJobApplications } from './services/notionService';
import { JobApplication } from './types/notion';

function App() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchJobApplications();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '就活情報の取得中にエラーが発生しました');
      console.error('Error loading applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <GraduationCap className="h-8 w-8 text-indigo-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">就活管理システム</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <JobApplicationForm onApplicationCreated={loadApplications} />
          </div>
          
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                <p className="text-red-800">{error}</p>
                <button 
                  onClick={loadApplications}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  再試行
                </button>
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-500">まだ応募情報がありません。</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {applications.map((application) => (
                  <JobApplicationCard key={application.id} application={application} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;