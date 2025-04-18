'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AlbumPage({ params }: { params: { id: string } }) {
  const [album, setAlbum] = useState<{
    id: string;
    name: string;
    image: string;
    artists: { id: string; name: string }[];
    release_date: string;
    tracks: { id: string; name: string; duration_ms: number; artists: string[] }[];
  } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const res = await fetch(`/api/album?id=${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setAlbum(data);
        } else {
          setError('Falha ao carregar álbum');
        }
      } catch (err) {
        setError('Erro ao buscar álbum');
      }
    }
    fetchAlbum();
  }, [params.id]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!album) return <div>Carregando...</div>;

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-3xl font-bold">{album.name}</h1>
      <div className="flex gap-6">
        <Image src={album.image} alt={album.name} width={200} height={200} className="rounded" />
        <div>
          <p className="text-gray-400">
            Artistas:{' '}
            {album.artists.map(artist => (
              <Link key={artist.id} href={`/artists/${artist.id}`} className="underline">
                {artist.name}
              </Link>
            ))}
          </p>
          <p className="text-gray-400">Lançamento: {album.release_date}</p>
        </div>
      </div>
      <h2 className="mt-6 text-2xl font-bold">Faixas</h2>
      <div className="mt-4">
        {album.tracks.map(track => (
          <div
            key={track.id}
            className="flex justify-between rounded p-2 hover:bg-gray-700"
            onClick={async () => {
              const res = await fetch(
                `/api/spotify/search?query=${encodeURIComponent(`${track.name} ${track.artists[0]}`)}&type=track`
              );
              if (res.ok) {
                const tracks = await res.json();
                const selected = tracks[0];
                if (selected?.videoId) {
                  window.dispatchEvent(
                    new CustomEvent('selectVideo', {
                      detail: {
                        id: selected.videoId,
                        title: selected.name,
                        artist: selected.artist,
                      },
                    })
                  );
                }
              }
            }}
          >
            <div>
              <p className="font-semibold">{track.name}</p>
              <p className="text-sm text-gray-400">{track.artists.join(', ')}</p>
            </div>
            <p className="text-gray-400">{formatDuration(track.duration_ms)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}