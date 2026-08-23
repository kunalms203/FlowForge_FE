'use client';

import React, { use } from 'react';
import { AppLayout } from '@/src/components/layout/AppLayout';
import { useWorkspace } from '@/src/hooks/useWorkspaces';
import { useProject } from '@/src/hooks/useProjects';
import { KanbanBoard } from '@/src/components/features/KanbanBoard';
import { Skeleton } from '@/src/components/ui/Skeleton';
import Link from 'next/link';
import { FolderKanban, ArrowLeft } from 'lucide-react';

export default function ProjectBoardPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  const resolvedParams = use(params);
  const { workspaceId, projectId } = resolvedParams;

  const { data: workspace } = useWorkspace(workspaceId);
  const { data: project, isLoading: isProjectLoading } = useProject(workspaceId, projectId);

  return (
    <AppLayout
      breadcrumbs={[
        { label: workspace?.name || 'Workspace', href: `/workspaces/${workspaceId}` },
        { label: 'Projects', href: `/workspaces/${workspaceId}/projects` },
        { label: project?.name || 'Project', href: `/workspaces/${workspaceId}/projects/${projectId}` },
        { label: 'Board' },
      ]}
    >
      <div className="space-y-4">
        {/* Board Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <Link
              href={`/workspaces/${workspaceId}/projects`}
              className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
              title="Back to Projects"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-neutral-500" />
                <h1 className="text-base font-bold text-neutral-900 tracking-tight">
                  {isProjectLoading ? <Skeleton className="h-5 w-32" /> : project?.name}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                  Kanban Board
                </span>
              </div>
              {project?.description && (
                <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1 max-w-xl">
                  {project.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* The Kanban Board */}
        <KanbanBoard workspaceId={workspaceId} projectId={projectId} />
      </div>
    </AppLayout>
  );
}
