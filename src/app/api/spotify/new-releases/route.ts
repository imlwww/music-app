import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { spotifyRequest } from '@/lib/spotify';

export async function GET() {
  const cacheKey = 'spotify:new-releases';
  const cached = await kv.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const response = await spotifyRequest('/browse/new-releases?limit=10');
    const albums = response.albums.items.map((album: any) => ({
      id: album.id,
      name: album.name,
      image: album.images[0]?.url || '',
    }));
    await kv.set(cacheKey, albums, { ex: 3600 });
    return NextResponse.json(albums);
  } catch (error) {
    console.error('Erro em new-releases:', error);
    return NextResponse.json({ error: 'Falha ao buscar lançamentos' }, { status: 500 });
  }
}