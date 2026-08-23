import { useQuery } from '@tanstack/react-query';
import { activityApi } from '@/src/services/activityApi';

export const activityKeys = {
  workspace: (workspaceId: string, page: number, limit: number) =>
    ['activities', 'workspace', workspaceId, { page, limit }] as const,
  project: (projectId: string, page: number, limit: number) =>
    ['activities', 'project', projectId, { page, limit }] as const,
  task: (taskId: string, page: number, limit: number) =>
    ['activities', 'task', taskId, { page, limit }] as const,
};

export function useWorkspaceActivities(workspaceId: string, page = 1, limit = 30) {
  return useQuery({
    queryKey: activityKeys.workspace(workspaceId, page, limit),
    queryFn: () => activityApi.getWorkspaceActivities(workspaceId, page, limit),
    enabled: !!workspaceId,
  });
}

export function useProjectActivities(projectId: string, page = 1, limit = 30) {
  return useQuery({
    queryKey: activityKeys.project(projectId, page, limit),
    queryFn: () => activityApi.getProjectActivities(projectId, page, limit),
    enabled: !!projectId,
  });
}

export function useTaskActivities(taskId: string, page = 1, limit = 30) {
  return useQuery({
    queryKey: activityKeys.task(taskId, page, limit),
    queryFn: () => activityApi.getTaskActivities(taskId, page, limit),
    enabled: !!taskId,
  });
}
