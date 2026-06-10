import type { AnalysisResult, FinanceFormData, RiskLevel } from "@/types/finance";
import { parseAmount } from "@/lib/formatters";

function safeRatio(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return numerator / denominator;
}

function addUnique(list: string[], item: string) {
  if (!list.includes(item)) list.push(item);
}

function emergencyRating(months: number | null): RiskLevel {
  if (months === null) return "暂无数据";
  if (months < 3) return "高风险";
  if (months <= 6) return "偏低";
  if (months <= 12) return "健康";
  return "保守";
}

function debtRating(ratio: number, totalAssets: number): RiskLevel {
  if (totalAssets <= 0) return "暂无数据";
  if (ratio > 0.5) return "高";
  if (ratio >= 0.3) return "中";
  return "低";
}

function investmentRating(ratio: number, futureExpense: number): RiskLevel {
  if (ratio > 0.8 && futureExpense > 0) return "高风险";
  if (ratio >= 0.5) return "中等";
  return "较低";
}

function cashflowRating(monthlySurplus: number): RiskLevel {
  if (monthlySurplus < 0) return "高风险";
  if (Math.abs(monthlySurplus) <= 500) return "中";
  return "健康";
}

function futureCoverageRating(coverage: number | null, futureExpense: number): RiskLevel {
  if (futureExpense <= 0) return "暂无数据";
  if (coverage === null) return "覆盖不足";
  if (coverage < 1) return "覆盖不足";
  if (coverage <= 2) return "勉强覆盖";
  return "较安全";
}

