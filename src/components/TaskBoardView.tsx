import TaskCard from "./TaskCard";
import { TASK_STATUSES, type Task } from "../types";

export default function TaskBoardView({ tasks, openEdit, deleteTask }: {
  tasks: Task[];
  openEdit: (task: Task) => void;
  deleteTask: (task: Task) => Promise<void>;
}) {
  return (
    <div className="kanban-grid">{TASK_STATUSES.map((status) => {
      const columnTasks = tasks.filter((task) => task.status === status);
      return <section className="kanban-column" key={status} aria-label={`${status} tasks`}>
        <div className="kanban-heading"><span className={`column-dot dot-${status.toLowerCase().replace(" ", "-")}`} /><h3>{status}</h3><span className="column-count">{columnTasks.length}</span></div>
        <div className="kanban-cards">{columnTasks.length ? columnTasks.map((task) => <TaskCard key={task.id} task={task} onEdit={openEdit} onDelete={(t) => void deleteTask(t)} />) : <div className="column-empty">No tasks here</div>}</div>
      </section>;
    })}</div>
  );
}
