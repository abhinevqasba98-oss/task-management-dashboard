# Taskflow — React + TypeScript Task Management Dashboard

A responsive task dashboard built for the Frontend Developer take-home assessment. It includes CRUD operations, list and Kanban views, combined search/filter/sort, metrics, form validation, and loading/error/empty states.

## Requirements

- Node.js 18 or newer (Node.js 20 LTS recommended)
- npm
- A modern browser

## Option A: Use a hosted MockAPI (no separate backend process)

This is convenient for a frontend-only workflow.

1. Open [MockAPI](https://mockapi.io/) and create a project.
2. Add a resource named `tasks` with these fields (in addition to its generated `id`):
   - `title` — string
   - `description` — string
   - `status` — string
   - `priority` — string
   - `dueDate` — string
3. Copy your project's base URL. It should look like `https://YOUR_PROJECT_ID.mockapi.io/api/v1` (do not add `/tasks` at the end; the app adds it).
4. In the project folder, copy `.env.example` to `.env.local` and set `VITE_API_URL` to your actual base URL. Example:

   ```env
   VITE_API_URL=https://YOUR_PROJECT_ID.mockapi.io/api/v1
   ```

5. Install dependencies and run the frontend:

   ```bash
   npm install
   npm run dev
   ```

6. Open the local URL printed by Vite, usually `http://127.0.0.1:5173`.

MockAPI generates IDs for newly created tasks and stores changes in the hosted resource. Add a few sample tasks in MockAPI's interface if you want initial data. Do not put private API keys or secrets in frontend environment variables.

## Option B: Use the included local JSON Server

No MockAPI account is needed, and the included `db.json` provides six sample tasks. Keep `.env.local` absent or set:

```env
VITE_API_URL=http://127.0.0.1:3001
```

Install dependencies:

```bash
npm install
```

Start the API in terminal 1:

```bash
npm run api
```

Start the frontend in terminal 2:

```bash
npm run dev
```

JSON Server serves `db.json` at `http://127.0.0.1:3001` and persists changes in that file.

## Verify the production build

```bash
npm run typecheck
npm run build
npm run preview
```

## Features

- Create, view, edit, and delete tasks. Deletion uses a browser confirmation dialog.
- Fields: title, description, status, priority, and due date.
- List and Kanban board views share the same task data.
- Case-insensitive title search debounced by 400 ms.
- Status and priority filters combine with search and due-date sort.
- Total, Completed, Pending, Overdue, and completion percentage metrics update from current task data.
- Overdue means the due date is earlier than the local calendar date and status is not Completed.
- Inline validation for whitespace-only titles and missing/invalid dates.
- Distinct loading, API failure, no-task, and no-match states.
- Mutation success notifications; failed saves remain in the form and display an error.
- Responsive layout and keyboard-focus indicators.

## Design and implementation decisions

- **React + TypeScript + Vite:** fast local feedback and typed UI components.
- **Local component state and hooks:** lifting the task collection into `App` keeps list and board views consistent without adding a state-management library.
- **REST API helper:** `src/api.ts` contains typed `GET`, `POST`, `PATCH`, and `DELETE` calls. Set `VITE_API_URL` to switch between hosted MockAPI and local JSON Server.
- **Derived state:** metrics and filtered/sorted tasks are calculated from the canonical task array with `useMemo`.
- **Debounced client-side search:** a 400 ms delay avoids recalculating the result set for every keystroke.
- **API error handling:** mutations update local state only after the API succeeds. Load errors have a retry action.
- **Date handling:** due dates are stored as ISO `YYYY-MM-DD` strings for reliable sorting.
- **Styling:** custom CSS keeps the app lightweight and avoids a CSS framework dependency.

## API endpoints

The app uses the base URL in `VITE_API_URL` and appends `/tasks`.

| Method | Endpoint | Use |
| --- | --- | --- |
| GET | `/tasks` | Load all tasks |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## Acceptance criteria checklist

- [x] Setup: frontend plus hosted MockAPI or local JSON Server.
- [x] Read: fetches tasks from the API and shows a loading state.
- [x] Create: POST mutation updates the UI only after success.
- [x] Edit: PATCH persists editable fields and updates shared state.
- [x] Delete: confirmation, cancellation safety, DELETE request, and UI update after success.
- [x] Validation: title must contain non-whitespace characters; due date is required and validated.
- [x] Views: list and board render the same filtered task collection.
- [x] Search/filter/sort: case-insensitive debounced search, combined status/priority filters, due-date sort.
- [x] Metrics: derived metrics update after create/edit/delete; completed tasks are excluded from overdue count.
- [x] Request states: loading, API failure/retry, empty tasks, no matches, and mutation errors.
- [x] Responsive UI: responsive CSS targets phone and desktop widths.
- [x] TypeScript/hygiene: typed task and component interfaces; run typecheck/build before submission.

## Manual test plan

1. Verify sample tasks load from the chosen API.
2. Create a task and refresh; verify it remains.
3. Try a whitespace-only title and missing due date; verify validation.
4. Edit a task and verify it remains after refresh.
5. Cancel a deletion, then confirm one; verify the confirmed task is gone after refresh.
6. Search with different letter case and combine with status/priority filters.
7. Toggle due-date sorting in both directions.
8. Switch between List and Board views.
9. Verify metrics after create/edit/delete.
10. Test at approximately 375 px and 1280 px viewport widths.

## Submission notes

Before submitting, create a Git repository, commit source files (not `node_modules` or `dist`), push it to GitHub, and share the repository URL. Run `npm run typecheck`, `npm run build`, and the manual test plan first. Be prepared to explain the state-management and API decisions during a live review.


## API configuration

The app works without a separate backend by default: it seeds sample tasks from `db.json` into browser `localStorage`, and Add/Edit/Delete changes persist in that browser. This is useful for previewing the frontend in StackBlitz.

To use a hosted MockAPI resource, create a `tasks` endpoint and set `VITE_API_URL` in `.env.local` to the base URL (for example `https://YOUR_PROJECT_ID.mockapi.io/api/v1`; do not include `/tasks`). Restart Vite after changing the environment file.

To use the included JSON Server, set `VITE_API_URL=http://127.0.0.1:3001` in `.env.local`, then run `npm run api` in one terminal and `npm run dev` in another.
