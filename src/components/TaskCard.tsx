import { CalendarDays, Pencil, Trash2 } from "./Icons";
import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function formatDate(date: string): string {
  if (!date) return "No due date";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`));
}

export function isOverdue(task: Task): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${task.dueDate}T00:00:00`);
  return task.status !== "Completed" && Boolean(task.dueDate) && due < today;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <article className="task-card">
      <div className="task-card-top">
        <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
          <span className="priority-dot" />{task.priority}
        </span>
        <div className="task-actions">
          <button className="icon-button small" type="button" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}>
            <Pencil size={15} />
          </button>
          <button className="icon-button small danger-hover" type="button" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task)}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <h3>{task.title}</h3>
      <p className="task-description">{task.description || "No description provided."}</p>
      <div className="task-card-footer">
        <span className={`status-badge status-${task.status.toLowerCase().replace(" ", "-")}`}>{task.status}</span>
        <span className={`due-date ${isOverdue(task) ? "overdue" : ""}`}><CalendarDays size={14} />{formatDate(task.dueDate)}</span>
      </div>
    </article>
  );
}
