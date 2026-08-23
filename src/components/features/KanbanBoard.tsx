'use client';

import React, { useState } from 'react';
import { Board, Task, TaskPriority } from '@/src/types';
import { TaskCard } from './TaskCard';
import { TaskDetailDrawer } from './TaskDetailDrawer';
import { CreateTaskModal } from './CreateTaskModal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import {
  useBoards,
  useCreateBoard,
  useUpdateBoard,
  useDeleteBoard,
} from '@/src/hooks/useBoards';
import { useTasks, useCreateTask, useMoveTask } from '@/src/hooks/useTasks';
import {
  Plus,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  X,
  Kanban as KanbanIcon,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface ColumnProps {
  board: Board;
  workspaceId: string;
  projectId: string;
  allBoards: Board[];
  onTaskClick: (taskId: string, boardId: string) => void;
  filterSearch: string;
  filterPriority: string;
}

function BoardColumn({
  board,
  workspaceId,
  projectId,
  allBoards,
  onTaskClick,
  filterSearch,
  filterPriority,
}: ColumnProps) {
  const { data: tasks, isLoading } = useTasks(workspaceId, projectId, board.id);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState(board.name);

  const createTaskMutation = useCreateTask(workspaceId, projectId, board.id);
  const updateBoardMutation = useUpdateBoard(workspaceId, projectId);
  const deleteBoardMutation = useDeleteBoard(workspaceId, projectId);

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    await createTaskMutation.mutateAsync({
      title: quickTitle.trim(),
    });
    setQuickTitle('');
    setIsQuickAddOpen(false);
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;
    await updateBoardMutation.mutateAsync({
      boardId: board.id,
      payload: { name: newColumnName.trim() },
    });
    setIsRenameModalOpen(false);
  };

  const handleDeleteColumn = async () => {
    if (confirm(`Are you sure you want to delete column "${board.name}"?`)) {
      await deleteBoardMutation.mutateAsync(board.id);
    }
  };

  // Filter tasks based on active search & priority filters
  const filteredTasks = tasks?.filter((task) => {
    if (
      filterSearch &&
      !task.title.toLowerCase().includes(filterSearch.toLowerCase()) &&
      !task.description?.toLowerCase().includes(filterSearch.toLowerCase())
    ) {
      return false;
    }
    if (filterPriority && task.priority !== filterPriority) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-80 shrink-0 flex flex-col bg-neutral-100/70 rounded-xl border border-neutral-200/80 max-h-full">
      {/* Column Header */}
      <div className="p-3 flex items-center justify-between border-b border-neutral-200/60 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-neutral-900 tracking-tight">{board.name}</h3>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-neutral-200/70 text-neutral-600 font-medium">
            {tasks?.length || 0}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
            className="p-1 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {isOptionsOpen && (
            <div className="absolute right-0 mt-1 w-36 rounded-lg bg-white border border-neutral-200 shadow-lg py-1 z-30 animate-in fade-in-80 zoom-in-95">
              <button
                onClick={() => {
                  setIsOptionsOpen(false);
                  setIsRenameModalOpen(true);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100 text-left"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Rename</span>
              </button>
              <button
                onClick={() => {
                  setIsOptionsOpen(false);
                  handleDeleteColumn();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 text-left"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Droppable Task List */}
      <Droppable droppableId={board.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2.5 space-y-2 overflow-y-auto min-h-[140px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-neutral-200/40' : ''
            }`}
          >
            {isLoading ? (
              <div className="p-4 text-center text-xs text-neutral-400">Loading tasks...</div>
            ) : filteredTasks && filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(dragProvided, dragSnapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                    >
                      <TaskCard
                        task={task}
                        isDragging={dragSnapshot.isDragging}
                        onClick={() => onTaskClick(task.id, board.id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-neutral-400">No tasks</div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Quick Add Task */}
      <div className="p-2 border-t border-neutral-200/60 shrink-0">
        {isQuickAddOpen ? (
          <form onSubmit={handleQuickAdd} className="space-y-2">
            <Input
              placeholder="Task title..."
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              autoFocus
            />
            <div className="flex items-center gap-1 justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsQuickAddOpen(false)}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
              <Button type="submit" size="sm" isLoading={createTaskMutation.isPending}>
                Add
              </Button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-md transition-colors font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add task</span>
          </button>
        )}
      </div>

      {/* Rename Column Modal */}
      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        title="Rename Column"
      >
        <form onSubmit={handleRename} className="space-y-4">
          <Input
            label="Column Name"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRenameModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={updateBoardMutation.isPending}>
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export interface KanbanBoardProps {
  workspaceId: string;
  projectId: string;
}

export function KanbanBoard({ workspaceId, projectId }: KanbanBoardProps) {
  const { data: boards, isLoading: isBoardsLoading } = useBoards(workspaceId, projectId);
  const createBoardMutation = useCreateBoard(workspaceId, projectId);
  const moveTaskMutation = useMoveTask(workspaceId, projectId);

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const handleTaskClick = (taskId: string, boardId: string) => {
    setSelectedTaskId(taskId);
    setSelectedBoardId(boardId);
    setIsDetailOpen(true);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Call backend move task endpoint
    await moveTaskMutation.mutateAsync({
      currentBoardId: source.droppableId,
      taskId: draggableId,
      newBoardId: destination.droppableId,
    });
  };

  const handleCreateColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;
    await createBoardMutation.mutateAsync({ name: newColumnName.trim() });
    setNewColumnName('');
    setIsAddColumnModalOpen(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Board Controls / Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-200/80">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter tasks by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-md bg-white border border-neutral-200 text-neutral-900 text-xs shadow-2xs placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:border-black focus:ring-black"
            />
          </div>

          <Select
            className="h-8 w-32"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddColumnModalOpen(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Column
          </Button>

          <Button
            size="sm"
            onClick={() => {
              if (boards && boards.length > 0) {
                setSelectedBoardId(boards[0].id);
                setIsCreateTaskModalOpen(true);
              }
            }}
            disabled={!boards || boards.length === 0}
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> New Task
          </Button>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll View */}
      {isBoardsLoading ? (
        <div className="flex items-center justify-center h-64 text-xs text-neutral-400">
          Loading board columns...
        </div>
      ) : !boards || boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-72 border border-dashed border-neutral-200 rounded-xl bg-white p-8 text-center">
          <KanbanIcon className="w-8 h-8 text-neutral-300 stroke-[1.5] mb-2" />
          <h3 className="text-sm font-semibold text-neutral-900">No board columns yet</h3>
          <p className="text-xs text-neutral-500 max-w-sm mt-1 mb-4">
            Create columns such as "To Do", "In Progress", and "Done" to organize tasks.
          </p>
          <Button size="sm" onClick={() => setIsAddColumnModalOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add First Column
          </Button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start select-none">
            {boards.map((board) => (
              <BoardColumn
                key={board.id}
                board={board}
                workspaceId={workspaceId}
                projectId={projectId}
                allBoards={boards}
                onTaskClick={handleTaskClick}
                filterSearch={searchQuery}
                filterPriority={filterPriority}
              />
            ))}

            {/* Quick Add Column Card */}
            <div className="w-80 shrink-0 p-3 rounded-xl border border-dashed border-neutral-200 flex items-center justify-center">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-neutral-500 hover:text-black"
                onClick={() => setIsAddColumnModalOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Column
              </Button>
            </div>
          </div>
        </DragDropContext>
      )}

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedTaskId(null);
        }}
        workspaceId={workspaceId}
        projectId={projectId}
        boardId={selectedBoardId}
        taskId={selectedTaskId}
        boards={boards}
      />

      {/* Create Task Modal */}
      {boards && boards.length > 0 && (
        <CreateTaskModal
          isOpen={isCreateTaskModalOpen}
          onClose={() => setIsCreateTaskModalOpen(false)}
          workspaceId={workspaceId}
          projectId={projectId}
          defaultBoardId={selectedBoardId || boards[0].id}
          boards={boards}
        />
      )}

      {/* Add Column Modal */}
      <Modal
        isOpen={isAddColumnModalOpen}
        onClose={() => setIsAddColumnModalOpen(false)}
        title="Add Column / Board"
        description="Add a new column to manage your workflow stages."
      >
        <form onSubmit={handleCreateColumn} className="space-y-4">
          <Input
            label="Column Name"
            placeholder="e.g. Backlog, Review, QA, Completed"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddColumnModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={createBoardMutation.isPending}>
              Add Column
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
