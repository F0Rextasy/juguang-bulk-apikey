'use strict';

/**
 * Clerk FAPI client (the fleet's proven browser-less signup path — OpenRouter
 * unlocked it; FastRouter's signup is the same Clerk Frontend API, instance
 * `clerk.fastrouter.ai`).
 *
 * Measured contract (OpenRouter, 2026-10-14; re-verified per host here):
 *   GET  /v1/environment?<QS>                                → warm, sets __client cookies
 *   POST /v1/client/sign_ups?<QS>                             form: email_address, password, first_name, last_name, legal_accepted
 *   POST /v1/client/sign_ups/{id}/prepare_verification?<QS>   form: strategy=email_code|email_link, redirect_url
 *   POST /v1/client/sign_ups/{id}/attempt_verification?<QS>   form: strategy=email_code, code=NNNNNN
 *   (link flow: GET the emailed /v1/verify?token=… URL with the same jar)
 *
 * Cookies and the `Origin` header are what Clerk checks; both are carried here.
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const { createAgent } = require('./proxy');
const { req, isExitError } = require('./lib');

const QS = '__clerk_api_version=2026-05-12&_clerk_js_version=6.39.0';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';

/**
 * Exit supply that proves an exit *at the moment it is used*: free exits here
 * live 1–5 minutes, so a pool verified two minutes ago is worth nothing. Every
 * `next()` tries candidates in order with a cheap GET on the target host and
 * returns the first that answers; `kill()` drops the failures for the run.
 */
class LiveSupply {
  constructor(candidates, { host, origin, path = '/v1/environment', timeoutMs = 10000, log = () => {} } = {}) {
    this.candidates = [...candidates];
    this.host = host;
    this.origin = origin;
    this.path = path;
    this.timeoutMs = timeoutMs;
    this.log = log;
    this.sticky = null;
    this.tested = 0;
  }

  async next() {
    if (this.sticky && Math.random() < 0.8) return this.sticky;
    // Test in parallel batches: serial probing of 25 candidates at a 10 s cap
    // can burn four minutes before the flow even starts.
    for (let round = 0; round < 5; round++) {
      const batch = [];
      for (let i = 0; i < 4 && this.candidates.length; i++) {
        const exit = this.candidates.shift();
        this.candidates.push(exit);
        batch.push(exit);
      }
      if (!batch.length) break;
      const results = await Promise.all(
        batch.map(async (exit) => {
          this.tested++;
          try {
            const res = await req(exit, `https://${this.host}${this.path}`, {
              timeoutMs: this.timeoutMs,
              headers: { accept: '*/*', origin: this.origin },
            });
            return res.status > 0 ? { exit, status: res.status } : null;
          } catch (e) {
            return null;
          }
        })
      );
      const winner = results.find(Boolean);
      if (winner) {
        this.sticky = winner.exit;
        this.log(`  supply ✔ ${winner.exit.line} → ${winner.status} (tested ${this.tested})`);
        return winner.exit;
      }
    }
    throw new Error(`no exit reaches ${this.host} right now (tested ${this.tested})`);
  }

  kill(p) {
    if (this.sticky === p) this.sticky = null;
    const i = this.candidates.findIndex((c) => c.line === (p && p.line));
    if (i >= 0) this.candidates.splice(i, 1);
  }

  alive(p) {
    if (p) this.sticky = p;
  }

  /** Same contract as `ExitPool.attempt` so panels can use either supply. */
  async attempt(fn, { tries = 6, onFail = null, label = '' } = {}) {
    let last = null;
    for (let i = 0; i < tries; i++) {
      let p = null;
      try {
        p = await this.next();
        const out = await fn(p, i);
        this.alive(p);
        return out;
      } catch (e) {
        last = e;
        if (isExitError(e)) {
          this.kill(p);
          if (onFail) onFail(e, p, i);
          continue;
        }
        throw e;
      }
    }
    throw new Error(`supply${label ? ' ' + label : ''} exhausted after ${tries} tries: ${String(last && last.message).slice(0, 120)}`);
  }
}

