'use client';

import { motion } from 'framer-motion';
import { Calendar, Weight, Ruler, User, Check, X } from 'lucide-react';
import { t } from '@/lib/i18n';

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
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('hr-HR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

const formatCreatedStamp = (date: string) =>
  t('list.stamp', { date: new Date(date).toLocaleDateString('hr-HR') });

const getDateColor = (date: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  if (target.getTime() === today.getTime()) return 'text-green-600';
  if (target.getTime() < today.getTime()) return 'text-red-600';
  return 'text-orange-500';
};

export function ItemList({ items }: ItemListProps) {
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
                <div className={`text-sm font-bold ${getDateColor(item.davidDateOfBirth)}`}>
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
  );
}
