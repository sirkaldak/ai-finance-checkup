import type { AnalysisResult } from "@/types/finance";
import { formatMoney, formatPercent } from "@/lib/formatters";

const explanations: Record<string, string> = {
  流动资产: "可快速动用的安全垫",
  投资资产: "波动资产，短期可能出现回撤",
  长期资产: "流动性较低，不能马上用于生活支出",
  其他资产: "未归类但属于你的资产",
  总资产: "你当前拥有的全部资产",
  短期负债: "近期需要优先处理的债务",
  长期负债: "未来较长时间逐步偿还的债务",
  总负债: "未来需要偿还的金额",
  净资产: "你的真实财富底盘"
};

export function BalanceSheet({ result }: { result: AnalysisResult }) {
  const currency = result.inputs.currency;
  const rows = [
    ["流动资产", result.liquidAssets, result.totalAssets > 0 ? result.liquidAssets / result.totalAssets : null],
    ["投资资产", result.investmentAssets, result.investmentRatio],
    ["长期资产", result.longTermAssets, result.totalAssets > 0 ? result.longTermAssets / result.totalAssets : null],
    ["其他资产", Number(result.inputs.otherAssets) || 0, result.totalAssets > 0 ? (Number(result.inputs.otherAssets) || 0) / result.totalAssets : null],
    ["总资产", result.totalAssets, result.totalAssets > 0 ? 1 : null],
    ["短期负债", result.shortTermDebt, result.totalAssets > 0 ? result.shortTermDebt / result.totalAssets : null],
    ["长期负债", result.longTermDebt, result.totalAssets > 0 ? result.longTermDebt / result.totalAssets : null],
    ["总负债", result.totalDebt, result.debtRatio],
    ["净资产", result.netWorth, result.totalAssets > 0 ? result.netWorth / result.totalAssets : null]
  ] as const;

  return (
    <section className="section-card p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-teal-700">Personal Balance Sheet</p>
          <h2 className="text-2xl font-black text-ink">个人资产负债表</h2>
        </div>
        <p className="text-sm text-slate-500">金额均按你选择的主要货币展示</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr className="text-slate-500">
              <th className="border-b border-slate-200 py-3 pr-4">项目</th>
              <th className="border-b border-slate-200 py-3 pr-4">金额</th>
              <th className="border-b border-slate-200 py-3 pr-4">占总资产比例</th>
              <th className="border-b border-slate-200 py-3">状态/解释</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, amount, ratio]) => (
              <tr key={name} className={name.includes("总") || name === "净资产" ? "font-bold text-ink" : "text-slate-700"}>
                <td className="border-b border-slate-100 py-3 pr-4">{name}</td>
                <td className="border-b border-slate-100 py-3 pr-4">{formatMoney(amount, currency)}</td>
                <td className="border-b border-slate-100 py-3 pr-4">{formatPercent(ratio)}</td>
                <td className="border-b border-slate-100 py-3 text-slate-500">{explanations[name]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
