<div align="center">

```
     ██╗██╗   ██╗ ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗ ██████╗
     ██║██║   ██║██╔════╝ ██║   ██║██╔══██╗████╗  ██║██╔════╝
     ██║██║   ██║██║  ███╗██║   ██║███████║██╔██╗ ██║██║  ███╗
██   ██║██║   ██║██║   ██║██║   ██║██╔══██║██║╚██╗██║██║   ██║
╚█████╔╝╚██████╔╝╚██████╔╝╚██████╔╝██║  ██║██║ ╚████║╚██████╔╝
 ╚════╝  ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝
```

# juguang-bulk-apikey

**Bulk-create Juguang (聚光AI) accounts with auto-generated API keys — OpenAI-compatible inference (121 models) with tool-calling + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-121%20served-412991?style=for-the-badge)](https://ai.juguang.chat)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-121-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Why this exists

Juguang (聚光AI) is a New API panel (v1.0.0-rc.41) with **no captcha**, a plain e-mail + password sign-up and a **paid daily check-in** — the balance that makes the key worth minting is the check-in award, not a one-shot sign-up grant. The default group serves 121 model ids and the whole default family **calls tools** (verified: `get_time` came back as a real `tool_calls` payload with correct arguments).

## 🎁 Free tier — how much you get

| What | Value |
| --- | --- |
| Sign-up grant | 0 quota — the account starts empty (`self.quota = 0`) |
| Daily check-in | **enabled and paid**: 662,984 – 2,235,284 quota measured across accounts on the first day |
| Captcha at sign-up | **none** (`turnstile_check: false`) |
| E-mail the panel accepts | plain `@gmail.com`; Mailtrap/`inbound-mailtrap.io` is refused with `This email address is not allowed by the administrator's email policy` |
| Tool calling | **yes** on `deepseek-v4.1-flash`, `deepseek-v4-flash`, `[ccmax]claude-haiku-4-5-20251001`, `[0.4刀/次]gemini-3-flash` |
| The unit that scales | **one account = one key** (the quota lives on the account) |

> 💡 The free tier is set by Juguang (聚光AI) and can change. Check the live numbers at [ai.juguang.chat](https://ai.juguang.chat) — and let the tool's own gate decide:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Models — all 121 of them

## 🧪 How to use the API

The base URL is **\`https://ai.juguang.chat/v1\`** — OpenAI-compatible, so anything that speaks OpenAI works (SDKs, Cursor, OpenCode, Kilo Code, …).

```bash
curl https://ai.juguang.chat/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Quick start

### 🖱️ The launcher

## ✅ Verified working — every key is tested

Measured 2026-10-22 through the WARP exit fleet: the mint chain ran end to end (register → login → check-in → token → reveal → chat) and the reference key answered `200` with real content. Tool calling was probed with a `get_time` schema on four default-group models; every one answered a real `tool_calls` payload.

> **Quality gates.** Every key here passed a live `chat-200` before it was written to `keys.txt`
> (dead keys are never shipped). Router combos follow the same rule at the model level: an entry is
> added **only if the model answers `chat-200` and can call tools** — a model without tool support,
> a dead key or a dead provider is dropped instead of added. Re-run the verify step any time;
> failures are reported, never hidden.

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Juguang (聚光AI) page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://ai.juguang.chat/v1/chat/completions → real content = the key is live
```

| Step | Call | Notes |
| --- | --- | --- |
| gates | `GET /api/status` | register + e-mail verification on, `turnstile_check: false`, check-in on |
| mailbox | Emailnator gmail | a fresh address per account; the panel refuses non-gmail domains |
| code | `GET /api/verification?email=…` | 6-hex code, brand mail subject `聚光AI邮箱验证邮件` — the inbox is shared across lanes, so the reader must filter by that subject |
| register | `POST /api/user/register` | username + password + `verification_code` |
| login | `POST /api/user/login` | sets the session cookie; the fork also needs the `New-Api-User` header |
| check-in | `POST /api/user/checkin` | pays the day's quota into the account |
| key | `POST /api/token/` then `POST /api/token/<id>/key` | rc.41 answers the create call with a **masked** key; only the reveal route returns the real one |
| proof | `POST /v1/chat/completions` | 200 with real content (and `tool_calls` when tools are sent) = the key is live |

## ⚙️ CLI options

```bash
node src/cli.js --count 10            # mint 10 accounts, one key each
node src/cli.js --count 5 --model deepseek-v4.1-flash
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # test the exits you have against the panel
node src/launcher.js                  # interactive menu
```

## 🛰️ Behind a proxy

**Required.** The panel binds a session to the exit that created it and bans abusive exits, so every account is minted through an exit from your list.

- Put one exit per line in `proxies.txt` (`http://`, `socks5://`, `socks4://` or bare `host:port`), or set `JUGUANG_PROXIES`, or pass `--pool <file>`.
- Without a list the tool stops and says so — it never falls back to your own address.

## 📄 Files

| Path | Contents |
| --- | --- |
| `keys.txt` | one live-verified key per line — git-ignored |
| `keys-dead.txt` | keys that stopped answering, with the panel's answer kept verbatim |
| `accounts.json` | e-mail, password, steps and the verification result per account — git-ignored |
| `proxies.txt` | your exits — git-ignored |
| `out/` | per-run logs — git-ignored |

## 🔌 Connect to 9Router

## 🔌 Connect to OmniRoute
## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Provider | **Juguang (聚光AI)** — [ai.juguang.chat](https://ai.juguang.chat) |
| 🎁 What the provider gives | one gmail account per key · 121 models · daily check-in pays the balance · every key chat-200 + tools-verified |
| 🔑 What one key gets you | one API key scoped to its own account: the 121 model ids on the endpoint below, at your plan's limits. The quota lives on the **account**, which is exactly why this tool creates one account per key |
| 🌐 API shape | OpenAI-compatible: `POST https://ai.juguang.chat/v1/chat/completions` |
| 🔒 Your data | only ai.juguang.chat and the inbox backend you configure are contacted; keys stay on your machine |

## 🐞 Issues

If Juguang (聚光AI) changes its signup shape or rate limits, the tool stops at that step and says so. **[Open an issue](../../issues)** with the command you ran and the exact output; PRs are welcome.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 juguang-bulk-apikey contributors

</div>
