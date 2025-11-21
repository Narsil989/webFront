'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/layout/Container';
import { t } from '@/lib/i18n';

type Actuals = {
  date: string;
  weight: number;
  length: number;
  unibrow: boolean;
};

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [weight, setWeight] = useState<string>('3.5');
  const [length, setLength] = useState<string>('50');
  const [unibrow, setUnibrow] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/actuals');
        const json = await res.json();
        if (json?.success && json.data) {
          const existing: Actuals = json.data;
          setDate(existing.date);
          setWeight(String(existing.weight));
          setLength(String(existing.length));
          setUnibrow(Boolean(existing.unibrow));
        } else {
          const today = new Date();
          setDate(today.toISOString().slice(0, 10));
        }
      } catch (err) {
        console.error('Failed to load actuals', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus('');
    try {
      const res = await fetch('/api/actuals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          weight: Number(weight),
          length: Number(length),
          unibrow
        })
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Failed to save');
      }
      setStatus(t('form.actions.save'));
    } catch (err) {
      setStatus(t('form.error.generic'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <p className="text-gray-600">Loading...</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold mb-1">{t('list.results.title')}</h1>
        <p className="text-gray-600 mb-6">{t('list.results.subtitle')}</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="actual-date">
              {t('list.labels.dob')}
            </label>
            <input
              id="actual-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="actual-weight">
                {t('form.weight')}
              </label>
              <input
                id="actual-weight"
                type="number"
                step="0.01"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1" htmlFor="actual-length">
                {t('form.length')}
              </label>
              <input
                id="actual-length"
                type="number"
                step="0.1"
                min="0"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={unibrow}
              onChange={(e) => setUnibrow(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm font-semibold text-gray-800">{t('form.unibrow')}</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-60"
            >
              {saving ? t('form.actions.saving') : t('form.actions.save')}
            </button>
          </div>
          {status && <p className="text-sm text-gray-600">{status}</p>}
        </form>
      </div>
    </Container>
  );
}
