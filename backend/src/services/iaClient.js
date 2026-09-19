const env = require('../config/env');

async function analyserPhoto(photoUrl) {
  if (!env.iaServiceUrl) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), env.iaTimeoutMs);
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (env.iaApiKey) headers['X-API-KEY'] = env.iaApiKey;
    const response = await fetch(`${env.iaServiceUrl}/analyser`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ photoUrl }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Service IA indisponible (HTTP ${response.status})`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { analyserPhoto };