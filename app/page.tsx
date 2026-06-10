"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, BadgeCheck, ClipboardList, Sparkles } from "lucide-react";
import { FinancialForm } from "@/components/FinancialForm";
import { ReportCard } from "@/components/ReportCard";
import { Disclaimer } from "@/components/Disclaimer";
import { analyzeFinances } from "@/lib/financialAnalysis";
import type { AnalysisResult, FinanceFormData } from "@/types/finance";

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  function handleSubmit(data: FinanceFormData) {
    setResult(analyzeFinances(data));
  }

  useEffect(() => {
    if (result) {
      window.setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  }, [result]);

  return (
    <main className="min-h-screen">
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-10 pt-8 md:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:pb-16 lg:pt-12">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3 py-1.5 text-sm font-bold text-teal-700 shadow-sm">
            <Sparkles className="h-4 w-4" />
            AI Finance Checkup
          </div>
          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-tight text-ink md:text-6xl">AI 财务体检报告</h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-650">输入几个数字，看看你的现金流、资产结构和未来风险。</p>
          <p className="mt-4 max-w-2xl text-lg font-bold text-slate-700">不是预测市场，而是看看你的钱能不能扛住生活。</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#checkup-form"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-base font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              开始体检
              <ArrowDown className="h-5 w-5" />
            </a>
            <div className="inline-flex items-center gap-2 rounded-lg border border-white bg-white/70 px-4 py-3 text-sm font-semibold text-slate-600">
              <BadgeCheck className="h-5 w-5 text-teal-600" />
              不登录 · 不保存 · 不接账户
            </div>
          </div>
          <div className="mt-7">
            <Disclaimer compact />
          </div>
        </div>

        <div className="section-card p-5 md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-teal-100 p-3 text-teal-700">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-ink">这份 MVP 会检查什么？</h2>
              <p className="text-sm text-slate-500">资产、负债、现金流、未来目标和压力测试</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["个人资产负债表", "财务健康评分", "风险 badge 和指标卡", "30% / 50% 回撤模拟", "6 个月无收入模拟", "资产与负债图表"].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-bold text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-8 md:px-6">
        <FinancialForm onSubmit={handleSubmit} />
      </section>

      {result ? (
        <section ref={reportRef} className="mx-auto w-full max-w-7xl px-4 pb-14 md:px-6">
          <ReportCard result={result} />
        </section>
      ) : null}
    </main>
  );
}
