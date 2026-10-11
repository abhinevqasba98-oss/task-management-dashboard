import type { Task, TaskInput } from "./types";

const configuredApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const TASKS_URL = configuredApiUrl ? `${configuredApiUrl.replace(/\/$/, "")}/tasks` : "";
const STORAGE_KEY = "taskflow.tasks.v1";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function readLocalTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) as Task[] : [];
  } catch {
    return [];
  }
}

function writeLocalTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

async function localGetAll(): Promise<Task[]> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return readLocalTasks();

  // Seed the browser demo from db.json the first time it is opened.
  try {
    const response = await fetch("/db.json");
    if (response.ok) {
      const data = await response.json() as { tasks?: Task[] };
      const initial = Array.isArray(data.tasks) ? data.tasks : [];
      writeLocalTasks(initial);
      return initial;
    }
  } catch {
    // The app can still start with an empty local task list.
  }
  writeLocalTasks([]);
  return [];
}

export const taskApi = {
  getAll: () => TASKS_URL ? request<Task[]>(TASKS_URL) : localGetAll(),
  create: async (task: TaskInput): Promise<Task> => {
    if (TASKS_URL) {
      return request<Task>(TASKS_URL, { method: "POST", body: JSON.stringify(task) });
    }
    const created: Task = { ...task, id: globalThis.crypto?.randomUUID?.() ?? `task-${Date.now()}` };
    writeLocalTasks([created, ...readLocalTasks()]);
    return created;
  },
  update: async (id: string, task: TaskInput): Promise<Task> => {
    if (TASKS_URL) {
      return request<Task>(`${TASKS_URL}/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(task) });
    }
    const updated: Task = { ...task, id };
    writeLocalTasks(readLocalTasks().map((item) => item.id === id ? updated : item));
    return updated;
  },
  remove: async (id: string): Promise<void> => {
    if (TASKS_URL) {
      await request<void>(`${TASKS_URL}/${encodeURIComponent(id)}`, { method: "DELETE" });
      return;
    }
    writeLocalTasks(readLocalTasks().filter((item) => item.id !== id));
  },
};
