'use client';

import React from 'react';
import { AppLayout } from '@/src/components/layout/AppLayout';
import { useAuth } from '@/src/context/AuthContext';
import { useWorkspaces } from '@/src/hooks/useWorkspaces';
import { useProjects } from '@/src/hooks/useProjects';
import { useWorkspaceActivities } from '@/src/hooks/useActivities';
import { Button } from '@/src/components/ui/Button';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { ActivityTimeline } from '@/src/components/features/ActivityTimeline';
import Link from 'next/link';
import {
  FolderKanban,
  KanbanSquare,
  Building2,
  Users,
  ArrowUpRight,
  Plus,
  Activity,
  Layers,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, currentWorkspace } = useAuth();
  const { data: workspaces, isLoading: isWorkspacesLoading } = useWorkspaces();
  const workspaceId = currentWorkspace?.id || '';

  const { data: projects, isLoading: isProjectsLoading } = useProjects(workspaceId);
  const { data: activities, isLoading: isActivitiesLoading } = useWorkspaceActivities(
    workspaceId,
    1,
    10
  );

  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              Welcome back, {user?.fullName || 'User'}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Here is what is happening across your workspaces and projects today.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {workspaceId && (
              <Link href={`/workspaces/projects?workspaceId=${workspaceId}`}>
                <Button size="sm">
                  <Plus className="w-3.5 h-3.5 mr-1" /> New Project
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[11px] font-medium uppercase tracking-wider">Workspaces</span>
              <Building2 className="w-4 h-4 text-neutral-500" />
            </div>
            <div className="text-2xl font-bold text-neutral-900">
              {isWorkspacesLoading ? <Skeleton className="h-7 w-12" /> : workspaces?.length || 0}
            </div>
            <p className="text-[11px] text-neutral-400">Active team workspaces</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[11px] font-medium uppercase tracking-wider">Projects</span>
              <FolderKanban className="w-4 h-4 text-neutral-500" />
            </div>
            <div className="text-2xl font-bold text-neutral-900">
              {isProjectsLoading ? <Skeleton className="h-7 w-12" /> : projects?.length || 0}
            </div>
            <p className="text-[11px] text-neutral-400">In current workspace</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Current Workspace
              </span>
              <Layers className="w-4 h-4 text-neutral-500" />
            </div>
            <div className="text-sm font-bold text-neutral-900 truncate">
              {currentWorkspace?.name || 'No workspace'}
            </div>
            <p className="text-[11px] text-neutral-400 truncate">
              Slug: {currentWorkspace?.slug || 'none'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[11px] font-medium uppercase tracking-wider">Members</span>
              <Users className="w-4 h-4 text-neutral-500" />
            </div>
            <div className="text-2xl font-bold text-neutral-900">
              {currentWorkspace?.members ? currentWorkspace.members.length : 1}
            </div>
            <p className="text-[11px] text-neutral-400">Team collaborators</p>
          </div>
        </div>

        {/* Main Grid: Recent Projects + Recent Workspace Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-neutral-500" />
                <span>Recent Projects</span>
              </h2>
              {workspaceId && (
                <Link
                  href={`/workspaces/projects?workspaceId=${workspaceId}`}
                  className="text-xs text-neutral-500 hover:text-black transition-colors"
                >
                  View all →
                </Link>
              )}
            </div>

            {isProjectsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : !projects || projects.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-neutral-200 bg-white text-center">
                <p className="text-xs text-neutral-500 mb-3">No projects in this workspace yet.</p>
                {workspaceId && (
                  <Link href={`/workspaces/projects?workspaceId=${workspaceId}`}>
                    <Button size="sm">Create First Project</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="group bg-white p-4 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-xs font-semibold text-neutral-900 group-hover:text-black">
                          {project.name}
                        </h3>
                        <Link
                          href={`/workspaces/projects/board?workspaceId=${workspaceId}&projectId=${project.id}`}
                          className="text-neutral-400 hover:text-black"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                      <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                        {project.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">
                        {project.boards?.length || 0} columns
                      </span>
                      <Link
                        href={`/workspaces/projects/board?workspaceId=${workspaceId}&projectId=${project.id}`}
                        className="font-medium text-black hover:underline flex items-center gap-1"
                      >
                        <KanbanSquare className="w-3.5 h-3.5" />
                        <span>Open Board</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Stream Column (1 col) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-neutral-500" />
                <span>Recent Activity</span>
              </h2>
              {workspaceId && (
                <Link
                  href={`/workspaces/activity?workspaceId=${workspaceId}`}
                  className="text-xs text-neutral-500 hover:text-black transition-colors"
                >
                  History →
                </Link>
              )}
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <ActivityTimeline
                activities={activities}
                isLoading={isActivitiesLoading}
                emptyMessage="No recent activity in this workspace"
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
