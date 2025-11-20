'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/lib/i18n';

export function ItemForm() {
  const router = useRouter();
  const [yourName, setYourName] = useState('');
  const [davidDateOfBirth, setDavidDateOfBirth] = useState('');
  const [davidWeight, setDavidWeight] = useState('');
  const [davidLength, setDavidLength] = useState('');
  const [hasUnibrow, setHasUnibrow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          yourName,
          davidDateOfBirth,
          davidWeight,
          davidLength,
          hasUnibrow
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || t('form.error.create'));
      }

      // Redirect to home page on success
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('form.error.generic'));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Your Name Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <label htmlFor="yourName" className="block text-lg font-semibold text-gray-800 mb-3">
          {t('form.yourName.label')}
        </label>
        <input
          type="text"
          id="yourName"
          value={yourName}
          onChange={(e) => setYourName(e.target.value)}
          required
          className="
            w-full
            px-4 py-3
            text-base
            border-2 border-blue-200
            rounded-lg
            bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all
          "
          placeholder={t('form.yourName.placeholder')}
        />
      </div>

      {/* David's Information Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-1 flex-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded"></div>
          <h3 className="text-xl font-bold text-purple-900">{t('form.sectionTitle')}</h3>
          <div className="h-1 flex-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded"></div>
        </div>

        <div className="space-y-5">
          {/* Date of Birth */}
          <div>
            <label htmlFor="davidDateOfBirth" className="block text-sm font-semibold text-gray-700 mb-2">
              {t('form.dateOfBirth')}
            </label>
            <input
              type="date"
              id="davidDateOfBirth"
              value={davidDateOfBirth}
              onChange={(e) => setDavidDateOfBirth(e.target.value)}
              required
              className="
                w-full
                px-4 py-3
                text-base
                border-2 border-purple-200
                rounded-lg
                bg-white
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                transition-all
              "
            />
          </div>

          {/* Weight and Length in a grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="davidWeight" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('form.weight')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="davidWeight"
                  value={davidWeight}
                  onChange={(e) => setDavidWeight(e.target.value)}
                  required
                  step="0.01"
                  className="
                    w-full
                    px-4 py-3
                    pr-12
                    text-base
                    border-2 border-purple-200
                    rounded-lg
                    bg-white
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                    transition-all
                  "
                  placeholder="3.5"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  {t('form.unitWeight')}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="davidLength" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('form.length')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="davidLength"
                  value={davidLength}
                  onChange={(e) => setDavidLength(e.target.value)}
                  required
                  step="0.1"
                  className="
                    w-full
                    px-4 py-3
                    pr-12
                    text-base
                    border-2 border-purple-200
                    rounded-lg
                    bg-white
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                    transition-all
                  "
                  placeholder="50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  {t('form.unitLength')}
                </span>
              </div>
            </div>
          </div>

          {/* Unibrow Checkbox */}
          <div className="mt-5">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={hasUnibrow}
                  onChange={(e) => setHasUnibrow(e.target.checked)}
                  className="
                    w-6 h-6
                    rounded
                    border-2 border-purple-300
                    text-purple-600
                    focus:ring-2 focus:ring-purple-500
                    cursor-pointer
                    transition-all
                  "
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">
                {t('form.unibrow')}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="
            flex-1 sm:flex-none
            px-8 py-3.5
            text-base
            font-semibold
            text-white
            bg-gradient-to-r from-blue-600 to-indigo-600
            rounded-lg
            hover:from-blue-700 hover:to-indigo-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            transform hover:scale-105
            transition-all
            shadow-lg hover:shadow-xl
          "
        >
          {loading ? t('form.actions.saving') : t('form.actions.save')}
        </button>

        <button
          type="button"
          onClick={() => router.push('/')}
          className="
            flex-1 sm:flex-none
            px-8 py-3.5
            text-base
            font-semibold
            text-gray-700
            bg-white
            border-2 border-gray-300
            rounded-lg
            hover:bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
            transition-all
          "
        >
          {t('form.actions.cancel')}
        </button>
      </div>
    </form>
  );
}
