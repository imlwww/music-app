import { NextResponse } from 'next/server';
import axios from 'axios';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let videoId = searchParams.get('videoId');
  const userId = searchParams.get('userId');

  console.log('Recebido /api/related:', { videoId, userId });

  if (!videoId || !userId) {
    console.error('Parâmetros inválidos:', { videoId, userId });
    return NextResponse.json([], { status: 400 });
  }

  try {
    // Buscar perfil do usuário para obter artista favorito
    console.log('Buscando perfil para userId:', userId);
    const doc = await databases.listDocuments('67fd7524003dfce963aa', '67fd7529003b9ab4a7e1', [
      Query.equal('userId', userId),
    ]);
    const profile = doc.documents[0] || {
      favoriteGenres: '[]',
      favoriteArtists: '[]',
      likedSongs: '[]',
      skippedSongs: '[]',
    };
    console.log('Perfil encontrado:', profile);

    const safeParse = (data: string | undefined): any[] => {
      if (!data) return [];
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Erro ao desserializar:', data, e);
        return [];
      }
    };

    const favoriteArtists = safeParse(profile.favoriteArtists);
    const likedSongs = safeParse(profile.likedSongs);
    const skippedSongs = safeParse(profile.skippedSongs);
    console.log('Dados do perfil:', { favoriteArtists, likedSongs, skippedSongs });

    // Buscar metadados do vídeo atual para extrair artista
    console.log('Buscando metadados para videoId:', videoId);
    const videoResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet',
        id: videoId,
        key: process.env.YOUTUBE_API_KEY,
      },
    });
    const video = videoResponse.data.items[0];
    if (!video) {
      console.error('Vídeo não encontrado:', videoId);
      return NextResponse.json([], { status: 404 });
    }
    const artist = video.snippet.channelTitle; // Extrair artista do canal
    console.log('Artista extraído:', artist);

    // Buscar vídeos relacionados usando search.list
    console.log('Buscando vídeos relacionados para artista:', artist);
    const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `músicas de ${artist}`,
        type: 'video',
        videoCategoryId: '10', // Categoria: Música
        key: process.env.YOUTUBE_API_KEY,
        maxResults: 15,
      },
    });
    let relatedVideos = searchResponse.data.items || [];
    console.log('Vídeos relacionados recebidos:', relatedVideos.length);

    // Filtrar vídeos pulados e inválidos
    const skippedIds = skippedSongs.map((s: any) => s.videoId);
    const filteredVideos = relatedVideos.filter(
      (item: any) => item.id?.videoId && !skippedIds.includes(item.id.videoId) && item.id.videoId !== videoId
    );
    console.log('Vídeos após filtro:', filteredVideos.length);

    // Priorizar artistas favoritos
    const sortedVideos = filteredVideos.sort((a: any, b: any) => {
      const aIsFavorite =
        favoriteArtists.includes(a.snippet.channelTitle) ||
        likedSongs.some((s: any) => s.artist === a.snippet.channelTitle)
          ? 1
          : 0;
      const bIsFavorite =
        favoriteArtists.includes(b.snippet.channelTitle) ||
        likedSongs.some((s: any) => s.artist === b.snippet.channelTitle)
          ? 1
          : 0;
      return bIsFavorite - aIsFavorite;
    });

    // Formatar saída
    const formattedVideos = sortedVideos.map((item: any) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
    }));
    console.log('Vídeos formatados:', formattedVideos);

    // Fallback: busca genérica por gênero favorito
    if (formattedVideos.length === 0) {
      console.log('Nenhum vídeo relacionado encontrado, usando busca genérica');
      const genre = safeParse(profile.favoriteGenres)[0] || 'pop';
      const fallbackResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: `${genre} music`,
          type: 'video',
          videoCategoryId: '10',
          key: process.env.YOUTUBE_API_KEY,
          maxResults: 5,
        },
      });
      const fallbackVideos = (fallbackResponse.data.items || []).map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
      }));
      console.log('Vídeos de fallback:', fallbackVideos);
      return NextResponse.json(fallbackVideos);
    }

    return NextResponse.json(formattedVideos.slice(0, 5));
  } catch (error: any) {
    console.error('Erro em /api/related:', error.message, error.response?.data || error);
    // Fallback genérico em caso de erro
    try {
      console.log('Tentando fallback genérico devido a erro');
      const fallbackResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: 'pop music',
          type: 'video',
          videoCategoryId: '10',
          key: process.env.YOUTUBE_API_KEY,
          maxResults: 5,
        },
      });
      const fallbackVideos = (fallbackResponse.data.items || []).map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
      }));
      console.log('Vídeos de fallback (erro):', fallbackVideos);
      return NextResponse.json(fallbackVideos);
    } catch (fallbackError) {
      console.error('Erro no fallback:', fallbackError);
      return NextResponse.json([], { status: 200 });
    }
  }
}