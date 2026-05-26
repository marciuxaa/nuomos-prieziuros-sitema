import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

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

  const priorityLabel = { low: 'Žema', medium: 'Vidutinė', high: 'Aukšta', emergency: 'Avarinė' };
  const statusLabel = { new: 'Nauja', assigned: 'Priskirta', in_progress: 'Vykdoma', done: 'Atlikta', archived: 'Archyvuota' };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar name={name} onLogout={logout} />

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Man priskirtos užklausos</h2>

        {tickets.length === 0 && <p className="text-slate-500 text-sm">Užklausų nėra</p>}
        {tickets.map((t) => (
          <div key={t.id} className="bg-white border border-slate-200 rounded p-4 mb-3">
            <div className="flex justify-between items-start">
              <p className="font-medium text-slate-800">{t.title}</p>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{statusLabel[t.status]}</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">{t.description}</p>
            <p className="text-xs text-slate-400 mt-1">Prioritetas: {priorityLabel[t.priority]}</p>

            <select value={t.status} onChange={(e) => changeStatus(t.id, e.target.value)} className="mt-3 border border-slate-300 rounded p-1 text-sm">
              <option value="assigned">Priskirta</option>
              <option value="in_progress">Vykdoma</option>
              <option value="done">Atlikta</option>
            </select>

            <div className="flex gap-3 mt-2">
              <button onClick={() => getComments(t.id)} className="text-xs text-green-600 underline">
                {comments[t.id] ? 'Slėpti komentarus' : 'Rodyti komentarus'}
              </button>
              <button onClick={() => getAttachments(t.id)} className="text-xs text-purple-600 underline">
                {attachments[t.id] ? 'Slėpti nuotraukas' : 'Rodyti nuotraukas'}
              </button>
            </div>

            {comments[t.id] && (
              <div className="mt-2 bg-slate-50 rounded p-3 text-sm">
                {comments[t.id].length === 0 && <p className="text-slate-400 text-xs">Komentarų nėra</p>}
                {comments[t.id].map((c) => (
                  <p key={c.id} className="text-slate-600 mb-1"><span className="font-medium">{c.full_name}:</span> {c.comment_text}</p>
                ))}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Rašyti komentarą..."
                    value={newComment[t.id] || ''}
                    onChange={(e) => setNewComment(prev => ({ ...prev, [t.id]: e.target.value }))}
                    className="border border-slate-300 rounded p-1 text-sm flex-1"
                  />
                  <button onClick={() => addComment(t.id)} className="bg-slate-800 text-white px-3 py-1 rounded text-sm">Siųsti</button>
                </div>
              </div>
            )}

            {attachments[t.id] && attachments[t.id].length === 0 && (
              <p className="text-xs text-slate-400 mt-2">Nuotraukų nėra</p>
            )}
            {attachments[t.id] && attachments[t.id].length > 0 && (
              <div className="mt-2">
                {attachments[t.id].map((a) => (
                  <a key={a.id} href={`http://localhost:5000/uploads/${a.file_path}`} target="_blank" rel="noreferrer" className="block text-xs text-blue-500 underline mt-1">
                    Peržiūrėti nuotrauką
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TechnicianPage;