import { NextResponse } from 'next/server';
import { spotifyRequest } from '@/lib/spotify';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID do álbum obrigatório' }, { status: 400 });
  }

  try {
    const album = await spotifyRequest<{
      id: string;
      name: string;
      images: { url: string }[];
      artists: { id: string; name: string }[];
      release_date: string;
      tracks: {
        items: { id: string; name: string; duration_ms: number; artists: { name: string }[] }[];
      };
    }>(`/albums/${id}`);

    return NextResponse.json({
      id: album.id,
      name: album.name,
      image: album.images[0]?.url || '',
      artists: album.artists.map(artist => ({ id: artist.id, name: artist.name })),
      release_date: album.release_date,
      tracks: album.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        duration_ms: track.duration_ms,
        artists: track.artists.map(a => a.name),
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar álbum:', error);
    return NextResponse.json({ error: 'Falha ao buscar álbum' }, { status: 500 });
  }
}