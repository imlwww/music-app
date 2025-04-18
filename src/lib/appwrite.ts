import { Client, Databases, Account, ID, Query } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT! || "https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID! || "677a8142001e3e9ad448");

  export const databases = new Databases(client);
  export const account = new Account(client);
  
  // Função auxiliar para serializar e truncar
  const serializeData = (data: any): string => {
    const serialized = JSON.stringify(data);
    return serialized.length > 255 ? serialized.substring(0, 255) : serialized;
  };
  
  // Função auxiliar para desserializar
  const deserializeData = (data: string | undefined): any => {
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  };
  
  // Autenticação
  export async function registerUser(email: string, password: string) {
    try {
      const user = await account.create(ID.unique(), email, password);
      await createUserProfile(user.$id);
      return user;
    } catch (error) {
      throw new Error('Erro ao registrar usuário: ' + error);
    }
  }
  
  export async function loginUser(email: string, password: string) {
    try {
      await account.createEmailPasswordSession(email, password);
      return await account.get();
    } catch (error) {
      throw new Error('Erro ao fazer login: ' + error);
    }
  }
  
  export async function logoutUser() {
    try {
      await account.deleteSession('current');
    } catch (error) {
      throw new Error('Erro ao fazer logout: ' + error);
    }
  }
  
  export async function getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  }
  
  // Perfil do Usuário
  export async function createUserProfile(userId: string) {
    await databases.createDocument('67fd7524003dfce963aa', '67fd7529003b9ab4a7e1', ID.unique(), {
      userId,
      favoriteGenres: serializeData([]),
      favoriteArtists: serializeData([]),
      history: serializeData([]),
      likedSongs: serializeData([]),
      skippedSongs: serializeData([]),
    });
  }
  
  export async function updateUserHistory(userId: string, videoId: string, title: string, artist: string) {
    const doc = await databases.listDocuments('67fd7524003dfce963aa', '67fd7529003b9ab4a7e1', [
      Query.equal('userId', userId),
    ]);
    if (doc.documents.length === 0) {
      await createUserProfile(userId);
    }
    const profile = doc.documents[0] || { history: serializeData([]) };
    const history = deserializeData(profile.history);
    history.unshift({ videoId, title, artist, timestamp: Date.now() });
    await databases.updateDocument('67fd7524003dfce963aa', '67fd7529003b9ab4a7e1', profile.$id, {
      history: serializeData(history.slice(0, 10)), // Limita para evitar estouro
    });
  }
  
  export async function updateUserPreferences(userId: string, genres: string[], artists: string[]) {
    const doc = await databases.listDocuments('67fd7524003dfce963aa', '67fd7529003b9ab4a7e1', [
      Query.equal('userId', userId),
    ]);
    if (doc.documents.length === 0) {
      await createUserProfile(userId);
    }
    await databases.updateDocument('67fd7524003dfce963aa', '67fd7529003b9ab4a7e1', doc.documents[0].$id, {
      favoriteGenres: serializeData(genres),
      favoriteArtists: serializeData(artists),
    });
  }
  
  export async function toggleLikeSong(userId: string, videoId: string, title: string, artist: string, like: boolean) {
    const doc = await databases.listDocuments('67fd7524003dfce963aa', '67fd7529003b9ab4a7e1', [
      Query.equal('userId', userId),
    ]);
    if (doc.documents.length === 0) {
      await createUserProfile(userId);
    }
    const profile = doc.documents[0];
    const likedSongs = deserializeData(profile.likedSongs);
    const skippedSongs = deserializeData(profile.skippedSongs);
    if (like) {
      likedSongs.push({ videoId, title, artist });
      const index = skippedSongs.findIndex((s: any) => s.videoId === videoId);
      if (index !== -1) skippedSongs.splice(index, 1);
    } else {
      skippedSongs.push({ videoId, title, artist });
      const index = likedSongs.findIndex((s: any) => s.videoId === videoId);
      if (index !== -1) likedSongs.splice(index, 1);
    }
    await databases.updateDocument('67fd7524003dfce963aa', '67fd7529003b9ab4a7e1', profile.$id, {
      likedSongs: serializeData(likedSongs.slice(0, 5)), // Limita para evitar estouro
      skippedSongs: serializeData(skippedSongs.slice(0, 5)),
    });
  }
  
  export async function createPlaylist(userId: string, name: string) {
    try {
      const doc = await databases.createDocument('67fd7524003dfce963aa', '67fd8d670029d91da30e', ID.unique(), {
        userId,
        name,
        songs: serializeData([]),
      });
      return doc;
    } catch (error) {
      throw new Error('Erro ao criar playlist: ' + (error as any).message);
    }
  }
  
  export async function addSongToPlaylist(playlistId: string, song: { videoId: string; title: string; artist: string }) {
    try {
      const doc = await databases.getDocument('67fd7524003dfce963aa', '67fd8d670029d91da30e', playlistId);
      const songs = deserializeData(doc.songs);
      songs.push(song);
      await databases.updateDocument('67fd7524003dfce963aa', '67fd8d670029d91da30e', playlistId, {
        songs: serializeData(songs.slice(0, 10)), // Limite de 10 músicas
      });
    } catch (error) {
      throw new Error('Erro ao adicionar música à playlist: ' + (error as any).message);
    }
  }
  
  export async function getUserPlaylists(userId: string) {
    try {
      const docs = await databases.listDocuments('67fd7524003dfce963aa', '67fd8d670029d91da30e', [
        Query.equal('userId', userId),
      ]);
      return docs.documents;
    } catch (error) {
      throw new Error('Erro ao buscar playlists: ' + (error as any).message);
    }
  }