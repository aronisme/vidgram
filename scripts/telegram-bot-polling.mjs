/**
 * Local Telegram Bot Long-Polling Runner
 * Digunakan untuk menguji bot secara langsung di komputer lokal tanpa perlu ngrok atau hosting publik.
 *
 * Cara menjalankan:
 *   node scripts/telegram-bot-polling.mjs
 */

import fs from 'fs';
import path from 'path';

// Helper to read .env.local manually
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key && values.length > 0) {
          process.env[key.trim()] = values.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    });
  }
}

loadEnv();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN tidak ditemukan di .env.local!');
  process.exit(1);
}

const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function callTelegram(method, body = {}) {
  const res = await fetch(`${API_BASE}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return await res.json();
}

async function startPolling() {
  console.log('🤖 Menghubungkan ke Telegram Bot...');
  const me = await callTelegram('getMe');
  if (!me.ok) {
    console.error('❌ Gagal terhubung ke Telegram Bot:', me.description);
    return;
  }

  console.log(`✅ Bot Berhasil Terhubung: @${me.result.username} (${me.result.first_name})`);

  // Hapus webhook agar mode polling bisa menerima pesan
  await callTelegram('deleteWebhook');
  console.log('🔄 Mode Polling Lokal Aktif! Silakan kirim pesan atau link TikTok ke @' + me.result.username);
  console.log('Tekan Ctrl+C untuk berhenti.\n');

  let offset = 0;

  while (true) {
    try {
      const updates = await callTelegram('getUpdates', {
        offset,
        timeout: 25,
        allowed_updates: ['message', 'callback_query'],
      });

      if (updates.ok && updates.result.length > 0) {
        for (const update of updates.result) {
          offset = update.update_id + 1;

          // Forward update ke Next.js API route lokal jika berjalan, atau proses langsung
          try {
            const devServerUrl = 'http://localhost:3000/api/telegram';
            const localRes = await fetch(devServerUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(update),
            });

            if (localRes.ok) {
              console.log(`📨 Update #${update.update_id} diproses oleh Dev Server Next.js.`);
            } else {
              console.log(`⚠️ Dev Server lokal status: ${localRes.status}.`);
            }
          } catch (serverErr) {
            console.log(`ℹ️ [Tip] Jalankan 'npm run dev' di terminal lain agar webhook lokal merespons otomatis.`);
          }
        }
      }
    } catch (loopErr) {
      console.error('Polling error:', loopErr.message);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

startPolling();
