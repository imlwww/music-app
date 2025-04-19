import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { spotifyRequest } from '@/lib/spotify';

export async function GET() {
  const cacheKey = 'spotify:genre-seeds';
  const cached = await kv.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const response = await spotifyRequest('/recommendations/available-genre-seeds');
    const genres = response.genres;
    await kv.set(cacheKey, genres, { ex: 86400 });
    return NextResponse.json(genres);
  } catch (error) {
    console.error('Erro em available-genre-seeds:', error);
    return NextResponse.json({ error: 'Falha ao buscar gêneros' }, { status: 500 });
  }
}