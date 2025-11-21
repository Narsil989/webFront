'use client';

import Link from 'next/link';
import { Baby, LineChart, Plus } from 'lucide-react';
import { t } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

export function Navigation() {
  const router = useRouter();
  const clicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSecretNav = (e: React.MouseEvent) => {
    clicks.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      clicks.current = 0;
    }, 1200);

    // On the 5th click, prevent the normal home navigation and go to /admin
    if (clicks.current >= 5) {
      e.preventDefault();
      clicks.current = 0;
      router.push('/admin');
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          <Link
            href="/"
            className="flex items-center gap-3 text-xl sm:text-2xl font-bold hover:scale-105 transition-transform group"
            onClick={handleSecretNav}
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Baby className="w-6 h-6" />
            </div>
            <span className="hidden sm:inline">{t('nav.title')}</span>
          </Link>

          <div className="flex gap-3 sm:gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base font-semibold rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              <LineChart className="w-4 h-4" />
              <span>{t('nav.bets')}</span>
            </Link>
            <Link
              href="/rank"
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base font-semibold rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm border border-white/30"
            >
              <LineChart className="w-4 h-4" />
              <span>{t('nav.rank')}</span>
            </Link>
            <Link
              href="/items/add"
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base font-semibold bg-white text-blue-600 rounded-lg hover:bg-blue-50 hover:scale-105 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>{t('nav.addBet')}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
