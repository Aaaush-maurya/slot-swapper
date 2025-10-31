import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar(){
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const linkClass = ({ isActive }) => `px-3 py-1 rounded-md ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`;

  return (
    <nav className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link to="/dashboard" className="font-bold text-lg tracking-tight">SlotSwapper</Link>

          <button className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100" aria-label="Toggle menu" onClick={() => setOpen(v=>!v)}>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>

          <div className="hidden md:flex items-center gap-2">
            {token ? (
              <>
                <NavLink to="/marketplace" className={linkClass}>Marketplace</NavLink>
                <NavLink to="/requests" className={linkClass}>Requests</NavLink>
                <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
                <button onClick={logout} className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>Login</NavLink>
                <NavLink to="/signup" className={linkClass}>Signup</NavLink>
              </>
            )}
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-3 space-y-1">
            {token ? (
              <>
                <NavLink to="/marketplace" className={linkClass} onClick={()=>setOpen(false)}>Marketplace</NavLink>
                <NavLink to="/requests" className={linkClass} onClick={()=>setOpen(false)}>Requests</NavLink>
                <NavLink to="/dashboard" className={linkClass} onClick={()=>setOpen(false)}>Dashboard</NavLink>
                <button onClick={()=>{ setOpen(false); logout(); }} className="w-full text-left px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass} onClick={()=>setOpen(false)}>Login</NavLink>
                <NavLink to="/signup" className={linkClass} onClick={()=>setOpen(false)}>Signup</NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
