'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function SearchBar({
  onSelectVideo,
}: {
  onSelectVideo: (id: string, title: string, artist: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<
    { id: string; name: string; artist: string; image: string; videoId: string }[]
  >([]);
  const [artistResults, setArtistResults] = useState<
    { id: string; name: string; image: string }[]
  >([]);
  const [albumResults, setAlbumResults] = useState<
    { id: string; name: string; image: string }[]
  >([]);

  const handleSearch = async () => {
    if (!query) return;
    try {
      const [tracksRes, artistsRes, albumsRes] = await Promise.all([
        fetch(`/api/spotify/search?query=${encodeURIComponent(query)}&type=track`),
        fetch(`/api/spotify/search?query=${encodeURIComponent(query)}&type=artist`),
        fetch(`/api/spotify/search?query=${encodeURIComponent(query)}&type=album`),
      ]);
      const tracks = tracksRes.ok ? await tracksRes.json() : [];
      const artists = artistsRes.ok ? await artistsRes.json() : [];
      const albums = albumsRes.ok ? await albumsRes.json() : [];
      setResults(tracks);
      setArtistResults(artists);
      setAlbumResults(albums);
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  return (
    <div className="mb-6">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && handleSearch()}
        placeholder="Buscar músicas, artistas ou álbuns..."
        className="w-full rounded bg-gray-700 p-2 text-white"
      />
      {(results.length > 0 || artistResults.length > 0 || albumResults.length > 0) && (
        <div className="mt-2 rounded bg-gray-800 p-4">
          {artistResults.length > 0 && (
            <>
              <h3 className="mb-2 font-semibold">Artistas</h3>
              {artistResults.map(artist => (
                <Link key={artist.id} href={`/artists/${artist.id}`}>
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-700">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                    <p>{artist.name}</p>
                  </div>
                </Link>
              ))}
            </>
          )}
          {albumResults.length > 0 && (
            <>
              <h3 className="mb-2 font-semibold">Álbuns</h3>
              {albumResults.map(album => (
                <Link key={album.id} href={`/albums/${album.id}`}>
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-700">
                    <img
                      src={album.image}
                      alt={album.name}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                    <p>{album.name}</p>
                  </div>
                </Link>
              ))}
            </>
          )}
          {results.length > 0 && (
            <>
              <h3 className="mb-2 font-semibold">Músicas</h3>
              {results.map(track => (
                <div
                  key={track.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-700"
                  onClick={() => onSelectVideo(track.videoId, track.name, track.artist)}
                >
                  <img
                    src={track.image}
                    alt={track.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                  <div>
                    <p>{track.name}</p>
                    <p className="text-sm text-gray-400">{track.artist}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}