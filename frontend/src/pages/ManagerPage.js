import { useState, useEffect } from 'react';

function ManagerPage() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
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
      headers: {
        'Content-Type': 'application/json',
        authorization: token
      },
      body: JSON.stringify({ status })
    });
    getTickets();
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
        <h2 className="text-lg font-semibold mb-4">Užklausos</h2>
        {filtered.length === 0 && <p className="text-gray-500">Užklausų nėra</p>}
        {filtered.map((t) => (
          <div key={t.id} className="border-b py-3">
            <p className="font-medium">{t.title}</p>
            <p className="text-sm text-gray-600">{t.description}</p>
            <p className="text-sm mt-1">Prioritetas: {t.priority} | Statusas: {t.status}</p>
            <select
              value={t.status}
              onChange={(e) => changeStatus(t.id, e.target.value)}
              className="mt-2 border p-1 rounded text-sm"
            >
              <option value="new">Nauja</option>
              <option value="assigned">Priskirta</option>
              <option value="in_progress">Vykdoma</option>
              <option value="done">Atlikta</option>
              <option value="archived">Archyvuota</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagerPage;