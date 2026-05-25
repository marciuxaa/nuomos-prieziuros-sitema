import { useState, useEffect } from 'react';

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mano užklausos</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{name}</span>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
            Atsijungti
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Nauja užklausa</h2>
        <input
          type="text"
          placeholder="Pavadinimas"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />
        <textarea
          placeholder="Aprašymas"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="low">Žema</option>
          <option value="medium">Vidutinė</option>
          <option value="high">Aukšta</option>
          <option value="emergency">Avarinė</option>
        </select>
        <button
          onClick={createTicket}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Pateikti
        </button>
      </div>

      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">Visos</option>
          <option value="new">Naujos</option>
          <option value="assigned">Priskirtos</option>
          <option value="in_progress">Vykdomos</option>
          <option value="done">Atliktos</option>
          <option value="archived">Archyvuotos</option>
        </select>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Užklausų istorija</h2>
        {filtered.length === 0 && <p className="text-gray-500">Užklausų nėra</p>}
        {filtered.map((t) => (
          <div key={t.id} className="border-b py-3">
            <p className="font-medium">{t.title}</p>
            <p className="text-sm text-gray-600">{t.description}</p>
            <p className="text-sm mt-1">Prioritetas: {t.priority} | Statusas: {t.status}</p>

            <div className="mt-2">
              <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} className="text-sm" />
              <button onClick={() => uploadFile(t.id)} className="ml-2 bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700">
                Įkelti
              </button>
              <button onClick={() => getAttachments(t.id)} className="ml-2 text-blue-600 text-xs underline">
                {attachments[t.id] ? 'Slėpti priedus' : 'Rodyti priedus'}
              </button>
              {attachments[t.id] && attachments[t.id].length === 0 && (
                <p className="text-xs text-gray-500 mt-1">Priedų nėra</p>
              )}
              {attachments[t.id] && attachments[t.id].length > 0 && (
                <div className="mt-1">
                  {attachments[t.id].map((a) => (
                   <div key={a.id} className="mt-1 flex items-center gap-2">
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
                        className="text-red-500 text-xs underline"
                      >
                        Ištrinti
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-2">
              <button onClick={() => getComments(t.id)} className="text-green-600 text-sm underline">
                Rodyti komentarus
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default TenantPage;