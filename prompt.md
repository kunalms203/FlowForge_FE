# FlowForge Frontend — Production SaaS Dashboard

You are working on the frontend for **FlowForge**, a production-grade multi-tenant SaaS project management platform.

The backend is already implemented.

## IMPORTANT — READ THE EXISTING BACKEND FIRST

Before writing frontend code:

1. Inspect the existing project structure.
2. Inspect the backend code where necessary to understand:
   - authentication
   - users
   - workspaces
   - workspace members
   - projects
   - boards
   - board columns
   - tasks
   - comments
   - notifications
   - activity logs
3. There is a **Postman API collection JSON file (`api.json`) in the project folder**.
4. Read and analyze that API collection completely.
5. Treat the API collection and existing backend implementation as the source of truth for:
   - endpoint URLs
   - HTTP methods
   - request bodies
   - query parameters
   - path parameters
   - authentication
   - response structures
   - error responses
6. DO NOT invent APIs that don't exist.
7. DO NOT change the backend.
8. If an API is missing for a frontend feature, clearly identify it instead of creating a fake/mock endpoint.

---

# FRONTEND GOAL

Build a polished, modern, production-quality frontend for FlowForge.

The visual direction should be:

**Black + White + Minimal + Premium + Professional SaaS**

Think:

- Linear
- Vercel
- Notion
- modern Jira
- clean enterprise dashboards

But DO NOT directly copy any existing product.

The UI should feel like a serious SaaS product that could be shown in a software engineering interview.

---

# DESIGN SYSTEM

Use a primarily monochrome design.

### Colors

Primary:

```text
Black: #000000
White: #FFFFFF
```

Supporting neutrals:

```text
#F7F7F7
#F3F3F3
#EAEAEA
#D4D4D4
#A3A3A3
#737373
#404040
#171717
```

Avoid unnecessary bright colors.

Use subtle colors only when required for semantic states such as:

- success
- error
- warning
- task priority

Even then, keep them muted and professional.

---

# TYPOGRAPHY

Use a clean modern sans-serif font.

Prefer:

- Inter
- Geist
- system-ui

Typography should have:

- strong hierarchy
- generous whitespace
- compact dashboard labels
- readable tables
- clear page titles

Avoid excessive font sizes.

---

# FRONTEND STACK

Use the existing frontend stack if one already exists.

If there is no frontend yet, use:

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios
- TanStack Query
- React Hook Form
- Zod
- Lucide icons

Do not introduce unnecessary libraries.

---

# APPLICATION STRUCTURE

Create a clean scalable structure similar to:

```text
src/
├── app/
│   ├── router/
│   ├── providers/
│   └── layouts/
│
├── components/
│   ├── ui/
│   ├── common/
│   ├── forms/
│   └── layout/
│
├── features/
│   ├── auth/
│   ├── workspace/
│   ├── projects/
│   ├── boards/
│   ├── tasks/
│   ├── comments/
│   ├── notifications/
│   └── activity/
│
├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── workspace/
│   ├── project/
│   └── settings/
│
├── services/
│   ├── api.ts
│   ├── authApi.ts
│   ├── workspaceApi.ts
│   ├── projectApi.ts
│   ├── taskApi.ts
│   └── ...
│
├── hooks/
├── types/
├── utils/
└── constants/
```

Keep API logic separate from UI components.

---

# API INTEGRATION

Create a centralized API client.

Example architecture:

```text
React Component
      ↓
React Query Hook
      ↓
API Service
      ↓
Axios
      ↓
Backend API
```

Do not call Axios directly throughout components.

For example:

```text
useProjects()
      ↓
projectApi.getProjects()
      ↓
api.get("/projects")
```

Use the exact endpoints and response structures from `api.json`.

---

# AUTHENTICATION

Implement the actual authentication flow from the backend/API collection.

The frontend should support:

```text
Register
   ↓
Login
   ↓
Authentication
   ↓
Dashboard
```

Handle:

