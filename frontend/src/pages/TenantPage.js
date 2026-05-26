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
  const [history, setHistory] = useState({});
  
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

  const getHistory = async (ticketId) => {
    if (history[ticketId]) { 
      setHistory(prev => ({ ...prev, [ticketId]: null })); 
      return; 
    }
    const res = await fetch(`http://localhost:5000/api/tickets/${ticketId}/history`, {
      headers: { authorization: token }
    });
    const data = await res.json();
    setHistory(prev => ({ ...prev, [ticketId]: data }));
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

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar name={name} onLogout={logout} />

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded border border-slate-200 p-6 mb-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Pateikti naują užklausą</h2>
          <input
            type="text"
            placeholder="Gedimo pavadinimas"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-slate-300 rounded p-2 mb-3 text-sm focus:outline-none focus:border-slate-400 bg-white"
          />
          <textarea
            placeholder="Aprašykite gedimą..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-slate-300 rounded p-2 mb-3 text-sm h-24 focus:outline-none focus:border-slate-400 bg-white"
          />
          <div className="flex gap-3">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border border-slate-300 rounded p-2 text-sm bg-white focus:outline-none focus:border-slate-400 text-slate-700"
            >
              <option value="low">Žemas prioritetas</option>
              <option value="medium">Vidutinis prioritetas</option>
              <option value="high">Aukštas prioritetas</option>
              <option value="emergency">Avarinė situacija</option>
            </select>
            <button
              onClick={createTicket}
              className="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-700 transition-colors font-medium"
            >
              Pateikti užklausą
            </button>
          </div>
        </div>

        <div className="bg-white rounded border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-slate-800">Mano užklausos</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-slate-300 rounded p-2 text-sm bg-white focus:outline-none focus:border-slate-400 text-slate-700"
            >
              <option value="all">Visos</option>
              <option value="new">Naujos</option>
              <option value="in_progress">Vykdomos</option>
              <option value="done">Atliktos</option>
            </select>
          </div>

          {filtered.length === 0 && <p className="text-slate-500 text-sm">Užklausų nėra</p>}
          
          {filtered.map((t) => (
  <div key={t.id} className="border border-slate-200 rounded p-4 mb-3 bg-white">
    {/* Viršutinė eilutė: Pavadinimas kairėje, graži lietuviška būsena dešinėje */}
    <div className="flex justify-between items-start">
      <p className="font-medium text-slate-800">{t.title}</p>
      <span className="text-xs text-slate-600 font-medium bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
        {t.status === 'new' ? 'Nauja' :
         t.status === 'assigned' ? 'Priskirta' :
         t.status === 'in_progress' ? 'Vykdoma' :
         t.status === 'done' ? 'Atlikta' :
         t.status === 'archived' ? 'Archyvuota' : t.status}
      </span>
    </div>
    
    {/* Aprašymas */}
    <p className="text-sm text-slate-500 mt-1">{t.description}</p>
    
    {/* PRIORITETO VIETA ČIA BUVO – DABAR JI VISIŠKAI IŠTRINTA */}

    {/* Apatinė eilutė su failų įkėlimu ir mygtukais */}
    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} className="text-xs text-slate-600" />
        <button onClick={() => uploadFile(t.id)} className="text-xs bg-slate-800 text-white px-2 py-1 rounded hover:bg-slate-700 transition-colors font-medium">
          Įkelti failą
        </button>
      </div>
      
      <div className="flex gap-4">
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
    </div>

    {/* Istorijos blokas */}
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

    {/* Nuotraukų blokas */}
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

    {/* Komentarų blokas */}
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
    </div>
  );
}

export default TenantPage;