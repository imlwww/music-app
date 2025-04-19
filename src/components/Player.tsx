'use client';

import { useState, useEffect, useRef } from 'react';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { updateUserHistory, toggleLikeSong } from '@/lib/appwrite';
import * as Slider from '@radix-ui/react-slider';
import Lyrics from './Lyrics';
import { StopVb } from '../../public/icons/StopVb';
import { PlayVb } from '../../public/icons/PlayVb';
import { SkipNextVb } from '../../public/icons/SkipNext';
import { SkipBackVb } from '../../public/icons/SkipBack';
import { ShuffleVb } from '../../public/icons/Shuffle';
import { ReapeatVb } from '../../public/icons/Repeat';

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
    <div className="fixed bottom-0 left-0 right-0 bg-[#0f0d13] border-t border-white/30 z-50">
  <YouTube videoId={videoId} opts={opts} onReady={onReady} onStateChange={onStateChange} />
  <div className="grid grid-cols-3 justify-between items-center p-4 gap-y-4 w-full  ">

    {/* Música e artista */}
    <div className="grid grid-cols-2">
      <div className='flex items-center gap-4'>
        <img
          src={`https://img.youtube.com/vi/${videoId}/default.jpg`}
          alt={title}
          className="h-[50px] w-[50px] object-cover rounded-xl"
        />
        <div>
          <p className="font-medium text-base text-white">{title}</p>
          <p className="text-sm text-white">{artist}</p>
        </div>
      </div>
      <div className='flex '>
        <button
            onClick={handleLike}
            className={`text-${isLiked ? 'green' : 'gray'}-400 hover:text-${isLiked ? 'green' : 'white'}`}
            aria-label={isLiked ? 'Descurtir' : 'Curtir'}
          >
            <svg className="h-6 w-6" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
      </div>
    </div>

    {/* Player centralizado */}
    <div className="flex flex-col items-center justify-center w-full sm:w-auto">
      <div className="flex items-center gap-4">
      <button
    
        onClick={() => setIsShuffled(!isShuffled)}
           className="hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center"
        aria-label="Aleatório"
      >
        <ShuffleVb className={`fill-${isLooping ? '[#BB66EE]' : 'white'} w-6 h-6`} />
      </button>
        <button
          onClick={onPrevious}
          className="hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center"
          aria-label="Anterior"
        >
          <SkipBackVb className='w-6 h-6 fill-white' />
        </button>
        <button
          onClick={togglePlay}
          className="rounded-full bg-[#BB66EE] p-2 fill-white"
          aria-label={isPlaying ? 'Pausar' : 'Tocar'}
        >
          {isPlaying ? <StopVb className='w-6 h-6' /> : <PlayVb className='w-6 h-6' />}
        </button>
        <button
          onClick={onNext}
          className="hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center"
          aria-label="Próxima"
        >
          <SkipNextVb className='w-6 h-6 fill-white' />
        </button>
        <button
            onClick={() => setIsLooping(!isLooping)}
       className="hover:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center"
        aria-label="Repetir"
      >
        <ReapeatVb className={`fill-${isLooping ? '[#BB66EE]' : 'white'} w-6 h-6`} />
      </button>
      </div>

      {/* Barra de progresso */}
      <div className="mt-2 w-full flex items-center gap-4">
  {/* Tempo atual */}
  <span className="text-sm text-white w-12 text-left">{formatTime(currentTime)}</span>

  {/* Slider centralizado e responsivo */}
  <Slider.Root
    className="flex-grow relative h-5 flex items-center"
    value={[currentTime]}
    max={duration}
    step={0.1}
    onValueChange={handleSeek}
  >
    <Slider.Track className="relative h-[2px] w-full rounded-full bg-[#1b1722]">
      <Slider.Range className="absolute h-[2px] rounded-full bg-[#BB66EE]" />
    </Slider.Track>
    <Slider.Thumb className="block   rounded-full bg-white shadow-md focus:outline-none" />
  </Slider.Root>

  {/* Duração total */}
  <span className="text-sm text-white w-12 text-right">{formatTime(duration)}</span>
</div>

    </div>

    {/* Botões extras */}
    <div className="flex justify-end items-center gap-4">
      
      <button
        onClick={() => setShowLyrics(!showLyrics)}
        className="rounded bg-gray-700 px-4 py-1 text-sm text-white"
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

    {/* Letras */}
    {showLyrics && (
      <div className="w-full mt-4">
        <Lyrics title={title} artist={artist} currentTime={currentTime} />
      </div>
    )}
  </div>
</div>

  );
}