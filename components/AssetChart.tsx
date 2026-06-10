"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { AnalysisResult } from "@/types/finance";
import { formatMoney } from "@/lib/formatters";

const assetColors = ["#14B8A6", "#38BDF8", "#FBBF24", "#FB7185"];
const debtColors = ["#F97316", "#64748B"];

export function AssetChart({ result }: { result: AnalysisResult }) {
  const assetData = [
    { name: "流动资产", value: result.liquidAssets },
    { name: "投资资产", value: result.investmentAssets },
    { name: "长期资产", value: result.longTermAssets },
    { name: "其他资产", value: Number(result.inputs.otherAssets) || 0 }
  ].filter((item) => item.value > 0);

  const debtData = [
    { name: "短期负债", value: result.shortTermDebt },
    { name: "长期负债", value: result.longTermDebt }
  ].filter((item) => item.value > 0);

  return (
    <section className="section-card p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-sky-700">Charts</p>
        <h2 className="text-2xl font-black text-ink">资产与负债构成</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartBlock title="资产构成" data={assetData} colors={assetColors} emptyText="还没有填写资产数据" currency={result.inputs.currency} />
        <ChartBlock title="负债构成" data={debtData} colors={debtColors} emptyText="目前没有负债数据" currency={result.inputs.currency} />
      </div>
    </section>
  );
}

function ChartBlock({
  title,
  data,
  colors,
  emptyText,
  currency
}: {
  title: string;
  data: Array<{ name: string; value: number }>;
  colors: string[];
  emptyText: string;
  currency: AnalysisResult["inputs"]["currency"];
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-base font-bold text-ink">{title}</h3>
      <div className="mt-3 h-72">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500">{emptyText}</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={54} outerRadius={92} paddingAngle={3}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatMoney(Number(value), currency)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
