import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI 포트폴리오 헬스체크",
  description:
    "AI 기반 포트폴리오 건강 진단 서비스 — 헬스 스코어, 섹터 분석, 투자자 전략 비교, 리밸런싱 제안을 한눈에 확인하세요.",
  keywords: ["포트폴리오", "투자", "헬스체크", "리밸런싱", "AI", "분석"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
