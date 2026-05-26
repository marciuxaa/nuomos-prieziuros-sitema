function Navbar({ name, onLogout }) {
  return (
    <nav className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="font-bold text-lg">BūstoValdymas</h1>
      <div className="flex items-center gap-4">
        <span className="text-slate-300 text-sm">{name}</span>
        <button
          onClick={onLogout}
          className="bg-slate-600 hover:bg-slate-500 text-white text-sm px-3 py-1 rounded"
        >
          Atsijungti
        </button>
      </div>
    </nav>
  );
}

export default Navbar;