- authentication state
- protected routes
- logout
- token handling
- expired sessions
- unauthorized responses
- loading states

Do not invent an authentication mechanism if the backend already defines one.

---

# ROUTING

Create proper protected/public routes.

Example conceptual structure:

```text
/auth/login
/auth/register

/dashboard

/workspaces
/workspaces/:workspaceId

/workspaces/:workspaceId/projects
/workspaces/:workspaceId/projects/:projectId

/workspaces/:workspaceId/projects/:projectId/board

/settings
```

Adapt these routes to the actual backend/domain structure.

---

# MAIN DASHBOARD

The dashboard should feel like a real SaaS product.

Layout:

```text
┌──────────────────────────────────────────────────────┐
│ FlowForge                         Search   🔔  User │
├──────────────┬───────────────────────────────────────┤
│              │                                       │
│ Dashboard    │ Overview                              │
│              │                                       │
│ Projects     │ ┌────────┐ ┌────────┐ ┌────────┐     │
│              │ │Projects│ │ Tasks  │ │Completed│    │
│ Workspace    │ └────────┘ └────────┘ └────────┘     │
│              │                                       │
│ Members      │ Recent Projects                       │
│              │                                       │
│ Settings     │ Recent Activity                       │
│              │                                       │
└──────────────┴───────────────────────────────────────┘
```

Use real API data.

Do not fill the dashboard with fake data if the backend provides the corresponding information.

---

# SIDEBAR

Create a clean collapsible sidebar.

Example:

```text
FLOWFORGE

Workspace
  Overview
  Projects
  Members

Project
  Board
  Tasks
  Activity

System
  Notifications
  Settings
```

Use icons sparingly.

The sidebar should be:

- compact
- monochrome
- responsive
- keyboard accessible

---

# PROJECT MANAGEMENT

Projects should have a professional project page.

Example:

```text
Project Name
Project description

[Board] [Tasks] [Activity]

--------------------------------

Project statistics

Tasks
Completed
In Progress
Overdue
```

Use the real API data.

---

# KANBAN BOARD

The board is one of the most important screens.

Create a polished Kanban interface.

Example:

```text
Development Board

┌─────────────┬─────────────┬─────────────┬─────────────┐
│ BACKLOG     │ DEVELOPMENT │ REVIEW      │ DONE        │
│ 8           │ 4           │ 2           │ 12          │
│             │             │             │             │
│ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │
│ │ Task    │ │ │ Task    │ │ │ Task    │ │ │ Task    │ │
│ │ #123    │ │ │ #124    │ │ │ #125    │ │ │ #126    │ │
│ └─────────┘ │ └─────────┘ │ └─────────┘ │ └─────────┘ │
│             │             │             │             │
│ + Add task  │ + Add task  │ + Add task  │             │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

Task cards should show useful information such as:

- title
- priority
- assignee
- due date
- labels
- comments
- attachment indicators

Use drag-and-drop only if the backend supports changing task/column state.

If drag-and-drop requires an API that doesn't exist, don't fake persistence.

---

# TASK DETAILS

Clicking a task should open a clean detail view or side panel.

Include, according to the available API:

```text
Task title
Description
Status / Column
Priority
Assignee
Reporter
Due date
Labels
Comments
Attachments
Activity
```

Allow editing only where the backend/API supports it.

---

# COMMENTS

Build a clean conversation UI.

Example:

```text
Comments

Kunal
This API needs validation.

2 hours ago

Rahul
Fixed it in the latest commit.

1 hour ago

[ Write a comment...                 ]
                              [Send]
```

Use the actual comments API.

---

# WORKSPACE MANAGEMENT

Create workspace screens for:

- workspace overview
- workspace members
- inviting members
- changing roles
- removing members
- workspace settings

Respect the backend's role/permission system.

Never show actions to users who aren't authorized to perform them.

---

# LOADING STATES

Every API-driven screen must have proper loading states.

Do NOT just display:

```text
Loading...
```

Use skeleton loaders where appropriate.

Examples:

```text
████████████
████████

