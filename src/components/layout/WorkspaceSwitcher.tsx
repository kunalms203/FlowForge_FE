'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { useWorkspaces, useCreateWorkspace } from '@/src/hooks/useWorkspaces';
import { ChevronsUpDown, Check, Plus, Building2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';

export function WorkspaceSwitcher() {
  const { currentWorkspace, setCurrentWorkspace } = useAuth();
  const { data: workspaces, isLoading } = useWorkspaces();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [error, setError] = useState('');
  const createMutation = useCreateWorkspace();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // If no workspace is selected yet, select the first available
  useEffect(() => {
    if (!currentWorkspace && workspaces && workspaces.length > 0) {
      setCurrentWorkspace(workspaces[0]);
    }
  }, [workspaces, currentWorkspace, setCurrentWorkspace]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (ws: any) => {
    setCurrentWorkspace(ws);
    setIsOpen(false);
    router.push(`/workspaces/${ws.id}`);
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) {
      setError('Workspace name is required');
      return;
    }
    setError('');
    try {
      const created = await createMutation.mutateAsync({ name: newWorkspaceName.trim() });
      setCurrentWorkspace(created);
      setIsCreateModalOpen(false);
      setNewWorkspaceName('');
      router.push(`/workspaces/${created.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create workspace');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100/80 transition-colors text-left border border-transparent hover:border-neutral-200"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
            {currentWorkspace?.name ? currentWorkspace.name[0].toUpperCase() : 'W'}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-neutral-900 truncate leading-none">
              {isLoading ? 'Loading...' : currentWorkspace?.name || 'Select Workspace'}
            </p>
            <p className="text-[10px] text-neutral-400 truncate mt-0.5">FlowForge SaaS</p>
          </div>
        </div>
        <ChevronsUpDown className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full min-w-[220px] rounded-lg bg-white border border-neutral-200 shadow-lg py-1 z-50 animate-in fade-in-80 zoom-in-95">
          <div className="px-2 py-1.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            Workspaces
          </div>
          <div className="max-h-56 overflow-y-auto py-0.5">
            {workspaces?.map((ws) => {
              const isSelected = currentWorkspace?.id === ws.id;
              return (
                <button
                  key={ws.id}
                  onClick={() => handleSelect(ws)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{ws.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-black shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-neutral-100 mt-1 pt-1 px-1">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsCreateModalOpen(true);
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Workspace</span>
            </button>
          </div>
        </div>
      )}

      {/* Create Workspace Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Workspace"
        description="Organize your teams, projects, boards, and tasks in a dedicated workspace."
      >
        <form onSubmit={handleCreateWorkspace} className="space-y-4">
          <Input
            label="Workspace Name"
            placeholder="e.g. Engineering, Acme Corp"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            error={error}
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={createMutation.isPending}>
              Create Workspace
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
