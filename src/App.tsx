import { useCallback, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Activity, AlertCircle, CheckCircle2, CircleDashed,
  ClipboardList, Clock3, LayoutGrid, List, Plus, RefreshCw, Search,
} from "./components/Icons";
import { taskApi } from "./api";
import TaskForm from "./components/TaskForm";
import { isOverdue } from "./components/TaskCard";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import TaskFilters from "./components/TaskFilters";
import TaskListView from "./components/TaskListView";
import TaskBoardView from "./components/TaskBoardView";
import StatCard from "./components/StatCard";
import type { SortOrder, Task, TaskInput, TaskPriority, TaskStatus, ViewMode } from "./types";

type StatusFilter = "All statuses" | TaskStatus;
type PriorityFilter = "All priorities" | TaskPriority;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All statuses");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All priorities");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [view, setView] = useState<ViewMode>("list");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [mutatingIds, setMutatingIds] = useState<string[]>([]);

  const loadTasks = useCallback(async (showSuccess = false) => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await taskApi.getAll();
      if (!Array.isArray(data)) throw new Error("The API returned an unexpected task list.");
      setTasks(data);
      if (showSuccess) toast.success("Tasks refreshed successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not load tasks.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => { void loadTasks(); }, [loadTasks]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim().toLocaleLowerCase()), 400);
    return () => window.clearTimeout(timer);
  }, [query]);

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const matchesQuery = task.title.toLocaleLowerCase().includes(debouncedQuery);
      const matchesStatus = statusFilter === "All statuses" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "All priorities" || task.priority === priorityFilter;
      return matchesQuery && matchesStatus && matchesPriority;
    });
    return filtered.sort((a, b) => {
      const comparison = a.dueDate.localeCompare(b.dueDate);
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [tasks, debouncedQuery, statusFilter, priorityFilter, sortOrder]);

  const metrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === "Completed").length;
    const pending = tasks.filter((task) => task.status !== "Completed").length;
    const overdue = tasks.filter(isOverdue).length;
    return { total, completed, pending, overdue, completion: total ? Math.round((completed / total) * 100) : 0 };
  }, [tasks]);

  async function saveTask(value: TaskInput) {
    if (editingTask) {
      const updated = await taskApi.update(editingTask.id, value);
      setTasks((current) => current.map((task) => task.id === editingTask.id ? { ...task, ...updated } : task));
      toast.success("Task updated successfully.");
    } else {
      const created = await taskApi.create(value);
      setTasks((current) => [created, ...current]);
      toast.success("Task created successfully.");
    }
  }

  async function deleteTask(task: Task) {
    const confirmed = window.confirm(`Delete "${task.title}"? This action cannot be undone.`);
    if (!confirmed) return;
    setMutatingIds((ids) => [...ids, task.id]);
    try {
      await taskApi.remove(task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
      toast.success("Task deleted successfully.");
    } catch (error) {
      toast.error(`Delete failed: ${error instanceof Error ? error.message : "Please try again."}`);
    } finally {
      setMutatingIds((ids) => ids.filter((id) => id !== task.id));
    }
  }

  function openCreate() { setEditingTask(null); setFormOpen(true); }
  function openEdit(task: Task) { setEditingTask(task); setFormOpen(true); }
  function closeForm() { setFormOpen(false); setEditingTask(null); }

  const activeFilters = statusFilter !== "All statuses" || priorityFilter !== "All priorities" || query.length > 0;

  return (
    <div className="app-shell">
      <Sidebar taskCount={tasks.length} />

      <main className="main-content" id="dashboard">
        <TopBar />

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">YOUR WORKSPACE</p>
              <h1>Good things take <span>focus.</span></h1>
              <p className="page-subtitle">Plan your work, track progress, and get things done.</p>
            </div>
            <button className="button button-primary create-button" onClick={openCreate}><Plus size={18} /> New task</button>
          </section>

          <section className="stats-grid" aria-label="Task metrics">
            <StatCard label="Total tasks" value={metrics.total} note="Across your workspace" icon={<ClipboardList size={18} />} tone="tone-purple" />
            <StatCard label="Completed" value={metrics.completed} note={`${metrics.completion}% completion rate`} icon={<CheckCircle2 size={18} />} tone="tone-green" />
            <StatCard label="Pending" value={metrics.pending} note="Tasks still in progress" icon={<CircleDashed size={18} />} tone="tone-blue" />
            <StatCard label="Overdue" value={metrics.overdue} note="Needs your attention" icon={<Clock3 size={18} />} tone="tone-orange" />
          </section>

          <section className="progress-panel" aria-label="Overall completion">
            <div className="progress-copy">
              <span className="progress-icon"><Activity size={18} /></span>
              <div><strong>Overall progress</strong><p>You're moving forward, one task at a time.</p></div>
            </div>
            <div className="progress-right"><strong>{metrics.completion}%</strong><div className="progress-track"><span style={{ width: `${metrics.completion}%` }} /></div></div>
          </section>

          <section className="tasks-section" id="tasks">
            <div className="section-heading">
              <div><h2>Your tasks <span className="task-count">{tasks.length}</span></h2><p>Keep track of everything on your plate.</p></div>
              <div className="view-switch" role="group" aria-label="Choose task view">
                <button className={view === "list" ? "selected" : ""} onClick={() => setView("list")} aria-pressed={view === "list"}><List size={16} /> List</button>
                <button className={view === "board" ? "selected" : ""} onClick={() => setView("board")} aria-pressed={view === "board"}><LayoutGrid size={16} /> Board</button>
              </div>
            </div>

            <TaskFilters
              query={query}
              setQuery={setQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              activeFilters={activeFilters}
              visibleTasksCount={visibleTasks.length}
              totalTasks={tasks.length}
            />

            {loading ? (
              <div className="state-panel"><span className="spinner" /><h3>{hasLoaded ? "Refreshing your tasks" : "Loading your tasks"}</h3><p>Connecting to your workspace…</p></div>
            ) : loadError ? (
              <div className="state-panel error-state"><span className="state-icon"><AlertCircle size={22} /></span><h3>Couldn't load tasks</h3><p>{loadError}. Make sure the mock API is running, then try again.</p><button className="button button-secondary" onClick={() => void loadTasks()}><RefreshCw size={15} /> Try again</button></div>
            ) : visibleTasks.length === 0 ? (
              <div className="state-panel"><span className="state-icon"><Search size={22} /></span><h3>{tasks.length === 0 ? "No tasks yet" : "No matching tasks"}</h3><p>{tasks.length === 0 ? "Create your first task to get your workspace moving." : "Try changing your search or filters."}</p>{tasks.length === 0 ? <button className="button button-primary" onClick={openCreate}><Plus size={16} /> Create your first task</button> : <button className="button button-secondary" onClick={() => { setQuery(""); setStatusFilter("All statuses"); setPriorityFilter("All priorities"); }}>Clear filters</button>}</div>
            ) : view === "list" ? (
              <TaskListView tasks={visibleTasks} openEdit={openEdit} deleteTask={deleteTask} mutatingIds={mutatingIds} />
            ) : (
              <TaskBoardView tasks={visibleTasks} openEdit={openEdit} deleteTask={deleteTask} />
            )}
            <div className="section-footer"><button onClick={() => void loadTasks(true)} className="refresh-link" disabled={loading} aria-live="polite"><RefreshCw size={13} /> {loading ? "Refreshing…" : "Refresh tasks"}</button></div>
          </section>
          <footer className="page-footer">Taskflow dashboard</footer>
        </div>
      </main>

      <ToastContainer position="top-right" autoClose={3200} hideProgressBar newestOnTop closeOnClick pauseOnHover />
      {formOpen && <TaskForm task={editingTask} onClose={closeForm} onSave={saveTask} />}
    </div>
  );
}
