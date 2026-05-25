import { useState, useEffect } from 'react';

function TechnicianPage() {
  const [tickets, setTickets] = useState([]);
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default TechnicianPage;