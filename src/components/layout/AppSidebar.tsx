'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { useProjects } from '@/src/hooks/useProjects';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { cn } from '@/src/utils/cn';
import {
  LayoutDashboard,
  FolderKanban,
  KanbanSquare,
  Users,
  Activity,
  Settings,
  Bell,
  ChevronRight,
  Plus,
} from 'lucide-react';

export interface AppSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AppSidebar({ isMobileOpen, onCloseMobile }: AppSidebarProps) {
  const pathname = usePathname();
  const { currentWorkspace } = useAuth();
  const workspaceId = currentWorkspace?.id || '';

  const { data: projects } = useProjects(workspaceId);

  const workspaceNav = [
    {
      label: 'Overview',
      href: workspaceId ? `/workspaces/${workspaceId}` : '/dashboard',
      icon: LayoutDashboard,
      active: pathname === `/workspaces/${workspaceId}`,
    },
    {
      label: 'Projects',
      href: workspaceId ? `/workspaces/${workspaceId}/projects` : '/dashboard',
      icon: FolderKanban,
      active: pathname.startsWith(`/workspaces/${workspaceId}/projects`) && !pathname.includes('/board'),
    },
    {
      label: 'Members',
      href: workspaceId ? `/workspaces/${workspaceId}/members` : '/dashboard',
      icon: Users,
      active: pathname === `/workspaces/${workspaceId}/members`,
    },
    {
      label: 'Activity',
      href: workspaceId ? `/workspaces/${workspaceId}/activity` : '/dashboard',
      icon: Activity,
      active: pathname === `/workspaces/${workspaceId}/activity`,
    },
    {
      label: 'Settings',
      href: workspaceId ? `/workspaces/${workspaceId}/settings` : '/dashboard',
      icon: Settings,
      active: pathname === `/workspaces/${workspaceId}/settings`,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-neutral-50/70 border-r border-neutral-200 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 md:static shrink-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand / Logo + Workspace Switcher */}
        <div className="p-3 border-b border-neutral-200/80">
          <div className="flex items-center gap-2 px-2 py-1 mb-2">
            <div className="w-5 h-5 rounded bg-black text-white flex items-center justify-center font-black text-[11px] tracking-tighter">
              FF
            </div>
            <span className="font-semibold text-xs text-neutral-900 tracking-tight">
              FLOWFORGE
            </span>
          </div>
          <WorkspaceSwitcher />
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Workspace Group */}
          <div>
            <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Workspace
            </div>
            <nav className="space-y-0.5">
              {workspaceNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                      item.active
                        ? 'bg-neutral-200/60 text-neutral-900 font-semibold'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    )}
                  >
                    <Icon className="w-4 h-4 text-neutral-500 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Active Projects / Boards */}
          {workspaceId && (
            <div>
              <div className="flex items-center justify-between px-2 mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Projects & Boards
                </span>
                <Link
                  href={`/workspaces/${workspaceId}/projects`}
                  className="text-neutral-400 hover:text-neutral-900 p-0.5 rounded transition-colors"
                  title="All Projects"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-0.5 max-h-48 overflow-y-auto">
                {!projects || projects.length === 0 ? (
                  <div className="px-2 py-1.5 text-[11px] text-neutral-400 italic">
                    No projects yet
                  </div>
                ) : (
                  projects.map((proj) => {
                    const isBoardActive = pathname.includes(`/projects/${proj.id}/board`);
                    return (
                      <Link
                        key={proj.id}
                        href={`/workspaces/${workspaceId}/projects/${proj.id}/board`}
                        onClick={onCloseMobile}
                        className={cn(
                          'flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors group',
                          isBoardActive
                            ? 'bg-neutral-200/60 text-neutral-900 font-semibold'
                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <KanbanSquare className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black shrink-0" />
                          <span className="truncate">{proj.name}</span>
                        </div>
                        <ChevronRight className="w-3 h-3 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* System Links */}
          <div>
            <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              System
            </div>
            <nav className="space-y-0.5">
              <Link
                href="/dashboard"
                onClick={onCloseMobile}
                className={cn(
                  'flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                  pathname === '/dashboard'
                    ? 'bg-neutral-200/60 text-neutral-900 font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                )}
              >
                <LayoutDashboard className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>Dashboard Overview</span>
              </Link>
              <Link
                href="/notifications"
                onClick={onCloseMobile}
                className={cn(
                  'flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                  pathname === '/notifications'
                    ? 'bg-neutral-200/60 text-neutral-900 font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                )}
              >
                <Bell className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>Notifications</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-neutral-200/80 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>FlowForge v1.0</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Production Ready" />
        </div>
      </aside>
    </>
  );
}
