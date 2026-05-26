import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';

function TechnicianPage() {
  const [tickets, setTickets] = useState([]);
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

  useEffect(() => { getTickets(); }, []);

  const changeStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/tickets/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', authorization: token },
      body: JSON.stringify({ status })
    });
    getTickets();
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

  const logout = () => { localStorage.clear(); window.location.reload(); };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar name={name} onLogout={logout} />

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-base font-semibold text-slate-800 mb-4">Man priskirtos užklausos</h2>

        {tickets.length === 0 && <p className="text-slate-500 text-sm">Užklausų nėra</p>}
        {tickets.map((t) => (
          <div key={t.id} className="bg-white border border-slate-200 rounded p-4 mb-3">
            <div className="flex justify-between items-start">
              <p className="font-medium text-slate-800">{t.title}</p>
              <StatusBadge status={t.status} />
            </div>
            <p className="text-sm text-slate-500 mt-1">{t.description}</p>
            
            <div className="mt-2">
              <PriorityBadge priority={t.priority} />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center flex-wrap gap-3">
              {/* Dinaminiai valdymo mygtukai, pritaikyti prie bendros puslapio estetikos */}
              <div>
                {t.status === 'assigned' && (
                  <button
                    onClick={() => changeStatus(t.id, 'in_progress')}
                    className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded hover:bg-slate-700 transition-colors font-medium"
                  >
                    Pradėti darbą
                  </button>
                )}
                {t.status === 'in_progress' && (
                  <button
                    onClick={() => changeStatus(t.id, 'done')}
                    className="text-xs bg-emerald-700 text-white px-3 py-1.5 rounded hover:bg-emerald-600 transition-colors font-medium"
                  >
                    Užbaigti darbą
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                <button onClick={() => getAttachments(t.id)} className="text-xs text-slate-600 hover:text-slate-800 font-medium transition-colors">
                  {attachments[t.id] ? 'Slėpti nuotraukas' : 'Nuotraukos'}
                </button>
                <button onClick={() => getComments(t.id)} className="text-xs text-slate-600 hover:text-slate-800 font-medium transition-colors">
                  {comments[t.id] ? 'Slėpti komentarus' : 'Komentarai'}
                </button>
              </div>
            </div>

            {attachments[t.id] && (
              <div className="mt-3 bg-slate-50 rounded p-3 border border-slate-200">
                {attachments[t.id].length === 0 && <p className="text-xs text-slate-400">Nuotraukų nėra</p>}
                <div className="flex flex-wrap gap-2">
                  {attachments[t.id].map((a) => (
                    <a key={a.id} href={`http://localhost:5000/uploads/${a.file_path}`} target="_blank" rel="noreferrer" className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 hover:bg-slate-50 block font-medium transition-colors">
                      Peržiūrėti nuotrauką
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
    </div>
  );
}

export default TechnicianPage;