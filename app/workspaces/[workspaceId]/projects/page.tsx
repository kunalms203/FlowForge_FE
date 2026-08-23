'use client';

import React, { useState, use } from 'react';
import { AppLayout } from '@/src/components/layout/AppLayout';
import { useWorkspace } from '@/src/hooks/useWorkspaces';
import {
  useProjects,
  useUpdateProject,
  useDeleteProject,
} from '@/src/hooks/useProjects';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { Modal } from '@/src/components/ui/Modal';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { CreateProjectModal } from '@/src/components/features/CreateProjectModal';
import Link from 'next/link';
import {
  FolderKanban,
  KanbanSquare,
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  ArrowUpRight,
} from 'lucide-react';
import { Project } from '@/src/types';

export default function WorkspaceProjectsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.workspaceId;

  const { data: workspace } = useWorkspace(workspaceId);
  const { data: projects, isLoading } = useProjects(workspaceId);
  const updateProjectMutation = useUpdateProject(workspaceId, '');
  const deleteProjectMutation = useDeleteProject(workspaceId);

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredProjects = projects?.filter((p) => {
    if (!searchQuery) return true;
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditDescription(project.description || '');
    setActiveMenuId(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editName.trim()) return;

    await updateProjectMutation.mutateAsync({
      name: editName.trim(),
      description: editDescription.trim() || undefined,
    });
    setEditingProject(null);
  };

  const handleDelete = async (projectId: string, name: string) => {
    setActiveMenuId(null);
    if (confirm(`Are you sure you want to delete project "${name}"?`)) {
      await deleteProjectMutation.mutateAsync(projectId);
    }
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: workspace?.name || 'Workspace', href: `/workspaces/${workspaceId}` },
        { label: 'Projects' },
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Projects</h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Manage your engineering projects, roadmaps, and Kanban workflows.
            </p>
          </div>

          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Create Project
          </Button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-md bg-white border border-neutral-200 text-neutral-900 text-xs shadow-2xs placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:border-black focus:ring-black"
            />
          </div>
        </div>

        {/* Project Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
          </div>
        ) : !filteredProjects || filteredProjects.length === 0 ? (
          <div className="p-12 rounded-xl border border-dashed border-neutral-200 bg-white text-center">
            <FolderKanban className="w-8 h-8 text-neutral-300 mx-auto mb-2 stroke-[1.5]" />
            <h3 className="text-sm font-semibold text-neutral-900">No projects found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-4">
              {searchQuery ? 'Try adjusting your search query.' : 'Create your first project to begin organizing work.'}
            </p>
            {!searchQuery && (
              <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Create Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white p-5 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700">
                        <FolderKanban className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-xs font-semibold text-neutral-900 truncate max-w-[180px]">
                        {project.name}
                      </h3>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenuId(activeMenuId === project.id ? null : project.id)
                        }
                        className="p-1 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenuId === project.id && (
                        <div className="absolute right-0 mt-1 w-36 rounded-lg bg-white border border-neutral-200 shadow-lg py-1 z-30 animate-in fade-in-80 zoom-in-95">
                          <button
                            onClick={() => handleOpenEdit(project)}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100 text-left"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Project</span>
                          </button>
                          <button
                            onClick={() => handleDelete(project.id, project.name)}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 text-left"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Project</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-500 line-clamp-3 leading-relaxed mt-2">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">
                    {project.boards?.length || 0} columns
                  </span>

                  <Link
                    href={`/workspaces/${workspaceId}/projects/${project.id}/board`}
                    className="font-semibold text-black hover:underline flex items-center gap-1"
                  >
                    <KanbanSquare className="w-3.5 h-3.5" />
                    <span>Open Board</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        workspaceId={workspaceId}
      />

      {/* Edit Project Modal */}
      <Modal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        title="Edit Project"
        description="Update project name and description."
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Input
            label="Project Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
            autoFocus
          />
          <Textarea
            label="Description"
            rows={3}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingProject(null)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={updateProjectMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
