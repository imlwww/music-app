import axios from 'axios';

export interface Lyrics {
  plainLyrics: string;
  syncedLyrics?: string;
}

export async function fetchLyrics(title: string, artist: string): Promise<Lyrics | null> {
  try {
    const response = await axios.get('https://lrclib.net/api/search', {
      params: {
        q: `${artist} ${title}`,
      },
    });
    if (response.data && response.data.length > 0) {
      const track = response.data[0];
      return {
        plainLyrics: track.plainLyrics || 'Letra não disponível',
        syncedLyrics: track.syncedLyrics || undefined,
      };
    }
    return { plainLyrics: 'Ainda estamos aprendendo essas músicas', syncedLyrics: undefined };
  } catch (error) {
    console.error('Erro ao buscar letras:', error);
    return { plainLyrics: 'Erro ao carregar letra', syncedLyrics: undefined };
  }
}