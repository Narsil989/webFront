import { Redis } from '@upstash/redis';

const ITEMS_KEY = 'items';
const ACTUALS_KEY = 'actuals';
const redis = Redis.fromEnv();

interface BaseItem {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

async function readItems<T>(): Promise<(T & BaseItem)[]> {
  const items = await redis.get<(T & BaseItem)[]>(ITEMS_KEY);
  return items ?? [];
}

async function writeItems<T>(items: (T & BaseItem)[]) {
  await redis.set(ITEMS_KEY, items);
}

type Actuals = {
  date: string;
  weight: number;
  length: number;
  unibrow: boolean;
  savedAt: string;
};

async function readActuals(): Promise<Actuals | null> {
  const value = await redis.get<Actuals>(ACTUALS_KEY);
  return value ?? null;
}

async function writeActuals(actuals: Actuals) {
  await redis.set(ACTUALS_KEY, actuals);
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
