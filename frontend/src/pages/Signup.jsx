import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function Signup(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/dashboard');
    } catch (err) {
      setErr(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold mb-2 tracking-tight">Create account</h2>
      <p className="text-sm text-gray-500 mb-4">Get started by creating your account.</p>
      {err && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            value={name}
            onChange={e=>setName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            value={password}
            onChange={e=>setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
            required
          />
        </div>
        <Button className="w-full" size="lg" variant="secondary">Create account</Button>
      </form>
    </div>
  );
}
