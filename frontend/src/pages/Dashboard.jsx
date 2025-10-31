import React, { useEffect, useState } from 'react';
import api from '../api/api';
import EventCard from '../components/EventCard';
import Button from '../components/Button';

export default function Dashboard(){
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    const res = await api.get('/events');
    setEvents(res.data);
  };

  useEffect(() => { fetchEvents(); }, []);

  const createEvent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/events', { title, startTime, endTime });
      setTitle(''); setStartTime(''); setEndTime('');
      await fetchEvents();
    } catch (err) {
      alert('Could not create event');
    } finally { setLoading(false); }
  };

  const toggleSwappable = async (id) => {
    const ev = events.find(x => x._id === id);
    if (!ev) return;
    const newStatus = ev.status === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE';
    await api.put(`/events/${id}`, { status: newStatus });
    await fetchEvents();
  };

  const deleteEvent = async (id) => {
    if (!confirm('Delete event?')) return;
    await api.delete(`/events/${id}`);
    await fetchEvents();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-4">Your events</h1>
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <form onSubmit={createEvent} className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-1" placeholder="e.g. Morning shift" value={title} onChange={e=>setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Start</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-1" type="datetime-local" value={startTime} onChange={e=>setStartTime(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">End</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-1" type="datetime-local" value={endTime} onChange={e=>setEndTime(e.target.value)} required />
          </div>
          <div className="flex items-end">
            <Button className="w-full" disabled={loading}>{loading ? 'Creating…' : 'Create'}</Button>
          </div>
        </form>
      </div>

      <div>
        {events.length === 0 && <div className="text-gray-500">No events yet</div>}
        {events.map(ev => (
          <EventCard key={ev._id} ev={ev} onMakeSwappable={toggleSwappable} onDelete={deleteEvent} />
        ))}
      </div>
    </div>
  );
}
