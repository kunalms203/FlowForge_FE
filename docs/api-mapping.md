# FlowForge Frontend API Mapping Document

This document maps all available backend APIs from `api.json` and the backend implementation (`FlowForge_BE`) to frontend features, React Query hooks, and UI components.

---

## 1. Authentication (`/api/auth`)

### 1.1 Register User
- **Frontend Feature**: User Signup & Initial Workspace Creation
- **HTTP Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "fullName": "Full Name",
    "workspaceName": "My Workspace"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "uuid",
        "email": "user@example.com",
        "fullName": "Full Name"
      },
      "workspace": {
        "id": "uuid",
        "name": "My Workspace",
        "slug": "my-workspace"
      },
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token"
    }
  }
  ```
- **Frontend Hook**: `useRegister()` (`useMutation`)
- **UI Component**: `RegisterPage` (`/auth/register`), `RegisterForm`

---

### 1.2 Login User
- **Frontend Feature**: User Sign In
- **HTTP Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "uuid",
        "email": "user@example.com",
        "fullName": "Full Name"
      },
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token"
    }
  }
  ```
- **Frontend Hook**: `useLogin()` (`useMutation`)
- **UI Component**: `LoginPage` (`/auth/login`), `LoginForm`

---

### 1.3 Refresh Access Token
- **Frontend Feature**: Silent Session Token Refresh
- **HTTP Method**: `POST`
- **Endpoint**: `/api/auth/refresh`
- **Request Body**:
  ```json
  {
    "refreshToken": "refresh_token"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
      "accessToken": "new_jwt_token"
    }
  }
  ```
- **Frontend Hook / Interceptor**: Axios Response Interceptor (Auto-refresh on 401)
- **UI Component**: Handled transparently by `AuthContext` / `apiClient`

---

### 1.4 Logout User
- **Frontend Feature**: User Logout & Session Invalidation
- **HTTP Method**: `POST`
- **Endpoint**: `/api/auth/logout`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "refreshToken": "refresh_token"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```
- **Frontend Hook**: `useLogout()` (`useMutation`)
- **UI Component**: `UserDropdown`, `HeaderUserNav`

---

## 2. Workspaces (`/api/workspaces`)

### 2.1 Get All Workspaces
- **Frontend Feature**: Workspace Switcher & List
- **HTTP Method**: `GET`
- **Endpoint**: `/api/workspaces`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "name": "Workspace Name",
        "slug": "workspace-slug",
        "createdAt": "iso-date",
        "updatedAt": "iso-date",
        "members": [
          {
            "role": "OWNER"
          }
        ]
      }
    ]
  }
  ```
- **Frontend Hook**: `useWorkspaces()` (`useQuery`)
- **UI Component**: `WorkspaceSwitcher`, `WorkspaceListPage`, `AppSidebar`

---

### 2.2 Create Workspace
- **Frontend Feature**: Create New Workspace Modal / Form
- **HTTP Method**: `POST`
- **Endpoint**: `/api/workspaces`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "name": "New Workspace"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Workspace created",
    "data": {
      "id": "uuid",
      "name": "New Workspace",
      "slug": "new-workspace"
    }
  }
  ```
- **Frontend Hook**: `useCreateWorkspace()` (`useMutation`)
- **UI Component**: `CreateWorkspaceModal`, `WorkspaceSettingsPage`

---

### 2.3 Get Workspace by ID
- **Frontend Feature**: Workspace Dashboard & Details (with Members & Projects)
- **HTTP Method**: `GET`
- **Endpoint**: `/api/workspaces/:workspaceId`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "name": "Workspace Name",
      "slug": "workspace-slug",
      "createdAt": "iso-date",
      "updatedAt": "iso-date",
      "members": [
        {
          "id": "uuid",
          "role": "OWNER",
          "joinedAt": "iso-date",
          "user": {
            "id": "uuid",
            "email": "user@example.com",
            "fullName": "User Name"
          }
        }
      ],
      "projects": [
        {
          "id": "uuid",
          "name": "Project Name",
          "description": "...",
          "createdAt": "iso-date"
        }
      ]
    }
  }
  ```
