'use client';

import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';

export function useWorkspaceParams() {
  const searchParams = useSearchParams();
  const { currentWorkspace } = useAuth();

  const workspaceId = searchParams.get('workspaceId') || currentWorkspace?.id || '';
  const projectId = searchParams.get('projectId') || '';

  return {
    workspaceId,
    projectId,
    currentWorkspace,
    searchParams,
  };
}
