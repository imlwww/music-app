'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

export default function Recommendations({
  userId,
  onSelectVideo,
}: {
  userId: string;
  onSelectVideo: (id: string, title: string, artist: string) => void;
}) {
  const [recommendations, setRecommendations] = useState<
    { id: string; name: string; artist: string; image: string; videoId: string }[]
  >([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const doc = await databases.listDocuments('67fd7524003dfce963aa', '67fd7529003b9ab4a7e1', [
          Query.equal('userId', userId),
        ]);
        const profile = doc.documents[0];
        const favoriteArtists = JSON.parse(profile.favoriteArtists || '[]');
        const favoriteGenres = JSON.parse(profile.favoriteGenres || '[]');

        const query = favoriteArtists[0] || favoriteGenres[0] || 'pop';
        const res = await fetch(`/api/spotify/search?query=${encodeURIComponent(query)}&type=track`);
        if (res.ok) {
          const tracks = await res.json();
          setRecommendations(tracks.filter((track: any) => track.videoId)); // Filtra faixas sem videoId
        } else {
          setError('Falha ao carregar recomendações');
        }
      } catch (err) {
        console.error('Erro em Recommendations:', err);
        setError('Erro ao buscar recomendações');
      }
    }
    fetchRecommendations();
  }, [userId]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!recommendations.length) return <div className="text-white">Carregando...</div>;

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-2xl font-bold text-white">Recomendações</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {recommendations.map(track => (
          <div key={track.id}>
            <div
              className="cursor-pointer rounded-lg bg-gray-700 p-4 hover:bg-gray-600"
              onClick={() => track.videoId && onSelectVideo(track.videoId, track.name, track.artist)}
            >
              <Image
                src={track.image}
                alt={track.name}
                width={150}
                height={150}
                className="mb-2 rounded"
              />
              <p className="font-semibold text-white">{track.name}</p>
              <Link href={`/artists/${track.id}`}>
                <p className="text-sm text-gray-400 underline">{track.artist}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}