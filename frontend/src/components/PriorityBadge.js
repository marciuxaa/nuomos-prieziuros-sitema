import React from 'react';

function PriorityBadge({ priority }) {
  const p = String(priority).toLowerCase();

  let label = priority;

  if (p === 'low' || p.includes('žem')) {
    label = 'Žemas prioritetas';
  } else if (p === 'medium' || p.includes('vidut')) {
    label = 'Vidutinis prioritetas';
  } else if (p === 'high' || p.includes('aukšt')) {
    label = 'Aukštas prioritetas';
  } else if (p === 'emergency' || p.includes('avar')) {
    label = 'Avarinė situacija';
  }

  // Tiesiog paprastas, neutralus pilkas tekstas be jokių rėmelių ar ryškių spalvų
  return (
    <span className="text-xs text-slate-500">
      Prioritetas: {label}
    </span>
  );
}

export default PriorityBadge;