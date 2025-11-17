const BASE = process.env.REACT_APP_API_URL ?? 'http://localhost:5000/api';

export const fetchData = async (url: string): Promise<any> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const postData = async (url: string, data: any): Promise<any> => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export async function fetchEntries() {
  const res = await fetch(`${BASE}/entries`);
  if (!res.ok) throw new Error('Failed to fetch entries');
  return res.json();
}

export async function postEntry(name: string, date: string) {
  const res = await fetch(`${BASE}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, date })
  });
  if (!res.ok) throw new Error('Failed to save entry');
  return res.json();
}