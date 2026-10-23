#!/usr/bin/env node
'use strict';

/**
 * repo-cli — the self-contained mint/verify engine shipped inside every
 * `<provider>-bulk-apikey` repository built from a community-wave provider.
 *
 * It reads `src/preset.js` (provider constants, generated at build time) and the
 * shared engines copied next to it (`./lib.js`, `./newapi.js`, `./clerk.js`,
 * `./gmail.js`, `./proxy.js`), so the published repo needs no lab checkout.
 *
 *   node src/cli.js --count 5 [--pool proxies.txt] [--model <id>]
 *   node src/cli.js --verify-only
 *   node src/cli.js --screen
 *
 * One account = one key. A key is written only after a real chat call answered
 * 200 on this provider alone.
 */

const fs = require('fs');
const path = require('path');
const { loadExits, req, sleep, randHex, randPass, nowIso } = require('./lib');
const { LiveSupply } = require('./clerk');
const { Panel, gates } = require('./newapi');
const gmail = require('./gmail');
const P = require('./preset');

const ROOT = path.resolve(__dirname, '..');
const KEYS = path.join(ROOT, 'keys.txt');
const DEAD = path.join(ROOT, 'keys-dead.txt');
const ACCOUNTS = path.join(ROOT, 'accounts.json');
const OUT = path.join(ROOT, 'out');

const argv = process.argv.slice(2);
const one = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
const has = (n) => argv.includes(`--${n}`);
const DRY = has('dry'); // resolve the plan, write nothing, send nothing
const COUNT = parseInt(one('count', '5'), 10) || 5;
const MODEL = one('model', P.model);
const ENV_POOLS = (process.env[`${P.env}_PROXIES`] || '').split(',').map((s) => s.trim()).filter(Boolean);
const POOL_FILES = [one('pool', ''), ...ENV_POOLS, path.join(ROOT, 'proxies.txt'), ...(P.poolFiles || [])].filter((f) => f && fs.existsSync(f));
const SUBJECT_RE = (() => { try { return P.mailSubject ? new RegExp(P.mailSubject, 'i') : null; } catch (e) { return null; } })();
const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...a);

if (has('help') || has('h')) {
  console.log(`${P.repoName} — one ${P.title} account per API key.\n`);
  console.log('  --count N        accounts/keys to mint (5)');
  console.log('  --pool FILE      exit list (or set ' + P.env + '_PROXIES / proxies.txt)');
  console.log('  --model ID       model used for the live verification');
  console.log('  --verify-only    re-check keys.txt');
  console.log('  --screen         test the exit pool against this panel');
  console.log('  --dry            print the resolved plan and exit (nothing written)');
  process.exit(0);
}

// `--dry` first, `out/` only for a real run: `--help`/`--dry` must not create
// anything in the checkout (dry-mutation audit, 2026-10-23).
if (DRY) {
  console.log(`${P.repoName} dry run — nothing written, nothing sent
  command   node src/cli.js --count ${COUNT}
  count     ${COUNT}
  model     ${MODEL}
  pool      ${POOL_FILES.length ? POOL_FILES.join(', ') : `none (write proxies.txt or set ${P.env}_PROXIES)`}
  keys      ${KEYS}`);
  process.exit(0);
}
fs.mkdirSync(OUT, { recursive: true });

const accounts = (() => { try { return JSON.parse(fs.readFileSync(ACCOUNTS, 'utf8')); } catch (e) { return []; } })();
const saveAccounts = () => fs.writeFileSync(ACCOUNTS, JSON.stringify(accounts, null, 1));
const readKeys = () => { try { return fs.readFileSync(KEYS, 'utf8').split(/\r?\n/).map((l) => l.split(/\s+/)[0]).filter(Boolean); } catch (e) { return []; } };
const appendKey = (k) => fs.appendFileSync(KEYS, (fs.existsSync(KEYS) && fs.statSync(KEYS).size ? '\n' : '') + k + '\n');

function makePool() {
  const exits = loadExits(POOL_FILES);
  if (!exits.length) {
    console.error(`no exits: put one proxy per line in proxies.txt (or set ${P.env}_PROXIES). Refusing to run direct.`);
    process.exit(2);
  }
  return exits;
}

