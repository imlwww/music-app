"use client";
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { PiMicrophoneStageFill } from 'react-icons/pi';
import { GiHearts } from 'react-icons/gi';
import { FaPlay } from 'react-icons/fa';
import { HiDotsHorizontal } from 'react-icons/hi';

interface Resultado {
  id: string;
  name: string;
  artist: string;
  image: string;
  videoId: string;
}

interface ArtistaOuAlbum {
  id: string;
  name: string;
  image: string;
}

interface Props {
  artistResults: ArtistaOuAlbum[];
  searchResults: Resultado[];
  albumResults: ArtistaOuAlbum[];
  handleSelectVideo: (id: string, title: string, artist: string) => Promise<void>;
}

import { useState } from 'react';

export function ResultadoDePesquisas({
  artistResults,
  searchResults,
  albumResults,
  handleSelectVideo,
}: Props) {

  const [artistPage, setArtistPage] = useState(0);
  const artistsPerPage = 5;

  const visibleArtists = artistResults.slice(artistPage * artistsPerPage, (artistPage + 1) * artistsPerPage);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-white mb-4">Resultados da Busca</h2>
      {searchResults.length > 0 && (
        <div className="flex flex-col gap-y-4">
          <div className="flex space-x-4 items-center pb-5">
            <h1 className="text-xl text-white font-bold">Músicas</h1>
            <button className="rounded-lg border text-xs font-bold border-white px-3 py-2 text-white">
              Visualizar Tudo
            </button>
          </div>
          <div className="hidden md:flex justify-between items-center pb-4 border-b border-neutral-600">
            <h1 className="uppercase text-xs text-neutral-600">Músicas</h1>
            <div className="flex items-center space-x-20">
              <h1 className="uppercase text-xs text-neutral-600">Álbum</h1>
              <h1 className="uppercase text-xs text-neutral-600">Tempo</h1>
            </div>
          </div>
          <div className="flex flex-col">
            {searchResults.map(track => (
              <div
                key={track.id}
                className="flex items-center justify-between py-2 hover:bg-neutral-800 rounded"
                onClick={() => handleSelectVideo(track.videoId, track.name, track.artist)}
              >
                <div className="flex space-x-4 w-full max-w-md">
                  <img
                    src={track.image}
                    alt={track.name}
                    width={48}
                    height={48}
                    className="rounded"
                  />
                  <div>
                    <p className="text-white">{track.name}</p>
                    <p className="text-sm text-gray-400">{track.artist}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="hidden sm:flex p-2 items-center justify-center rounded-full hover:bg-neutral-800">
                    <PiMicrophoneStageFill size={17} className="text-white" />
                  </button>
                  <button className="p-2 flex items-center justify-center rounded-full hover:bg-neutral-800">
                    <GiHearts size={17} className="text-white" />
                  </button>
                  <button className="p-2 hidden sm:flex items-center justify-center rounded-full hover:bg-neutral-800">
                    <HiDotsHorizontal size={17} className="text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {artistResults.length > 0 && (
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between">
            <h1 className="md:text-xl text-lg text-neutral-200 font-bold">Artistas</h1>
            <div className="flex items-center">
              <button disabled={artistPage === 0}
                onClick={() => setArtistPage(p => p - 1)} className="p-2 text-white disabled:opacity-50 hover:bg-neutral-800 hover:rounded-full">
                <FiChevronLeft size={24} />
              </button>
              <button disabled={(artistPage + 1) * artistsPerPage >= artistResults.length}
                onClick={() => setArtistPage(p => p + 1)} className="p-2 text-white disabled:opacity-50 hover:bg-neutral-800 hover:rounded-full">
                <FiChevronRight size={24} />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-10">
            <ul className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 gap-x-15">
              {visibleArtists.map(artist => (
                <li key={artist.id}>
                  <Link
                    className="relative space-y-2 hover:bg-neutral-900 rounded-md p-2 block group"
                    href={`/artists/${artist.id}`}
                  >
                    {artist.image ? (
                      <div className="relative">
                        <img
                          src={artist.image}
                          alt={artist.name}
                          width={160}
                          height={160}
                          className="rounded-full w-24 h-24 md:w-40 md:h-40 object-cover"
                        />
                        <button className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-green-500 p-2 rounded-full">
                          <FaPlay size={16} className="text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-40 h-40 bg-neutral-700 rounded-full" />
                    )}
                    <p className="text-base font-bold text-neutral-200 text-center">
                      {artist.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {albumResults.length > 0 && (
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between">
            <h1 className="md:text-xl text-lg text-neutral-200 font-bold">Álbuns</h1>
            <div className="flex items-center">
              <button className="p-2 text-white disabled:opacity-50 hover:bg-neutral-800 hover:rounded-full">
                <FiChevronLeft size={24} />
              </button>
              <button className="p-2 text-white disabled:opacity-50 hover:bg-neutral-800 hover:rounded-full">
                <FiChevronRight size={24} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {albumResults.map(album => (
              <Link
                key={album.id}
                href={`/albums/${album.id}`}
                className="flex flex-col items-center gap-2 p-2 hover:bg-neutral-900 rounded"
              >
                <img
                  src={album.image}
                  alt={album.name}
                  width={160}
                  height={160}
                  className="rounded w-24 h-24 md:w-40 md:h-40 object-cover"
                />
                <p className="text-white text-sm text-center">{album.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
      {searchResults.length === 0 && artistResults.length === 0 && albumResults.length === 0 && (
        <p className="text-gray-400">Nenhum resultado encontrado</p>
      )}
    </div>
  );
}