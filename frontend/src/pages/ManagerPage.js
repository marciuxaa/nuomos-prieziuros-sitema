import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function ManagerPage() {
  const [tickets, setTickets] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('tickets');
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
    const res = await fetch('http://localhost:5000/api/tickets', { headers: { authorization: token } });
    const data = await res.json();
    setTickets(data);
  };

  const getTenants = async () => {
    const res = await fetch('http://localhost:5000/api/users/tenants', { headers: { authorization: token } });
    const data = await res.json();
    setTenants(data);
  };

  const getTechnicians = async () => {
    const res = await fetch('http://localhost:5000/api/users/technicians', { headers: { authorization: token } });
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
    if (history[ticketId]) { setHistory(prev => ({ ...prev, [ticketId]: null })); return; }
    const res = await fetch(`http://localhost:5000/api/tickets/${ticketId}/history`, { headers: { authorization: token } });
    const data = await res.json();
    setHistory(prev => ({ ...prev, [ticketId]: data }));
  };

  const getComments = async (ticketId) => {
    if (comments[ticketId]) { setComments(prev => ({ ...prev, [ticketId]: null })); return; }
    const res = await fetch(`http://localhost:5000/api/tickets/${ticketId}/comments`, { headers: { authorization: token } });
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
    setNewComment(prev => ({ ...prev, [ticketId]: '' }));
    getComments(ticketId);
  };

  const getAttachments = async (ticketId) => {
    if (attachments[ticketId]) { setAttachments(prev => ({ ...prev, [ticketId]: null })); return; }
    const res = await fetch(`http://localhost:5000/api/tickets/${ticketId}/attachments`, { headers: { authorization: token } });
    const data = await res.json();
    setAttachments(prev => ({ ...prev, [ticketId]: data }));
  };

  const createTenant = async () => {
    if (!newTenant.full_name || !newTenant.email || !newTenant.password) { setTenantMsg('Užpildykite visus laukus'); return; }
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
    if (!newTechnician.full_name || !newTechnician.email || !newTechnician.password) { setTechMsg('Užpildykite visus laukus'); return; }
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

  const logout = () => { localStorage.clear(); window.location.reload(); };

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar name={name} onLogout={logout} />

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'tickets' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
            Užklausos
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
            Vartotojai
          </button>
        </div>

        {activeTab === 'tickets' && (
          <div className="bg-white rounded border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold text-slate-800">Visos sistemos užklausos</h2>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-slate-300 rounded p-2 text-sm bg-white focus:outline-none focus:border-slate-400">
                <option value="all">Visos</option>
                <option value="new">Naujos</option>
                <option value="assigned">Priskirtos</option>
                <option value="in_progress">Vykdomos</option>
                <option value="done">Atliktos</option>
                <option value="archived">Archyvuotos</option>
              </select>
            </div>

            {filtered.length === 0 && <p className="text-slate-500 text-sm">Užklausų nėra</p>}
            {filtered.map((t) => (
              <div key={t.id} className="border border-slate-200 rounded p-4 mb-3 bg-white">
                
                
                <div className="flex justify-between items-start">
                  <p className="font-medium text-slate-800">{t.title}</p>
                  <span className="text-xs font-semibold text-slate-600">
                    Būsena: {
                      t.status === 'new' ? 'Nauja' :
                      t.status === 'assigned' ? 'Priskirta' :
                      t.status === 'in_progress' ? 'Vykdoma' :
                      t.status === 'done' ? 'Atlikta' :
                      t.status === 'archived' ? 'Archyvuota' : t.status
                    }
                  </span>
                </div>
                
                <p className="text-sm text-slate-500 mt-1">{t.description}</p>
                <p className="text-xs text-slate-400 mt-1">{t.address}, {t.city}</p>
                
                <div className="mt-2 text-xs text-slate-500">
                  Prioritetas: {
                    t.priority === 'low' ? 'Žemas' :
                    t.priority === 'medium' ? 'Vidutinis' :
                    t.priority === 'high' ? 'Aukštas' :
                    t.priority === 'emergency' ? 'Avarinė situacija' : t.priority
                  }
                </div>

                
                <div className="mt-3 flex gap-3 flex-wrap">
                  <select 
                    value={t.status} 
                    onChange={(e) => changeStatus(t.id, e.target.value)} 
                    className="border border-slate-300 rounded p-1 text-sm bg-white focus:outline-none focus:border-slate-400 text-slate-700"
                  >
                    <option value="new">Nauja</option>
                    <option value="assigned">Priskirta</option>
                    <option value="in_progress">Vykdoma</option>
                    <option value="done">Atlikta</option>
                    <option value="archived">Archyvuota</option>
                  </select>
                  
                  <select value={t.technician_id || ''} onChange={(e) => assignTechnician(t.id, e.target.value)} className="border border-slate-300 rounded p-1 text-sm bg-white focus:outline-none focus:border-slate-400 text-slate-700">
                    <option value="">Priskirti techniką</option>
                    {technicians.map((tech) => (
                      <option key={tech.id} value={tech.id}>{tech.full_name}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-4">
                  <button onClick={() => getHistory(t.id)} className="text-xs text-slate-600 hover:text-slate-800 font-medium transition-colors">
                    {history[t.id] ? 'Slėpti istoriją' : 'Būsenų istorija'}
                  </button>
                  <button onClick={() => getAttachments(t.id)} className="text-xs text-slate-600 hover:text-slate-800 font-medium transition-colors">
                    {attachments[t.id] ? 'Slėpti nuotraukas' : 'Nuotraukos'}
                  </button>
                  <button onClick={() => getComments(t.id)} className="text-xs text-slate-600 hover:text-slate-800 font-medium transition-colors">
                    {comments[t.id] ? 'Slėpti komentarus' : 'Komentarai'}
                  </button>
                </div>

                {history[t.id] && (
                  <div className="mt-3 bg-slate-50 rounded p-3 text-xs text-slate-600 border border-slate-200">
                    {history[t.id].length === 0 && <p className="text-slate-400">Istorijos nėra</p>}
                    {history[t.id].map((h) => (
                      <p key={h.id} className="mt-1">
                        Pakeitė <span className="font-medium text-slate-700">{h.full_name}</span>: <span className="font-semibold text-slate-700">{h.status_from}</span> → <span className="font-semibold text-slate-700">{h.status_to}</span>
                        <span className="text-slate-400 ml-2">| {new Date(h.changed_at).toLocaleString('lt-LT')}</span>
                      </p>
                    ))}
                  </div>
                )}

                {attachments[t.id] && (
                  <div className="mt-3 bg-slate-50 rounded p-3 border border-slate-200">
                    {attachments[t.id].length === 0 && <p className="text-xs text-slate-400">Nuotraukų nėra</p>}
                    <div className="flex flex-wrap gap-2">
                      {attachments[t.id].map((a) => (
                        <a key={a.id} href={`http://localhost:5000/uploads/${a.file_path}`} target="_blank" rel="noreferrer" className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 hover:bg-slate-50 block font-medium transition-colors">
                          Peržiūrėti failą
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {comments[t.id] && (
                  <div className="mt-3 bg-slate-50 rounded p-3 border border-slate-200">
                    {comments[t.id].length === 0 && <p className="text-xs text-slate-400 mb-2">Komentarų nėra</p>}
                    {comments[t.id].map((c) => (
                      <p key={c.id} className="text-sm text-slate-600 mb-1">
                        <span className="font-medium text-slate-800">{c.full_name}:</span> {c.comment_text}
                      </p>
                    ))}
                    <div className="flex gap-2 mt-3">
                      <input
                        type="text"
                        placeholder="Rašyti komentarą..."
                        value={newComment[t.id] || ''}
                        onChange={(e) => setNewComment(prev => ({ ...prev, [t.id]: e.target.value }))}
                        className="border border-slate-300 rounded p-1.5 text-sm flex-1 focus:outline-none focus:border-slate-400 bg-white"
                      />
                      <button onClick={() => addComment(t.id)} className="bg-slate-800 text-white px-3 py-1 rounded text-sm hover:bg-slate-700 transition-colors">Siųsti</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded border border-slate-200 p-6">
              <h2 className="text-base font-semibold text-slate-800 mb-4">Nuomininkai</h2>
              {tenantMsg && <p className="text-slate-600 text-sm mb-3 font-medium">{tenantMsg}</p>}
              <input type="text" placeholder="Vardas Pavardė" value={newTenant.full_name}
                onChange={(e) => setNewTenant({ ...newTenant, full_name: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 mb-2 text-sm focus:outline-none focus:border-slate-400 bg-white" />
              <input type="email" placeholder="El. paštas" value={newTenant.email}
                onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 mb-2 text-sm focus:outline-none focus:border-slate-400 bg-white" />
              <input type="password" placeholder="Laikinas slaptažodis" value={newTenant.password}
                onChange={(e) => setNewTenant({ ...newTenant, password: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 mb-3 text-sm focus:outline-none focus:border-slate-400 bg-white" />
              <button onClick={createTenant} className="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-700 transition-colors mb-4 font-medium">
                Sukurti nuomininką
              </button>
              <div>
                {tenants.map((t) => (
                  <div key={t.id} className="flex justify-between items-center border-b border-slate-100 py-2 text-sm">
                    <span className="text-slate-700">{t.full_name} - {t.email}</span>
                    <button onClick={() => {
                      if (window.confirm('Ar tikrai norite ištrinti?')) {
                        fetch(`http://localhost:5000/api/users/tenants/${t.id}`, { method: 'DELETE', headers: { authorization: token } }).then(() => getTenants());
                      }
                    }} className="text-slate-500 text-xs font-medium hover:text-red-600 transition-colors">Ištrinti</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded border border-slate-200 p-6">
              <h2 className="text-base font-semibold text-slate-800 mb-4">Technikai</h2>
              {techMsg && <p className="text-slate-600 text-sm mb-3 font-medium">{techMsg}</p>}
              <input type="text" placeholder="Vardas Pavardė" value={newTechnician.full_name}
                onChange={(e) => setNewTechnician({ ...newTechnician, full_name: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 mb-2 text-sm focus:outline-none focus:border-slate-400 bg-white" />
              <input type="email" placeholder="El. paštas" value={newTechnician.email}
                onChange={(e) => setNewTechnician({ ...newTechnician, email: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 mb-2 text-sm focus:outline-none focus:border-slate-400 bg-white" />
              <input type="password" placeholder="Laikinas slaptažodis" value={newTechnician.password}
                onChange={(e) => setNewTechnician({ ...newTechnician, password: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 mb-3 text-sm focus:outline-none focus:border-slate-400 bg-white" />
              <button onClick={createTechnician} className="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-700 transition-colors mb-4 font-medium">
                Sukurti techniką
              </button>
               <div>
                {technicians.map((t) => (
                  <div key={t.id} className="flex justify-between items-center border-b border-slate-100 py-2 text-sm">
                    <span className="text-slate-700">{t.full_name} - {t.email}</span>
                    <button onClick={() => {
                      if (window.confirm('Ar tikrai norite ištrinti?')) {
                        fetch(`http://localhost:5000/api/users/technicians/${t.id}`, {
                          method: 'DELETE', headers: { authorization: token }
                        }).then(() => getTechnicians());
                      }
                    }} className="text-red-500 text-xs underline">Ištrinti</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerPage;