import { NextResponse } from 'next/server';
import axios from 'axios';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID é obrigatório' }, { status: 400 });
  }

  try {
    // Buscar perfil do usuário
    const doc = await databases.listDocuments('67fd7524003dfce963aa', '67fd7529003b9ab4a7e1', [
      Query.equal('userId', userId),
    ]);

    // Inicializar perfil com valores padrão
    const profile = doc.documents[0] || {
      favoriteGenres: '[]',
      favoriteArtists: '[]',
      history: '[]',
      likedSongs: '[]',
      skippedSongs: '[]',
    };

    // Desserializar dados com segurança
    const safeParse = (data: string | undefined): any[] => {
      if (!data) return [];
      try {
        return JSON.parse(data);
      } catch {
        console.error('Erro ao desserializar:', data);
        return [];
      }
    };

    const favoriteGenres = safeParse(profile.favoriteGenres);
    const favoriteArtists = safeParse(profile.favoriteArtists);
    const history = safeParse(profile.history);
    const likedSongs = safeParse(profile.likedSongs);
    const skippedSongs = safeParse(profile.skippedSongs);

    // Definir consultas padrão
    const defaultQueries = [
      'pop hits 2025',
      'rock classics',
      'hip hop trending',
      'eletrônica dance',
      'sertanejo 2025',
    ];

    // Criar consultas com pesos
    const queries = [];
    if (favoriteArtists.length > 0) {
      queries.push(...favoriteArtists.map((artist: string) => `${artist} music`));
    }
    if (likedSongs.length > 0) {
      queries.push(...likedSongs.map((song: any) => `${song.artist} music`));
    }
    if (favoriteGenres.length > 0) {
      queries.push(...favoriteGenres.map((genre: string) => `${genre} music`));
    }
    if (history.length > 0) {
      const recentArtists = [...new Set(history.slice(0, 2).map((h: any) => h.artist))];
      queries.push(...recentArtists.map((artist: string) => `${artist} music`));
    }
    if (queries.length < 5) {
      queries.push(...defaultQueries.slice(0, 5 - queries.length));
    }

    // Buscar vídeos no YouTube
    const recommendations = [];
    for (const query of queries.slice(0, 3)) {
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            q: query,
            type: 'video',
            key: process.env.YOUTUBE_API_KEY,
            maxResults: 5,
          },
        });
        recommendations.push(...(response.data.items || []));
      } catch (apiError) {
        console.error(`Erro ao buscar "${query}" na YouTube API:`, apiError);
        // Continua com outras consultas
      }
    }

    // Filtrar músicas puladas
    const skippedIds = skippedSongs.map((s: any) => s.videoId);
    const filteredRecommendations = recommendations.filter(
      (item: any) => !skippedIds.includes(item.id.videoId)
    );

    // Ordenar com base em relevância
    const sortedRecommendations = filteredRecommendations.sort((a: any, b: any) => {
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

    // Adicionar sugestões "surpresa" se necessário
    if (sortedRecommendations.length < 5) {
      try {
        const surpriseResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            q: defaultQueries[Math.floor(Math.random() * defaultQueries.length)],
            type: 'video',
            key: process.env.YOUTUBE_API_KEY,
            maxResults: 5,
          },
        });
        sortedRecommendations.push(...(surpriseResponse.data.items || []));
      } catch (apiError) {
        console.error('Erro ao buscar sugestões surpresa:', apiError);
      }
    }

    return NextResponse.json(sortedRecommendations.slice(0, 10));
  } catch (error) {
    console.error('Erro na rota /api/recommendations:', error);
    return NextResponse.json([], { status: 200 }); // Retorna array vazio em caso de erro
  }
}