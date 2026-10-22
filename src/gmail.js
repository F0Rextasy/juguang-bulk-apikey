'use strict';

/**
 * Gmail mailboxes from Emailnator (the fleet's Emailnator client in
 * `providers/cloudflare-wai/emailnator.js`), wrapped with exit rotation and the
 * pacing the fleet measured (Emailnator 429s under load → 6 s between calls,
 * 30 s backoff on failure).
 *
 * Why: several panels here enforce an e-mail **domain whitelist** and accept
 * only qq/gmail; Mailtrap/inboxes domains are refused server-side
 * (measured: 快跑API "email domain name whitelist", AIAIAI "仅支持 QQ 邮箱和 Gmail 邮箱").
 *
 * `plain` (dots stripped) is the form the panel must be given; Emailnator's own
 * message API is keyed by the dotted form.
 */

const path = require('path');
const { sleep, isExitError } = require('./lib');

let emailnator = null;
try {
  emailnator = require('./emailnator');
} catch (e) {
  /* reported on first use */
}

let lastCall = 0;
let lock = Promise.resolve();

/** Serialized + paced access to Emailnator (it rate-limits by habit). */
function gate(fn) {
  const run = lock.then(async () => {
    const gap = 6000 - (Date.now() - lastCall);
    if (gap > 0) await sleep(gap);
    try {
      return await fn();
    } finally {
      lastCall = Date.now();
    }
  });
  lock = run.catch(() => {});
  return run;
}

async function withRetry(label, fn, { tries = 5 } = {}) {
  let last = null;
  for (let i = 0; i < tries; i++) {
    try {
      return await gate(fn);
    } catch (e) {
      last = e;
      const msg = String(e.message || e);
      if (/429|rate|too many/i.test(msg)) await sleep(20000 + i * 15000);
      else await sleep(3000 + i * 4000);
    }
  }
  throw new Error(`${label}: ${String(last && last.message).slice(0, 160)}`);
}

function pickExit(pool) {
  return pool ? pool.next() : null;
}

/** Fresh gmail box; returns {plain, dotted, exit}. */
async function newGmail(pool, { tries = 6 } = {}) {
  if (!emailnator) throw new Error('emailnator module missing');
  let lastErr = null;
  for (let i = 0; i < tries; i++) {
    const exit = pickExit(pool);
    try {
      const box = await withRetry('emailnator generate', () => emailnator.newAddress(exit), { tries: 3 });
      if (pool && pool.alive) pool.alive(exit);
      return { plain: box.plain, dotted: box.dotted, exit: exit && exit.line, provider: 'emailnator' };
    } catch (e) {
      lastErr = e;
      if (exit) pool.kill(exit);
    }
  }
  throw lastErr;
}

async function list(plain, pool, { tries = 5 } = {}) {
  for (let i = 0; i < tries; i++) {
    const exit = pickExit(pool);
    try {
      const messages = await withRetry('emailnator list', () => emailnator.listMessages(plain, exit), { tries: 3 });
      if (pool && pool.alive) pool.alive(exit);
      return { messages, exit: exit && exit.line };
    } catch (e) {
      if (exit) pool.kill(exit);
      if (i === tries - 1) throw e;
    }
  }
  return { messages: [] };
}

async function read(id, pool, { tries = 4 } = {}) {
  for (let i = 0; i < tries; i++) {
    const exit = pickExit(pool);
    try {
      const full = await withRetry('emailnator read', () => emailnator.readMessage(id, exit), { tries: 3 });
      if (pool && pool.alive) pool.alive(exit);
      return full;
    } catch (e) {
      if (exit) pool.kill(exit);
      if (i === tries - 1) throw e;
    }
  }
  return {};
}

/** Polls until `extract(text)` matches; text = subject + readable body. */
async function waitCode(plain, pool, extract, { timeoutMs = 240000, pollMs = 8000 } = {}) {
  const t0 = Date.now();
  const seen = new Set();
  while (Date.now() - t0 < timeoutMs) {
    let messages = [];
    try {
      messages = (await list(plain, pool)).messages;
    } catch (e) {
      await sleep(pollMs);
      continue;
    }
    for (const m of messages) {
      const id = String(m.message_id || m.id || '');
      const subject = m.subject || '';
      if (!id || seen.has(id)) continue;
      seen.add(id);
      let text = subject;
      try {
        const full = await read(id, pool);
        // Emailnator answers with the body in `content` (HTML); `text`/`html` are
        // other backends' names — read all three.
        text = `${subject}\n${full.text || ''}\n${String(full.content || full.html || '').replace(/<[^>]+>/g, ' ')}`;
      } catch (e) {
        /* subject-only */
      }
      // `extract` may be a function or a RegExp (the browser-generic mint passes its link
      // pattern through); calling a RegExp threw `extract is not a function`.
      const code = typeof extract === 'function' ? extract(text) : (String(text).match(extract) || [])[0];
      if (code) return { code, subject, id, text: text.slice(0, 4000), elapsed: Date.now() - t0 };
    }
    await sleep(pollMs);
  }
  return null;
}

module.exports = { newGmail, list, read, waitCode };
