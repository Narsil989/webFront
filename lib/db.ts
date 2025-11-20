import { kv } from '@vercel/kv';

const ITEMS_KEY = 'items';

interface BaseItem {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

interface NewItem<T> {
  data: T;
}

async function readItems<T>(): Promise<(T & BaseItem)[]> {
  const items = await kv.get<(T & BaseItem)[]>(ITEMS_KEY);
  return items ?? [];
}

async function writeItems<T>(items: (T & BaseItem)[]) {
  await kv.set(ITEMS_KEY, items);
}

export async function getItems<T = any>(): Promise<(T & BaseItem)[]> {
  return readItems<T>();
}

export async function addItem<T = any>(
  item: NewItem<T>['data']
): Promise<T & BaseItem> {
  const items = await readItems<T>();
  const newItem: T & BaseItem = {
    ...(item as T),
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  // Prepend newest item
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
