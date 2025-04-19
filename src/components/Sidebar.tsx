import Link from "next/link"
import { HeartVb } from "../../public/icons/HeartVb"
import { PlusVb } from "../../public/icons/PlusVb"
import { HouseVb } from "../../public/icons/HouseVb"
import { ExploreVb } from "../../public/icons/ExploreVibra"

export function Sidebar() {
    return (
        <aside className="hidden min-w-[272px] min-h-screen bg-[#0f0d13] p-2 border-r sm:flex sm:flex-col border-white/30">
        <div className="flex flex-col items-start gap-y-1 border-b border-white/30">
          <h1 className="text-white font-semibold text-2xl pl-4 my-5 uppercase">Vibra Music</h1>
          <div className="grid grid-cols-1 gap-2 mb-4 w-full">
            <Link
              href="/"
              className="flex items-center w-full h-[40px] rounded-lg px-4 group hover:text-[#BB66EE] transition-colors ease-in-out"
            >
              <HouseVb className="fill-white w-6 h-6 mr-2 group-hover:fill-[#BB66EE] transition-colors ease-in-out" />
              <span className="text-white font-semibold text-xl transition-colors ease-in-out group-hover:text-[#BB66EE]">
                Início
              </span>
            </Link>

            <Link
              href="/explore"
              className="flex items-center w-full h-[40px] rounded-lg px-4 group hover:text-[#BB66EE] transition-colors ease-in-out"
            >
              <ExploreVb className="fill-white w-6 h-6 mr-2 group-hover:fill-[#BB66EE] transition-colors ease-in-out" />
              <span className="text-white font-semibold text-xl transition-colors ease-in-out group-hover:text-[#BB66EE]">
                Explorar
              </span>
            </Link>

            <Link
              href="/@me/favoritos"
              className="flex items-center w-full h-[40px] rounded-lg px-4 group hover:text-[#BB66EE] transition-colors ease-in-out"
            >
              <ExploreVb className="fill-white w-6 h-6 mr-2 group-hover:fill-[#BB66EE] transition-colors ease-in-out" />
              <span className="text-white font-semibold text-xl transition-colors ease-in-out group-hover:text-[#BB66EE]">
                Favoritos
              </span>
            </Link>
            </div>
        </div>
        <Link href="/favorites" className="flex flex-col">
          <button className="flex items-center w-full hover:opacity-50 h-[60px] px-2 rounded-lg my-2 cursor-pointer">
            <div className="w-12 h-12 bg-[#BB66EE] flex items-center justify-center mr-4">
              <HeartVb className="w-7 h-7" />
            </div>
            <span className="text-white font-ligth">Suas Favoritas</span>
          </button>
        </Link>
        <div className="flex flex-col">
          <button className="flex items-center w-full hover:opacity-50 h-[60px] px-2 rounded-lg my-2 cursor-pointer">
            <div className="w-12 h-12 bg-[#BB66EE]/5 flex items-center justify-center mr-4">
              <PlusVb className="w-7 h-7 fill-[#BB66EE]" />
            </div>
            <span className="text-white font-light">Criar Playlist</span>
          </button>
        </div>
      </aside>
    )
}