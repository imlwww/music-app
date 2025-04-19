'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SpotifyAlbum } from '@/types/spotify';

export default function NewReleases() {
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchNewReleases() {
      try {
        const res = await fetch('/api/spotify/new-releases');
        if (res.ok) {
          const data = await res.json();
          setAlbums(data);
        } else {
          setError('Falha ao carregar lançamentos');
        }
      } catch (err) {
        console.error('Erro em NewReleases:', err);
        setError('Erro ao buscar lançamentos');
      }
    }
    fetchNewReleases();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!albums.length) return <div className="text-white">Carregando...</div>;

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-2xl font-bold text-white">Novos Lançamentos</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {albums.map(album => (
          <Link key={album.id} href={`/albums/${album.id}`}>
            <div className="p-2 hover:bg-neutral-800 rounded">
              <img
                src={album.image}
                alt={album.name}
                width={160}
                height={160}
                className="rounded w-24 h-24 md:w-40 md:h-40 object-cover"
              />
              <p className="mt-2 text-sm text-white text-center">{album.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}