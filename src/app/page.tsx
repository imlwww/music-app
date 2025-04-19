'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import Onboarding from '@/components/Onboarding';
import Player from '@/components/Player';
import Recommendations from '@/components/Recommendations';
import Playlists from '@/components/Playlists';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SongsGenres } from '@/components/GenêrosDeMúsicas';
import { BarraDePesquisa } from '@/components/Navbar/BarraDePesquisa';
import { ResultadoDePesquisas } from '@/components/ResultadoDePesquisas';
import FavoriteArtists from '@/components/FavoriteArtists';
import RecentlyPlayed from '@/components/RecentlyPlayed';
import NewReleases from '@/components/NewReleases';
import PopularPlaylists from '@/components/PopularPlaylists';
import RecommendedAlbums from '@/components/RecommendedAlbums';
import TopGenres from '@/components/TopGenres';
import { Sidebar } from '@/components/Sidebar';

export default function Home() {
  const [userId, setUserId] = useState('');
  const [videoId, setVideoId] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [queue, setQueue] = useState<
    { videoId: string; title: string; artist: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    { id: string; name: string; artist: string; image: string; videoId: string }[]
  >([]);
  const [artistResults, setArtistResults] = useState<
    { id: string; name: string; image: string }[]
  >([]);
  const [albumResults, setAlbumResults] = useState<
    { id: string; name: string; image: string }[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const user = await getCurrentUser();
      if (user) {
        setUserId(user.$id);
        try {
          const doc = await databases.listDocuments('67fd7524003dfce963aa', '67fd7529003b9ab4a7e1', [
            Query.equal('userId', user.$id),
          ]);
          if (doc.documents.length === 0) {
            // Novo usuário: criar documento e exibir onboarding
            await databases.createDocument(
              '67fd7524003dfce963aa',
              '67fd7529003b9ab4a7e1',
              user.$id,
              {
                userId: user.$id,
                favoriteArtists: '[]',
                favoriteGenres: '[]',
                recentlyPlayed: '[]',
                onboardingCompleted: false,
              }
            );
            setShowOnboarding(true);
          }
          // Usuários existentes: não exibir onboarding
        } catch (err) {
          console.error('Erro ao verificar usuário no Appwrite:', err);
          router.push('/auth/login');
        }
      } else {
        router.push('/auth/login');
      }
    }
    checkUser();
  }, [router]);

  const handleSelectVideo = async (id: string, videoTitle: string, videoArtist: string) => {
    console.log('Selecionando vídeo:', { id, videoTitle, videoArtist });
    setVideoId(id);
    setTitle(videoTitle);
    setArtist(videoArtist);

    // Atualizar recentlyPlayed no Appwrite
    try {
      const doc = await databases.listDocuments('67fd7524003dfce963aa', '67fd7529003b9ab4a7e1', [
        Query.equal('userId', userId),
      ]);
      const profile = doc.documents[0];
      const recentlyPlayed = JSON.parse(profile.recentlyPlayed || '[]');
      recentlyPlayed.unshift({
        id: id,
        name: videoTitle,
        artist: videoArtist,
        videoId: id,
        timestamp: Date.now(),
      });
      await databases.updateDocument('67fd7524003dfce963aa', '67fd7529003b9ab4a7e1', profile.$id, {
        recentlyPlayed: JSON.stringify(recentlyPlayed.slice(0, 10)), // Limita a 10 faixas
      });
    } catch (err) {
      console.error('Erro ao atualizar recentlyPlayed:', err);
    }

    await fetchRelated(id);
  };

  const fetchRelated = async (currentVideoId: string) => {
    if (!currentVideoId) {
      console.log('videoId vazio, buscando recomendações genéricas');
      try {
        const res = await fetch(`/api/related?userId=${userId}`);
        if (res.ok) {
          const related = await res.json();
          console.log('Relacionadas genéricas recebidas:', related);
          setQueue(related);
        } else {
          console.error('Erro na resposta:', res.status);
          setQueue([]);
        }
      } catch (error) {
        console.error('Erro ao buscar relacionadas genéricas:', error);
        setQueue([]);
      }
      return;
    }
    console.log('Buscando relacionadas para videoId:', currentVideoId);
    try {
      const res = await fetch(`/api/related?videoId=${currentVideoId}&userId=${userId}`);
      if (res.ok) {
        const related = await res.json();
        console.log('Relacionadas recebidas:', related);
        setQueue(related);
      } else {
        console.error('Erro na resposta:', res.status);
        setQueue([]);
      }
    } catch (error) {
      console.error('Erro ao buscar relacionadas:', error);
      setQueue([]);
    }
  };

  const handleNext = async () => {
    console.log('Avançando para próxima música. Fila atual:', queue);
    if (queue.length > 0) {
      const next = queue[0];
      setVideoId(next.videoId);
      setTitle(next.title);
      setArtist(next.artist);
      setQueue(queue.slice(1));
      await fetchRelated(next.videoId);
    } else {
      console.log('Fila vazia, buscando novas recomendações');
      setVideoId('');
      setTitle('');
      setArtist('');
      await fetchRelated('');
    }
  };

  const handlePrevious = () => {
    console.log('Voltando para música anterior');
    setVideoId('');
    setTitle('');
    setArtist('');
  };

  const handleSkip = () => {
    console.log('Pulando música');
    handleNext();
  };

  const handleSearchResults = (
    query: string,
    results: { id: string; name: string; artist: string; image: string; videoId: string }[],
    artistResults: { id: string; name: string; image: string }[],
    albumResults: { id: string; name: string; image: string }[]
  ) => {
    setSearchQuery(query);
    setSearchResults(results);
    setArtistResults(artistResults);
    setAlbumResults(albumResults);
  };

  if (!userId) return null;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      {/* Conteúdo Principal */}
      <div className="bg-[#0f0d13] flex flex-col w-full">
        {/* Navbar */}
        <header className="hidden bg-[#0f0d13] border-b border-white/30 sm:flex justify-between p-2 w-full h-[80px]">
          <BarraDePesquisa onSelectVideo={handleSelectVideo} onSearchResults={handleSearchResults} />
          <div className="grid grid-cols-2 items-center gap-2">
            <div className="bg-white rounded-full h-10 w-10"></div>
            <div className="bg-white rounded-full h-10 w-10"></div>
          </div>
        </header>
        {/* Conteúdo principal */}
        <div className="flex flex-col p-4 mx-8 overflow-y-scroll">
          <div className="">
            {showOnboarding ? (
              <Onboarding userId={userId} onComplete={() => setShowOnboarding(false)} />
            ) : searchQuery ? (
              <ResultadoDePesquisas
                searchResults={searchResults}
                artistResults={artistResults}
                albumResults={albumResults}
                handleSelectVideo={handleSelectVideo}
              />
            ) : (
              <>
                <SongsGenres />
                <Recommendations userId={userId} onSelectVideo={handleSelectVideo} />
                <Playlists
                  userId={userId}
                  currentSong={videoId ? { videoId, title, artist } : undefined}
                  onSelectSong={handleSelectVideo}
                />
              </>
            )}
            {videoId && (
              <Player
                videoId={videoId}
                title={title}
                artist={artist}
                userId={userId}
                onSkip={handleSkip}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}