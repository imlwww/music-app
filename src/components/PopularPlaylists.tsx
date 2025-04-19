'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SpotifyPlaylist } from '@/types/spotify';

export default function PopularPlaylists() {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPopularPlaylists() {
      try {
        const res = await fetch('/api/spotify/featured-playlists');
        if (res.ok) {
          const data = await res.json();
          setPlaylists(data);
        } else {
          setError('Falha ao carregar playlists');
        }
      } catch (err) {
        console.error('Erro em PopularPlaylists:', err);
        setError('Erro ao buscar playlists');
      }
    }
    fetchPopularPlaylists();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!playlists.length) return <div className="text-white">Carregando...</div>;

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-2xl font-bold text-white">Playlists Populares</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {playlists.map(playlist => (
          <Link key={playlist.id} href={`/playlists/${playlist.id}`}>
            <div className="p-2 hover:bg-neutral-800 rounded">
              <img
                src={playlist.image}
                alt={playlist.name}
                width={160}
                height={160}
                className="rounded w-24 h-24 md:w-40 md:h-40 object-cover"
              />
              <p className="mt-2 text-sm text-white">{playlist.name}</p>
              <p className="text-xs text-gray-400">{playlist.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}