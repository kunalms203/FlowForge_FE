'use client';

import React, { Suspense } from 'react';
import { AppLayout } from '@/src/components/layout/AppLayout';
import { useWorkspace } from '@/src/hooks/useWorkspaces';
import { useProject } from '@/src/hooks/useProjects';
import { useProjectActivities } from '@/src/hooks/useActivities';
import { useWorkspaceParams } from '@/src/hooks/useWorkspaceParams';
import { Button } from '@/src/components/ui/Button';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { ActivityTimeline } from '@/src/components/features/ActivityTimeline';
import Link from 'next/link';
import { FolderKanban, KanbanSquare, ArrowUpRight, Activity, Calendar } from 'lucide-react';
import { format } from 'date-fns';

function ProjectOverviewContent() {
  const { workspaceId, projectId } = useWorkspaceParams();

  const { data: workspace } = useWorkspace(workspaceId);
  const { data: project, isLoading } = useProject(workspaceId, projectId);
  const { data: activities, isLoading: isActivitiesLoading } = useProjectActivities(
    projectId,
    1,
    20
  );

  return (
    <AppLayout
      breadcrumbs={[
        {
          label: workspace?.name || 'Workspace',
          href: workspaceId ? `/workspaces?workspaceId=${workspaceId}` : '/workspaces',
        },
        {
          label: 'Projects',
          href: workspaceId
            ? `/workspaces/projects?workspaceId=${workspaceId}`
            : '/workspaces/projects',
        },
        { label: project?.name || 'Project' },
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Project Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
                <FolderKanban className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
                  {isLoading ? <Skeleton className="h-7 w-40" /> : project?.name}
                </h1>
                <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Created{' '}
                    {project?.createdAt
                      ? format(new Date(project.createdAt), 'MMMM d, yyyy')
                      : 'recently'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <Link
            href={`/workspaces/projects/board?workspaceId=${workspaceId}&projectId=${projectId}`}
          >
            <Button size="md" className="gap-2">
              <KanbanSquare className="w-4 h-4" />
              <span>Launch Kanban Board</span>
              <ArrowUpRight className="w-4 h-4 ml-0.5" />
            </Button>
          </Link>
        </div>

        {/* Project Details Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="p-5 rounded-xl bg-white border border-neutral-200 space-y-3">
              <h2 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                Description
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-wrap">
                {project?.description || 'No description provided for this project.'}
              </p>
            </div>

            {/* Board Columns Summary */}
            <div className="p-5 rounded-xl bg-white border border-neutral-200 space-y-3">
              <h2 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                Board Columns ({project?.boards?.length || 0})
              </h2>
              <div className="flex flex-wrap gap-2">
                {project?.boards?.map((b) => (
                  <span
                    key={b.id}
                    className="px-3 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700"
                  >
                    {b.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Project Activity Log */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-neutral-500" />
              <span>Project Activity</span>
            </h2>
            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <ActivityTimeline
                activities={activities}
                isLoading={isActivitiesLoading}
                emptyMessage="No activity in this project yet"
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function ProjectOverviewPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8">
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <ProjectOverviewContent />
    </Suspense>
  );
}
