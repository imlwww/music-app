'use client';

import { useEffect } from 'react';
import DiscordRPC from 'discord-rpc';

export default function DiscordPresence({
  title,
  artist,
  isPlaying,
}: {
  title: string;
  artist: string;
  isPlaying: boolean;
}) {
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '';
    const rpc = new DiscordRPC.Client({ transport: 'ipc' });

    rpc.on('ready', () => {
      if (title && artist) {
        rpc.setActivity({
          details: title,
          state: artist,
          startTimestamp: isPlaying ? Date.now() : undefined,
          largeImageKey: 'youtube',
          largeImageText: 'YouTube Music',
        });
      }
    });

    rpc.login({ clientId }).catch(console.error);

    return () => {
      rpc.destroy();
    };
  }, [title, artist, isPlaying]);

  return null;
}
