import type { ReactNode } from "react";

export default function StatCard({ label, value, note, icon, tone }: {
  label: string;
  value: string | number;
  note: string;
  icon: ReactNode;
  tone: string;
}) {
  return (
    <article className="stat-card">
      <div className="stat-top"><span>{label}</span><span className={`stat-icon ${tone}`}>{icon}</span></div>
      <div className="stat-value">{value}</div>
      <p>{note}</p>
    </article>
  );
}
