import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { spotifyRequest } from '@/lib/spotify';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const seed = searchParams.get('seed');
  const type = searchParams.get('type') || 'track';

  if (!seed) {
    return NextResponse.json({ error: 'Seed obrigatório' }, { status: 400 });
  }

  const cacheKey = `spotify:recommendations:${seed}:${type}`;
  const cached = await kv.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const response = await spotifyRequest(`/recommendations?seed_genres=${encodeURIComponent(seed)}&limit=10`);
    let results: any[] = [];

    if (type === 'track') {
      results = await Promise.all(
        response.tracks.map(async (track: any) => {
          const youtubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
              part: 'snippet',
              q: `${track.name} ${track.artists[0].name}`,
              type: 'video',
              videoCategoryId: '10',
              key: process.env.YOUTUBE_API_KEY,
            },
          }).catch(() => ({ data: { items: [] } }));
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            artistId: track.artists[0].id,
            image: track.album.images[0]?.url || '',
            videoId: youtubeResponse.data.items[0]?.id.videoId || '',
          };
        })
      );
    } else if (type === 'album') {
      results = response.tracks.map((track: any) => ({
        id: track.album.id,
        name: track.album.name,
        image: track.album.images[0]?.url || '',
      }));
    }

    await kv.set(cacheKey, results, { ex: 3600 });
    return NextResponse.json(results);
  } catch (error) {
    console.error('Erro em recommendations:', error);
    return NextResponse.json({ error: 'Falha ao buscar recomendações' }, { status: 500 });
  }
}