- **Frontend Hook**: `useWorkspace(workspaceId)` (`useQuery`)
- **UI Component**: `WorkspaceOverviewPage`, `WorkspaceMembersPage`, `WorkspaceHeader`

---

### 2.4 Update Workspace
- **Frontend Feature**: Workspace General Settings (Rename)
- **HTTP Method**: `PUT`
- **Endpoint**: `/api/workspaces/:workspaceId`
- **Request Headers**: `Authorization: Bearer <accessToken>` (Requires OWNER/ADMIN role)
- **Request Body**:
  ```json
  {
    "name": "Updated Workspace Name"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Workspace updated",
    "data": { ... }
  }
  ```
- **Frontend Hook**: `useUpdateWorkspace(workspaceId)` (`useMutation`)
- **UI Component**: `WorkspaceGeneralSettingsForm`

---

### 2.5 Delete Workspace
- **Frontend Feature**: Delete Workspace (Danger Zone)
- **HTTP Method**: `DELETE`
- **Endpoint**: `/api/workspaces/:workspaceId`
- **Request Headers**: `Authorization: Bearer <accessToken>` (Requires OWNER role)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Workspace deleted"
  }
  ```
- **Frontend Hook**: `useDeleteWorkspace()` (`useMutation`)
- **UI Component**: `DeleteWorkspaceDialog`

---

## 3. Projects (`/api/workspaces/:workspaceId/projects`)

### 3.1 Get All Projects
- **Frontend Feature**: Workspace Projects List & Cards
- **HTTP Method**: `GET`
- **Endpoint**: `/api/workspaces/:workspaceId/projects`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "workspaceId": "uuid",
        "name": "Project Name",
        "description": "Project description",
        "createdAt": "iso-date",
        "updatedAt": "iso-date",
        "boards": [
          { "id": "uuid", "name": "To Do", "position": 0 }
        ],
        "_count": { "boards": 3 }
      }
    ]
  }
  ```
- **Frontend Hook**: `useProjects(workspaceId)` (`useQuery`)
- **UI Component**: `ProjectsListPage`, `ProjectsGrid`, `ProjectCard`

---

### 3.2 Create Project
- **Frontend Feature**: Create Project Modal
- **HTTP Method**: `POST`
- **Endpoint**: `/api/workspaces/:workspaceId/projects`
- **Request Headers**: `Authorization: Bearer <accessToken>` (Requires OWNER/ADMIN/MANAGER role)
- **Request Body**:
  ```json
  {
    "name": "New Project",
    "description": "Project description"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Project created",
    "data": {
      "id": "uuid",
      "name": "New Project",
      "description": "Project description",
      "workspaceId": "uuid"
    }
  }
  ```
- **Frontend Hook**: `useCreateProject(workspaceId)` (`useMutation`)
- **UI Component**: `CreateProjectModal`, `CreateProjectForm`

---

### 3.3 Get Project by ID
- **Frontend Feature**: Project Overview & Summary
- **HTTP Method**: `GET`
- **Endpoint**: `/api/workspaces/:workspaceId/projects/:projectId`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "name": "Project Name",
      "description": "Project description",
      "workspaceId": "uuid",
      "createdAt": "iso-date",
      "updatedAt": "iso-date",
      "boards": [
        { "id": "uuid", "name": "To Do", "position": 0 }
      ],
      "members": []
    }
  }
  ```
- **Frontend Hook**: `useProject(workspaceId, projectId)` (`useQuery`)
- **UI Component**: `ProjectOverviewPage`, `ProjectHeader`

---

### 3.4 Update Project
- **Frontend Feature**: Project Settings Form
- **HTTP Method**: `PUT`
- **Endpoint**: `/api/workspaces/:workspaceId/projects/:projectId`
- **Request Headers**: `Authorization: Bearer <accessToken>` (Requires OWNER/ADMIN/MANAGER role)
- **Request Body**:
  ```json
  {
    "name": "Updated Project Name",
    "description": "Updated description"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Project updated",
    "data": { ... }
  }
  ```
- **Frontend Hook**: `useUpdateProject(workspaceId, projectId)` (`useMutation`)
- **UI Component**: `ProjectSettingsPage`, `ProjectEditModal`

---

### 3.5 Delete Project
- **Frontend Feature**: Delete Project Modal
- **HTTP Method**: `DELETE`
- **Endpoint**: `/api/workspaces/:workspaceId/projects/:projectId`
- **Request Headers**: `Authorization: Bearer <accessToken>` (Requires OWNER/ADMIN role)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Project deleted"
  }
  ```
