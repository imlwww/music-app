'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CiSearch } from "react-icons/ci";

export function BarraDePesquisa({
  onSelectVideo,
  onSearchResults,
}: {
  onSelectVideo: (videoId: string, title: string, artist: string) => void;
  onSearchResults: (
    query: string,
    results: { id: string; name: string; artist: string; image: string; videoId: string }[],
    artistResults: { id: string; name: string; image: string }[],
    albumResults: { id: string; name: string; image: string }[]
  ) => void;
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
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async () => {
    if (!query) {
      setResults([]);
      setArtistResults([]);
      setAlbumResults([]);
      onSearchResults('', [], [], []);
      return;
    }

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
      onSearchResults(query, tracks, artists, albums);
    } catch (error) {
      console.error('Erro na busca:', error);
      setResults([]);
      setArtistResults([]);
      setAlbumResults([]);
      onSearchResults(query, [], [], []);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <>
      <div className="relative border w-[375px] h-[48px] flex items-center px-2 border-white/30 rounded-lg">
        <CiSearch size={30} />
        <input
          className="focus:outline-none w-full ml-4 bg-transparent text-white"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar músicas, artistas ou álbuns..."
          type="search"
        />
      </div>
      {/* {(results.length > 0 || artistResults.length > 0 || albumResults.length > 0) && (
        <div className="w-full max-w-3xl h-auto mt-2 absolute z-10 top-[60px] left-[290px] rounded bg-gray-800 p-4">
          {artistResults.length > 0 && (
            <>
              <h3 className="mb-2 font-semibold text-white">Artistas</h3>
              <div className="grid grid-cols-4 gap-4">
                {artistResults.map(artist => (
                  <Link key={artist.id} href={`/artists/${artist.id}`}>
                    <div className="flex flex-col items-center gap-2 p-2 hover:bg-gray-700 rounded">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        width={120}
                        height={120}
                        className="rounded-full object-cover"
                      />
                      <p className="text-white text-sm">{artist.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
          {results.length > 0 && (
            <>
              <h3 className="mb-2 font-semibold text-white">Músicas</h3>
              <div className="grid grid-cols-4 gap-4">
                {results.map(track => (
                  <div
                    key={track.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
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
                      <p className="text-white">{track.name}</p>
                      <p className="text-sm text-gray-400">{track.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {albumResults.length > 0 && (
            <>
              <h3 className="mb-2 font-semibold text-white">Álbuns</h3>
              <div className="grid grid-cols-4 gap-4">
                {albumResults.map(album => (
                  <Link key={album.id} href={`/albums/${album.id}`}>
                    <div className="flex flex-col items-center gap-2 p-2 hover:bg-gray-700 rounded">
                      <img
                        src={album.image}
                        alt={album.name}
                        width={120}
                        height={120}
                        className="rounded object-cover"
                      />
                      <p className="text-white text-sm">{album.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )} */}
    </>
  );
}