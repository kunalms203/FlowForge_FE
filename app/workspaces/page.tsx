'use client';

import React, { useState, Suspense } from 'react';
import { AppLayout } from '@/src/components/layout/AppLayout';
import { useWorkspace } from '@/src/hooks/useWorkspaces';
import { useProjects } from '@/src/hooks/useProjects';
import { useWorkspaceActivities } from '@/src/hooks/useActivities';
import { useWorkspaceParams } from '@/src/hooks/useWorkspaceParams';
import { Button } from '@/src/components/ui/Button';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { Avatar } from '@/src/components/ui/Avatar';
import { Badge } from '@/src/components/ui/Badge';
import { CreateProjectModal } from '@/src/components/features/CreateProjectModal';
import { ActivityTimeline } from '@/src/components/features/ActivityTimeline';
import Link from 'next/link';
import {
  FolderKanban,
  KanbanSquare,
  Users,
  Calendar,
  Plus,
  ArrowUpRight,
  Settings,
  Activity,
} from 'lucide-react';
import { format } from 'date-fns';

function WorkspaceOverviewContent() {
  const { workspaceId } = useWorkspaceParams();
  const { data: workspace, isLoading: isWorkspaceLoading } = useWorkspace(workspaceId);
  const { data: projects, isLoading: isProjectsLoading } = useProjects(workspaceId);
  const { data: activities, isLoading: isActivitiesLoading } = useWorkspaceActivities(
    workspaceId,
    1,
    10
  );

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Workspaces', href: '/dashboard' },
        { label: workspace?.name || 'Workspace' },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Workspace Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
                {isWorkspaceLoading ? (
                  <Skeleton className="h-7 w-48" />
                ) : (
                  workspace?.name || 'Workspace'
                )}
              </h1>
              {workspace?.slug && (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-100 text-neutral-600 border border-neutral-200">
                  slug: {workspace.slug}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Created{' '}
                {workspace?.createdAt
                  ? format(new Date(workspace.createdAt), 'MMMM d, yyyy')
                  : 'recently'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={
                workspaceId
                  ? `/workspaces/settings?workspaceId=${workspaceId}`
                  : '/workspaces/settings'
              }
            >
              <Button variant="outline" size="sm">
                <Settings className="w-3.5 h-3.5 mr-1" /> Settings
              </Button>
            </Link>
            <Button size="sm" onClick={() => setIsCreateProjectOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" /> New Project
            </Button>
          </div>
        </div>

        {/* Projects Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-neutral-500" />
              <span>Projects ({projects?.length || 0})</span>
            </h2>
            <Link
              href={
                workspaceId
                  ? `/workspaces/projects?workspaceId=${workspaceId}`
                  : '/workspaces/projects'
              }
              className="text-xs text-neutral-500 hover:text-black transition-colors"
            >
              Manage projects →
            </Link>
          </div>

          {isProjectsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ) : !projects || projects.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-neutral-200 bg-white text-center">
              <FolderKanban className="w-6 h-6 text-neutral-300 mx-auto mb-2 stroke-[1.5]" />
              <p className="text-xs text-neutral-500 mb-3">No projects yet in this workspace.</p>
              <Button size="sm" onClick={() => setIsCreateProjectOpen(true)}>
                Create Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white p-4 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-xs font-semibold text-neutral-900 truncate">
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
                      {project.description || 'No project description.'}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                    <span className="text-neutral-400">{project.boards?.length || 0} columns</span>
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

        {/* Bottom Split: Members & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Members */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-neutral-500" />
                <span>Workspace Members</span>
              </h2>
              <Link
                href={
                  workspaceId
                    ? `/workspaces/members?workspaceId=${workspaceId}`
                    : '/workspaces/members'
                }
                className="text-xs text-neutral-500 hover:text-black transition-colors"
              >
                View all ({workspace?.members?.length || 0}) →
              </Link>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200 divide-y divide-neutral-100">
              {!workspace?.members || workspace.members.length === 0 ? (
                <p className="text-xs text-neutral-400 py-4 text-center">No members listed</p>
              ) : (
                workspace.members.slice(0, 5).map((m: any, idx: number) => {
                  const userObj = m.user || { fullName: 'Member', email: '' };
                  return (
                    <div
                      key={m.id || idx}
                      className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar name={userObj.fullName} size="xs" />
                        <div>
                          <p className="text-xs font-semibold text-neutral-900 leading-tight">
                            {userObj.fullName}
                          </p>
                          <p className="text-[11px] text-neutral-400">{userObj.email}</p>
                        </div>
                      </div>
                      <Badge role={m.role} />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Activity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-neutral-500" />
                <span>Audit Stream</span>
              </h2>
              <Link
                href={
                  workspaceId
                    ? `/workspaces/activity?workspaceId=${workspaceId}`
                    : '/workspaces/activity'
                }
                className="text-xs text-neutral-500 hover:text-black transition-colors"
              >
                Full audit log →
              </Link>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <ActivityTimeline
                activities={activities}
                isLoading={isActivitiesLoading}
                emptyMessage="No activity logs yet"
              />
            </div>
          </div>
        </div>
      </div>

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        workspaceId={workspaceId}
      />
    </AppLayout>
  );
}

export default function WorkspaceOverviewPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8">
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <WorkspaceOverviewContent />
    </Suspense>
  );
}
