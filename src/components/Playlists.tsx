'use client';

import { useState, useEffect } from 'react';
import { createPlaylist, addSongToPlaylist, getUserPlaylists } from '@/lib/appwrite';

export default function Playlists({
  userId,
  currentSong,
  onSelectSong,
}: {
  userId: string;
  currentSong?: { videoId: string; title: string; artist: string };
  onSelectSong: (videoId: string, title: string, artist: string) => void;
}) {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const data = await getUserPlaylists(userId);
        setPlaylists(data);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchPlaylists();
  }, [userId]);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName) {
      setError('Digite um nome para a playlist');
      return;
    }
    try {
      await createPlaylist(userId, newPlaylistName);
      setNewPlaylistName('');
      setError('');
      const data = await getUserPlaylists(userId);
      setPlaylists(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddSong = async (playlistId: string) => {
    if (!currentSong) return;
    try {
      await addSongToPlaylist(playlistId, currentSong);
      setError('');
      const data = await getUserPlaylists(userId);
      setPlaylists(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="mb-4 text-2xl font-bold">Suas Playlists</h2>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="Nome da playlist"
          className="rounded bg-gray-700 p-2 text-white"
        />
        <button
          onClick={handleCreatePlaylist}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Criar
        </button>
      </div>
      {playlists.length === 0 && (
        <p className="text-gray-400">Nenhuma playlist criada.</p>
      )}
      <div className="grid gap-4">
        {playlists.map((playlist) => {
          const songs = JSON.parse(playlist.songs || '[]');
          return (
            <div key={playlist.$id} className="rounded-lg bg-gray-700 p-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold">{playlist.name}</h3>
                {currentSong && (
                  <button
                    onClick={() => handleAddSong(playlist.$id)}
                    className="rounded bg-green-500 px-2 py-1 text-sm text-white"
                  >
                    Adicionar Música
                  </button>
                )}
              </div>
              {songs.length === 0 ? (
                <p className="text-gray-400">Nenhuma música na playlist.</p>
              ) : (
                <ul className="mt-2">
                  {songs.map((song: any, index: number) => (
                    <li
                      key={index}
                      className="cursor-pointer p-2 hover:bg-gray-600"
                      onClick={() =>
                        onSelectSong(song.videoId, song.title, song.artist)
                      }
                    >
                      {song.title} - {song.artist}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}