export type Identity =
  | "本科生"
  | "研究生"
  | "博士"
  | "已工作"
  | "自由职业"
  | "其他";

export type Region = "大陆" | "香港" | "美国" | "英国" | "日本" | "其他";
export type Currency = "人民币" | "美元" | "港币" | "其他";
export type DrawdownTolerance = "10%" | "20%" | "30%" | "50%" | "不确定";
export type FamilySupport = "有稳定支持" | "偶尔支持" | "没有" | "不确定";
export type RiskLevel = "高风险" | "偏低" | "健康" | "保守" | "高" | "中" | "低" | "较低" | "中等" | "较安全" | "勉强覆盖" | "覆盖不足" | "暂无数据";

export interface FinanceFormData {
  age: string;
  identity: Identity;
  region: Region;
  currency: Currency;
  cash: string;
  bankDeposits: string;
  moneyMarket: string;
  stocks: string;
  fundsEtfs: string;
  bonds: string;
  overseasBrokerage: string;
  realEstate: string;
  vehicle: string;
  crypto: string;
  otherAssets: string;
  creditCardDebt: string;
  consumerLoans: string;
  studentLoans: string;
  carLoans: string;
  mortgage: string;
  otherShortTermDebt: string;
  otherLongTermDebt: string;
  monthlyDebtPayment: string;
  monthlyIncome: string;
  monthlyExpense: string;
  futureLargeExpense12m: string;
  goals: string;
  maxDrawdown: DrawdownTolerance;
  familySupport: FamilySupport;
}

export interface AnalysisResult {
  inputs: FinanceFormData;
  liquidAssets: number;
  investmentAssets: number;
  longTermAssets: number;
  totalAssets: number;
  shortTermDebt: number;
  longTermDebt: number;
  totalDebt: number;
  netWorth: number;
  monthlySurplus: number;
  emergencyMonths: number | null;
  debtRatio: number;
  investmentRatio: number;
  futureExpenseCoverage: number | null;
  score: number;
  summary: string;
  persona: string;
  risks: string[];
  suggestions: string[];
  ratings: {
    emergency: RiskLevel;
    debt: RiskLevel;
    investment: RiskLevel;
    cashflow: RiskLevel;
    futureCoverage: RiskLevel;
  };
  scenarios: Array<{
    title: string;
    amount: number | null;
    description: string;
    tone: "good" | "warn" | "danger" | "neutral";
  }>;
}
