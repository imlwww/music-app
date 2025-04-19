'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TopGenres() {
  const [genres, setGenres] = useState<{ id: string; name: string; image: string }[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTopGenres() {
      try {
        // Mock de gêneros populares (Spotify não tem endpoint direto, usar /recommendations/available-genre-seeds)
        const res = await fetch('/api/spotify/available-genre-seeds');
        if (res.ok) {
          const genreSeeds = await res.json();
          const topGenres = genreSeeds.slice(0, 6).map((genre: string, index: number) => ({
            id: genre,
            name: genre.charAt(0).toUpperCase() + genre.slice(1),
            image: `/genres/${genre}.jpg` // Substituir por imagens reais ou API
          }));
          setGenres(topGenres);
        } else {
          setError('Falha ao carregar gêneros');
        }
      } catch (err) {
        console.error('Erro em TopGenres:', err);
        setError('Erro ao buscar gêneros');
      }
    }
    fetchTopGenres();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!genres.length) return <div className="text-white">Carregando...</div>;

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-2xl font-bold text-white">Gêneros em Destaque</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {genres.map(genre => (
          <Link key={genre.id} href={`/genres/${genre.id}`}>
            <div className="p-2 hover:bg-neutral-800 rounded">
              <img
                src={genre.image}
                alt={genre.name}
                className="rounded w-24 h-24 md:w-32 md:h-32 object-cover"
              />
              <p className="mt-2 text-sm text-white text-center">{genre.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}