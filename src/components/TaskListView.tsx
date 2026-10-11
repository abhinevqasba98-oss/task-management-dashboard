import { formatDate, isOverdue } from "./TaskCard";
import type { Task } from "../types";

export default function TaskListView({ tasks, openEdit, deleteTask, mutatingIds }: {
  tasks: Task[];
  openEdit: (task: Task) => void;
  deleteTask: (task: Task) => Promise<void>;
  mutatingIds: string[];
}) {
  return (
    <div className="table-wrap">
      <table className="task-table">
        <thead><tr><th>TASK</th><th>STATUS</th><th>PRIORITY</th><th>DUE DATE</th><th><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>{tasks.map((task) => (
          <tr key={task.id} className={mutatingIds.includes(task.id) ? "row-busy" : ""}>
            <td><div className="table-task-title"><div><strong>{task.title}</strong><p>{task.description || "No description provided."}</p></div></div></td>
            <td><span className={`status-badge status-${task.status.toLowerCase().replace(" ", "-")}`}>{task.status}</span></td>
            <td><span className={`priority-badge priority-${task.priority.toLowerCase()}`}><span className="priority-dot" />{task.priority}</span></td>
            <td><span className={`due-date ${isOverdue(task) ? "overdue" : ""}`}>{formatDate(task.dueDate)}{isOverdue(task) && <small>Overdue</small>}</span></td>
            <td><div className="row-actions"><button className="text-action" onClick={() => openEdit(task)}>Edit</button><button className="text-action delete-action" onClick={() => void deleteTask(task)}>Delete</button></div></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
