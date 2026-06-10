import type { RiskLevel } from "@/types/finance";

const styles: Record<string, string> = {
  高风险: "bg-rose-100 text-rose-700 ring-rose-200",
  高: "bg-rose-100 text-rose-700 ring-rose-200",
  覆盖不足: "bg-rose-100 text-rose-700 ring-rose-200",
  偏低: "bg-amber-100 text-amber-700 ring-amber-200",
  中: "bg-amber-100 text-amber-700 ring-amber-200",
  中等: "bg-amber-100 text-amber-700 ring-amber-200",
  勉强覆盖: "bg-amber-100 text-amber-700 ring-amber-200",
  健康: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  低: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  较低: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  较安全: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  保守: "bg-sky-100 text-sky-700 ring-sky-200",
  暂无数据: "bg-slate-100 text-slate-600 ring-slate-200"
};

export function RiskBadge({ level }: { level: RiskLevel | string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[level] ?? styles["暂无数据"]}`}>
      {level}
    </span>
  );
}
