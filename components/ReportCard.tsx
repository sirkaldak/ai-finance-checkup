import { Banknote, Gauge, PiggyBank, ShieldCheck, TrendingUp, WalletCards } from "lucide-react";
import type { AnalysisResult } from "@/types/finance";
import { formatMoney, formatNumber, formatPercent } from "@/lib/formatters";
import { BalanceSheet } from "@/components/BalanceSheet";
import { MetricCard } from "@/components/MetricCard";
import { RiskBadge } from "@/components/RiskBadge";
import { ScenarioSimulation } from "@/components/ScenarioSimulation";
import { AssetChart } from "@/components/AssetChart";
import { Disclaimer } from "@/components/Disclaimer";

export function ReportCard({ result }: { result: AnalysisResult }) {
  const currency = result.inputs.currency;
  const scoreColor = result.score >= 80 ? "bg-emerald-500" : result.score >= 60 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div id="report" className="space-y-5">
      <section className="section-card overflow-hidden p-5 md:p-6">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-teal-700">AI Finance Checkup</p>
            <h2 className="mt-2 text-3xl font-black text-ink">你的财务健康报告</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{result.summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-ink px-3 py-1.5 text-sm font-bold text-white">{result.persona}</span>
              <RiskBadge level={result.ratings.emergency} />
              <RiskBadge level={result.ratings.cashflow} />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-500">财务健康总分</p>
                <p className="mt-1 text-6xl font-black text-ink">{result.score}</p>
              </div>
              <Gauge className="h-14 w-14 text-teal-600" />
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${scoreColor}`} style={{ width: `${result.score}%` }} />
            </div>
            <p className="mt-3 text-sm text-slate-500">0–100 分，综合应急金、现金流、负债、未来支出和波动承受能力。</p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="净资产" value={formatMoney(result.netWorth, currency)} helper="资产减去负债后的财富底盘" icon={<PiggyBank className="h-5 w-5" />} />
        <MetricCard label="应急金月数" value={formatNumber(result.emergencyMonths, " 个月")} helper="流动资产可覆盖生活费" badge={result.ratings.emergency} icon={<ShieldCheck className="h-5 w-5" />} />
        <MetricCard label="月结余" value={formatMoney(result.monthlySurplus, currency)} helper="月收入减月支出" badge={result.ratings.cashflow} icon={<Banknote className="h-5 w-5" />} />
        <MetricCard label="投资资产占比" value={formatPercent(result.investmentRatio)} helper="波动资产占总资产比例" badge={result.ratings.investment} icon={<TrendingUp className="h-5 w-5" />} />
        <MetricCard label="负债率" value={formatPercent(result.debtRatio)} helper="总负债占总资产比例" badge={result.ratings.debt} icon={<WalletCards className="h-5 w-5" />} />
        <MetricCard label="未来支出覆盖率" value={formatNumber(result.futureExpenseCoverage, " 倍")} helper="流动资产覆盖未来大额支出" badge={result.ratings.futureCoverage} icon={<ShieldCheck className="h-5 w-5" />} />
      </section>

      <BalanceSheet result={result} />

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="section-card p-5">
          <h2 className="text-2xl font-black text-ink">主要风险</h2>
          <div className="mt-4 space-y-3">
            {result.risks.map((risk, index) => (
              <div key={risk} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral text-sm font-black text-white">{index + 1}</span>
                <p className="text-sm leading-6 text-slate-650">{risk}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="section-card p-5">
          <h2 className="text-2xl font-black text-ink">具体建议</h2>
          <div className="mt-4 space-y-3">
            {result.suggestions.map((suggestion) => (
              <div key={suggestion} className="rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm leading-6 text-slate-700">
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ScenarioSimulation result={result} />
      <AssetChart result={result} />
      <Disclaimer />
    </div>
  );
}
