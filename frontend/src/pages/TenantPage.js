import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function TenantPage() {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachments, setAttachments] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  const getTickets = async () => {
    const res = await fetch('http://localhost:5000/api/tickets', {
      headers: { authorization: token }
    });
    const data = await res.json();
    setTickets(data);
  };

  useEffect(() => {
    getTickets();
  }, []);

  const createTicket = async () => {
    if (!title) return;
    await fetch('http://localhost:5000/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: token },
      body: JSON.stringify({ title, description, priority, property_id: 1 })
    });
    setTitle('');
    setDescription('');
    getTickets();
  };

  const uploadFile = async (ticketId) => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);
    await fetch(`http://localhost:5000/api/tickets/${ticketId}/attachments`, {
      method: 'POST',
      headers: { authorization: token },
      body: formData
    });
    setSelectedFile(null);
    getAttachments(ticketId);
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
    setNewComment(prev => ({ ...prev, [ticketId]: '' }));
    getComments(ticketId);
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  const priorityLabel = { low: 'Žema', medium: 'Vidutinė', high: 'Aukšta', emergency: 'Avarinė' };
  const statusLabel = { new: 'Nauja', assigned: 'Priskirta', in_progress: 'Vykdoma', done: 'Atlikta', archived: 'Archyvuota' };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar name={name} onLogout={logout} />

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Pateikti naują užklausą</h2>
          <input
            type="text"
            placeholder="Gedimo pavadinimas"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-slate-300 rounded p-2 mb-3 text-sm"
          />
          <textarea
            placeholder="Aprašykite gedimą"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-slate-300 rounded p-2 mb-3 text-sm h-24"
          />
          <div className="flex gap-3">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border border-slate-300 rounded p-2 text-sm"
            >
              <option value="low">Žema prioritetas</option>
              <option value="medium">Vidutinis prioritetas</option>
              <option value="high">Aukštas prioritetas</option>
              <option value="emergency">Avarinė situacija</option>
            </select>
            <button
              onClick={createTicket}
              className="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-700"
            >
              Pateikti užklausą
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Mano užklausos</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-slate-300 rounded p-2 text-sm"
            >
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
            <div key={t.id} className="border border-slate-200 rounded p-4 mb-3">
              <div className="flex justify-between items-start">
                <p className="font-medium text-slate-800">{t.title}</p>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{statusLabel[t.status]}</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">{t.description}</p>
              <p className="text-xs text-slate-400 mt-1">Prioritetas: {priorityLabel[t.priority]}</p>

              <div className="mt-3 flex gap-3 flex-wrap">
                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} className="text-xs" />
                <button onClick={() => uploadFile(t.id)} className="text-xs bg-slate-600 text-white px-2 py-1 rounded hover:bg-slate-500">
                  Įkelti nuotrauką
                </button>
                <button onClick={() => getAttachments(t.id)} className="text-xs text-blue-600 underline">
                  {attachments[t.id] ? 'Slėpti nuotraukas' : 'Rodyti nuotraukas'}
                </button>
                <button onClick={() => getComments(t.id)} className="text-xs text-green-600 underline">
                  {comments[t.id] ? 'Slėpti komentarus' : 'Rodyti komentarus'}
                </button>
              </div>

              {attachments[t.id] && attachments[t.id].length === 0 && (
                <p className="text-xs text-slate-400 mt-2">Nuotraukų nėra</p>
              )}
              {attachments[t.id] && attachments[t.id].length > 0 && (
                <div className="mt-2">
                  {attachments[t.id].map((a) => (
                    <div key={a.id} className="flex gap-2 items-center mt-1">
                      <a href={`http://localhost:5000/uploads/${a.file_path}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 underline">
                        Peržiūrėti nuotrauką
                      </a>
                      <button
                        onClick={async () => {
                          await fetch(`http://localhost:5000/api/tickets/attachments/${a.id}`, {
                            method: 'DELETE',
                            headers: { authorization: token }
                          });
                          getAttachments(t.id);
                        }}
                        className="text-xs text-red-500 underline"
                      >
                        Ištrinti
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {comments[t.id] && (
                <div className="mt-3 bg-slate-50 rounded p-3">
                  {comments[t.id].length === 0 && <p className="text-xs text-slate-400">Komentarų nėra</p>}
                  {comments[t.id].map((c) => (
                    <p key={c.id} className="text-sm text-slate-600 mb-1">
                      <span className="font-medium">{c.full_name}:</span> {c.comment_text}
                    </p>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Rašyti komentarą..."
                      value={newComment[t.id] || ''}
                      onChange={(e) => setNewComment(prev => ({ ...prev, [t.id]: e.target.value }))}
                      className="border border-slate-300 rounded p-1 text-sm flex-1"
                    />
                    <button onClick={() => addComment(t.id)} className="bg-slate-800 text-white px-3 py-1 rounded text-sm">
                      Siųsti
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TenantPage;