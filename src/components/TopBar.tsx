export default function TopBar() {
  return (
    <header className="topbar">
      <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>Overview</strong></div>
      <div className="topbar-right"><span className="today-label">{new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(new Date())}</span></div>
    </header>
  );
}
