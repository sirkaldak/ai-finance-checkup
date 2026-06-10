import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 财务体检报告",
  description: "输入几个数字，看看你的现金流、资产结构和未来风险。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
