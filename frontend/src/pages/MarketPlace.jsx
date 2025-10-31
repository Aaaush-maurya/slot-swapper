import React, { useEffect, useState } from 'react';
import api from '../api/api';
import Button from '../components/Button';

export default function Marketplace(){
  const [slots, setSlots] = useState([]);
  const [mySwappables, setMySwappables] = useState([]);
  const [selectedTheirSlot, setSelectedTheirSlot] = useState(null);
  const [chosenMySlotId, setChosenMySlotId] = useState(null);

  const fetch = async () => {
    const [s1, s2] = await Promise.all([
      api.get('/swaps/swappable-slots'),
      api.get('/events')
    ]);
    setSlots(s1.data);
    setMySwappables(s2.data.filter(e => e.status === 'SWAPPABLE'));
  };

  useEffect(() => { fetch(); }, []);

  const requestSwap = async () => {
    if (!chosenMySlotId || !selectedTheirSlot) {
      alert('choose your swappable slot and a target');
      return;
    }
    await api.post('/swaps/swap-request', { mySlotId: chosenMySlotId, theirSlotId: selectedTheirSlot._id });
    alert('Swap requested');
    // reload
    fetch();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-4">Marketplace</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Available slots</h2>
            <span className="text-sm text-gray-500">{slots.length} total</span>
          </div>
          {slots.length===0 && <div className="text-gray-500">No slots available</div>}
          {slots.map(s => (
            <button key={s._id} className={`w-full text-left p-3 border rounded-md mb-3 transition ring-0 hover:bg-gray-50 ${selectedTheirSlot?._id===s._id ? 'ring-2 ring-gray-900 bg-gray-50' : ''}`} onClick={()=>setSelectedTheirSlot(s)}>
              <div className="font-semibold">{s.title} <span className="text-sm text-gray-500">by {s.owner?.name}</span></div>
              <div className="text-sm text-gray-600">{new Date(s.startTime).toLocaleString()} — {new Date(s.endTime).toLocaleString()}</div>
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold mb-3">Choose one of your SWAPPABLE slots as offer</h2>
          {mySwappables.length===0 && <div className="text-gray-500">You have no swappable slots. Mark a slot as swappable in Dashboard.</div>}
          {mySwappables.map(m => (
            <button key={m._id} className={`w-full text-left p-3 border rounded-md mb-3 transition hover:bg-gray-50 ${chosenMySlotId===m._id ? 'ring-2 ring-gray-900 bg-gray-50' : ''}`} onClick={()=>setChosenMySlotId(m._id)}>
              <div className="font-medium">{m.title}</div>
              <div className="text-sm text-gray-600">{new Date(m.startTime).toLocaleString()} — {new Date(m.endTime).toLocaleString()}</div>
            </button>
          ))}

          <div className="mt-4">
            <Button className="w-full bg-green-600 hover:bg-green-700 focus-visible:ring-green-600" onClick={requestSwap} disabled={!chosenMySlotId || !selectedTheirSlot}>
              Request swap
            </Button>
          </div>

          {selectedTheirSlot && (
            <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-3">
              <div className="text-sm text-gray-600">Selected</div>
              <div className="font-semibold">{selectedTheirSlot.title}</div>
              <div className="text-sm text-gray-700">{new Date(selectedTheirSlot.startTime).toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
