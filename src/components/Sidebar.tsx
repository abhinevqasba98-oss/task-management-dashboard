import { Check, ClipboardList, LayoutGrid } from "./Icons";

export default function Sidebar({ taskCount }: { taskCount: number }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#" aria-label="Taskflow home">
        <span className="brand-mark"><Check size={20} strokeWidth={3} /></span>
        <span>taskflow<span className="brand-period">.</span></span>
      </a>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        <a href="#dashboard" className="nav-item active"><LayoutGrid size={18} /> Overview</a>
        <a href="#tasks" className="nav-item"><ClipboardList size={18} /> All tasks <span className="nav-count">{taskCount}</span></a>
      </nav>
      <div className="sidebar-bottom">
        <div className="profile-row">
          <div className="avatar">Y</div>
          <div className="profile-copy"><strong>Your workspace</strong><span>Personal account</span></div>
        </div>
      </div>
    </aside>
  );
}
