"use client";

import React from "react";
import Link from "next/link";

interface DomainCard {
  slug: string;
  title: string;
  description: string;
  icon: string;
  taskCount: number;
  active: boolean;
}

const DOMAINS: DomainCard[] = [
  {
    slug: "devops",
    title: "DevOps & Infra",
    description:
      "Linux, CI/CD pipelines, AWS architecture, and scripting automation.",
    icon: "🚀",
    taskCount: 25,
    active: true,
  },
  {
    slug: "philosophy",
    title: "Philosophy and More",
    description: "from beautiful Quotes to sophisticated books",
    icon: "🎨",
    taskCount: 15,
    active: true, // For future expansion
  },
  {
    slug: "backend",
    title: "Backend Systems",
    description:
      "API design, database optimization, caching, and system architecture.",
    icon: "⚙️",
    taskCount: 0,
    active: false, // For future expansion
  },
];

export default function HubPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 flex flex-col justify-center items-center">
      <div className="max-w-md w-full space-y-6">
        {/* Hub Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xl font-bold mb-2">
            Ω
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Execution Hub
          </h1>
          <p className="text-sm text-slate-400">
            Select a focus domain to view your time-blocked execution menus.
          </p>
        </header>

        {/* Domain Grid / Menu */}
        <div className="space-y-3">
          {DOMAINS.map((domain) => {
            if (!domain.active) {
              return (
                <div
                  key={domain.slug}
                  className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl opacity-40 cursor-not-allowed flex items-start gap-4"
                >
                  <span className="text-2xl saturate-0">{domain.icon}</span>
                  <div>
                    <h2 className="text-base font-bold text-slate-400">
                      {domain.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {domain.description}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={domain.slug}
                href={`/${domain.slug}`}
                className="block p-4 bg-slate-800 hover:bg-slate-750 border border-slate-700/60 hover:border-indigo-500/50 rounded-xl transition-all duration-200 group relative overflow-hidden active:scale-[0.99]"
              >
                {/* Glow Accent Effect */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-xl pointer-events-none rounded-full group-hover:bg-indigo-500/10 transition-colors" />

                <div className="flex items-start gap-4">
                  <span className="text-2xl p-2 bg-slate-900 rounded-lg border border-slate-700/50 group-hover:border-indigo-500/30 transition-colors">
                    {domain.icon}
                  </span>
                  <div className="space-y-1 pr-6">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {domain.title}
                      </h2>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20">
                        {domain.taskCount} items
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {domain.description}
                    </p>
                  </div>
                </div>

                {/* Arrow indicator */}
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-200 text-lg">
                  →
                </span>
              </Link>
            );
          })}
        </div>

        {/* Footer info */}
        <footer className="text-center">
          <p className="text-[10px] font-mono tracking-widest text-slate-600 uppercase">
            v1.0.0 // PWA READY
          </p>
        </footer>
      </div>
    </main>
  );
}
