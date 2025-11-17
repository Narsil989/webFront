import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const todayIso = (): string => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const PickDate: React.FC = () => {
  const { currentName, addEntry } = useUser();
  const [date, setDate] = useState<string>(todayIso());
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentName) navigate('/home');
  }, [currentName, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    addEntry(currentName, date);
    navigate('/summary');
  };

  return (
    <main style={{ maxWidth: 480, margin: '3rem auto', padding: '1.5rem', border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Hi {currentName || 'guest'}, pick a date</h2>
      <form onSubmit={submit}>
        <input
          type="date"
          value={date}
          min={todayIso()}
          onChange={e => setDate(e.target.value)}
          style={{ padding: '0.5rem', marginTop: '0.5rem' }}
        />
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" style={{ padding: '0.5rem 1rem' }}>
            Save date
          </button>
        </div>
      </form>
    </main>
  );
};

export default PickDate;