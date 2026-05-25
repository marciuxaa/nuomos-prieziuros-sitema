import { useState, useEffect } from 'react';

function ManagerPage() {
  const [tickets, setTickets] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [filter, setFilter] = useState('all');
  const [newTenant, setNewTenant] = useState({ full_name: '', email: '', password: '' });
  const [newTechnician, setNewTechnician] = useState({ full_name: '', email: '', password: '' });
  const [tenantMsg, setTenantMsg] = useState('');
  const [techMsg, setTechMsg] = useState('');
  const [history, setHistory] = useState({});
  const [comments, setComments] = useState({});
const [newComment, setNewComment] = useState({});
const [attachments, setAttachments] = useState({});
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  const getTickets = async () => {
    const res = await fetch('http://localhost:5000/api/tickets', {
      headers: { authorization: token }
    });
    const data = await res.json();
    setTickets(data);
  };

  const getTenants = async () => {
    const res = await fetch('http://localhost:5000/api/users/tenants', {
      headers: { authorization: token }
    });
    const data = await res.json();
    setTenants(data);
  };

  const getTechnicians = async () => {
    const res = await fetch('http://localhost:5000/api/users/technicians', {
      headers: { authorization: token }
    });
    const data = await res.json();
    setTechnicians(data);
  };

  useEffect(() => {
    getTickets();
    getTenants();
    getTechnicians();
  }, []);

  const changeStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/tickets/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', authorization: token },
      body: JSON.stringify({ status })
    });
    getTickets();
  };

  const assignTechnician = async (ticketId, technicianId) => {
    await fetch(`http://localhost:5000/api/tickets/${ticketId}/assign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', authorization: token },
      body: JSON.stringify({ technician_id: technicianId })
    });
    getTickets();
  };
const getHistory = async (ticketId) => {
    if (history[ticketId]) {
        setHistory({ ...history, [ticketId]: null });
        return;
    }
    const res = await fetch(`http://localhost:5000/api/tickets/${ticketId}/history`, {
        headers: { authorization: token }
    });
    const data = await res.json();
    setHistory({ ...history, [ticketId]: data });
};
const getComments = async (ticketId) => {
    if (comments[ticketId]) {
      setComments(prev => ({ ...prev, [ticketId]: null }));
      return;
    }
    const res = await fetch(`http://localhost:5000/api/tickets/${ticketId}/comments`, {
      headers: { authorization: token }
    });
    const data = await res.json();
    setComments(prev => ({ ...prev, [ticketId]: data }));
};

