import { Client } from '@notionhq/client';
import type { JobApplication } from '../types/types';

export class NotionService {
  private notion: Client;
  private databaseId: string;

  constructor(apiKey: string, databaseId: string) {
    this.notion = new Client({ auth: apiKey });
    this.databaseId = databaseId;
  }

  async createApplication(application: Omit<JobApplication, 'id' | 'createdAt'>) {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties: {
          '企業名': {
            title: [
              {
                text: {
                  content: application.companyName
                }
              }
            ]
          },
          '応募職種': {
            rich_text: [
              {
                text: {
                  content: application.position
                }
              }
            ]
          },
          'タスク（応募書類等）': {
            rich_text: [
              {
                text: {
                  content: application.tasks
                }
              }
            ]
          },
          'ステージ': {
            select: {
              name: application.stage
            }
          },
          '結果': {
            select: {
              name: application.result
            }
          }
        }
      });
      
      return response;
    } catch (error) {
      console.error('Failed to create Notion page:', error);
      throw error;
    }
  }

  async fetchApplications() {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        sorts: [
          {
            property: 'created_time',
            direction: 'descending',
          },
        ],
      });

      return response.results.map((page: any) => ({
        id: page.id,
        companyName: page.properties['企業名'].title[0]?.text.content || '',
        position: page.properties['応募職種'].rich_text[0]?.text.content || '',
        tasks: page.properties['タスク（応募書類等）'].rich_text[0]?.text.content || '',
        stage: page.properties['ステージ'].select?.name || '応募',
        result: page.properties['結果'].select?.name || '結果待ち',
        createdAt: page.created_time,
      }));
    } catch (error) {
      console.error('Failed to fetch Notion pages:', error);
      throw error;
    }
  }

  async deleteApplication(pageId: string) {
    try {
      await this.notion.pages.update({
        page_id: pageId,
        archived: true,
      });
    } catch (error) {
      console.error('Failed to delete Notion page:', error);
      throw error;
    }
  }
}