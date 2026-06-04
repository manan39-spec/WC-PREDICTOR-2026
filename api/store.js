'use strict';

const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');

const STORE_KEY = 'wc26:entries';
const STORE_PATH = join(process.cwd(), 'data', 'store.json');

// ── Initialise KV/Redis client once at cold-start ──────────────────────────
let kvClient = null;
let _mode = 'local';

try {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    // Vercel KV / Upstash connected via legacy env names
    const { kv } = require('@vercel/kv');
    kvClient = { get: (k) => kv.get(k), set: (k, v) => kv.set(k, v) };
    _mode = 'kv-legacy';
  } else if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Redis } = require('@upstash/redis');
    kvClient = Redis.fromEnv();
    _mode = 'upstash';
  }
} catch (e) {
  console.error('[store] KV init failed, falling back to local file:', e.message);
  kvClient = null;
  _mode = 'local';
}

// ── Local-file helpers (dev / fallback) ────────────────────────────────────
function readLocal() {
  if (!existsSync(STORE_PATH)) return {};
  try {
    const raw = JSON.parse(readFileSync(STORE_PATH, 'utf8'));
    return raw.entries && typeof raw.entries === 'object' ? raw.entries : {};
  } catch { return {}; }
}

function writeLocal(entries) {
  writeFileSync(STORE_PATH, JSON.stringify({ version: 1, updatedAt: Date.now(), entries }, null, 2), 'utf8');
}

// ── Core load/save ─────────────────────────────────────────────────────────
async function load() {
  if (!kvClient) return readLocal();
  try {
    const v = await kvClient.get(STORE_KEY);
    if (v && typeof v === 'object') return v;
  } catch (e) { console.error('[store] load error:', e.message); }
  return readLocal();
}

async function save(entries) {
  if (!kvClient) { writeLocal(entries); return; }
  try { await kvClient.set(STORE_KEY, entries); }
  catch (e) { console.error('[store] save error:', e.message); }
}

// ── CORS ───────────────────────────────────────────────────────────────────
function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ── Handler ────────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    // GET
    if (req.method === 'GET') {
      if (req.query.health === '1') {
        return res.status(200).json({ ok: true, storage: _mode });
      }

      const entries = await load();

      if (req.query.prefix) {
        const prefix = String(req.query.prefix);
        return res.status(200).json({ keys: Object.keys(entries).filter(k => k.startsWith(prefix)) });
      }

      if (req.query.key) {
        const key = String(req.query.key);
        return res.status(200).json({ value: Object.prototype.hasOwnProperty.call(entries, key) ? entries[key] : null });
      }

      return res.status(200).json({ entries, storage: _mode });
    }

    // POST
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const entries = await load();

      if (body.action === 'wipe' && body.prefix) {
        const p = String(body.prefix);
        Object.keys(entries).forEach(k => { if (k.startsWith(p)) delete entries[k]; });
        await save(entries);
        return res.status(200).json({ ok: true });
      }

      if (body.action === 'delete' && Array.isArray(body.keys)) {
        body.keys.forEach(k => { if (typeof k === 'string') delete entries[k]; });
        await save(entries);
        return res.status(200).json({ ok: true });
      }

      if (!body.key) return res.status(400).json({ error: 'Missing key' });

      entries[String(body.key)] = body.value;
      await save(entries);
      return res.status(200).json({ ok: true, storage: _mode });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('[store] handler error:', err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
};