const chat = (key, model, { tools = false, stream = false, prompt = 'Reply with the single word: ok' } = {}) =>
  ({ model, messages: [{ role: 'user', content: prompt }], ...(tools ? { tools: [TOOL], tool_choice: 'auto' } : {}), max_tokens: 64, stream });
const TOOL = { type: 'function', function: { name: 'get_time', description: 'current time', parameters: { type: 'object', properties: { tz: { type: 'string' } }, required: ['tz'] } } };

function judge(status, text, { stream = false } = {}) {
  let json = null; try { json = JSON.parse(text); } catch (e) {}
  const msg = json && json.choices && json.choices[0] && json.choices[0].message;
  const content = (msg && (msg.content || msg.reasoning_content || msg.reasoning)) || '';
  const tc = msg && msg.tool_calls;
  const live = status === 200 && (String(content).trim() || (tc && tc.length) || (stream && /"content"\s*:\s*"[^"]/.test(text)));
  return { status, content: String(content).slice(0, 60), tool_calls: Array.isArray(tc) ? tc.length : 0, live, note: String(text).replace(/\s+/g, ' ').slice(0, 200) };
}

async function verifyKey(exits, key, { tools = false, stream = false } = {}) {
  const pool = new LiveSupply(exits, { host: new URL(P.base).host, path: '/v1/models', origin: P.base, timeoutMs: 9000, log: () => {} });
  try {
    const r = await pool.attempt(async (p) => req(p, `${P.base}/v1/chat/completions`, {
      method: 'POST', body: JSON.stringify(chat(key, MODEL, { tools, stream })),
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json', accept: stream ? 'text/event-stream' : 'application/json' }, timeoutMs: 70000,
    }), { tries: 5, label: 'verify' });
    return judge(r.status, r.text, { stream });
  } catch (e) {
    return { status: -1, live: false, note: String(e.message).slice(0, 160) };
  }
}

async function verifyOnly() {
  const exits = makePool();
  const keys = readKeys();
  const live = [];
  const dead = [];
  for (const key of keys) {
    const v = await verifyKey(exits, key, { tools: P.tools, stream: P.stream });
    log(`${v.status}\t${key.slice(0, 12)}…\t${v.content || v.note.slice(0, 90)}`);
    if (v.live) live.push(key); else dead.push(`${key}\t${v.status}\t${v.note.slice(0, 160)}`);
  }
  fs.writeFileSync(KEYS, live.join('\n') + (live.length ? '\n' : ''));
  if (dead.length) fs.appendFileSync(DEAD, `# ${nowIso()} verify-only\n` + dead.join('\n') + '\n');
  log(`live ${live.length}/${keys.length}`);
}

async function screen() {
  const exits = makePool();
  const url = `${P.base}/api/status`;
  let ok = 0;
  let i = 0;
  await Promise.all(Array.from({ length: 24 }, async () => {
    while (i < exits.length) {
      const p = exits[i++];
      try { const r = await req(p, url, { timeoutMs: 12000, headers: { accept: 'application/json' } }); if (r.status > 0) ok++; } catch (e) {}
    }
  }));
  log(`${ok}/${exits.length} exits answer ${url}`);
}

