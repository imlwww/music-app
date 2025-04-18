'use client';

import { useState } from 'react';
import { updateUserPreferences } from '@/lib/appwrite';

export default function Onboarding({
  userId,
  onComplete,
}: {
  userId: string;
  onComplete: () => void;
}) {
  const [genres, setGenres] = useState<string[]>([]);
  const [artists, setArtists] = useState<string[]>([]);

  const availableGenres = ['Pop', 'Rock', 'Hip Hop', 'Eletrônica', 'Sertanejo', 'Clássica'];
  const exampleArtists = ['Dua Lipa', 'Queen', 'Drake', 'The Weeknd', 'AnnenMayKantereit', 'Ludovico Einaudi'];

  const toggleGenre = (genre: string) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const toggleArtist = (artist: string) => {
    setArtists((prev) =>
      prev.includes(artist) ? prev.filter((a) => a !== artist) : [...prev, artist]
    );
  };

  const handleSubmit = async () => {
    await updateUserPreferences(userId, genres, artists);
    onComplete();
  };

  return (
    <div className="rounded-lg bg-gray-800 p-6">
      <h2 className="mb-4 text-2xl font-bold">Bem-vindo! Escolha suas preferências</h2>
      <div className="mb-4">
        <h3 className="mb-2 text-lg">Gêneros</h3>
        <div className="flex flex-wrap gap-2">
          {availableGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`rounded px-3 py-1 ${
                genres.includes(genre) ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="mb-2 text-lg">Artistas</h3>
        <div className="flex flex-wrap gap-2">
          {exampleArtists.map((artist) => (
            <button
              key={artist}
              onClick={() => toggleArtist(artist)}
              className={`rounded px-3 py-1 ${
                artists.includes(artist) ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              {artist}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="rounded bg-green-500 px-4 py-2 text-white"
      >
        Concluir
      </button>
    </div>
  );
}