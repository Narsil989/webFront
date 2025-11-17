import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const EnterName: React.FC = () => {
  const { setCurrentName } = useUser();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCurrentName(name.trim());
    navigate('/pick-date');
  };

  return (
    <main style={{ maxWidth: 480, margin: '3rem auto', padding: '1.5rem', border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Enter your name</h2>
      <form onSubmit={submit}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
        />
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={!name.trim()} style={{ padding: '0.5rem 1rem' }}>
            Next
          </button>
        </div>
      </form>
    </main>
  );
};

export default EnterName;