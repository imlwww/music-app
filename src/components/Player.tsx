'use client';

import { useState, useEffect, useRef } from 'react';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { updateUserHistory, toggleLikeSong } from '@/lib/appwrite';
import * as Slider from '@radix-ui/react-slider';
import Lyrics from './Lyrics';

export default function Player({
  videoId,
  title,
  artist,
  userId,
  onSkip,
  onNext,
  onPrevious,
}: {
  videoId: string;
  title: string;
  artist: string;
  userId: string;
  onSkip: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      controls: 0,
    },
  };

  const onReady = (event: { target: YouTubePlayer }) => {
    setPlayer(event.target);
    event.target.setVolume(volume);
    setDuration(event.target.getDuration());
    updateUserHistory(userId, videoId, title, artist);
    event.target.playVideo(); // Tocar automaticamente
  };

  const onStateChange = (event: { data: number }) => {
    setIsPlaying(event.data === 1);
    if (event.data === 1) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(player?.getCurrentTime() || 0);
      }, 1000);
    } else if (event.data === 0 && !isLooping) {
      onNext(); // Chamar próxima música ao acabar
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      player?.pauseVideo();
    } else {
      player?.playVideo();
    }
  };

  const handleLike = async () => {
    await toggleLikeSong(userId, videoId, title, artist, !isLiked);
    setIsLiked(!isLiked);
  };

  const handleVolume = (value: number[]) => {
    setVolume(value[0]);
    player?.setVolume(value[0]);
  };

  const handleSeek = (value: number[]) => {
    player?.seekTo(value[0], true);
    setCurrentTime(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black  border-t border-white/30">
      <YouTube videoId={videoId} opts={opts} onReady={onReady} onStateChange={onStateChange} />
      <div className="grid grid-cols-3 justify-between p-2 w-full">
        <div className="flex items-center">
          <div className="flex items-center gap-4">
            <img
              src={`https://img.youtube.com/vi/${videoId}/default.jpg`}
              alt={title}
              className="h-12 w-12 object-cover rounded-xl"
            />
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-gray-400">{artist}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-4">
              <button
                onClick={onPrevious}
                className="text-gray-300 hover:text-white"
                aria-label="Anterior"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h2v16H6V4zm12 0l-8 8 8 8V4z" />
                </svg>
              </button>
              <button
                onClick={togglePlay}
                className="rounded-full bg-white p-2 text-black"
                aria-label={isPlaying ? 'Pausar' : 'Tocar'}
              >
                {isPlaying ? (
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4l16 8-16 8V4z" />
                  </svg>
                )}
              </button>
              <button
                onClick={onNext}
                className="text-gray-300 hover:text-white"
                aria-label="Próxima"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4l8 8-8 8V4zm10 0h2v16h-2V4z" />
                </svg>
              </button>
            </div>    
            <div className="mt-2 w-full">
              <Slider.Root
                className="relative flex h-5 items-center"
                value={[currentTime]}
                max={duration}
                step={0.1}
                onValueChange={handleSeek}
              >
                <Slider.Track className="relative h-1 flex-grow rounded-full bg-gray-600">
                  <Slider.Range className="absolute h-1 rounded-full bg-blue-500" />
                </Slider.Track>
                <Slider.Thumb className="block h-4 w-4 rounded-full bg-white shadow-md focus:outline-none" />
              </Slider.Root>
              <div className="flex justify-between text-sm text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
        </div>
        <div className='flex justify-end'>
          <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`text-${isLiked ? 'green' : 'gray'}-400 hover:text-${isLiked ? 'green' : 'white'}`}
                aria-label={isLiked ? 'Descurtir' : 'Curtir'}
              >
                <svg className="h-6 w-6" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`text-${isLooping ? 'blue' : 'gray'}-400 hover:text-${isLooping ? 'blue' : 'white'}`}
                aria-label="Repetir"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v4l4-4-4-4v4H4v4H2V4zm0 12h16v-4l4 4-4 4v-4H4v-4H2v4z" />
                </svg>
              </button>
              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={`text-${isShuffled ? 'blue' : 'gray'}-400 hover:text-${isShuffled ? 'blue' : 'white'}`}
                aria-label="Aleatório"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12l-7.5 7.5M3 4h4.5L21 12l-7.5 7.5H3" />
                </svg>
              </button>
              <button
                onClick={() => setShowLyrics(!showLyrics)}
                className="mt-2 rounded bg-gray-700 px-4 py-1 text-sm text-white"
              >
                {showLyrics ? 'Esconder Letras' : 'Mostrar Letras'}
              </button>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v18l15-9L5 3z" />
                </svg>
                <Slider.Root
                  className="relative flex h-5 w-24 items-center"
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolume}
                >
                  <Slider.Track className="relative h-1 flex-grow rounded-full bg-gray-600">
                    <Slider.Range className="absolute h-1 rounded-full bg-blue-500" />
                  </Slider.Track>
                  <Slider.Thumb className="block h-4 w-4 rounded-full bg-white shadow-md focus:outline-none" />
                </Slider.Root>
              </div>
          </div>

        </div>
        {showLyrics && (
          <div className="mt-4">
            <Lyrics title={title} artist={artist} currentTime={currentTime} />
          </div>
        )}
      </div>
    </div>
  );
}