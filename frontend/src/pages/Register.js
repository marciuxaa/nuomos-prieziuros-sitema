import { useState } from 'react';

function Register({ onBack }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      setError('Užpildykite visus laukus');
      return;
    }

    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, email, password, role: 'tenant' })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    setSuccess('Registracija sėkminga, galite prisijungti');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Registracija</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <input
          type="text"
          placeholder="Vardas Pavardė"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />
        <input
          type="email"
          placeholder="El. paštas"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />
        <input
          type="password"
          placeholder="Slaptažodis"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mb-3"
        >
          Registruotis
        </button>

        <button
          onClick={onBack}
          className="w-full bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
        >
          Atgal į prisijungimą
        </button>
      </div>
    </div>
  );
}

export default Register;