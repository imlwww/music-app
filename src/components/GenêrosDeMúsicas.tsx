export function SongsGenres() {
    return (
        <div className="flex flex-col w-full gap-y-2 mb-4">
            <div className="flex flex-col mb-2">
                <span className="text-2xl font-medium text-white">Station: toque o que você sente</span>
                <p className="text-base text-white/60">Um mix infinito e personalizado das músicas que você ama e também de novas descobertas.</p>
            </div>
            <div className="flex items-center gap-x-15 w-full">
                <div className="flex flex-col items-center gap-y-2">
                    <div className="rounded-full bg-[#1b1722] h-[124.5px] w-[124.5px] flex items-center justify-center">
                        <span className="text-4xl text-white font-semibold text-center">Mix</span>
                    </div>
                    <p className="text-white font-medium text-base">Meu Mix</p>
                </div>
                <div className="flex flex-col items-center gap-y-2">
                    <div className="rounded-full bg-[#1b1722] h-[124.5px] w-[124.5px] flex items-center justify-center">
                        <img src="https://cdn-images.dzcdn.net/images/cover/c602d40a9c43431bc1048e5fc7bc0c1c/232x232-none-80-0-0.png" className="w-[122px] h-[122px]" alt="Funk" />
                    </div>
                    <p className="text-white font-medium text-base">Funk</p>
                </div>
                <div className="flex flex-col items-center gap-y-2">
                    <div className="rounded-full bg-[#1b1722] h-[124.5px] w-[124.5px] flex items-center justify-center">
                        <img src="https://cdn-images.dzcdn.net/images/cover/bd0f978e57dc27930e2741540d2dc0de/232x232-none-80-0-0.png" className="w-[122px] h-[122px]" alt="Forro" />
                    </div>
                    <p className="text-white font-medium text-base">Forró</p>
                </div>
                <div className="flex flex-col items-center gap-y-2">
                    <div className="rounded-full bg-[#1b1722] h-[124.5px] w-[124.5px] flex items-center justify-center">
                        <img src="https://cdn-images.dzcdn.net/images/cover/737aacf92340e3e685ad874cbe16c0ca/232x232-none-80-0-0.png" className="w-[122px] h-[122px]" alt="Sertanejo" />
                    </div>
                    <p className="text-white font-medium text-base">Sertanejo</p>
                </div>
                <div className="flex flex-col items-center gap-y-2">
                    <div className="rounded-full bg-[#1b1722] h-[124.5px] w-[124.5px] flex items-center justify-center">
                        <img src="https://cdn-images.dzcdn.net/images/cover/24d27a478fbb085f2488ffc2984c7b73/232x232-none-80-0-0.png" className="w-[122px] h-[122px]" alt="Pop" />
                    </div>
                    <p className="text-white font-medium text-base">Pop</p>
                </div>
                <div className="flex flex-col items-center gap-y-2">
                    <div className="rounded-full bg-[#1b1722] h-[124.5px] w-[124.5px] flex items-center justify-center">
                        <img src="https://cdn-images.dzcdn.net/images/cover/8480aa295e29d6231bc8509ff772b0e5/232x232-none-80-0-0.png" className="w-[122px] h-[122px]" alt="Rave" />
                    </div>
                    <p className="text-white font-medium text-base">Rave</p>
                </div>
            </div>
        </div>
    )
}