const addComment = async (ticketId) => {
    if (!newComment[ticketId]) return;
    await fetch(`http://localhost:5000/api/tickets/${ticketId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ comment_text: newComment[ticketId] })
    });
    setNewComment({ ...newComment, [ticketId]: '' });
    getComments(ticketId);
};
const getAttachments = async (ticketId) => {
    if (attachments[ticketId]) {
      setAttachments(prev => ({ ...prev, [ticketId]: null }));
      return;
    }
    const res = await fetch(`http://localhost:5000/api/tickets/${ticketId}/attachments`, {
      headers: { authorization: token }
    });
    const data = await res.json();
    setAttachments(prev => ({ ...prev, [ticketId]: data }));
};
  const createTenant = async () => {
    if (!newTenant.full_name || !newTenant.email || !newTenant.password) {
      setTenantMsg('Užpildykite visus laukus');
      return;
    }
    const res = await fetch('http://localhost:5000/api/users/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: token },
      body: JSON.stringify(newTenant)
    });
    const data = await res.json();
    setTenantMsg(data.message);
    setNewTenant({ full_name: '', email: '', password: '' });
    getTenants();
  };

  const createTechnician = async () => {
    if (!newTechnician.full_name || !newTechnician.email || !newTechnician.password) {
      setTechMsg('Užpildykite visus laukus');
      return;
    }
    const res = await fetch('http://localhost:5000/api/users/technicians', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: token },
      body: JSON.stringify(newTechnician)
    });
    const data = await res.json();
    setTechMsg(data.message);
    setNewTechnician({ full_name: '', email: '', password: '' });
    getTechnicians();
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Valdytojo panelė</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{name}</span>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
            Atsijungti
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Sukurti nuomininką</h2>
          {tenantMsg && <p className="text-green-600 mb-3">{tenantMsg}</p>}
          <input type="text" placeholder="Vardas Pavardė" value={newTenant.full_name}
            onChange={(e) => setNewTenant({ ...newTenant, full_name: e.target.value })}
            className="w-full border p-2 rounded mb-3" />
          <input type="email" placeholder="El. paštas" value={newTenant.email}
            onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
            className="w-full border p-2 rounded mb-3" />
          <input type="password" placeholder="Laikinas slaptažodis" value={newTenant.password}
            onChange={(e) => setNewTenant({ ...newTenant, password: e.target.value })}
            className="w-full border p-2 rounded mb-3" />
          <button onClick={createTenant} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Sukurti
          </button>
          <h3 className="text-md font-semibold mt-4 mb-3">Nuomininkai</h3>
          {tenants.map((t) => (
            <div key={t.id} className="border-b py-2 text-sm flex justify-between items-center">
              <p>{t.full_name} - {t.email}</p>
              <button onClick={() => {
                if (window.confirm('Ar tikrai norite ištrinti?')) {
                  fetch(`http://localhost:5000/api/users/tenants/${t.id}`, {
                    method: 'DELETE', headers: { authorization: token }
                  }).then(() => getTenants());
                }
              }} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">
                Ištrinti
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Sukurti techniką</h2>
          {techMsg && <p className="text-green-600 mb-3">{techMsg}</p>}
          <input type="text" placeholder="Vardas Pavardė" value={newTechnician.full_name}
            onChange={(e) => setNewTechnician({ ...newTechnician, full_name: e.target.value })}
            className="w-full border p-2 rounded mb-3" />
          <input type="email" placeholder="El. paštas" value={newTechnician.email}
            onChange={(e) => setNewTechnician({ ...newTechnician, email: e.target.value })}
            className="w-full border p-2 rounded mb-3" />
          <input type="password" placeholder="Laikinas slaptažodis" value={newTechnician.password}
            onChange={(e) => setNewTechnician({ ...newTechnician, password: e.target.value })}
            className="w-full border p-2 rounded mb-3" />
          <button onClick={createTechnician} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Sukurti
          </button>
          <h3 className="text-md font-semibold mt-4 mb-3">Technikai</h3>
          {technicians.map((t) => (
            <div key={t.id} className="border-b py-2 text-sm">
              <p>{t.full_name} - {t.email}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-2 rounded">
          <option value="all">Visos</option>
          <option value="new">Naujos</option>
          <option value="assigned">Priskirtos</option>
          <option value="in_progress">Vykdomos</option>
          <option value="done">Atliktos</option>
          <option value="archived">Archyvuotos</option>
        </select>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Užklausos</h2>
        {filtered.length === 0 && <p className="text-gray-500">Užklausų nėra</p>}
        {filtered.map((t) => (
          <div key={t.id} className="border-b py-3">
            <p className="font-medium">{t.title}</p>
            <p className="text-sm text-gray-600">{t.description}</p>
            <p className="text-sm mt-1">Prioritetas: {t.priority} | Statusas: {t.status}</p>
            <div className="flex gap-3 mt-2">
              <select value={t.status} onChange={(e) => changeStatus(t.id, e.target.value)}
                className="border p-1 rounded text-sm">
                <option value="new">Nauja</option>
                <option value="assigned">Priskirta</option>
                <option value="in_progress">Vykdoma</option>
                <option value="done">Atlikta</option>
                <option value="archived">Archyvuota</option>
              </select>
              <select value={t.technician_id || ''} onChange={(e) => assignTechnician(t.id, e.target.value)}
                className="border p-1 rounded text-sm">
                <option value="">Priskirti techniką</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>{tech.full_name}</option>
                ))}
              </select>
            </div>
            <button
                onClick={() => getHistory(t.id)}
                className="text-blue-600 text-sm underline mt-2"
            >
                {history[t.id] ? 'Slėpti istoriją' : 'Rodyti istoriją'}
            </button>

          {history[t.id] && (
                <div className="mt-2 bg-gray-50 p-2 rounded text-sm">
                    {history[t.id].map((h) => (
                        <p key={h.id} className="text-gray-600">
                            {h.full_name}: {h.status_from} → {h.status_to} | {new Date(h.changed_at).toLocaleString('lt-LT')}
                        </p>
                    ))}
                </div>                
            )}

            <div className="mt-2">
                <button onClick={() => getComments(t.id)} className="text-green-600 text-sm underline">
    {comments[t.id] ? 'Slėpti komentarus' : 'Rodyti komentarus'}
</button>
                {comments[t.id] && (
                    <div className="mt-2 bg-gray-50 p-2 rounded text-sm">
                        {comments[t.id].length === 0 && <p className="text-gray-500">Komentarų nėra</p>}
                        {comments[t.id].map((c) => (
                            <p key={c.id} className="text-gray-600 mb-1">
                                <span className="font-medium">{c.full_name}:</span> {c.comment_text}
                            </p>
                        ))}
                        <div className="flex gap-2 mt-2">
                            <input
                                type="text"
                                placeholder="Rašyti komentarą..."
                                value={newComment[t.id] || ''}
                                onChange={(e) => setNewComment(prev => ({ ...prev, [t.id]: e.target.value }))}
                                className="border p-1 rounded text-sm flex-1"
                            />
                            <button onClick={() => addComment(t.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                                Siųsti
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-2">
                <button onClick={() => getAttachments(t.id)} className="text-purple-600 text-sm underline">
                    {attachments[t.id] ? 'Slėpti nuotraukas' : 'Rodyti nuotraukas'}
                </button>
                {attachments[t.id] && attachments[t.id].length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">Nuotraukų nėra</p>
                )}
                {attachments[t.id] && attachments[t.id].length > 0 && (
                    <div className="mt-1">
                        {attachments[t.id].map((a) => (
                            <div key={a.id} className="mt-1">
                                <a href={`http://localhost:5000/uploads/${a.file_path}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 underline">
                                    Peržiūrėti nuotrauką
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>       
        ))}
      </div>   
    </div>
  );
}

export default ManagerPage;