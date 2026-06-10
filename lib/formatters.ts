import type { Currency } from "@/types/finance";

export function parseAmount(value: string | number | undefined | null): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
}

export function formatMoney(amount: number, currency: Currency): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const formatted = Math.round(safeAmount).toLocaleString("en-US");

  if (currency === "人民币") return `¥${formatted}`;
  if (currency === "美元") return `$${formatted}`;
  if (currency === "港币") return `HK$${formatted}`;
  return formatted;
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "暂无数据";
  }
  return `${Math.round(value * 100)}%`;
}

export function formatNumber(value: number | null | undefined, suffix = ""): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "无法计算";
  }
  return `${value.toFixed(value >= 10 ? 1 : 2)}${suffix}`;
}
