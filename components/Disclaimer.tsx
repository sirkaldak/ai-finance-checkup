export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`rounded-lg border border-amber-200 bg-amber-50 text-amber-900 ${compact ? "p-3 text-xs" : "p-4 text-sm"}`}>
      本报告仅用于教育、预算管理和财务健康分析，不构成投资建议、证券推荐、保险推荐、税务或法律建议。请根据自身情况咨询持牌专业人士。
    </div>
  );
}