████████████████
██████████
```

---

# EMPTY STATES

Create professional empty states.

Example:

```text
No projects yet

Create your first project to start organizing your work.

[ + Create Project ]
```

Do not leave blank screens.

---

# ERROR STATES

Handle:

- 400
- 401
- 403
- 404
- 409
- 422
- 429
- 500

Display useful user-friendly messages.

Never expose raw backend stack traces.

---

# FORMS

All forms should have:

- validation
- labels
- error messages
- disabled submit state
- loading state
- successful submission feedback

Use the backend's actual validation requirements.

---

# RESPONSIVE DESIGN

The frontend must work well on:

```text
Desktop
Laptop
Tablet
Mobile
```

Desktop is the primary target, but don't allow horizontal overflow.

The Kanban board can horizontally scroll on smaller screens.

---

# ACCESSIBILITY

Implement:

- semantic HTML
- keyboard navigation
- visible focus states
- accessible buttons
- accessible dialogs
- proper labels
- sufficient contrast
- ARIA only when needed

---

# PERFORMANCE

Use:

- React Query caching
- pagination where APIs support it
- lazy loading for large pages
- debounced search
- optimistic updates only when safe
- avoid unnecessary API requests
- avoid unnecessary React re-renders

Do not over-engineer.

---

# SECURITY

Never:

- hardcode secrets
- expose backend secrets
- store sensitive credentials in source code
- trust frontend authorization alone

The backend remains the source of truth for authorization.

The frontend should hide unauthorized UI actions, but the backend must enforce permissions.

---

# API ERROR HANDLING

Create a centralized API error handler.

For example:

```text
401
→ clear invalid auth state
→ redirect to login

403
→ show "You don't have permission"

404
→ show resource not found

500
→ show generic server error
```

---

# DESIGN DETAILS

The UI should use:

- 1px subtle borders
- rounded corners, but not excessive
- subtle shadows
- lots of whitespace
- monochrome buttons
- black primary CTA
- white secondary CTA
- subtle hover animations
- smooth transitions

Avoid:

- gradients
- excessive glassmorphism
- neon colors
- giant cards
- excessive rounded corners
- unnecessary animations
- generic Bootstrap-looking UI

The result should feel like a **premium developer/productivity SaaS**.

---

# IMPORTANT IMPLEMENTATION RULES

1. First inspect the repository.
2. Find `api.json`.
3. Read the complete Postman collection.
4. Map every available API to a frontend feature.
5. Create TypeScript types matching the actual responses.
6. Create API service modules.
7. Build authentication.
8. Build the application shell/layout.
9. Build workspace functionality.
10. Build project functionality.
11. Build board/task functionality.
12. Build comments/notifications/activity where APIs exist.
13. Add loading, empty and error states.
14. Make everything responsive.
15. Run TypeScript checks.
16. Run the production build.
17. Fix all build/runtime errors.

---

# API MAPPING DOCUMENT

Before implementing, create:

```text
docs/api-mapping.md
```

with:

```text
Frontend Feature
      ↓
HTTP Method
      ↓
Endpoint
      ↓
Request
      ↓
Response
      ↓
Frontend Hook
      ↓
UI Component
```

Example:

```text
Projects List
     ↓
GET
     ↓
/api/v1/projects
     ↓
useProjects()
     ↓
ProjectsPage
```

Use the actual endpoints from `api.json`.

---

# FINAL QUALITY BAR

When finished, the application should look like something that could realistically be deployed as a SaaS product.

Do not create a simple CRUD demo.

The frontend should demonstrate:

- real API integration
- clean architecture
- reusable components
- proper state management
- authentication
- authorization-aware UI
- responsive design
- professional UX
- production-quality error handling
- scalable code organization

Most importantly:

**DO NOT INVENT BACKEND APIs.**

The existing backend + `api.json` are the source of truth.
If something cannot be implemented because the backend does not expose the required functionality, document it clearly rather than mocking it.