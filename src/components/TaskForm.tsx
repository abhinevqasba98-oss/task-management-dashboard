import { useEffect, useState, type FormEvent } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { X } from "./Icons";
import { TASK_PRIORITIES, TASK_STATUSES, type Task, type TaskInput, type TaskPriority, type TaskStatus } from "../types";

interface TaskFormProps {
  task: Task | null;
  onClose: () => void;
  onSave: (value: TaskInput) => Promise<void>;
}

interface FormErrors {
  title?: string;
  dueDate?: string;
}

const emptyForm: TaskInput = {
  title: "",
  description: "",
  status: "To Do",
  priority: "Medium",
  dueDate: "",
};

export default function TaskForm({ task, onClose, onSave }: TaskFormProps) {
  const [form, setForm] = useState<TaskInput>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    setForm(task ? {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    } : emptyForm);
    setErrors({});
    setSaveError("");
  }, [task]);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!form.title.trim()) next.title = "Enter a task title.";
    if (!form.dueDate || Number.isNaN(Date.parse(`${form.dueDate}T00:00:00`))) {
      next.dueDate = "Choose a valid due date.";
    }
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    setSaveError("");
    try {
      await onSave({ ...form, title: form.title.trim(), description: form.description.trim() });
      onClose();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save this task.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !saving) onClose();
    }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">{task ? "UPDATE TASK" : "NEW ITEM"}</p>
            <h2 id="task-form-title">{task ? "Edit task" : "Create a task"}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close form" disabled={saving}>
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Task title <span className="required">*</span></span>
            <input
              autoFocus
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Prepare sprint review"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && <small className="field-error" id="title-error">{errors.title}</small>}
          </label>

          <label className="field">
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Add a few details about this task"
              rows={3}
            />
          </label>

          <div className="form-grid">
            <label className="field">
              <span>Status</span>
              <FormControl className="task-form-select" size="small">
                <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })} inputProps={{ "aria-label": "Status" }}>
                  {TASK_STATUSES.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </Select>
              </FormControl>
            </label>
            <label className="field">
              <span>Priority</span>
              <FormControl className="task-form-select" size="small">
                <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })} inputProps={{ "aria-label": "Priority" }}>
                  {TASK_PRIORITIES.map((priority) => <MenuItem key={priority} value={priority}>{priority}</MenuItem>)}
                </Select>
              </FormControl>
            </label>
          </div>

          <label className="field">
            <span>Due date <span className="required">*</span></span>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              aria-invalid={Boolean(errors.dueDate)}
              aria-describedby={errors.dueDate ? "date-error" : undefined}
            />
            {errors.dueDate && <small className="field-error" id="date-error">{errors.dueDate}</small>}
          </label>

          {saveError && <p className="inline-error" role="alert">{saveError}</p>}
          <div className="modal-actions">
            <button className="button button-secondary" type="button" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="button button-primary" type="submit" disabled={saving}>
              {saving ? "Saving…" : task ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
