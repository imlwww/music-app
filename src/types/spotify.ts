export interface SpotifyTrack {
    id: string;
    name: string;
    artist: string;
    artistId?: string;
    image: string;
    videoId: string;
    album?: string;
    duration_ms?: number;
  }
  
  export interface SpotifyArtist {
    id: string;
    name: string;
    image: string;
  }
  
  export interface SpotifyAlbum {
    id: string;
    name: string;
    image: string;
  }
  
  export interface SpotifyPlaylist {
    id: string;
    name: string;
    image: string;
    description: string;
  }
  
  export interface RecentlyPlayedTrack {
    id: string;
    name: string;
    artist: string;
    videoId: string;
    timestamp: number;
  }