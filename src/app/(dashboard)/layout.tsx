"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  BarChart3,
  Users,
  RefreshCw,
  Activity,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/portfolio", label: "포트폴리오", icon: Briefcase },
  { href: "/analysis", label: "분석", icon: BarChart3 },
  { href: "/strategies", label: "투자자 전략", icon: Users },
  { href: "/rebalance", label: "리밸런싱", icon: RefreshCw },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col bg-[var(--sidebar-bg)] transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <Link href="/" className="text-white font-bold text-base">
              포트폴리오 헬스체크
            </Link>
            <p className="text-xs text-slate-500">AI 진단 서비스</p>
          </div>
          <button
            className="lg:hidden ml-auto text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((navItem) => {
            const isActive = pathname === navItem.href || pathname.startsWith(navItem.href + "/");
            return (
              <Link
                key={navItem.href}
                href={navItem.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--sidebar-active)] text-white"
                    : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-white"
                }`}
              >
                <navItem.icon className="w-5 h-5 flex-shrink-0" />
                {navItem.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs text-slate-500">
            투자 참고 목적으로만 활용해 주세요.
            <br />
            실제 투자 판단은 본인 책임입니다.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-slate-900">포트폴리오 헬스체크</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