class ClerkClient {
  constructor({ clerkHost, origin, proxy, pool = null, timeoutMs = 45000 }) {
    if (!proxy) throw new Error('ClerkClient needs an exit (refusing direct)');
    this.clerkHost = clerkHost.replace(/^https?:\/\//, '');
    this.origin = origin.replace(/\/$/, '');
    this.proxy = proxy;
    this.pool = pool;
    this.timeoutMs = timeoutMs;
    this.cookies = new Map();
    this.rotations = 0;
  }

  /** Free exits die mid-flow: the next call re-picks through `pool.next()`
   *  (which preflights). The Clerk session lives server-side, so cookies survive. */
  rotate() {
    if (this.proxy) {
      if (this.pool && this.pool.kill) this.pool.kill(this.proxy);
      this.proxy = null;
      this.rotations++;
    }
  }

  cookieHeader() {
    return [...this.cookies.values()].map((c) => `${c.name}=${c.value}`).join('; ');
  }

  absorb(res) {
    const raw = res.headers['set-cookie'] || [];
    for (const c of raw) {
      const [pair] = c.split(';');
      const idx = pair.indexOf('=');
      if (idx < 0) continue;
      const name = pair.slice(0, idx).trim();
      const value = pair.slice(idx + 1).trim();
      if (!name) continue;
      if (value === '' || /deleted/i.test(c)) this.cookies.delete(name);
      else this.cookies.set(name, { name, value });
    }
  }

  request(method, pathname, { body = null, headers = {}, url = null, tries = 4 } = {}) {
    const target = url || `https://${this.clerkHost}${pathname}`;
    return (async () => {
      let last = null;
      for (let i = 0; i < tries; i++) {
        try {
          // pick (and prove) an exit inside the loop: `next()` is async, so a
          // rotation must never leave a Promise sitting in `this.proxy`
          if (this.pool && this.pool.next) {
            const next = await this.pool.next();
            if (next && next.host && next.port) this.proxy = next;
          }
          if (!this.proxy || !this.proxy.host || !this.proxy.port) throw new Error('no usable exit (malformed proxy object)');
          const u = new URL(target);
          const payload =
            body === null ? null : Buffer.from(typeof body === 'string' ? body : new URLSearchParams(body).toString());
          const h = {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'user-agent': UA,
            origin: this.origin,
            referer: `${this.origin}/`,
            ...headers,
          };
          if (payload) h['content-type'] = h['content-type'] || 'application/x-www-form-urlencoded';
          if (payload) h['content-length'] = payload.length;
          const jar = this.cookieHeader();
          if (jar) h.cookie = jar;
          const res = await new Promise((resolve, reject) => {
            const lib = u.protocol === 'https:' ? https : http;
            const r = lib.request(
              { method, host: u.hostname, port: u.port || (u.protocol === 'https:' ? 443 : 80), path: u.pathname + u.search, agent: createAgent(this.proxy), headers: h },
              (response) => {
                let text = '';
                response.setEncoding('utf8');
                response.on('data', (c) => (text += c));
                response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, text }));
              }
            );
            r.setTimeout(this.timeoutMs, () => r.destroy(new Error('timeout ' + target)));
            r.on('error', reject);
            if (payload) r.write(payload);
            r.end();
          });
          this.absorb(res);
          if (this.pool && this.pool.alive) this.pool.alive(this.proxy);
          let json = null;
          try {
            json = JSON.parse(res.text);
          } catch (e) {}
          return { ...res, json };
        } catch (e) {
          last = e;
          this.rotate();
        }
      }
      throw last;
    })();
  }

  get environment() {
    return this.request('GET', `/v1/environment?${QS}`, { tries: 3 });
  }

  createSignup({ email, password, firstName = 'Alex', lastName = 'Morgan', legalAccepted = true }) {
    return this.request('POST', `/v1/client/sign_ups?${QS}`, {
      body: { email_address: email, password, first_name: firstName, last_name: lastName, legal_accepted: String(legalAccepted) },
    });
  }

  prepare(signupId, { strategy = 'email_code', redirectUrl = null } = {}) {
    const body = { strategy };
    if (redirectUrl) body.redirect_url = redirectUrl;
    return this.request('POST', `/v1/client/sign_ups/${signupId}/prepare_verification?${QS}`, { body });
  }

  attemptCode(signupId, code) {
    return this.request('POST', `/v1/client/sign_ups/${signupId}/attempt_verification?${QS}`, { body: { strategy: 'email_code', code } });
  }

  /** Link flow: following the emailed verify URL finishes the signup. */
  followLink(url) {
    return this.request('GET', null, { url, tries: 2 });
  }

  client() {
    return this.request('GET', `/v1/client?${QS}`, { tries: 3 });
  }
}

module.exports = { ClerkClient, LiveSupply, QS, UA };
