'use client';

import { motion } from 'framer-motion';
import { Calendar, Weight, Ruler, User, Check, X } from 'lucide-react';
import { t } from '@/lib/i18n';

interface Actuals {
  date: string;
  weight: number;
  length: number;
  unibrow: boolean;
  savedAt?: string;
}

interface Item {
  id: string;
  yourName: string;
  davidDateOfBirth: string;
  davidWeight: string;
  davidLength: string;
  hasUnibrow: boolean;
  createdAt: string;
}

interface ItemListProps {
  items: Item[];
  actuals: Actuals | null;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('hr-HR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

const formatCreatedStamp = (date: string) =>
  t('list.stamp', { date: new Date(date).toLocaleDateString('hr-HR') });

const getDateColor = (date: string, compareTo: Date) => {
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const base = new Date(compareTo);
  base.setHours(0, 0, 0, 0);

  if (target.getTime() === base.getTime()) return 'text-green-600';
  if (target.getTime() < base.getTime()) return 'text-red-600';
  return 'text-orange-500';
};

const toDays = (d: Date) => Math.floor(d.getTime() / (1000 * 60 * 60 * 24));

const findClosest = (items: Item[], selector: (item: Item) => number, target: number | null) => {
  if (target === null || Number.isNaN(target)) return { exact: [] as Item[], closest: [] as Item[] };

  const exact = items.filter((item) => selector(item) === target);
  const remaining = items.filter((item) => !exact.includes(item));

  if (remaining.length === 0) return { exact, closest: [] as Item[] };

  const diffs = remaining.map((item) => ({
    item,
    diff: Math.abs(selector(item) - target),
  }));
  const minDiff = Math.min(...diffs.map((d) => d.diff));
  const closest = diffs.filter((d) => d.diff === minDiff).map((d) => d.item);

  return { exact, closest };
};

export function ItemList({ items, actuals }: ItemListProps) {
  const comparisonDate = actuals?.date ? new Date(actuals.date) : new Date();

  const dateResults = (() => {
    if (!actuals?.date) return { exact: [] as Item[], closest: [] as Item[] };
    const baseDays = toDays(new Date(actuals.date));
    const exact = items.filter((item) => toDays(new Date(item.davidDateOfBirth)) === baseDays);
    const remaining = items.filter((item) => !exact.includes(item));
    if (remaining.length === 0) return { exact, closest: [] as Item[] };
    const diffs = remaining.map((item) => ({
      item,
      diff: Math.abs(toDays(new Date(item.davidDateOfBirth)) - baseDays),
    }));
    const minDiff = Math.min(...diffs.map((d) => d.diff));
    const closest = diffs.filter((d) => d.diff === minDiff).map((d) => d.item);
    return { exact, closest };
  })();

  const weightResults = findClosest(items, (i) => Number(i.davidWeight), actuals?.weight ?? null);
  const lengthResults = findClosest(items, (i) => Number(i.davidLength), actuals?.length ?? null);
  const unibrowResults =
    typeof actuals?.unibrow === 'boolean'
      ? { exact: items.filter((i) => i.hasUnibrow === actuals.unibrow), closest: [] as Item[] }
      : { exact: [] as Item[], closest: [] as Item[] };

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="inline-block p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-700 text-xl font-bold mb-2">
            {t('list.emptyTitle')}
          </p>
          <p className="text-gray-500">
            {t('list.emptySubtitle')}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {(actuals?.date || actuals?.weight || actuals?.length || typeof actuals?.unibrow === 'boolean') && (
        <div className="mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 uppercase tracking-wide">
                {t('list.results.title')}
              </div>
              <div className="text-sm text-gray-600">
                {t('list.results.subtitle')}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actuals?.date && (
                <ResultCard
                  label={t('list.labels.dob')}
                  actual={formatDate(actuals.date)}
                  exact={dateResults.exact}
                  closest={dateResults.closest}
                />
              )}
              {typeof actuals?.weight === 'number' && (
                <ResultCard
                  label={t('list.labels.weight')}
                  actual={`${actuals.weight} ${t('form.unitWeight')}`}
                  exact={weightResults.exact}
                  closest={weightResults.closest}
                />
              )}
              {typeof actuals?.length === 'number' && (
                <ResultCard
                  label={t('list.labels.length')}
                  actual={`${actuals.length} ${t('form.unitLength')}`}
                  exact={lengthResults.exact}
                  closest={lengthResults.closest}
                />
              )}
              {typeof actuals?.unibrow === 'boolean' && (
                <ResultCard
                  label={t('list.labels.unibrow')}
                  actual={actuals.unibrow ? t('list.values.yes') : t('list.values.no')}
                  exact={unibrowResults.exact}
                  closest={[]}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
      ">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="
            bg-white
            rounded-2xl
            shadow-lg hover:shadow-2xl
            border-2 border-gray-100
            overflow-hidden
            transition-shadow duration-300
          "
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">
                  {item.yourName}
                </h3>
              </div>
              <span className="text-xs bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium">
                {formatCreatedStamp(item.createdAt)}
              </span>
            </div>
          </div>

          {/* David's Info Section */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 flex-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded"></div>
              <h4 className="text-lg font-bold text-purple-900">{t('list.sectionTitle')}</h4>
              <div className="h-1 flex-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Date of Birth */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-4 rounded-xl border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">{t('list.labels.dob')}</span>
                </div>
                <div className={`text-sm font-bold ${getDateColor(item.davidDateOfBirth, comparisonDate)}`}>
                  {formatDate(item.davidDateOfBirth)}
                </div>
              </motion.div>

              {/* Weight */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-4 rounded-xl border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <Weight className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">{t('list.labels.weight')}</span>
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {item.davidWeight} <span className="text-sm text-gray-500 font-normal">{t('form.unitWeight')}</span>
                </div>
              </motion.div>

              {/* Length */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-4 rounded-xl border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <Ruler className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">{t('list.labels.length')}</span>
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {item.davidLength} <span className="text-sm text-gray-500 font-normal">{t('form.unitLength')}</span>
                </div>
              </motion.div>

              {/* Unibrow */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-4 rounded-xl border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  {item.hasUnibrow ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span className="text-xs font-bold uppercase tracking-wide">{t('list.labels.unibrow')}</span>
                </div>
                <div className={`text-lg font-bold ${item.hasUnibrow ? 'text-green-600' : 'text-red-600'}`}>
                  {item.hasUnibrow ? t('list.values.yes') : t('list.values.no')}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}
      </div>
    </>
  );
}

interface ResultCardProps {
  label: string;
  actual: string;
  exact: Item[];
  closest: Item[];
}

function ResultCard({ label, actual, exact, closest }: ResultCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="text-sm text-blue-700 font-semibold">{actual}</span>
      </div>
      <div className="space-y-2">
        <ResultRow
          title={t('list.results.exact')}
          items={exact}
          badgeColor="bg-green-100 text-green-700"
        />
        {closest.length > 0 && (
          <ResultRow
            title={t('list.results.closest')}
            items={closest}
            badgeColor="bg-orange-100 text-orange-700"
          />
        )}
        {exact.length === 0 && closest.length === 0 && (
          <p className="text-sm text-gray-500">{t('list.results.none')}</p>
        )}
      </div>
    </div>
  );
}

interface ResultRowProps {
  title: string;
  items: Item[];
  badgeColor: string;
}

function ResultRow({ title, items, badgeColor }: ResultRowProps) {
  if (items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">{title}</span>
        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${badgeColor}`}>
          {items.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item.id}
            className="px-2 py-1 text-xs font-semibold bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            {item.yourName}
          </span>
        ))}
      </div>
    </div>
  );
}