function scoreResult(params: {
  emergencyMonths: number | null;
  monthlySurplus: number;
  debtRatio: number;
  totalAssets: number;
  futureExpenseCoverage: number | null;
  futureExpense: number;
  investmentRatio: number;
  maxDrawdown: FinanceFormData["maxDrawdown"];
}): number {
  let score = 100;

  if (params.emergencyMonths === null) score -= 12;
  else if (params.emergencyMonths < 3) score -= 24;
  else if (params.emergencyMonths < 6) score -= 12;
  else if (params.emergencyMonths > 18) score -= 4;

  if (params.monthlySurplus < 0) score -= 22;
  else if (Math.abs(params.monthlySurplus) <= 500) score -= 10;

  if (params.totalAssets > 0 && params.debtRatio > 0.5) score -= 20;
  else if (params.totalAssets > 0 && params.debtRatio >= 0.3) score -= 10;

  if (params.futureExpense > 0) {
    if ((params.futureExpenseCoverage ?? 0) < 1) score -= 18;
    else if ((params.futureExpenseCoverage ?? 0) <= 2) score -= 8;
  }

  const lowTolerance = params.maxDrawdown === "10%" || params.maxDrawdown === "不确定";
  if (params.investmentRatio > 0.8 && lowTolerance) score -= 16;
  else if (params.investmentRatio > 0.65 && lowTolerance) score -= 8;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function createSummary(score: number, emergencyMonths: number | null, monthlySurplus: number, futureExpenseCoverage: number | null): string {
  if (score >= 82) {
    return "你的财务状态比较稳，短期生活冲击大概率能扛住，可以继续把目标资金和长期资金分清楚。";
  }
  if (monthlySurplus < 0) {
    return "你的财务状态需要尽快减压，现金流正在消耗安全垫，未来 12 个月要更保守。";
  }
  if (emergencyMonths !== null && emergencyMonths < 6) {
    return "你的财务状态不是危险，但现金流安全垫偏薄，未来 12 个月需要更保守。";
  }
  if (futureExpenseCoverage !== null && futureExpenseCoverage < 1) {
    return "你的日常现金流还可以，但未来确定支出的资金缺口需要提前处理。";
  }
  return "你的财务状态整体可控，但资产结构和未来目标之间还有优化空间。";
}

function createPersona(data: FinanceFormData, values: {
  liquidAssets: number;
  investmentRatio: number;
  monthlySurplus: number;
  debtRatio: number;
  emergencyMonths: number | null;
}): string {
  if (data.identity === "博士" && values.monthlySurplus <= 1000) return "读博生存模式";
  if (values.debtRatio > 0.5) return "负债压力型玩家";
  if (values.monthlySurplus < 0 || (values.emergencyMonths !== null && values.emergencyMonths < 3)) return "现金流脆皮大学生";
  if (values.investmentRatio > 0.75) return "高波动长期主义者";
  if (values.investmentRatio > 0.55) return "攻击型资产配置玩家";
  if (values.emergencyMonths !== null && values.emergencyMonths > 18) return "现金很多但效率偏低型";
  if (values.monthlySurplus > 0 && values.emergencyMonths !== null && values.emergencyMonths >= 6) return "现金流安全型玩家";
  return "稳健防守型玩家";
}

export function analyzeFinances(data: FinanceFormData): AnalysisResult {
  const liquidAssets = parseAmount(data.cash) + parseAmount(data.bankDeposits) + parseAmount(data.moneyMarket);
  const investmentAssets =
    parseAmount(data.stocks) +
    parseAmount(data.fundsEtfs) +
    parseAmount(data.bonds) +
    parseAmount(data.overseasBrokerage) +
    parseAmount(data.crypto);
  const longTermAssets = parseAmount(data.realEstate) + parseAmount(data.vehicle);
  const otherAssets = parseAmount(data.otherAssets);
  const totalAssets = liquidAssets + investmentAssets + longTermAssets + otherAssets;

  const shortTermDebt = parseAmount(data.creditCardDebt) + parseAmount(data.consumerLoans) + parseAmount(data.otherShortTermDebt);
  const longTermDebt = parseAmount(data.studentLoans) + parseAmount(data.carLoans) + parseAmount(data.mortgage) + parseAmount(data.otherLongTermDebt);
  const totalDebt = shortTermDebt + longTermDebt;
  const netWorth = totalAssets - totalDebt;

  const monthlyIncome = parseAmount(data.monthlyIncome);
  const monthlyExpense = parseAmount(data.monthlyExpense);
  const futureExpense = parseAmount(data.futureLargeExpense12m);
  const monthlySurplus = monthlyIncome - monthlyExpense;
  const emergencyMonths = monthlyExpense > 0 ? liquidAssets / monthlyExpense : null;
  const debtRatio = safeRatio(totalDebt, totalAssets);
  const investmentRatio = safeRatio(investmentAssets, totalAssets);
  const futureExpenseCoverage = futureExpense > 0 ? liquidAssets / futureExpense : null;

  const ratings = {
    emergency: emergencyRating(emergencyMonths),
    debt: debtRating(debtRatio, totalAssets),
    investment: investmentRating(investmentRatio, futureExpense),
    cashflow: cashflowRating(monthlySurplus),
    futureCoverage: futureCoverageRating(futureExpenseCoverage, futureExpense)
  };

  const risks: string[] = [];
  if (ratings.emergency === "高风险" || ratings.emergency === "偏低") addUnique(risks, "应急金不足，生活或签证节奏一变就容易被动。");
  if (ratings.investment === "高风险") addUnique(risks, "投资资产占比过高，且未来 12 个月有确定支出，流动性风险偏高。");
  if (ratings.debt === "高" || ratings.debt === "中") addUnique(risks, "负债率偏高，未来现金流需要优先照顾还款压力。");
  if (monthlySurplus < 0) addUnique(risks, "月结余为负，正在消耗存量资产。");
  if (futureExpense > 0 && (futureExpenseCoverage ?? 0) < 1) addUnique(risks, "未来 12 个月确定支出覆盖不足，需要提前准备。");
  if (shortTermDebt > liquidAssets * 0.5 && shortTermDebt > 0) addUnique(risks, "短期负债相对流动资产偏高，可能挤压日常周转。");
  if ((data.maxDrawdown === "10%" || data.maxDrawdown === "不确定") && investmentRatio > 0.65) addUnique(risks, "风险承受能力和资产波动暴露不完全匹配。");
  if (risks.length === 0) addUnique(risks, "暂未发现特别突出的短期风险，继续保持预算和目标资金分层。");

  const suggestions: string[] = [
    "先留出 6–12 个月生活费，覆盖房租、吃饭、医保、签证和必要交通。",
    "把未来 12 个月一定要用的钱和长期投资资金分开，避免临近用钱时被迫卖出波动资产。",
    "建立现金桶、目标桶、长期投资桶，让每笔钱知道自己要完成什么任务。"
  ];
  if (totalDebt > 0) addUnique(suggestions, "优先减少高息负债，尤其是信用卡欠款和消费贷。");
  if (investmentRatio > 0.6) addUnique(suggestions, "做 30% 或 50% 市场下跌压力测试，确认学费、房租和搬家资金不会受影响。");
  if (futureExpense > 0) addUnique(suggestions, "优先保证学费、房租、签证、搬家等确定性支出，不要让它们依赖短期市场表现。");
  if (investmentRatio > 0.7) addUnique(suggestions, "降低单一资产或单一市场暴露，让资产结构更能扛住突发变化。");

  const score = scoreResult({
    emergencyMonths,
    monthlySurplus,
    debtRatio,
    totalAssets,
    futureExpenseCoverage,
    futureExpense,
    investmentRatio,
    maxDrawdown: data.maxDrawdown
  });

  const scenarios = [
    {
      title: "投资资产下跌 30%",
      amount: netWorth - investmentAssets * 0.3,
      description: "假设股票、基金、海外券商和加密资产同步回撤 30%，看看净资产还能剩多少。",
      tone: investmentAssets > 0 && investmentRatio > 0.6 ? "warn" : "neutral"
    },
    {
      title: "投资资产下跌 50%",
      amount: netWorth - investmentAssets * 0.5,
      description: "更极端的市场压力测试，适合检查长期资金和短期生活钱有没有混在一起。",
      tone: investmentAssets > 0 && investmentRatio > 0.6 ? "danger" : "neutral"
    },
    {
      title: "6 个月没有收入",
      amount: liquidAssets - monthlyExpense * 6,
      description: monthlyExpense <= 0 ? "月支出为 0，暂时无法判断 6 个月生活费是否够用。" : liquidAssets >= monthlyExpense * 6 ? "流动资产可以覆盖 6 个月生活费。" : "流动资产不足以覆盖 6 个月生活费。",
      tone: monthlyExpense <= 0 ? "neutral" : liquidAssets >= monthlyExpense * 6 ? "good" : "danger"
    },
    {
      title: "未来大额支出提前发生",
      amount: futureExpense > 0 ? liquidAssets - futureExpense : null,
      description: futureExpense > 0 ? "假设未来 12 个月确定支出现在就发生，检查现金是否够用。" : "你没有填写未来 12 个月确定大额支出，暂不进行该项压力测试。",
      tone: futureExpense <= 0 ? "neutral" : liquidAssets >= futureExpense ? "good" : "danger"
    }
  ] as AnalysisResult["scenarios"];

  return {
    inputs: data,
    liquidAssets,
    investmentAssets,
    longTermAssets,
    totalAssets,
    shortTermDebt,
    longTermDebt,
    totalDebt,
    netWorth,
    monthlySurplus,
    emergencyMonths,
    debtRatio,
    investmentRatio,
    futureExpenseCoverage,
    score,
    summary: createSummary(score, emergencyMonths, monthlySurplus, futureExpenseCoverage),
    persona: createPersona(data, { liquidAssets, investmentRatio, monthlySurplus, debtRatio, emergencyMonths }),
    risks: risks.slice(0, 5),
    suggestions: suggestions.slice(0, 6),
    ratings,
    scenarios
  };
}
