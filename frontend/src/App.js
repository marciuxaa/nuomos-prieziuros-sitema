import { useState } from 'react';
import Login from './pages/Login';
import TenantPage from './pages/TenantPage';
import ManagerPage from './pages/ManagerPage';

function App() {
  const [role, setRole] = useState(null);

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

  if (!role) {
    return <Login onLogin={handleLogin} />;
  }

  if (role === 'tenant') {
    return <TenantPage />;
  }

  if (role === 'manager') {
    return <ManagerPage />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <p className="p-4">Prisijungta kaip: {role}</p>
    </div>
  );
}

export default App;