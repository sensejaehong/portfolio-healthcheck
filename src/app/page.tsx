"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  PieChart,
  Users,
  RefreshCw,
  ArrowRight,
  Shield,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "헬스 스코어",
    desc: "포트폴리오 건강 상태를 0~100점으로 한눈에 진단합니다. 분산투자, 리스크, 섹터 균형을 종합 평가합니다.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: PieChart,
    title: "섹터 분석",
    desc: "보유 종목의 섹터 분포를 분석하고 벤치마크 대비 편중 여부를 시각적으로 확인합니다.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Users,
    title: "투자자 전략 비교",
    desc: "워런 버핏, 레이 달리오 등 7명의 전설적 투자자와 내 포트폴리오를 비교해 보세요.",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: RefreshCw,
    title: "리밸런싱 제안",
    desc: "선택한 투자 전략에 맞춰 매수/매도/유지 제안을 자동으로 생성합니다.",
    color: "from-amber-500 to-amber-600",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8 text-sm text-blue-200">
              <Shield className="w-4 h-4" />
              AI 기반 포트폴리오 진단 서비스
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              내 포트폴리오,
              <br />
              <span className="text-gradient bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                얼마나 건강할까요?
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              AI가 분석하는 포트폴리오 헬스체크. 분산투자 수준, 섹터 균형,
              리스크 지표를 한눈에 확인하고 전설적 투자자들의 전략과 비교해
              보세요.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 text-lg"
              >
                포트폴리오 진단 시작하기
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/analysis"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-medium px-8 py-4 rounded-xl transition-all text-lg"
              >
                <BarChart3 className="w-5 h-5" />
                데모 분석 보기
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: "100+", label: "분석 지표" },
              { value: "7명", label: "투자 전략가" },
              { value: "실시간", label: "포트폴리오 진단" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              포트폴리오를 360도로 분석합니다
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              다양한 관점에서 포트폴리오의 강점과 약점을 파악하세요
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-6"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={item}
                className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} text-white mb-5`}
                >
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            지금 바로 진단을 시작하세요
          </h2>
          <p className="text-lg text-slate-500 mb-8 max-w-lg mx-auto">
            보유 종목을 입력하면 즉시 AI 분석 결과를 확인할 수 있습니다. 무료로
            체험해 보세요.
          </p>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 text-lg"
          >
            시작하기
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm">
          <p>AI 포트폴리오 헬스체크 &copy; 2026. 투자 참고 목적으로만 활용해 주세요.</p>
        </div>
      </footer>
    </div>
  );
}
