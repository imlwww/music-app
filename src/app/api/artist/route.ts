import { NextResponse } from 'next/server';
import { spotifyRequest } from '@/lib/spotify';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID do artista obrigatório' }, { status: 400 });
  }

  try {
    const artist = await spotifyRequest<{
      id: string;
      name: string;
      images: { url: string }[];
      genres: string[];
      popularity: number;
      followers: { total: number };
    }>(`/artists/${id}`);

    const albums = await spotifyRequest<{
      items: { id: string; name: string; images: { url: string }[]; release_date: string }[];
    }>(`/artists/${id}/albums?limit=10`);

    return NextResponse.json({
      id: artist.id,
      name: artist.name,
      image: artist.images[0]?.url || '',
      genres: artist.genres,
      popularity: artist.popularity,
      followers: artist.followers.total,
      albums: albums.items.map(album => ({
        id: album.id,
        name: album.name,
        image: album.images[0]?.url || '',
        release_date: album.release_date,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar artista:', error);
    return NextResponse.json({ error: 'Falha ao buscar artista' }, { status: 500 });
  }
}