import React from 'react';

function StatusBadge({ status }) {
  const s = String(status).toLowerCase();

  let style = 'bg-sky-50 text-sky-700 border border-sky-200';
  let label = status;

  if (s === 'new' || s.includes('nauj')) {
    style = 'bg-sky-50 text-sky-700 border border-sky-200';
    label = 'Nauja';
  } else if (s === 'assigned' || s.includes('prisk')) {
    style = 'bg-indigo-50 text-indigo-700 border border-indigo-200';
    label = 'Priskirta';
  } else if (s === 'in_progress' || s.includes('vykd')) {
    style = 'bg-amber-50 text-amber-700 border border-amber-200';
    label = 'Vykdoma';
  } else if (s === 'done' || s.includes('atl') || s.includes('įvykd')) {
    style = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    label = 'Atlikta';
  } else if (s === 'archived' || s.includes('arch')) {
    style = 'bg-slate-50 text-slate-400 border border-slate-200';
    label = 'Archyvuota';
  }

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}

export default StatusBadge;