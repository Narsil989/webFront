import { getItems } from '@/lib/db';
import { Container } from '@/components/layout/Container';
import { ItemList } from '@/components/features/ItemList';
import Link from 'next/link';
import { getActuals } from '@/lib/db';
import { t } from '@/lib/i18n';

// This page will be dynamically rendered to always show fresh data
export const dynamic = 'force-dynamic';

interface Item {
  id: string;
  yourName: string;
  davidDateOfBirth: string;
  davidWeight: string;
  davidLength: string;
  hasUnibrow: boolean;
  createdAt: string;
}

export default async function HomePage() {
  let items: Item[] = [];
  let actuals = null;
  let error = '';

  try {
    items = await getItems<Item>();
    actuals = await getActuals();
  } catch (err) {
    error = t('home.error');
    console.error('Error loading entries:', err);
  }

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('home.title')}
          </h1>
        </div>
        <p className="text-base sm:text-lg text-gray-600">
          {t('home.subtitle')}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      <ItemList items={items} actuals={actuals} />

      {items.length > 0 && (
        <div className="mt-12 text-center">
          <Link
            href="/items/add"
            className="
              inline-flex items-center gap-2
              px-8 py-4
              text-lg
              font-semibold
              text-white
              bg-gradient-to-r from-blue-600 to-indigo-600
              rounded-xl
              hover:from-blue-700 hover:to-indigo-700
              transform hover:scale-105
              transition-all
              shadow-lg hover:shadow-xl
            "
          >
            {t('home.cta')}
          </Link>
        </div>
      )}
    </Container>
  );
}
