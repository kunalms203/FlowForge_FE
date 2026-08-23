export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'MEMBER' | 'VIEWER';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  joinedAt: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  members?: WorkspaceMember[] | { role: WorkspaceRole }[];
  projects?: Project[];
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  boards?: Board[];
  members?: { id: string; userId: string; user?: User }[];
  _count?: {
    boards?: number;
  };
}

export interface Board {
  id: string;
  projectId: string;
  name: string;
  position: number;
  createdAt: string;
  tasks?: Task[];
}

export interface Label {
  id: string;
  workspaceId: string;
  name: string;
  color: string;
}

export interface TaskLabel {
  taskId: string;
  labelId: string;
  label: Label;
}

export interface Task {
  id: string;
  workspaceId: string;
  projectId: string;
  boardId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints: number | null;
  startDate: string | null;
  dueDate: string | null;
  assigneeId: string | null;
  reporterId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  assignee?: {
    id: string;
    fullName: string;
    email?: string;
  } | null;
  reporter?: {
    id: string;
    fullName: string;
    email?: string;
  } | null;
  comments?: Comment[];
  attachments?: Attachment[];
  labels?: TaskLabel[];
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email?: string;
  };
}

export interface Attachment {
  id: string;
  taskId: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number | string;
  mimeType: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  workspaceId: string;
  projectId?: string | null;
  taskId?: string | null;
  actorId: string;
  action: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  createdAt: string;
  actor: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthData {
  user: User;
  workspace?: Workspace;
  accessToken: string;
  refreshToken: string;
}
