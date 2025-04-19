'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { SpotifyArtist } from '@/types/spotify';

export default function FavoriteArtists({
  userId,
}: {
  userId: string;
}) {
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchFavoriteArtists() {
      try {
        const doc = await databases.listDocuments('67fd7524003dfce963aa', '67fd7529003b9ab4a7e1', [
          Query.equal('userId', userId),
        ]);
        const favoriteArtists = JSON.parse(doc.documents[0].favoriteArtists || '[]');
        if (!favoriteArtists.length) {
          setArtists([]);
          return;
        }

        const res = await fetch(`/api/spotify/search?query=${encodeURIComponent(favoriteArtists.join(','))}&type=artist`);
        if (res.ok) {
          const data = await res.json();
          setArtists(data);
        } else {
          setError('Falha ao carregar artistas favoritos');
        }
      } catch (err) {
        console.error('Erro em FavoriteArtists:', err);
        setError('Erro ao buscar artistas');
      }
    }
    fetchFavoriteArtists();
  }, [userId]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!artists.length) return null;

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-2xl font-bold text-white">Seus Artistas Favoritos</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {artists.map(artist => (
          <Link key={artist.id} href={`/artists/${artist.id}`} className="group">
            <div className="relative flex flex-col items-center p-2 hover:bg-neutral-800 rounded">
              <img
                src={artist.image}
                alt={artist.name}
                width={160}
                height={160}
                className="rounded-full w-24 h-24 md:w-40 md:h-40 object-cover"
              />
              <p className="mt-2 text-sm text-white text-center">{artist.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}