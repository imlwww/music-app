'use client';

import { useState } from 'react';
import { registerUser } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(email, password);
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-gray-800 p-6">
      <h2 className="mb-4 text-2xl font-bold">Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-1 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded bg-gray-700 p-2 text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded bg-gray-700 p-2 text-white"
            required
          />
        </div>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full rounded bg-blue-500 px-4 py-2 text-white"
        >
          Registrar
        </button>
      </form>
      <p className="mt-4 text-center">
        Já tem conta?{' '}
        <a href="/auth/login" className="text-blue-400">
          Faça login
        </a>
      </p>
    </div>
  );
}