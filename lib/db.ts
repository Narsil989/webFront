import fs from 'fs/promises';
import path from 'path';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'db.json');

interface BaseItem {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

type Actuals = {
  date: string;
  weight: number;
  length: number;
  unibrow: boolean;
  savedAt: string;
};

interface Database {
  items: any[];
  actuals: Actuals | null;
  metadata: {
    created: string;
    version: string;
  };
}

async function ensureDataDir() {
  const dir = path.dirname(DB_PATH);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function initializeDB() {
  try {
    await fs.access(DB_PATH);
  } catch {
    const initialData: Database = {
      items: [],
      actuals: null,
      metadata: {
        created: new Date().toISOString(),
        version: '1.0.0',
      },
    };
    await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
  }
}

async function readDB(): Promise<Database> {
  await ensureDataDir();
  await initializeDB();

  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as Database;
  } catch (error) {
    console.error('Error reading database:', error);
    throw new Error('Failed to read database');
  }
}

async function writeDB(data: Database): Promise<void> {
  await ensureDataDir();
  const tempPath = `${DB_PATH}.tmp`;

  try {
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2));
    await fs.rename(tempPath, DB_PATH);
  } catch (error) {
    try {
      await fs.unlink(tempPath);
    } catch {}
    console.error('Error writing database:', error);
    throw new Error('Failed to write database');
  }
}

async function readItems<T>(): Promise<(T & BaseItem)[]> {
  const db = await readDB();
  return (db.items ?? []) as (T & BaseItem)[];
}

async function writeItems<T>(items: (T & BaseItem)[]) {
  const db = await readDB();
  db.items = items;
  await writeDB(db);
}

async function readActuals(): Promise<Actuals | null> {
  const db = await readDB();
  return db.actuals ?? null;
}

async function writeActuals(actuals: Actuals) {
  const db = await readDB();
  db.actuals = actuals;
  await writeDB(db);
}

export async function getItems<T = any>(): Promise<(T & BaseItem)[]> {
  return readItems<T>();
}

export async function addItem<T = any>(item: T): Promise<T & BaseItem> {
  const items = await readItems<T>();
  const newItem: T & BaseItem = {
    ...(item as T),
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const updated = [newItem, ...items];
  await writeItems(updated);
  return newItem;
}

export async function getItemById<T = any>(id: string): Promise<(T & BaseItem) | null> {
  const items = await readItems<T>();
  const found = items.find((item) => item.id === id);
  return found ?? null;
}

export async function updateItem<T = any>(
  id: string,
  updates: Partial<T>
): Promise<(T & BaseItem) | null> {
  const items = await readItems<T>();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const updated = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  } as T & BaseItem;

  items[index] = updated;
  await writeItems(items);
  return updated;
}

export async function deleteItem(id: string): Promise<boolean> {
  const items = await readItems();
  const filtered = items.filter((item) => item.id !== id);

  if (filtered.length === items.length) {
    return false;
  }

  await writeItems(filtered);
  return true;
}

export async function getActuals(): Promise<Actuals | null> {
  const actuals = await readActuals();
  if (!actuals) return null;
  return {
    ...actuals,
    weight: Number(actuals.weight),
    length: Number(actuals.length),
    unibrow: Boolean(actuals.unibrow),
  };
}

export async function setActuals(payload: {
  date: string;
  weight: number;
  length: number;
  unibrow: boolean;
}): Promise<Actuals> {
  const actuals: Actuals = {
    date: payload.date,
    weight: payload.weight,
    length: payload.length,
    unibrow: payload.unibrow,
    savedAt: new Date().toISOString(),
  };
  await writeActuals(actuals);
  return actuals;
}
