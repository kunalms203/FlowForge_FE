import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi, CreateProjectPayload, UpdateProjectPayload } from '@/src/services/projectApi';

export const projectKeys = {
  all: (workspaceId: string) => ['projects', workspaceId] as const,
  detail: (workspaceId: string, projectId: string) => ['projects', workspaceId, projectId] as const,
};

export function useProjects(workspaceId: string) {
  return useQuery({
    queryKey: projectKeys.all(workspaceId),
    queryFn: () => projectApi.getProjects(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useProject(workspaceId: string, projectId: string) {
  return useQuery({
    queryKey: projectKeys.detail(workspaceId, projectId),
    queryFn: () => projectApi.getProjectById(workspaceId, projectId),
    enabled: !!workspaceId && !!projectId,
  });
}

export function useCreateProject(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => projectApi.createProject(workspaceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all(workspaceId) });
    },
  });
}

export function useUpdateProject(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProjectPayload) => projectApi.updateProject(workspaceId, projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all(workspaceId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(workspaceId, projectId) });
    },
  });
}

export function useDeleteProject(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => projectApi.deleteProject(workspaceId, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all(workspaceId) });
    },
  });
}
