'use client';

import React, { Suspense } from 'react';
import { AppLayout } from '@/src/components/layout/AppLayout';
import { useWorkspace } from '@/src/hooks/useWorkspaces';
import { useWorkspaceActivities } from '@/src/hooks/useActivities';
import { useWorkspaceParams } from '@/src/hooks/useWorkspaceParams';
import { ActivityTimeline } from '@/src/components/features/ActivityTimeline';
import { Skeleton } from '@/src/components/ui/Skeleton';

function WorkspaceActivityContent() {
  const { workspaceId } = useWorkspaceParams();

  const { data: workspace } = useWorkspace(workspaceId);
  const { data: activities, isLoading } = useWorkspaceActivities(workspaceId, 1, 50);

  return (
    <AppLayout
      breadcrumbs={[
        {
          label: workspace?.name || 'Workspace',
          href: workspaceId ? `/workspaces?workspaceId=${workspaceId}` : '/workspaces',
        },
        { label: 'Activity Audit Log' },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="pb-4 border-b border-neutral-200">
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            Workspace Activity Log
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Audit history of task creations, updates, stage movements, and member interactions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
          <ActivityTimeline
            activities={activities}
            isLoading={isLoading}
            emptyMessage="No activity records found in this workspace"
          />
        </div>
      </div>
    </AppLayout>
  );
}

export default function WorkspaceActivityPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8">
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <WorkspaceActivityContent />
    </Suspense>
  );
}
