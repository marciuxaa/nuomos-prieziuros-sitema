import { useState } from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('name', data.name);
      onLogin(data.role);
    } catch (err) {
      setError('Serverio klaida');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow w-96">
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">Prisijungimas</h1>
        <p className="text-center text-slate-500 text-sm mb-6">Būsto priežiūros sistema</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <label className="text-sm text-slate-600">El. paštas</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2 mt-1 mb-4 text-sm"
          placeholder="vardas@example.lt"
        />

        <label className="text-sm text-slate-600">Slaptažodis</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded p-2 mt-1 mb-6 text-sm"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-700 text-sm"
        >
          Prisijungti
        </button>
      </div>
    </div>
  );
}

export default Login;