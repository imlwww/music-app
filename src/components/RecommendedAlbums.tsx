'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { SpotifyAlbum } from '@/types/spotify';

export default function RecommendedAlbums({
  userId,
}: {
  userId: string;
}) {
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRecommendedAlbums() {
      try {
        const doc = await databases.listDocuments('67fd7524003dfce963aa', '67fd7529003b9ab4a7e1', [
          Query.equal('userId', userId),
        ]);
        const favoriteArtists = JSON.parse(doc.documents[0].favoriteArtists || '[]');
        const favoriteGenres = JSON.parse(doc.documents[0].favoriteGenres || '[]');
        const seed = favoriteArtists[0] || favoriteGenres[0] || 'pop';

        const res = await fetch(`/api/spotify/recommendations?seed=${encodeURIComponent(seed)}&type=album`);
        if (res.ok) {
          const data = await res.json();
          setAlbums(data);
        } else {
          setError('Falha ao carregar álbuns recomendados');
        }
      } catch (err) {
        console.error('Erro em RecommendedAlbums:', err);
        setError('Erro ao buscar álbuns');
      }
    }
    fetchRecommendedAlbums();
  }, [userId]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!albums.length) return <div className="text-white">Carregando...</div>;

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-2xl font-bold text-white">Álbuns Recomendados</h2>
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