import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const STORE_KEY = 'wc26:entries';
const STORE_PATH = join(process.cwd(), 'data', 'store.json');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function readLocalEntries() {
  if (!existsSync(STORE_PATH)) return {};
  try {
    const raw = JSON.parse(readFileSync(STORE_PATH, 'utf8'));
    return raw.entries && typeof raw.entries === 'object' ? raw.entries : {};
  } catch {
    return {};
  }
}

function writeLocalEntries(entries) {
  const payload = { version: 1, updatedAt: Date.now(), entries };
  writeFileSync(STORE_PATH, JSON.stringify(payload, null, 2), 'utf8');
}

let redisClient = null;

async function getRedis() {
  if (redisClient) return redisClient;

  // Current Vercel path: Upstash Redis (Marketplace integration)
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Redis } = await import('@upstash/redis');
    redisClient = Redis.fromEnv();
    return redisClient;
  }

  // Legacy: old Vercel KV env names (migrated projects)
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { kv } = await import('@vercel/kv');
    redisClient = {
      async get(key) {
        return kv.get(key);
      },
      async set(key, value) {
        await kv.set(key, value);
      }
    };
    return redisClient;
  }

  return null;
}

async function storageMode() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return 'upstash';
  }
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return 'kv-legacy';
  }
  return 'local';
}

async function loadEntries() {
  const redis = await getRedis();
  if (redis) {
    try {
      const stored = await redis.get(STORE_KEY);
      if (stored && typeof stored === 'object') return stored;
    } catch (err) {
      console.error('Redis load failed:', err);
    }
  }
  return readLocalEntries();
}

async function saveEntries(entries) {
  const redis = await getRedis();
  if (redis) {
    await redis.set(STORE_KEY, entries);
    return await storageMode();
  }
  writeLocalEntries(entries);
  return 'local';
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      if (req.query.health === '1') {
        const mode = await storageMode();
        return res.status(200).json({ ok: true, storage: mode });
      }

      const entries = await loadEntries();

      if (req.query.prefix) {
        const prefix = String(req.query.prefix);
        const keys = Object.keys(entries).filter((k) => k.startsWith(prefix));
        return res.status(200).json({ keys });
      }

      if (req.query.key) {
        const key = String(req.query.key);
        const value = Object.prototype.hasOwnProperty.call(entries, key) ? entries[key] : null;
        return res.status(200).json({ value });
      }

      return res.status(200).json({ entries, storage: await storageMode() });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const entries = await loadEntries();

      if (body.action === 'wipe' && body.prefix) {
        const prefix = String(body.prefix);
        Object.keys(entries).forEach((k) => {
          if (k.startsWith(prefix)) delete entries[k];
        });
        await saveEntries(entries);
        return res.status(200).json({ ok: true });
      }

      if (body.action === 'delete' && Array.isArray(body.keys)) {
        body.keys.forEach((k) => {
          if (typeof k === 'string') delete entries[k];
        });
        await saveEntries(entries);
        return res.status(200).json({ ok: true });
      }

      if (!body.key) {
        return res.status(400).json({ error: 'Missing key' });
      }

      entries[String(body.key)] = body.value;
      const mode = await saveEntries(entries);
      return res.status(200).json({ ok: true, storage: mode });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('store API error:', err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
}
