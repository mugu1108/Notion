import { JobApplication, NotionResponse } from '../types/notion';

const NOTION_API_KEY = import.meta.env.VITE_NOTION_API_KEY;
const NOTION_DATABASE_ID = import.meta.env.VITE_NOTION_DATABASE_ID;

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  throw new Error('Missing required environment variables');
}

export async function fetchJobApplications(): Promise<JobApplication[]> {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sorts: [
          {
            property: 'created_time',
            direction: 'desc'
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: NotionResponse = await response.json();
    
    if (!data.results) {
      throw new Error('Invalid response format from Notion API');
    }

    return data.results.map(page => {
      try {
        return {
          id: page.id,
          companyName: page.properties['企業名']?.title[0]?.text?.content || '企業名なし',
          position: page.properties['応募職種']?.rich_text[0]?.text?.content || '職種なし',
          tasks: page.properties['タスク（応募書類等）']?.rich_text[0]?.text?.content || 'タスクなし',
          stage: page.properties['ステージ']?.select?.name || '応募',
          result: page.properties['結果']?.select?.name || '結果待ち',
          createdAt: page.created_time,
        };
      } catch (error) {
        console.error('Error parsing page:', error);
        return null;
      }
    }).filter((app): app is JobApplication => app !== null);
  } catch (error) {
    console.error('Error fetching Notion data:', error);
    throw new Error(error instanceof Error ? error.message : '就活情報の取得中にエラーが発生しました');
  }
}

export async function createJobApplication(application: Omit<JobApplication, 'id' | 'createdAt'>) {
  try {
    if (!application.companyName) {
      throw new Error('企業名は必須です');
    }

    const response = await fetch(`https://api.notion.com/v1/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          '企業名': {
            title: [{ text: { content: application.companyName } }]
          },
          '応募職種': {
            rich_text: [{ text: { content: application.position } }]
          },
          'タスク（応募書類等）': {
            rich_text: [{ text: { content: application.tasks } }]
          },
          'ステージ': {
            select: { name: application.stage }
          },
          '結果': {
            select: { name: application.result }
          }
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating job application:', error);
    throw new Error(error instanceof Error ? error.message : '就活情報の作成中にエラーが発生しました');
  }
}