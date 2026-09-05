'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { AppLayout } from '@/src/components/layout/AppLayout';
import { useWorkspace, useUpdateWorkspace, useDeleteWorkspace } from '@/src/hooks/useWorkspaces';
import { useAuth } from '@/src/context/AuthContext';
import { useWorkspaceParams } from '@/src/hooks/useWorkspaceParams';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { ErrorAlert } from '@/src/components/ui/ErrorAlert';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { useRouter } from 'next/navigation';
import { Check, Trash2, ShieldAlert } from 'lucide-react';

function WorkspaceSettingsContent() {
  const { workspaceId } = useWorkspaceParams();
  const { setCurrentWorkspace } = useAuth();
  const { data: workspace, isLoading } = useWorkspace(workspaceId);
  const updateWorkspaceMutation = useUpdateWorkspace(workspaceId);
  const deleteWorkspaceMutation = useDeleteWorkspace();
  const router = useRouter();

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (workspace) {
      setName(workspace.name);
    }
  }, [workspace]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Workspace name cannot be empty');
      return;
    }
    setError('');

    try {
      const updated = await updateWorkspaceMutation.mutateAsync({ name: name.trim() });
      setCurrentWorkspace(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update workspace');
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        `Are you sure you want to delete workspace "${workspace?.name}"? This action is irreversible.`
      )
    ) {
      try {
        await deleteWorkspaceMutation.mutateAsync(workspaceId);
        setCurrentWorkspace(null);
        router.push('/dashboard');
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to delete workspace');
      }
    }
  };

  return (
    <AppLayout
      breadcrumbs={[
        {
          label: workspace?.name || 'Workspace',
          href: workspaceId ? `/workspaces?workspaceId=${workspaceId}` : '/workspaces',
        },
        { label: 'Settings' },
      ]}
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="pb-4 border-b border-neutral-200">
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Workspace Settings</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage workspace identity, configuration, and preferences.
          </p>
        </div>

        {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}

        {/* General Settings */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900">General Information</h2>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <Input
                label="Workspace Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Workspace Slug (Read-only)"
                value={workspace?.slug || ''}
                disabled
                helperText="Auto-generated URL identifier for your workspace"
              />

              <div className="flex items-center justify-between pt-2">
                {savedSuccess ? (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <Check className="w-4 h-4" /> Settings updated successfully
                  </span>
                ) : (
                  <span />
                )}

                <Button type="submit" size="sm" isLoading={updateWorkspaceMutation.isPending}>
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white p-6 rounded-xl border border-red-200 shadow-2xs space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-100">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">Danger Zone</h2>
              <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                Deleting this workspace will remove all associated projects, boards, tasks,
                comments, and attachments.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 flex justify-end">
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              isLoading={deleteWorkspaceMutation.isPending}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Workspace
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function WorkspaceSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8">
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <WorkspaceSettingsContent />
    </Suspense>
  );
}