- **Frontend Hook**: `useDeleteProject(workspaceId)` (`useMutation`)
- **UI Component**: `DeleteProjectDialog`

---

## 4. Boards / Columns (`/api/workspaces/:workspaceId/projects/:projectId/boards`)

### 4.1 Get All Boards
- **Frontend Feature**: Kanban Board Columns & Column Headers
- **HTTP Method**: `GET`
- **Endpoint**: `/api/workspaces/:workspaceId/projects/:projectId/boards`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "projectId": "uuid",
        "name": "To Do",
        "position": 0,
        "createdAt": "iso-date",
        "tasks": [ ... ]
      }
    ]
  }
  ```
- **Frontend Hook**: `useBoards(workspaceId, projectId)` (`useQuery`)
- **UI Component**: `KanbanBoard`, `BoardColumnList`

---

### 4.2 Create Board / Column
- **Frontend Feature**: Add Kanban Column
- **HTTP Method**: `POST`
- **Endpoint**: `/api/workspaces/:workspaceId/projects/:projectId/boards`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "name": "In Review"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Board created",
    "data": {
      "id": "uuid",
      "name": "In Review",
      "position": 3
    }
  }
  ```
- **Frontend Hook**: `useCreateBoard(workspaceId, projectId)` (`useMutation`)
- **UI Component**: `AddColumnButton`, `CreateBoardDialog`

---

### 4.3 Get Board by ID
- **Frontend Feature**: Single Column Data
- **HTTP Method**: `GET`
- **Endpoint**: `/api/workspaces/:workspaceId/projects/:projectId/boards/:boardId`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "name": "To Do",
      "position": 0,
      "tasks": [ ... ]
    }
  }
  ```
- **Frontend Hook**: `useBoard(workspaceId, projectId, boardId)` (`useQuery`)
- **UI Component**: `BoardColumn`

---

### 4.4 Update Board
- **Frontend Feature**: Rename Column / Reorder Column
- **HTTP Method**: `PUT`
- **Endpoint**: `/api/workspaces/:workspaceId/projects/:projectId/boards/:boardId`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "name": "In Progress",
    "position": 1
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Board updated",
    "data": { ... }
  }
  ```
- **Frontend Hook**: `useUpdateBoard(workspaceId, projectId)` (`useMutation`)
- **UI Component**: `BoardColumnHeader`, `EditBoardModal`

---

### 4.5 Delete Board
- **Frontend Feature**: Delete Column
- **HTTP Method**: `DELETE`
- **Endpoint**: `/api/workspaces/:workspaceId/projects/:projectId/boards/:boardId`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Board deleted"
  }
  ```
- **Frontend Hook**: `useDeleteBoard(workspaceId, projectId)` (`useMutation`)
- **UI Component**: `DeleteBoardDialog`

---

## 5. Tasks (`/api/workspaces/:workspaceId/projects/:projectId/boards/:boardId/tasks`)

### 5.1 Get All Tasks for Board
- **Frontend Feature**: Column Tasks List & Cards
- **HTTP Method**: `GET`
- **Endpoint**: `/api/workspaces/:workspaceId/projects/:projectId/boards/:boardId/tasks`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "title": "Task title",
        "description": "Task description",
        "status": "TODO",
        "priority": "HIGH",
        "storyPoints": 5,
        "startDate": "iso-date",
        "dueDate": "iso-date",
        "assigneeId": "uuid",
        "assignee": {
          "id": "uuid",
          "fullName": "User Name"
        },
        "createdAt": "iso-date",
        "updatedAt": "iso-date"
      }
    ]
  }
  ```
