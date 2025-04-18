import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json([], { status: 400 });
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        key: process.env.YOUTUBE_API_KEY,
        maxResults: 10,
      },
    });
    return NextResponse.json(response.data.items);
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    return NextResponse.json([], { status: 200 });
  }
}