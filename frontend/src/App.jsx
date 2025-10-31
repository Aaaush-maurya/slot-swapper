import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/MarketPlace';
import Requests from './pages/Requests';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

export default function App(){
  return (
    <div>
      <Navbar />
      <main className="p-6 max-w-5xl mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/requests" element={<Requests />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}
