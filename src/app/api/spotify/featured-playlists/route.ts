import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { spotifyRequest } from '@/lib/spotify';

export async function GET() {
  const cacheKey = 'spotify:featured-playlists';
  const cached = await kv.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const response = await spotifyRequest('/browse/featured-playlists?limit=10');
    const playlists = response.playlists.items.map((playlist: any) => ({
      id: playlist.id,
      name: playlist.name,
      image: playlist.images[0]?.url || '',
      description: playlist.description || '',
    }));
    await kv.set(cacheKey, playlists, { ex: 3600 });
    return NextResponse.json(playlists);
  } catch (error) {
    console.error('Erro em featured-playlists:', error);
    return NextResponse.json({ error: 'Falha ao buscar playlists' }, { status: 500 });
  }
}