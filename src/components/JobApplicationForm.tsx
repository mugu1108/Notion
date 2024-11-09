import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createJobApplication } from '../services/notionService';

interface JobApplicationFormProps {
  onApplicationCreated: () => void;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ onApplicationCreated }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    position: '',
    tasks: '',
    stage: '応募',
    result: '結果待ち'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJobApplication(formData);
      toast.success('求人情報が追加されました！');
      setFormData({
        companyName: '',
        position: '',
        tasks: '',
        stage: '応募',
        result: '結果待ち'
      });
      onApplicationCreated();
    } catch (error) {
      toast.error('エラーが発生しました。もう一度お試しください。');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">企業名</label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">応募職種</label>
        <input
          type="text"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">タスク</label>
        <input
          type="text"
          value={formData.tasks}
          onChange={(e) => setFormData({ ...formData, tasks: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">ステージ</label>
          <select
            value={formData.stage}
            onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="応募">応募</option>
            <option value="書類選考">書類選考</option>
            <option value="面接">面接</option>
            <option value="内定">内定</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">結果</label>
          <select
            value={formData.result}
            onChange={(e) => setFormData({ ...formData, result: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="結果待ち">結果待ち</option>
            <option value="合格">合格</option>
            <option value="不合格">不合格</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
      >
        追加
      </button>
    </form>
  );
};

export default JobApplicationForm;