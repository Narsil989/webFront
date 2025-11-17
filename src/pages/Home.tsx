// ...existing code...
import React, { useState } from 'react';

const pollQuestion = "What's your favorite programming language?";
const pollOptions = ['JavaScript', 'Python', 'TypeScript', 'C#'];

const Home: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.value);
  };

  const handleVote = () => {
    if (selected) setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: 8 }}>
      <h1>Simple Poll</h1>
      <h2>{pollQuestion}</h2>
      {!submitted ? (
        <>
          {pollOptions.map((option, idx) => (
            <div key={option} style={{ margin: '0.5rem 0' }}>
              <input
                id={`poll-option-${idx}`}
                type="radio"
                name="poll"
                value={option}
                checked={selected === option}
                onChange={handleChange}
              />
              <label htmlFor={`poll-option-${idx}`} style={{ marginLeft: 8, cursor: 'pointer' }}>
                {option}
              </label>
            </div>
          ))}
          <button
            type="button"
            style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
            onClick={handleVote}
            disabled={!selected}
          >
            Vote
          </button>
        </>
      ) : (
        <div>
          <p>Thank you for voting!</p>
          <p>Your choice: <strong>{selected}</strong></p>
        </div>
      )}
    </div>
  );
};

export default Home;
// ...existing code...