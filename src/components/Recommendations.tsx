'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaPlay } from 'react-icons/fa';

export default function Recommendations({
  userId,
  onSelectVideo,
}: {
  userId: string;
  onSelectVideo: (id: string, title: string, artist: string) => void;
}) {
  const [recommendations, setRecommendations] = useState<
    { id: string; name: string; artist: string; artistId: string; image: string; videoId: string }[]
  >([]);
  const [error, setError] = useState('');
  const [trackPage, setTrackPage] = useState(0);
  const tracksPerPage = 5;

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
          setRecommendations(tracks.filter((track: any) => track.videoId));
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

  const visibleTracks = recommendations.slice(trackPage * tracksPerPage, (trackPage + 1) * tracksPerPage);

  return (
    <div className="mb-6 flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-medium text-white">Músicas Recomendadas</h2>
        <div className="flex items-center space-x-2">
          <button
            disabled={trackPage === 0}
            onClick={() => setTrackPage(p => p - 1)}
            className="p-2 text-white disabled:opacity-50 hover:bg-gray-800 rounded-full"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            disabled={(trackPage + 1) * tracksPerPage >= recommendations.length}
            onClick={() => setTrackPage(p => p + 1)}
            className="p-2 text-white disabled:opacity-50 hover:bg-white/10 rounded-full"
          >
            <FiChevronRight size={24} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:overflow-x-visible">

      {visibleTracks.slice(0, 4).map(track => (
          <div
            key={track.id}
            className="relative cursor-pointer group"
            onClick={() => track.videoId && onSelectVideo(track.videoId, track.name, track.artist)}
          >
            <div className='relative'>
              <img
                src={track.image || '/placeholder.jpg'}
                alt={track.name}
                className="mb-2 w-[132px] h-[132px] sm:w-[264px] sm:h-[264px]  rounded object-cover group-hover:opacity-50"
              />
              <button className="absolute bottom-25 left-1/2 cursor-pointer transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#BB66EE] h-20 w-20 flex items-center justify-center rounded-full">
                <FaPlay size={40} className="text-white" />
              </button>
            </div>
            <p className="text-base font-semibold text-white truncate">{track.name}</p>
            <Link href={`/artists/${track.artistId}`}>
              <p className="text-sm text-white/60 truncate">{track.artist}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}