import { useState, useEffect } from 'react';

function ManagerPage() {
  const [tickets, setTickets] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [filter, setFilter] = useState('all');
  const [newTenant, setNewTenant] = useState({ full_name: '', email: '', password: '' });
  const [tenantMsg, setTenantMsg] = useState('');
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

  useEffect(() => {
    getTickets();
    getTenants();
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

  const createTenant = async () => {
    if (!newTenant.full_name || !newTenant.email || !newTenant.password) {
      setTenantMsg('Užpildykite visus laukus');
      return;
    }
    const res = await fetch('http://localhost:5000/api/users/tenants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: token
      },
      body: JSON.stringify(newTenant)
    });
    const data = await res.json();
    setTenantMsg(data.message);
    setNewTenant({ full_name: '', email: '', password: '' });
    getTenants();
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

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Sukurti nuomininką</h2>
        {tenantMsg && <p className="text-green-600 mb-3">{tenantMsg}</p>}
        <input
          type="text"
          placeholder="Vardas Pavardė"
          value={newTenant.full_name}
          onChange={(e) => setNewTenant({ ...newTenant, full_name: e.target.value })}
          className="w-full border p-2 rounded mb-3"
        />
        <input
          type="email"
          placeholder="El. paštas"
          value={newTenant.email}
          onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
          className="w-full border p-2 rounded mb-3"
        />
        <input
          type="password"
          placeholder="Laikinas slaptažodis"
          value={newTenant.password}
          onChange={(e) => setNewTenant({ ...newTenant, password: e.target.value })}
          className="w-full border p-2 rounded mb-3"
        />
        <button
          onClick={createTenant}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Sukurti
        </button>

        <h3 className="text-md font-semibold mt-6 mb-3">Nuomininkai sistemoje</h3>
        {tenants.map((t) => (
  <div key={t.id} className="border-b py-2 text-sm flex justify-between items-center">
    <p>{t.full_name} - {t.email}</p>
    <button
      onClick={() => {
        if (window.confirm('Ar tikrai norite ištrinti šį nuomininką?')) {
          fetch(`http://localhost:5000/api/users/tenants/${t.id}`, {
            method: 'DELETE',
            headers: { authorization: token }
          }).then(() => getTenants());
        }
      }}
      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
    >
      Ištrinti
    </button>
  </div>
))}
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