- **Frontend Hook**: `useTasks(workspaceId, projectId, boardId)` (`useQuery`)
- **UI Component**: `TaskCard`, `TaskList`

---

### 5.2 Create Task
- **Frontend Feature**: Quick Add Task & Detailed Task Creation
- **HTTP Method**: `POST`
- **Endpoint**: `/api/workspaces/:workspaceId/projects/:projectId/boards/:boardId/tasks`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "title": "Build Authentication",
    "description": "Implement JWT auth endpoints",
    "status": "TODO",
    "priority": "HIGH",
    "storyPoints": 3,
    "assigneeId": "uuid",
    "startDate": "iso-date",
    "dueDate": "iso-date"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Task created",
    "data": {
      "id": "uuid",
      "title": "Build Authentication",
      "status": "TODO",
      "priority": "HIGH",
      "boardId": "uuid",
      "projectId": "uuid",
      "workspaceId": "uuid"
    }
  }
  ```
- **Frontend Hook**: `useCreateTask(workspaceId, projectId, boardId)` (`useMutation`)
- **UI Component**: `CreateTaskInline`, `CreateTaskModal`

---

### 5.3 Get Task by ID
- **Frontend Feature**: Task Detail Modal / Slide-over Drawer
- **HTTP Method**: `GET`
- **Endpoint**: `/api/workspaces/:workspaceId/projects/:projectId/boards/:boardId/tasks/:taskId`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "title": "Task title",
      "description": "Task description",
      "status": "TODO",
      "priority": "HIGH",
      "storyPoints": 5,
      "startDate": "iso-date",
      "dueDate": "iso-date",
      "assignee": { "id": "uuid", "fullName": "Assignee Name", "email": "assignee@example.com" },
      "reporter": { "id": "uuid", "fullName": "Reporter Name", "email": "reporter@example.com" },
      "comments": [ ... ],
      "attachments": [ ... ],
      "labels": [ ... ]
    }
  }
  ```
- **Frontend Hook**: `useTask(workspaceId, projectId, boardId, taskId)` (`useQuery`)
- **UI Component**: `TaskDetailDrawer`, `TaskDetailModal`, `TaskOverview`

---

### 5.4 Update Task
- **Frontend Feature**: Edit Task Fields (Title, Description, Status, Priority, Assignee, Dates)
- **HTTP Method**: `PUT`
- **Endpoint**: `/api/workspaces/:workspaceId/projects/:projectId/boards/:boardId/tasks/:taskId`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "title": "Updated Title",
    "description": "Updated description",
    "status": "IN_PROGRESS",
    "priority": "CRITICAL",
    "storyPoints": 8,
    "assigneeId": "uuid",
    "startDate": "iso-date",
    "dueDate": "iso-date"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Task updated",
    "data": { ... }
  }
  ```
- **Frontend Hook**: `useUpdateTask(workspaceId, projectId, boardId, taskId)` (`useMutation`)
- **UI Component**: `TaskDetailDrawer`, `TaskPriorityDropdown`, `TaskAssigneeSelect`

---

### 5.5 Move Task to Another Board / Column
- **Frontend Feature**: Drag & Drop / Move Task Action
- **HTTP Method**: `POST`
- **Endpoint**: `/api/workspaces/:workspaceId/projects/:projectId/boards/:boardId/tasks/:taskId/move`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "newBoardId": "target-board-uuid"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Task moved successfully",
    "data": { ... }
  }
  ```
