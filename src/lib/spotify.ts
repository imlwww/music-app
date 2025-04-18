import axios from 'axios';

let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

export async function getSpotifyAccessToken(): Promise<string> {
  if (accessToken && tokenExpiresAt > Date.now()) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    accessToken = response.data.access_token;
    tokenExpiresAt = Date.now() + response.data.expires_in * 1000 - 60000; // Expira 1min antes
    console.log('Novo token Spotify obtido');
    return accessToken;
  } catch (error) {
    console.error('Erro ao obter token Spotify:', error);
    throw new Error('Falha ao autenticar com Spotify');
  }
}

export async function spotifyRequest<T>(endpoint: string): Promise<T> {
  const token = await getSpotifyAccessToken();
  try {
    const response = await axios.get(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro na requisição Spotify (${endpoint}):`, error);
    throw error;
  }
}