'use client'

import { useState } from 'react';
import axios from 'axios';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e:any) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/admin/login', { email, password });
      localStorage.setItem('token', data.token);
      alert('Login successful');
      // Redirect to admin dashboard
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
