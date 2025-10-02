export interface User {
  name: string;
  score: number;
  rankRange?: string;
}

export interface AccountItem {
  title: string;
  value: number;
}

export interface MockData {
  user: User;
  accounts: AccountItem[];
  summary: {
    totalDisputes: number;
    totalEnquiries: number;
  };
  scoreHistory: {
    labels: string[];
    values: number[];
  };
}