- **Frontend Hook**: `useMoveTask(workspaceId, projectId)` (`useMutation`)
- **UI Component**: `KanbanBoard` (Drag & Drop Handler), `MoveTaskSelect`

---

### 5.6 Delete Task
- **Frontend Feature**: Delete Task Action
- **HTTP Method**: `DELETE`
- **Endpoint**: `/api/workspaces/:workspaceId/projects/:projectId/boards/:boardId/tasks/:taskId`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Task deleted"
  }
  ```
- **Frontend Hook**: `useDeleteTask(workspaceId, projectId, boardId)` (`useMutation`)
- **UI Component**: `DeleteTaskDialog`, `TaskActionsMenu`

---

## 6. Comments (`/api/tasks/:taskId/comments`)

### 6.1 Get Task Comments
- **Frontend Feature**: Task Activity / Discussion Thread
- **HTTP Method**: `GET`
- **Endpoint**: `/api/tasks/:taskId/comments`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "taskId": "uuid",
        "userId": "uuid",
        "content": "Comment text",
        "createdAt": "iso-date",
        "updatedAt": "iso-date",
        "user": {
          "id": "uuid",
          "fullName": "User Name"
        }
      }
    ]
  }
  ```
- **Frontend Hook**: `useTaskComments(taskId)` (`useQuery`)
- **UI Component**: `TaskCommentList`, `CommentItem`

---

### 6.2 Create Comment
- **Frontend Feature**: Post New Comment
- **HTTP Method**: `POST`
- **Endpoint**: `/api/tasks/:taskId/comments`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "content": "Here is the update on this task."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Comment added",
    "data": {
      "id": "uuid",
      "content": "Here is the update on this task.",
      "createdAt": "iso-date"
    }
  }
  ```
- **Frontend Hook**: `useCreateComment(taskId)` (`useMutation`)
- **UI Component**: `CommentComposer`, `CommentForm`

---

### 6.3 Update Comment
- **Frontend Feature**: Edit Existing Comment
- **HTTP Method**: `PUT`
- **Endpoint**: `/api/tasks/:taskId/comments/:commentId`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Request Body**:
  ```json
  {
    "content": "Updated comment content"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Comment updated",
    "data": { ... }
  }
  ```
- **Frontend Hook**: `useUpdateComment(taskId)` (`useMutation`)
- **UI Component**: `CommentItemEditable`

---

### 6.4 Delete Comment
- **Frontend Feature**: Remove Comment
- **HTTP Method**: `DELETE`
- **Endpoint**: `/api/tasks/:taskId/comments/:commentId`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Comment deleted"
  }
  ```
- **Frontend Hook**: `useDeleteComment(taskId)` (`useMutation`)
- **UI Component**: `DeleteCommentDialog`

---

## 7. Attachments (`/api/tasks/:taskId/attachments`)

### 7.1 Upload Attachment
- **Frontend Feature**: File Drag & Drop / Upload to Task
- **HTTP Method**: `POST`
- **Endpoint**: `/api/tasks/:taskId/attachments/upload`
- **Request Headers**: `Authorization: Bearer <accessToken>`, `Content-Type: multipart/form-data`
- **Request Body**: `FormData (field: file)`
- **Response**:
  ```json
  {
    "success": true,
    "message": "File uploaded",
    "data": {
      "id": "uuid",
      "fileName": "screenshot.png",
      "fileUrl": "/uploads/uuid.png",
      "fileSize": 120400,
      "mimeType": "image/png"
    }
  }
  ```
- **Frontend Hook**: `useUploadAttachment(taskId)` (`useMutation`)
- **UI Component**: `AttachmentUploader`, `TaskAttachmentsSection`

---

