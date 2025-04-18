'use client';

import { useState, useEffect } from 'react';
import { fetchLyrics } from '@/lib/lyrics';

export interface Lyrics {
  plainLyrics: string;
  syncedLyrics?: string;
}

export default function Lyrics({
  title,
  artist,
  currentTime,
}: {
  title: string;
  artist: string;
  currentTime: number;
}) {
  const [lyrics, setLyrics] = useState<Lyrics | null>(null);

  useEffect(() => {
    async function loadLyrics() {
      const result = await fetchLyrics(title, artist);
      setLyrics(result);
    }
    loadLyrics();
  }, [title, artist]);

  if (!lyrics) {
    return <p className="text-gray-400">Carregando letras...</p>;
  }

  // Processar letras sincronizadas (se disponíveis)
  const getCurrentLine = () => {
    if (!lyrics.syncedLyrics) {
      return lyrics.plainLyrics;
    }
    const lines = lyrics.syncedLyrics.split('\n').map((line) => {
      const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
      if (!match) return null;
      const minutes = parseInt(match[1]);
      const seconds = parseFloat(match[2]);
      const time = minutes * 60 + seconds;
      return { time, text: match[3].trim() };
    }).filter(Boolean);
    
    const current = lines.find((line, i) => {
      const nextTime = lines[i + 1]?.time || Infinity;
      return line && currentTime >= line.time && currentTime < nextTime;
    });
    return current ? current.text : '';
  };

  return (
    <div className="max-h-64 overflow-y-auto rounded-lg bg-gray-800 p-4">
      <h3 className="mb-2 text-lg font-semibold">Letras</h3>
      {lyrics.syncedLyrics ? (
        <p className="text-lg font-bold text-blue-400">{getCurrentLine()}</p>
      ) : (
        <pre className="whitespace-pre-wrap text-sm">{lyrics.plainLyrics}</pre>
      )}
    </div>
  );
}