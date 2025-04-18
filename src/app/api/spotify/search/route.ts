import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { spotifyRequest } from '@/lib/spotify';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const type = searchParams.get('type') || 'track';

  if (!query) {
    return NextResponse.json({ error: 'Query obrigatória' }, { status: 400 });
  }

  const cacheKey = `youtube:search:${query}:${type}`;
  const cached = await kv.get(cacheKey);
  if (cached) {
    console.log('Retornando do cache:', cacheKey);
    return NextResponse.json(cached);
  }

  try {
    const search = await spotifyRequest<{
      tracks?: { items: { id: string; name: string; artists: { name: string }[]; album: { images: { url: string }[] } }[] };
      artists?: { items: { id: string; name: string; images: { url: string }[] }[] };
      albums?: { items: { id: string; name: string; images: { url: string }[] }[] };
    }>(`/search?q=${encodeURIComponent(query)}&type=${type}&limit=10`);

    if (type === 'track') {
      const tracks = search.tracks?.items || [];
      const results = await Promise.all(
        tracks.map(async track => {
          const youtubeCacheKey = `youtube:video:${track.name}:${track.artists[0].name}`;
          const cachedVideo = await kv.get(youtubeCacheKey);
          if (cachedVideo) {
            return cachedVideo;
          }

          const youtubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
              part: 'snippet',
              q: `${track.name} ${track.artists[0].name}`,
              type: 'video',
              videoCategoryId: '10',
              key: process.env.YOUTUBE_API_KEY,
            },
          }).catch(error => {
            console.error(`Erro YouTube para ${track.name}:`, error.response?.data || error.message);
            return { data: { items: [] } }; // Fallback
          });

          const videoId = youtubeResponse.data.items[0]?.id.videoId || '';
          const result = {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            image: track.album.images[0]?.url || '',
            videoId,
          };
          await kv.set(youtubeCacheKey, result, { ex: 86400 }); // Cache por 24h
          return result;
        })
      );
      await kv.set(cacheKey, results, { ex: 3600 }); // Cache por 1h
      return NextResponse.json(results);
    } else if (type === 'artist') {
      const results = search.artists?.items.map(artist => ({
        id: artist.id,
        name: artist.name,
        image: artist.images[0]?.url || '',
      })) || [];
      await kv.set(cacheKey, results, { ex: 3600 });
      return NextResponse.json(results);
    } else if (type === 'album') {
      const results = search.albums?.items.map(album => ({
        id: album.id,
        name: album.name,
        image: album.images[0]?.url || '',
      })) || [];
      await kv.set(cacheKey, results, { ex: 3600 });
      return NextResponse.json(results);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Erro ao buscar no Spotify:', error);
    return NextResponse.json({ error: 'Falha ao buscar' }, { status: 500 });
  }
}