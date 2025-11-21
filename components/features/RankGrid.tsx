'use client';

import { useMemo, useState } from 'react';
import { t } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

type Item = {
  id: string;
  yourName: string;
  davidDateOfBirth: string;
  davidWeight: string;
  davidLength: string;
  hasUnibrow: boolean;
  createdAt: string;
};

type Actuals = {
  date: string;
  weight: number;
  length: number;
  unibrow: boolean;
} | null;

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString('hr-HR', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : t('rank.unknown');

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const closestMatches = (
  items: Item[],
  selector: (item: Item) => number,
  target: number | null,
): Set<string> => {
  if (target === null) return new Set();

  const scored = items.map((item) => ({
    id: item.id,
    diff: Math.abs(selector(item) - target),
  }));

  const hasExact = scored.some((s) => s.diff === 0);
  if (hasExact) {
    return new Set(scored.filter((s) => s.diff === 0).map((s) => s.id));
  }

  const minDiff = Math.min(...scored.map((s) => s.diff));
  return new Set(scored.filter((s) => s.diff === minDiff).map((s) => s.id));
};

const orderWithName = (items: Item[], selector: (item: Item) => number) =>
  [...items].sort((a, b) => {
    const av = selector(a);
    const bv = selector(b);
    if (av === bv) return a.yourName.localeCompare(b.yourName);
    return bv - av;
  });

export default function RankGrid({ items, actuals }: { items: Item[]; actuals: Actuals }) {
  const [open, setOpen] = useState<Record<string, boolean>>({
    date: false,
    weight: false,
    length: false,
    unibrow: false,
  });

  const accentClasses: Record<
    string,
    { from: string; border: string; dot: string; text: string }
  > = {
    blue: {
      from: 'from-blue-50',
      border: 'border-blue-100',
      dot: 'bg-blue-500',
      text: 'text-blue-700',
    },
    amber: {
      from: 'from-amber-50',
      border: 'border-amber-100',
      dot: 'bg-amber-500',
      text: 'text-amber-700',
    },
    green: {
      from: 'from-green-50',
      border: 'border-green-100',
      dot: 'bg-green-500',
      text: 'text-green-700',
    },
    purple: {
      from: 'from-purple-50',
      border: 'border-purple-100',
      dot: 'bg-purple-500',
      text: 'text-purple-700',
    },
  };

  const { rankedDate, rankedWeight, rankedLength, rankedUnibrow, winnersDate, winnersWeight, winnersLength, winnersUnibrow, targetDate, targetWeight, targetLength, targetUnibrow } =
    useMemo(() => {
      const today = startOfDay(new Date());
      const targetDate = actuals?.date ? startOfDay(new Date(actuals.date)) : null;
      const targetWeight = typeof actuals?.weight === 'number' ? actuals.weight : null;
      const targetLength = typeof actuals?.length === 'number' ? actuals.length : null;
      const targetUnibrow =
        typeof actuals?.unibrow === 'boolean' ? (actuals.unibrow ? 1 : 0) : null;

      const toDateValue = (iso: string) => startOfDay(new Date(iso)).getTime() || 0;
      const isExactDate = (iso: string) =>
        targetDate ? toDateValue(iso) === targetDate.getTime() : false;
      const isPast = (iso: string) => toDateValue(iso) < today.getTime();

      const byDate = [...items].sort((a, b) => {
        const exactA = isExactDate(a.davidDateOfBirth);
        const exactB = isExactDate(b.davidDateOfBirth);
        if (exactA !== exactB) return exactA ? -1 : 1;

        const pastA = isPast(a.davidDateOfBirth);
        const pastB = isPast(b.davidDateOfBirth);
        if (pastA !== pastB) return pastA ? 1 : -1;

        const timeA = toDateValue(a.davidDateOfBirth);
        const timeB = toDateValue(b.davidDateOfBirth);
        if (timeA === timeB) return a.yourName.localeCompare(b.yourName);
        return timeB - timeA;
      });

      const byWeight = orderWithName(items, (i) => Number(i.davidWeight) || 0);
      const byLength = orderWithName(items, (i) => Number(i.davidLength) || 0);
      const byUnibrow = orderWithName(items, (i) => (i.hasUnibrow ? 1 : 0));

      const winnersDate = targetDate
        ? closestMatches(byDate, (i) => toDateValue(i.davidDateOfBirth), targetDate.getTime())
        : new Set<string>();
      const winnersWeight = closestMatches(byWeight, (i) => Number(i.davidWeight) || 0, targetWeight);
      const winnersLength = closestMatches(byLength, (i) => Number(i.davidLength) || 0, targetLength);
      const winnersUnibrow = closestMatches(byUnibrow, (i) => (i.hasUnibrow ? 1 : 0), targetUnibrow);

      const prioritize = (list: Item[], winners: Set<string>) =>
        winners.size > 0
          ? [...list.filter((i) => winners.has(i.id)), ...list.filter((i) => !winners.has(i.id))]
          : list;

      return {
        rankedDate: prioritize(byDate, winnersDate),
        rankedWeight: prioritize(byWeight, winnersWeight),
        rankedLength: prioritize(byLength, winnersLength),
        rankedUnibrow: prioritize(byUnibrow, winnersUnibrow),
        winnersDate,
        winnersWeight,
        winnersLength,
        winnersUnibrow,
        targetDate,
        targetWeight,
        targetLength,
        targetUnibrow,
      };
    }, [items, actuals]);

  const renderList = (
    list: Item[],
    renderValue: (item: Item) => string,
    opts?: { isCorrect?: (item: Item) => boolean; isPast?: (item: Item) => boolean },
  ) => {
    if (list.length === 0) {
      return <p className="text-sm text-gray-500">{t('rank.empty')}</p>;
    }

    return (
      <ol className="space-y-2">
        {list.map((item, idx) => {
          const correct = opts?.isCorrect ? opts.isCorrect(item) : null;
          const past = opts?.isPast ? opts.isPast(item) : false;

          let wrapper = 'bg-white border border-gray-200';
          let nameColor = 'text-gray-800';
          let valueColor = 'text-gray-700';

          if (correct === true) {
            wrapper = 'bg-green-50 border border-green-200';
            nameColor = 'text-green-800';
            valueColor = 'text-green-700';
          } else if (correct === false || past) {
            wrapper = 'bg-red-50 border border-red-200';
            nameColor = 'text-red-800';
            valueColor = 'text-red-700 line-through';
          }

          return (
            <li
              key={`${item.id}-${idx}`}
              className={`flex items-center justify-between rounded-lg px-3 py-2 shadow-sm ${wrapper}`}
            >
              <span className={`text-sm font-semibold ${nameColor}`}>{item.yourName}</span>
              <span className={`text-sm ${valueColor}`}>{renderValue(item)}</span>
            </li>
          );
        })}
      </ol>
    );
  };

  const sections = [
    {
      key: 'date',
      title: t('rank.headers.date'),
      accent: 'blue',
      actual: targetDate ? formatDate(targetDate.toISOString()) : t('rank.unknown'),
      list: rankedDate,
      renderValue: (item: Item) => formatDate(item.davidDateOfBirth),
      isCorrect:
        targetDate && winnersDate.size > 0 ? (item: Item) => winnersDate.has(item.id) : undefined,
      isPast: (item: Item) =>
        targetDate ? startOfDay(new Date(item.davidDateOfBirth)) < startOfDay(new Date()) : false,
    },
    {
      key: 'weight',
      title: t('rank.headers.weight'),
      accent: 'amber',
      actual:
        typeof targetWeight === 'number'
          ? `${targetWeight} ${t('form.unitWeight')}`
          : t('rank.unknown'),
      list: rankedWeight,
      renderValue: (item: Item) => `${item.davidWeight} ${t('form.unitWeight')}`,
      isCorrect:
        targetWeight !== null && winnersWeight.size > 0
          ? (item: Item) => winnersWeight.has(item.id)
          : undefined,
    },
    {
      key: 'length',
      title: t('rank.headers.length'),
      accent: 'green',
      actual:
        typeof targetLength === 'number'
          ? `${targetLength} ${t('form.unitLength')}`
          : t('rank.unknown'),
      list: rankedLength,
      renderValue: (item: Item) => `${item.davidLength} ${t('form.unitLength')}`,
      isCorrect:
        targetLength !== null && winnersLength.size > 0
          ? (item: Item) => winnersLength.has(item.id)
          : undefined,
    },
    {
      key: 'unibrow',
      title: t('rank.headers.unibrow'),
      accent: 'purple',
      actual:
        targetUnibrow === null
          ? t('rank.unknown')
          : targetUnibrow === 1
            ? t('list.values.yes')
            : t('list.values.no'),
      list: rankedUnibrow,
      renderValue: (item: Item) =>
        item.hasUnibrow ? t('list.values.yes') : t('list.values.no'),
      isCorrect:
        targetUnibrow !== null && winnersUnibrow.size > 0
          ? (item: Item) => winnersUnibrow.has(item.id)
          : undefined,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('rank.title')}</h1>
        <p className="text-sm text-gray-600">{t('rank.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {sections.map((section) => {
          const isOpen = open[section.key];
          return (
          // Static class map because Tailwind needs literal class names
          // eslint-disable-next-line tailwindcss/no-custom-classname
          <article
            key={section.key}
            className={`bg-gradient-to-br ${accentClasses[section.accent].from} to-white p-4 rounded-xl border ${accentClasses[section.accent].border} shadow-sm`}
          >
            <button
              type="button"
              onClick={() => setOpen((prev) => ({ ...prev, [section.key]: !prev[section.key] }))}
              className="w-full text-left"
            >
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-base font-bold text-gray-900 flex items-center gap-2 justify-center">
                  <span className={`w-2 h-2 rounded-full ${accentClasses[section.accent].dot}`} />
                  {section.title}
                </p>
                <span className={`font-semibold ${accentClasses[section.accent].text}`}>
                  {section.actual}
                </span>
                <span className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <span
                    className={`h-4 w-4 inline-flex items-center justify-center rounded-full border border-gray-300 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    ▾
                  </span>
                  {isOpen ? t('rank.collapse') : t('rank.expand')}
                </span>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key={`${section.key}-content`}
                  initial={{ opacity: 0, height: 0, y: -6 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="mt-3">
                    {renderList(section.list, section.renderValue, {
                      isCorrect: section.isCorrect,
                      isPast: section.key === 'date' ? section.isPast : undefined,
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </article>
        )})}
      </div>
    </div>
  );
}
