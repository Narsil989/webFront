import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchEntries, postEntry } from '../services/api';

type Entry = { id: string; name: string; date: string };
type ContextType = {
  currentName: string;
  setCurrentName: (n: string) => void;
  entries: Entry[];
  addEntry: (name: string, date: string) => Promise<void>;
};

const UserContext = createContext<ContextType | undefined>(undefined);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentName, setCurrentName] = useState<string>('');
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const remote = await fetchEntries();
        setEntries(remote);
      } catch {
        setEntries([]);
      }
    })();
  }, []);

  const addEntry = async (name: string, date: string) => {
    const saved = await postEntry(name, date);
    setEntries(prev => [saved, ...prev]);
  };

  return (
    <UserContext.Provider value={{ currentName, setCurrentName, entries, addEntry }}>
      {children}
    </UserContext.Provider>
  );
};