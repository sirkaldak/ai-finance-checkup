"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Calculator, ChevronDown, Sparkles } from "lucide-react";
import type { FinanceFormData } from "@/types/finance";

const initialData: FinanceFormData = {
  age: "",
  identity: "研究生",
  region: "美国",
  currency: "美元",
  cash: "",
  bankDeposits: "",
  moneyMarket: "",
  stocks: "",
  fundsEtfs: "",
  bonds: "",
  overseasBrokerage: "",
  realEstate: "",
  vehicle: "",
  crypto: "",
  otherAssets: "",
  creditCardDebt: "",
  consumerLoans: "",
  studentLoans: "",
  carLoans: "",
  mortgage: "",
  otherShortTermDebt: "",
  otherLongTermDebt: "",
  monthlyDebtPayment: "",
  monthlyIncome: "",
  monthlyExpense: "",
  futureLargeExpense12m: "",
  goals: "",
  maxDrawdown: "20%",
  familySupport: "不确定"
};

const selectOptions = {
  identity: ["本科生", "研究生", "博士", "已工作", "自由职业", "其他"],
  region: ["大陆", "香港", "美国", "英国", "日本", "其他"],
  currency: ["人民币", "美元", "港币", "其他"],
  maxDrawdown: ["10%", "20%", "30%", "50%", "不确定"],
  familySupport: ["有稳定支持", "偶尔支持", "没有", "不确定"]
} as const;

const basicFields = [
  { key: "age", label: "年龄", placeholder: "例如 24" }
] as const;

const assetFields = [
  ["cash", "现金"],
  ["bankDeposits", "银行存款"],
  ["moneyMarket", "货币基金/现金管理类资产"],
  ["stocks", "股票"],
  ["fundsEtfs", "基金/ETF"],
  ["bonds", "债券"],
  ["overseasBrokerage", "港美股/海外券商账户资产"],
  ["realEstate", "房产估值"],
  ["vehicle", "车辆估值"],
  ["crypto", "加密资产"],
  ["otherAssets", "其他资产"]
] as const;

const debtFields = [
  ["creditCardDebt", "信用卡欠款"],
  ["consumerLoans", "消费贷"],
  ["studentLoans", "学贷"],
  ["carLoans", "车贷"],
  ["mortgage", "房贷"],
  ["otherShortTermDebt", "其他短期负债"],
  ["otherLongTermDebt", "其他长期负债"],
  ["monthlyDebtPayment", "每月固定还款额，可选"]
] as const;

const cashflowFields = [
  ["monthlyIncome", "月收入"],
  ["monthlyExpense", "月支出"],
  ["futureLargeExpense12m", "未来 12 个月确定大额支出"]
] as const;

interface FinancialFormProps {
  onSubmit: (data: FinanceFormData) => void;
}

export function FinancialForm({ onSubmit }: FinancialFormProps) {
  const [data, setData] = useState<FinanceFormData>(initialData);
  const [error, setError] = useState("");

  function updateField<K extends keyof FinanceFormData>(key: K, value: FinanceFormData[K]) {
    setData((current) => ({ ...current, [key]: value }));
  }

  function handleNumberChange(event: ChangeEvent<HTMLInputElement>, key: keyof FinanceFormData) {
    const value = event.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      updateField(key, value as never);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const age = Number(data.age);
    const monthlyExpense = Number(data.monthlyExpense || 0);

    if (data.age && (!Number.isFinite(age) || age < 0 || age > 120)) {
      setError("年龄看起来不太对，可以留空或填写 0–120 之间的数字。");
      return;
    }

    if (monthlyExpense < 0) {
      setError("月支出不能为负数。");
      return;
    }

    setError("");
    onSubmit(data);
  }

  return (
    <form id="checkup-form" onSubmit={handleSubmit} className="section-card p-5 md:p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-teal-700">
            <Sparkles className="h-4 w-4" />
            填表不考试，数字大概准就行
          </p>
          <h2 className="mt-2 text-2xl font-black text-ink">开始你的财务体检</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-500">所有数据只在当前浏览器里计算，不登录、不保存、不上传。</p>
      </div>

      {error ? <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}

      <FormSection title="基础信息">
        {basicFields.map((field) => (
          <NumberInput key={field.key} label={field.label} value={data[field.key]} placeholder={field.placeholder} onChange={(event) => handleNumberChange(event, field.key)} />
        ))}
        <SelectInput label="身份" value={data.identity} onChange={(value) => updateField("identity", value as FinanceFormData["identity"])} options={selectOptions.identity} />
        <SelectInput label="当前地区" value={data.region} onChange={(value) => updateField("region", value as FinanceFormData["region"])} options={selectOptions.region} />
        <SelectInput label="主要货币" value={data.currency} onChange={(value) => updateField("currency", value as FinanceFormData["currency"])} options={selectOptions.currency} />
      </FormSection>

      <FormSection title="资产部分">
        {assetFields.map(([key, label]) => (
          <NumberInput key={key} label={label} value={data[key]} onChange={(event) => handleNumberChange(event, key)} />
        ))}
      </FormSection>

      <FormSection title="负债部分">
        {debtFields.map(([key, label]) => (
          <NumberInput key={key} label={label} value={data[key]} onChange={(event) => handleNumberChange(event, key)} />
        ))}
      </FormSection>

      <FormSection title="现金流与未来目标">
        {cashflowFields.map(([key, label]) => (
          <NumberInput key={key} label={label} value={data[key]} onChange={(event) => handleNumberChange(event, key)} />
        ))}
        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">未来 1–3 年目标</span>
          <textarea
            className="input-shell min-h-28 resize-y"
            value={data.goals}
            onChange={(event) => updateField("goals", event.target.value)}
            placeholder="例如：读博、买房、留学、创业、换城市"
          />
        </label>
        <SelectInput label="最大可接受资产回撤" value={data.maxDrawdown} onChange={(value) => updateField("maxDrawdown", value as FinanceFormData["maxDrawdown"])} options={selectOptions.maxDrawdown} />
        <SelectInput label="是否有家庭支持" value={data.familySupport} onChange={(value) => updateField("familySupport", value as FinanceFormData["familySupport"])} options={selectOptions.familySupport} />
      </FormSection>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3.5 text-base font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-800 sm:w-auto"
      >
        <Calculator className="h-5 w-5" />
        生成报告
      </button>
    </form>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mb-6 border-0 p-0">
      <legend className="mb-3 text-base font-black text-ink">{title}</legend>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{children}</div>
    </fieldset>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  placeholder = "0"
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input className="input-shell" inputMode="decimal" min="0" value={value} onChange={onChange} placeholder={placeholder} />
    </label>
  );
}

function SelectInput<T extends readonly string[]>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: T;
  onChange: (value: T[number]) => void;
}) {
  return (
    <label className="relative flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select className="input-shell appearance-none pr-9" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-slate-400" />
    </label>
  );
}
