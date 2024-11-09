import React from 'react';
import { JobApplication } from '../types/notion';

interface JobApplicationCardProps {
  application: JobApplication;
}

const JobApplicationCard: React.FC<JobApplicationCardProps> = ({ application }) => {
  const getStageColor = (stage: string) => {
    switch (stage) {
      case '応募': return 'bg-blue-100 text-blue-800';
      case '書類選考': return 'bg-yellow-100 text-yellow-800';
      case '面接': return 'bg-purple-100 text-purple-800';
      case '内定': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case '合格': return 'bg-green-100 text-green-800';
      case '不合格': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{application.companyName}</h3>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(application.stage)}`}>
            {application.stage}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResultColor(application.result)}`}>
            {application.result}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium">応募職種:</span> {application.position}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">次のタスク:</span> {application.tasks}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          作成日: {new Date(application.createdAt).toLocaleDateString('ja-JP')}
        </p>
      </div>
    </div>
  );
};

export default JobApplicationCard;