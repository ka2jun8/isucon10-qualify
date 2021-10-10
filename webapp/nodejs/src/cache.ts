import { Handler, Request } from "express";

type Cache = {
  [key: string]: {
    value: any;
    createdAt: Date;
    updatedAt: Date;
    maxAge: number; // 秒;
  };
}

const MAX_AGE = 60;

class MemoryCache {
  cache: Cache;
  
  constructor(){
    this.cache = {};
  }

  set(key: string, value: any, maxAge: number = MAX_AGE) {
    const now = new Date();
    if(!this.cache[key]) {
      this.cache[key] = {
        value,
        createdAt: now,
        updatedAt: now,
        maxAge,
      }
      return;
    }
    const current = this.cache[key];
    current.value = value;
    current.updatedAt = now;
    current.maxAge = maxAge;
    this.cache[key] = current;
  }

  get(key: string) {
    const data = this.cache[key];
    if(data && !this.isStaled(key)) {
      return data.value;
    }
    return null;
  }

  purgeAll() {
    this.cache = {};
  }

  isStaled(key: string) {
    const data = this.cache[key];
    if(!data) {
      return null;
    }
    const now = new Date().getTime();
    const staleTime = data.updatedAt.getTime() + (data.maxAge * 1000);
    if(now < staleTime) {
      return false;
    }
    return true;
  }
};

let memoryCache;

export const getMemoryCache = (): MemoryCache => {
  if(memoryCache) {
    return memoryCache;
  }
  memoryCache = new MemoryCache()
  return memoryCache;
};

export const createKey = (req: Request) => {
  const { path, params } = req;
  return path + ":" + JSON.stringify(params);
}

export const cacheHandler: Handler = (req, res, next) => {
  const { method } = req;
  if(method !== "GET") {
    return next();
  }
  const key = createKey(req);
  const value = getMemoryCache().get(key);
  if(value) {
    res.setHeader("x-express-cache", "true");
    res.send(value);
    return;
  }
  next();
}
