import { useState, useEffect } from 'react';
import { NotionService } from '../services/notion';
import type { JobApplication } from '../types/types';
import toast from 'react-hot-toast';

const NOTION_API_KEY = import.meta.env.VITE_NOTION_API_KEY;
const NOTION_DATABASE_ID = import.meta.env.VITE_NOTION_DATABASE_ID;

export function useNotion() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [notionService, setNotionService] = useState<NotionService | null>(null);

  useEffect(() => {
    if (NOTION_API_KEY && NOTION_DATABASE_ID) {
      setNotionService(new NotionService(NOTION_API_KEY, NOTION_DATABASE_ID));
    } else {
      toast.error('Notion APIキーとデータベースIDを設定してください');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (notionService) {
      fetchApplications();
    }
  }, [notionService]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await notionService!.fetchApplications();
      setApplications(data);
    } catch (error) {
      toast.error('応募情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async (data: Omit<JobApplication, 'id' | 'createdAt'>) => {
    try {
      await notionService!.createApplication(data);
      toast.success('応募情報を登録しました');
      await fetchApplications();
    } catch (error) {
      toast.error('応募情報の登録に失敗しました');
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      await notionService!.deleteApplication(id);
      toast.success('応募情報を削除しました');
      await fetchApplications();
    } catch (error) {
      toast.error('応募情報の削除に失敗しました');
    }
  };

  return {
    applications,
    loading,
    createApplication,
    deleteApplication,
    isInitialized: !!notionService,
  };
}