async function mint() {
  const exits = makePool();
  const host = new URL(P.base).host;
  const supply = new LiveSupply(exits, { host, path: '/api/status', origin: P.base, timeoutMs: 9000, log: (m) => log(m) });
  const mailPool = new (require('./clerk').LiveSupply)(exits, { host, path: '/api/status', origin: P.base, timeoutMs: 9000, log: () => {} });
  const panel = new Panel(P.base, supply, { label: P.name, log });
  const st = await panel.status();
  const g = gates(st.json || {});
  log(`gates: ${JSON.stringify({ site: g.system_name, reg: g.register_enabled, em: g.email_verification, ts: g.turnstile_check, ci: g.checkin_enabled })}`);
  if (g.turnstile_check === true) { log('turnstile_check=true — this panel needs the browser mint; aborting'); process.exit(2); }

  let made = 0;
  for (let i = 0; i < COUNT; i++) {
    const box = await gmail.newGmail(mailPool);
    const username = `${P.tag}${randHex(6)}`.slice(0, 18);
    const password = randPass();
    const rec = { provider: P.name, base: P.base, index: accounts.length + 1, email: box.plain, mailbox: box, username, password, created: nowIso(), steps: {} };
    log(`#${rec.index} ${box.plain} user=${username}`);
    try {
      const sent = await panel.sendCode(box.plain, { tries: 8 });
      rec.steps.sendCode = { status: sent.status, body: sent.json ? (sent.json.message || JSON.stringify(sent.json)) : String(sent.text || '').slice(0, 150) };
      if (sent.status >= 400 || (sent.json && sent.json.success === false)) { rec.status = 'send-refused'; accounts.push(rec); saveAccounts(); continue; }
      const got = await gmail.waitCode(box.plain, mailPool, (t) => (SUBJECT_RE && !SUBJECT_RE.test(String(t)) ? null : (String(t).match(/([0-9]{4,8})/) || [])[1]), { timeoutMs: 240000, pollMs: 6000 });
      if (!got) { rec.status = 'no-code'; accounts.push(rec); saveAccounts(); continue; }
      rec.steps.code = { code: got.code, subject: got.subject };
      log(`  code ${got.code}`);
      const reg = await panel.register({ username, password, email: box.plain, code: got.code, tries: 4 });
      rec.steps.register = { status: reg.status, body: reg.json ? { success: reg.json.success, message: reg.json.message } : null };
      if (!(reg.json && reg.json.success)) { rec.status = 'register-refused'; accounts.push(rec); saveAccounts(); continue; }
      const login = await panel.login({ username, password, tries: 5 });
      rec.steps.login = { status: login.status, success: login.json && login.json.success };
      if (!(login.json && login.json.success)) { rec.status = 'login-refused'; accounts.push(rec); saveAccounts(); continue; }
      const self = await panel.self(4);
      if (self.json && self.json.data) panel.userId = self.json.data.id || panel.userId;
      rec.steps.self = { id: self.json && self.json.data && self.json.data.id, quota: self.json && self.json.data && (self.json.data.quota ?? self.json.data.balance) };
      log(`  self id=${rec.steps.self.id} quota=${rec.steps.self.quota}`);
      if (P.checkin) {
        const ci = await panel.checkin(3);
        rec.steps.checkin = { status: ci.status, body: ci.json ? { success: ci.json.success, message: ci.json.message, data: ci.json.data } : null };
        log(`  checkin ${ci.status} ${JSON.stringify(rec.steps.checkin.body).slice(0, 120)}`);
      }
      const created = await panel.createToken(`${P.tag}-${rec.index}`, 4, P.group || '');
      let key = created.key;
      const masked = (k) => !k || /\*/.test(k);
      if (masked(key)) {
        const list = await panel.listTokens(4);
        const pick = (list.items || []).find((t) => t.name === `${P.tag}-${rec.index}`) || (list.items || [])[0];
        if (pick && pick.id) { const rev = await panel.tokenKey(pick.id, 6); if (!masked(rev.key)) key = rev.key; }
      }
      if (!key) { rec.status = 'no-key'; accounts.push(rec); saveAccounts(); continue; }
      rec.key = key;
      const v = await verifyKey(exits, key, { tools: P.tools, stream: P.stream });
      rec.verify = v;
      log(`  verify ${v.status} ${v.content || v.note.slice(0, 90)}`);
      if (v.live) { rec.status = 'minted'; if (!readKeys().includes(key)) appendKey(key); made++; }
      else rec.status = 'key-unverified';
    } catch (e) {
      rec.status = 'error';
      rec.error = String(e.message).slice(0, 250);
      log(`  ${rec.error}`);
    }
    accounts.push(rec);
    saveAccounts();
  }
  log(`done: ${made}/${COUNT} key(s) this run`);
}

(has('verify-only') ? verifyOnly() : has('screen') ? screen() : mint()).catch((e) => { console.error('FATAL', e.message); process.exit(1); });
