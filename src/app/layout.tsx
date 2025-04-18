'use client';

import './globals.css';
import { useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '@/lib/appwrite';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

import { Inter_Tight } from 'next/font/google'
const Inter = Inter_Tight({
  subsets: ["latin"]
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkUser() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else if (!['/auth/login', '/auth/register'].includes(pathname)) {
        router.push('/auth/login');
      }
    }
    checkUser();
  }, [router, pathname]);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <html lang="pt-BR">
      <body className={`${Inter.className} `}>
        {/* {user && !['/auth/login', '/auth/register'].includes(pathname) && (
          <nav className="flex w-[1252px] h-[80px] justify-between p-4">
            <Link href="/" className="text-xl font-bold">
              Music Recommender
            </Link>
            <div>
              <span className="mr-4">{user.email}</span>
              <button
                onClick={handleLogout}
                className="rounded bg-red-500 px-4 py-2 text-white"
              >
                Sair
              </button>
            </div>
          </nav>
        )} */}
        {children}
      </body>
    </html>
  );
}