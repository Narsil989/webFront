import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
};

const Summary: React.FC = () => {
  const { entries } = useUser();
  const navigate = useNavigate();

  return (
    <main style={{ maxWidth: 720, margin: '2rem auto', padding: '1.5rem' }}>
      <h2>Entered dates</h2>
      <button onClick={() => navigate('/home')} style={{ marginBottom: 12 }}>Add another</button>
      {entries.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {entries.map(e => (
            <li key={e.id} style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>
              <strong>{e.name}</strong> — {formatDate(e.date)}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default Summary;