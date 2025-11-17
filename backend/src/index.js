const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, '..', 'db.json');

app.use(cors());
app.use(express.json());

async function readDb() {
  try {
    const text = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(text);
  } catch {
    return { entries: [] };
  }
}

async function writeDb(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/entries', async (req, res) => {
  const db = await readDb();
  res.json(db.entries || []);
});

app.post('/api/entries', async (req, res) => {
  const { name, date } = req.body;
  if (!name || !date) return res.status(400).json({ error: 'name and date required' });
  const db = await readDb();
  const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const entry = { id, name, date };
  db.entries = [entry, ...(db.entries || [])];
  await writeDb(db);
  res.status(201).json(entry);
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});