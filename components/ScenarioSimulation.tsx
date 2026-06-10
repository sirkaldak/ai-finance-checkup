import type { AnalysisResult } from "@/types/finance";
import { formatMoney } from "@/lib/formatters";

const toneStyle = {
  good: "border-emerald-200 bg-emerald-50",
  warn: "border-amber-200 bg-amber-50",
  danger: "border-rose-200 bg-rose-50",
  neutral: "border-slate-200 bg-white"
};

export function ScenarioSimulation({ result }: { result: AnalysisResult }) {
  return (
    <section className="section-card p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-coral">Stress Test</p>
        <h2 className="text-2xl font-black text-ink">情景模拟</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {result.scenarios.map((scenario) => (
          <div key={scenario.title} className={`rounded-lg border p-4 ${toneStyle[scenario.tone]}`}>
            <p className="text-sm font-bold text-ink">{scenario.title}</p>
            <p className="mt-2 text-2xl font-black">{scenario.amount === null ? "暂无数据" : formatMoney(scenario.amount, result.inputs.currency)}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{scenario.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
