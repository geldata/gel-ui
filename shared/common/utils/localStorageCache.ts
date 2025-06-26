import * as z from "zod";

const cacheDataType = z.array(z.tuple([z.string(), z.any()]));

type CacheData = z.infer<typeof cacheDataType>;

export function getLocalStorageCacheItem<T extends z.ZodType>(
  cacheName: string,
  itemKey: string,
  schema: T
): z.infer<T> | null {
  const cacheKey = `Cache-${cacheName}`;
  const rawData = localStorage.getItem(cacheKey);
  if (!rawData) {
    return null;
  }
  let cacheData: CacheData;
  try {
    cacheData = cacheDataType.parse(JSON.parse(rawData));
  } catch {
    localStorage.removeItem(cacheKey);
    return null;
  }

  const index = cacheData.findIndex((item) => item[0] === itemKey);
  if (index === -1) {
    return null;
  }

  const item = cacheData[index];
  const parsed = schema.safeParse(item[1]);

  if (!parsed.success || index !== cacheData.length - 1) {
    cacheData.splice(index, 1);
    if (parsed.success) {
      cacheData.push(item);
    }
    storeCacheData(cacheKey, cacheData);
  }

  return parsed.success ? parsed.data : null;
}

export function storeLocalStorageCacheItem(
  cacheName: string,
  itemKey: string,
  data: any,
  maxStorage = 1e6
) {
  const cacheKey = `Cache-${cacheName}`;

  let cacheData: CacheData = [];
  const rawData = localStorage.getItem(cacheKey);
  if (rawData) {
    try {
      cacheData = cacheDataType.parse(JSON.parse(rawData));
    } catch {
      // ignore
    }
  }

  const index = cacheData.findIndex((item) => item[0] === itemKey);
  if (index !== -1) {
    cacheData.splice(index, 1);
  }

  cacheData.push([itemKey, data]);

  storeCacheData(cacheKey, cacheData, maxStorage);
}

function storeCacheData(
  cacheKey: string,
  cacheData: CacheData,
  maxStorage?: number
) {
  let itemStrs = cacheData.map((item) => JSON.stringify(item));
  if (maxStorage) {
    let storage = 0;
    for (let i = itemStrs.length - 1; i >= 0; i--) {
      storage += itemStrs[i].length;
      if (storage > maxStorage) {
        itemStrs = itemStrs.slice(i + 1);
        break;
      }
    }
  }
  while (itemStrs.length > 0) {
    try {
      localStorage.setItem(cacheKey, `[${itemStrs.join(",")}]`);
      return;
    } catch {
      itemStrs = itemStrs.slice(1);
    }
  }
  localStorage.removeItem(cacheKey);
}
