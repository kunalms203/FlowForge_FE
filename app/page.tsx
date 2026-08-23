'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/src/components/ui/Button';
import { Kanban, ArrowRight, Layers, ShieldCheck, Zap } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
      {/* Header */}
      <header className="border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center font-bold text-xs">
            FF
          </div>
          <span className="font-semibold text-sm tracking-tight text-neutral-900">
            FlowForge
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-medium text-neutral-700">
          <span className="w-1.5 h-1.5 rounded-full bg-black" />
          <span>Production SaaS Project Management</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 max-w-2xl mx-auto leading-tight">
          Precision project tracking for high-velocity teams.
        </h1>

        <p className="text-neutral-500 text-sm max-w-xl mx-auto leading-relaxed">
          Manage multi-tenant workspaces, Kanban workflows, real-time activity audits, and team velocity in a minimal, monochrome dashboard.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/register">
            <Button size="lg" className="px-6">
              Launch Workspace <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 text-left">
          <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-800">
              <Kanban className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-neutral-900">Dynamic Kanban Boards</h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Drag and drop tasks across customizable column stages with instant API synchronization.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-800">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-neutral-900">Multi-Tenant Workspaces</h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Granular role-based permissions (Owner, Admin, Manager, Member) and isolated projects.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-neutral-900">Audit & Live Activity</h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Complete task and workspace activity streams with attachments and conversation threads.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-6 px-6 text-center text-xs text-neutral-400">
        FlowForge &copy; 2026. Built with modern React & TypeScript.
      </footer>
    </div>
  );
}
