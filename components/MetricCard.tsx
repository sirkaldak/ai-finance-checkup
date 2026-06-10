import { ReactNode } from "react";
import { RiskBadge } from "@/components/RiskBadge";

interface MetricCardProps {
  label: string;
  value: string;
  helper?: string;
  badge?: string;
  icon?: ReactNode;
}

export function MetricCard({ label, value, helper, badge, icon }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black text-ink">{value}</p>
        </div>
        {icon ? <div className="rounded-lg bg-teal-50 p-2 text-teal-700">{icon}</div> : null}
      </div>
      <div className="mt-3 flex min-h-7 items-center justify-between gap-2">
        <p className="text-xs leading-5 text-slate-500">{helper}</p>
        {badge ? <RiskBadge level={badge} /> : null}
      </div>
    </div>
  );
}
