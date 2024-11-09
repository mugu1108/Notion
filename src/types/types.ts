export type JobApplication = {
  id: string;
  companyName: string;
  position: string;
  tasks: string;
  stage: ApplicationStage;
  result: ApplicationResult;
  createdAt: string;
};

export type ApplicationStage = 
  | "応募"
  | "書類選考"
  | "一次面接"
  | "二次面接"
  | "最終面接"
  | "内定";

export type ApplicationResult = 
  | "結果待ち"
  | "合格"
  | "不合格"
  | "辞退";