'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { RecentlyPlayedTrack, SpotifyTrack } from '@/types/spotify';

export default function RecentlyPlayed({
  userId,
  onSelectVideo,
}: {
  userId: string;
  onSelectVideo: (id: string, title: string, artist: string) => void;
}) {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRecentlyPlayed() {
      try {
        const doc = await databases.listDocuments('67fd7524003dfce963aa', '67fd7529003b9ab4a7e1', [
          Query.equal('userId', userId),
        ]);
        const recentlyPlayed: RecentlyPlayedTrack[] = JSON.parse(doc.documents[0].recentlyPlayed || '[]');
        const sortedTracks = recentlyPlayed
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 4);

        const results = await Promise.all(
          sortedTracks.map(async track => {
            const res = await fetch(`/api/spotify/search?query=${encodeURIComponent(`${track.name} ${track.artist}`)}&type=track`);
            if (res.ok) {
              const data = await res.json();
              return data[0] || { id: track.id, name: track.name, artist: track.artist, image: '', videoId: track.videoId };
            }
            return { id: track.id, name: track.name, artist: track.artist, image: '', videoId: track.videoId };
          })
        );
        setTracks(results);
      } catch (err) {
        console.error('Erro em RecentlyPlayed:', err);
        setError('Erro ao buscar músicas recentes');
      }
    }
    fetchRecentlyPlayed();
  }, [userId]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!tracks.length) return null;

  return (
    <div className="mb-6">
      <h2 className="mb-4 text-2xl font-bold text-white">Tocadas Recentemente</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {tracks.map(track => (
          <div
            key={track.id}
            className="cursor-pointer p-2 hover:bg-neutral-800 rounded"
            onClick={() => track.videoId && onSelectVideo(track.videoId, track.name, track.artist)}
          >
            <img
              src={track.image || '/placeholder.jpg'}
              alt={track.name}
              width={120}
              height={120}
              className="rounded w-20 h-20 md:w-32 md:h-32 object-cover"
            />
            <p className="mt-2 text-sm text-white">{track.name}</p>
            <p className="text-xs text-gray-400">{track.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
}