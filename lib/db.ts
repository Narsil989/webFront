import fs from 'fs/promises';
import path from 'path';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'db.json');

interface Database {
  items: any[];
  metadata: {
    created: string;
    version: string;
  };
}

// Ensure data directory exists
async function ensureDataDir() {
  const dir = path.dirname(DB_PATH);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Initialize database if it doesn't exist
async function initializeDB() {
  try {
    await fs.access(DB_PATH);
  } catch {
    const initialData: Database = {
      items: [],
      metadata: {
        created: new Date().toISOString(),
        version: '1.0.0'
      }
    };
    await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
  }
}

// Read database with error handling
export async function readDB<T = Database>(): Promise<T> {
  await ensureDataDir();
  await initializeDB();

  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    throw new Error('Failed to read database');
  }
}

// Write database with atomic operations
export async function writeDB<T = Database>(data: T): Promise<void> {
  await ensureDataDir();

  const tempPath = `${DB_PATH}.tmp`;

  try {
    // Write to temp file first
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2));
    // Rename atomically
    await fs.rename(tempPath, DB_PATH);
  } catch (error) {
    // Clean up temp file on error
    try {
      await fs.unlink(tempPath);
    } catch {}
    console.error('Error writing database:', error);
    throw new Error('Failed to write database');
  }
}

// Concurrent access handling with simple locking
let isWriting = false;
const writeQueue: (() => Promise<void>)[] = [];

async function processQueue() {
  if (isWriting || writeQueue.length === 0) return;

  isWriting = true;
  const operation = writeQueue.shift();

  if (operation) {
    await operation();
  }

  isWriting = false;

  if (writeQueue.length > 0) {
    processQueue();
  }
}

export async function safeWriteDB<T>(data: T): Promise<void> {
  return new Promise((resolve, reject) => {
    writeQueue.push(async () => {
      try {
        await writeDB(data);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    processQueue();
  });
}

// Get all items
export async function getItems<T = any>(): Promise<T[]> {
  const db = await readDB<Database>();
  return db.items as T[];
}

// Add a new item
export async function addItem<T = any>(item: T): Promise<T & { id: string; createdAt: string }> {
  const db = await readDB<Database>();

  const newItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };

  db.items.push(newItem);
  await safeWriteDB(db);

  return newItem;
}

// Get item by ID
export async function getItemById<T = any>(id: string): Promise<T | null> {
  const db = await readDB<Database>();
  const item = db.items.find((item: any) => item.id === id);
  return item || null;
}

// Update item by ID
export async function updateItem<T = any>(
  id: string,
  updates: Partial<T>
): Promise<T | null> {
  const db = await readDB<Database>();

  const index = db.items.findIndex((item: any) => item.id === id);

  if (index === -1) {
    return null;
  }

  db.items[index] = {
    ...db.items[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  await safeWriteDB(db);

  return db.items[index];
}

// Delete item by ID
export async function deleteItem(id: string): Promise<boolean> {
  const db = await readDB<Database>();

  const initialLength = db.items.length;
  db.items = db.items.filter((item: any) => item.id !== id);

  if (db.items.length === initialLength) {
    return false;
  }

  await safeWriteDB(db);

  return true;
}
