'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ArtistPage({ params }: { params: { id: string } }) {
  const [artist, setArtist] = useState<{
    id: string;
    name: string;
    image: string;
    genres: string[];
    popularity: number;
    followers: number;
    albums: { id: string; name: string; image: string; release_date: string }[];
  } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchArtist() {
      try {
        const res = await fetch(`/api/artist?id=${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setArtist(data);
        } else {
          setError('Falha ao carregar artista');
        }
      } catch (err) {
        setError('Erro ao buscar artista');
      }
    }
    fetchArtist();
  }, [params.id]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!artist) return <div>Carregando...</div>;

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">{artist.name}</h1>
      <div className="flex gap-6">
        <img
          src={artist.image}
          alt={artist.name}
          width={200}
          height={200}
          className="rounded-full"
        />
        <div>
          <p className="text-gray-400">Gêneros: {artist.genres.join(', ')}</p>
          <p className="text-gray-400">Popularidade: {artist.popularity}/100</p>
          <p className="text-gray-400">Seguidores: {artist.followers.toLocaleString()}</p>
        </div>
      </div>
      <h2 className="mt-6 text-2xl font-bold">Álbuns</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {artist.albums.map(album => (
          <Link key={album.id} href={`/albums/${album.id}`}>
            <div className="rounded-lg bg-gray-700 p-4 hover:bg-gray-600">
              <img
                src={album.image}
                alt={album.name}
                width={150}
                height={150}
                className="mb-2 rounded"
              />
              <p className="font-semibold">{album.name}</p>
              <p className="text-sm text-gray-400">{album.release_date}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}