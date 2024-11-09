export interface JobApplication {
  id: string;
  companyName: string;
  position: string;
  tasks: string;
  stage: string;
  result: string;
  createdAt: string;
}

export interface NotionResponse {
  results: any[];
}