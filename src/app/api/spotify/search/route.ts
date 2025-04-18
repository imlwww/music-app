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
          // Buscar videoId no YouTube
          const youtubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
              part: 'snippet',
              q: `${track.name} ${track.artists[0].name}`,
              type: 'video',
              videoCategoryId: '10',
              key: process.env.YOUTUBE_API_KEY,
            },
          });
          const videoId = youtubeResponse.data.items[0]?.id.videoId || '';
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            image: track.album.images[0]?.url || '',
            videoId,
          };
        })
      );
      return NextResponse.json(results);
    } else if (type === 'artist') {
      return NextResponse.json(
        search.artists?.items.map(artist => ({
          id: artist.id,
          name: artist.name,
          image: artist.images[0]?.url || '',
        })) || []
      );
    } else if (type === 'album') {
      return NextResponse.json(
        search.albums?.items.map(album => ({
          id: album.id,
          name: album.name,
          image: album.images[0]?.url || '',
        })) || []
      );
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Erro ao buscar no Spotify:', error);
    return NextResponse.json({ error: 'Falha ao buscar' }, { status: 500 });
  }
}