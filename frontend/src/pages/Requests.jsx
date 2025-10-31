import React, { useEffect, useState } from 'react';
import api from '../api/api';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function Requests(){
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  const fetch = async () => {
    const res = await api.get('/swaps/requests');
    setIncoming(res.data.incoming);
    setOutgoing(res.data.outgoing);
  };

  useEffect(() => { fetch(); }, []);

  const respond = async (id, accept) => {
    await api.post(`/swaps/swap-response/${id}`, { accepted: accept });
    fetch();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-4">Swap requests</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold mb-3">Incoming</h2>
          {incoming.length===0 && <div className="text-gray-500">No incoming requests</div>}
          {incoming.map(r => (
            <div key={r._id} className="mb-3 rounded-md border border-gray-200 p-3">
              <div className="mb-1"><strong>{r.fromUser?.name}</strong> wants to swap</div>
              <div className="text-sm text-gray-700">Their: {r.theirSlot?.title} ({new Date(r.theirSlot?.startTime).toLocaleString()})</div>
              <div className="text-sm text-gray-700">Offer: {r.mySlot?.title} ({new Date(r.mySlot?.startTime).toLocaleString()})</div>
              {r.status === 'PENDING' ? (
                <div className="mt-2 flex items-center gap-2">
                  <Button className="bg-green-600 hover:bg-green-700 focus-visible:ring-green-600" size="sm" onClick={()=>respond(r._id, true)}>Accept</Button>
                  <Button variant="danger" size="sm" onClick={()=>respond(r._id, false)}>Reject</Button>
                </div>
              ) : (
                <div className="mt-2">
                  <Badge color={r.status === 'ACCEPTED' ? 'green' : r.status === 'REJECTED' ? 'red' : 'gray'}>
                    {r.status}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="font-semibold mb-3">Outgoing</h2>
          {outgoing.length===0 && <div className="text-gray-500">No outgoing requests</div>}
          {outgoing.map(r => (
            <div key={r._id} className="mb-3 rounded-md border border-gray-200 p-3">
              <div className="mb-1">To: <strong>{r.toUser?.name}</strong></div>
              <div className="text-sm text-gray-700">Their: {r.theirSlot?.title}</div>
              <div className="text-sm text-gray-700">Your: {r.mySlot?.title}</div>
              <div className="mt-2">
                <Badge color={r.status === 'PENDING' ? 'amber' : r.status === 'ACCEPTED' ? 'green' : r.status === 'REJECTED' ? 'red' : 'gray'}>
                  {r.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
