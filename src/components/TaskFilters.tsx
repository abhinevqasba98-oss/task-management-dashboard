import { FormControl, MenuItem, Select } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";
import { ArrowDownUp, Search, SlidersHorizontal, X } from "./Icons";
import { TASK_PRIORITIES, TASK_STATUSES, type SortOrder, type TaskPriority, type TaskStatus } from "../types";

type StatusFilter = "All statuses" | TaskStatus;
type PriorityFilter = "All priorities" | TaskPriority;

export default function TaskFilters({
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortOrder,
  setSortOrder,
  activeFilters,
  visibleTasksCount,
  totalTasks,
}: {
  query: string;
  setQuery: (value: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
  priorityFilter: PriorityFilter;
  setPriorityFilter: (value: PriorityFilter) => void;
  sortOrder: SortOrder;
  setSortOrder: Dispatch<SetStateAction<SortOrder>>;
  activeFilters: boolean;
  visibleTasksCount: number;
  totalTasks: number;
}) {
  return (
    <>
      <div className="filter-bar">
        <label className="search-box"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks..." aria-label="Search task titles" />{query && <button aria-label="Clear search" onClick={() => setQuery("")}><X size={15} /></button>}</label>
        <div className="filter-control"><SlidersHorizontal size={15} /><FormControl className="filter-select-control" size="small">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} inputProps={{ "aria-label": "Filter by status" }}>
            {["All statuses", ...TASK_STATUSES].map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
          </Select>
        </FormControl></div>
        <div className="filter-control"><FormControl className="filter-select-control" size="small">
          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)} inputProps={{ "aria-label": "Filter by priority" }}>
            {["All priorities", ...TASK_PRIORITIES].map((priority) => <MenuItem key={priority} value={priority}>{priority}</MenuItem>)}
          </Select>
        </FormControl></div>
        <button className="sort-button" onClick={() => setSortOrder((order) => order === "asc" ? "desc" : "asc")}><ArrowDownUp size={15} /> Due date <span>{sortOrder === "asc" ? "↑" : "↓"}</span></button>
      </div>

      {activeFilters && <div className="filter-summary"><span>Showing {visibleTasksCount} of {totalTasks} tasks</span><button onClick={() => { setQuery(""); setStatusFilter("All statuses"); setPriorityFilter("All priorities"); }}>Clear filters <X size={13} /></button></div>}
    </>
  );
}
