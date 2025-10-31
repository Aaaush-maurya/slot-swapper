import React from 'react';
import Badge from './Badge';
import Button from './Button';

export default function EventCard({ ev, onMakeSwappable, onDelete }) {
  const statusColor = ev.status === 'SWAPPABLE' ? 'green' : ev.status === 'BUSY' ? 'amber' : 'gray';

  return (
    <div className="mb-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-semibold tracking-tight">{ev.title}</div>
          <div className="mt-1 text-sm text-gray-600">
            {new Date(ev.startTime).toLocaleString()} — {new Date(ev.endTime).toLocaleString()}
          </div>
          <div className="mt-2">
            <Badge color={statusColor}>{ev.status}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ev.status === 'BUSY' && (
            <Button variant="outline" size="sm" onClick={() => onMakeSwappable(ev._id)}>Make swappable</Button>
          )}
          {ev.status === 'SWAPPABLE' && (
            <Button variant="ghost" size="sm" onClick={() => onMakeSwappable(ev._id)}>Unset</Button>
          )}
          <Button variant="danger" size="sm" onClick={() => onDelete(ev._id)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}
