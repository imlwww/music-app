'use client';

import { useState } from 'react';
import { loginUser } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-gray-800 p-6">
      <h2 className="mb-4 text-2xl font-bold">Login</h2>
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
          Entrar
        </button>
      </form>
      <p className="mt-4 text-center">
        Não tem conta?{' '}
        <a href="/auth/register" className="text-blue-400">
          Registre-se
        </a>
      </p>
    </div>
  );
}