### 7.2 Delete Attachment
- **Frontend Feature**: Remove Attachment
- **HTTP Method**: `DELETE`
- **Endpoint**: `/api/tasks/:taskId/attachments/:attachmentId`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Attachment deleted"
  }
  ```
- **Frontend Hook**: `useDeleteAttachment(taskId)` (`useMutation`)
- **UI Component**: `AttachmentCard`

---

## 8. Notifications (`/api/notifications`)

### 8.1 Get Notifications
- **Frontend Feature**: Notifications Popover / Feed
- **HTTP Method**: `GET`
- **Endpoint**: `/api/notifications?page=1&limit=20`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Query Params**: `page=1`, `limit=20`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "title": "Task Assigned",
        "body": "You were assigned to 'Build API'",
        "isRead": false,
        "createdAt": "iso-date"
      }
    ]
  }
  ```
- **Frontend Hook**: `useNotifications(page, limit)` (`useQuery`)
- **UI Component**: `NotificationBell`, `NotificationPopover`, `NotificationsPage`

---

### 8.2 Mark Notification as Read
- **Frontend Feature**: Mark single item read
- **HTTP Method**: `PUT`
- **Endpoint**: `/api/notifications/:notificationId/read`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Notification marked as read"
  }
  ```
- **Frontend Hook**: `useMarkNotificationRead()` (`useMutation`)
- **UI Component**: `NotificationItem`

---

### 8.3 Mark All Notifications as Read
- **Frontend Feature**: Mark all read button
- **HTTP Method**: `PUT`
- **Endpoint**: `/api/notifications/read-all`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "All notifications marked as read"
  }
  ```
- **Frontend Hook**: `useMarkAllNotificationsRead()` (`useMutation`)
- **UI Component**: `NotificationPopoverHeader`

---

### 8.4 Delete Notification
- **Frontend Feature**: Dismiss / delete notification
- **HTTP Method**: `DELETE`
- **Endpoint**: `/api/notifications/:notificationId`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Notification deleted"
  }
  ```
- **Frontend Hook**: `useDeleteNotification()` (`useMutation`)
- **UI Component**: `NotificationItem`

---

## 9. Activity Logs (`/api/activities`)

### 9.1 Get Workspace Activities
- **Frontend Feature**: Workspace Activity Audit Log / Stream
- **HTTP Method**: `GET`
- **Endpoint**: `/api/activities/workspace/:workspaceId?page=1&limit=30`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "workspaceId": "uuid",
        "action": "TASK_CREATED",
        "actorId": "uuid",
        "actor": {
          "id": "uuid",
          "fullName": "User Name",
          "email": "user@example.com"
        },
        "oldValues": null,
        "newValues": { "title": "Build Auth" },
        "createdAt": "iso-date"
      }
    ]
  }
  ```
- **Frontend Hook**: `useWorkspaceActivities(workspaceId, page, limit)` (`useQuery`)
- **UI Component**: `WorkspaceActivityFeed`, `ActivityLogTimeline`

---

### 9.2 Get Project Activities
- **Frontend Feature**: Project Activity Feed Tab
- **HTTP Method**: `GET`
- **Endpoint**: `/api/activities/project/:projectId?page=1&limit=30`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [ ... ]
  }
  ```
- **Frontend Hook**: `useProjectActivities(projectId, page, limit)` (`useQuery`)
- **UI Component**: `ProjectActivityTab`

---

### 9.3 Get Task Activities
- **Frontend Feature**: Task History Audit Trail
- **HTTP Method**: `GET`
- **Endpoint**: `/api/activities/task/:taskId?page=1&limit=30`
- **Request Headers**: `Authorization: Bearer <accessToken>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [ ... ]
  }
  ```
- **Frontend Hook**: `useTaskActivities(taskId, page, limit)` (`useQuery`)
- **UI Component**: `TaskActivityHistoryTab`

---

## 10. Health Check (`/health`)

- **HTTP Method**: `GET`
- **Endpoint**: `/health` (Base domain)
- **Response**:
  ```json
  {
    "status": "ok",
    "environment": "development"
  }
  ```
- **Frontend Hook**: `useSystemHealth()`
- **UI Component**: `SystemStatusIndicator`
