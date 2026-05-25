import { useState, useEffect } from 'react';

function TechnicianPage() {
  const [tickets, setTickets] = useState([]);
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

  useEffect(() => {
    getTickets();
  }, []);

  const changeStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/tickets/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', authorization: token },
      body: JSON.stringify({ status })
    });
    getTickets();
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

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Techniko panelė</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{name}</span>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
            Atsijungti
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Man priskirtos užklausos</h2>
        {tickets.length === 0 && <p className="text-gray-500">Užklausų nėra</p>}
        {tickets.map((t) => (
          <div key={t.id} className="border-b py-3">
            <p className="font-medium">{t.title}</p>
            <p className="text-sm text-gray-600">{t.description}</p>
            <p className="text-sm mt-1">Prioritetas: {t.priority} | Statusas: {t.status}</p>
            <select
              value={t.status}
              onChange={(e) => changeStatus(t.id, e.target.value)}
              className="mt-2 border p-1 rounded text-sm"
            >
              <option value="assigned">Priskirta</option>
              <option value="in_progress">Vykdoma</option>
              <option value="done">Atlikta</option>
            </select>

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

export default TechnicianPage;