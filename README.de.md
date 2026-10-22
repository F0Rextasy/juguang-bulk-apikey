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

**Massenhaftes Erstellen von Juguang (聚光AI)-Konten mit automatisch generierten API-Schlüsseln — OpenAI-kompatible Inferenz (121 Modelle) mit Tool-Calling + 9Router-Konnektor.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-121%20served-412991?style=for-the-badge)](https://ai.juguang.chat)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenlose Stufe](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-121-of-them) · [🧪 Die API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 So funktioniert es](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es das gibt

Juguang (聚光AI) ist ein New-API-Panel (v1.0.0-rc.41) mit **keinem Captcha**, einer einfachen E-Mail-+-Passwort-Registrierung und einem **bezahlten täglichen Check-in** — das Guthaben, das den Schlüssel wertvoll macht, ist die Check-in-Prämie, nicht eine einmalige Registrierungszuwendung. Die Standardgruppe bedient 121 Modell-IDs, und die gesamte Standardfamilie **ruft Tools auf** (verifiziert: `get_time` kam als echte `tool_calls`-Nutzlast mit korrekten Argumenten zurück).

## 🎁 Kostenlose Stufe — wie viel du bekommst

| Was | Wert |
| --- | --- |
| Registrierungszuwendung | 0 Kontingent — das Konto startet leer (`self.quota = 0`) |
| Täglicher Check-in | **aktiviert und bezahlt**: 662.984 – 2.235.284 Kontingent, gemessen über Konten am ersten Tag |
| Captcha bei der Registrierung | **keines** (`turnstile_check: false`) |
| E-Mail, die das Panel akzeptiert | einfache `@gmail.com`; Mailtrap/`inbound-mailtrap.io` wird mit `This email address is not allowed by the administrator's email policy` abgelehnt |
| Tool-Aufruf | **ja** bei `deepseek-v4.1-flash`, `deepseek-v4-flash`, `[ccmax]claude-haiku-4-5-20251001`, `[0.4刀/次]gemini-3-flash` |
| Die Einheit, die skaliert | **ein Konto = ein Schlüssel** (das Kontingent liegt auf dem Konto) |

> 💡 Die kostenlose Stufe wird von Juguang (聚光AI) festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen unter [ai.juguang.chat](https://ai.juguang.chat) — und lass das Gate des Tools selbst entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 121

## 🧪 So verwendest du die API

Die Basis-URL ist **\`https://ai.juguang.chat/v1\`** — OpenAI-kompatibel, also funktioniert alles, was OpenAI spricht (SDKs, Cursor, OpenCode, Kilo Code, …).

```bash
curl https://ai.juguang.chat/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Schnellstart

### 🖱️ Der Launcher

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

Gemessen am 2026-10-22 über die WARP-Exit-Flotte: Die Mint-Kette lief von Anfang bis Ende (registrieren → anmelden → Check-in → Token → aufdecken → chat), und der Referenzschlüssel antwortete mit `200` und echtem Inhalt. Tool-Aufrufe wurden mit einem `get_time`-Schema bei vier Modellen der Standardgruppe geprüft; jedes antwortete mit einer echten `tool_calls`-Nutzlast.

> **Qualitätsgates.** Jeder Schlüssel hier hat ein Live-`chat-200` bestanden, bevor er in `keys.txt` geschrieben wurde
> (tote Schlüssel werden nie ausgeliefert). Router-Kombinationen folgen derselben Regel auf Modellebene: Ein Eintrag wird
> **nur hinzugefügt, wenn das Modell `chat-200` antwortet und Tools aufrufen kann** — ein Modell ohne Tool-Unterstützung,
> ein toter Schlüssel oder ein toter Anbieter wird verworfen statt hinzugefügt. Führe den Verifizierungsschritt jederzeit erneut aus;
> Fehler werden gemeldet, nie versteckt.

## 🧭 So funktioniert es

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Juguang (聚光AI) page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://ai.juguang.chat/v1/chat/completions → real content = the key is live
```

| Schritt | Aufruf | Hinweise |
| --- | --- | --- |
| Gates | `GET /api/status` | Registrierung + E-Mail-Verifizierung an, `turnstile_check: false`, Check-in an |
| Mailbox | Emailnator gmail | eine frische Adresse pro Konto; das Panel lehnt Nicht-Gmail-Domains ab |
| Code | `GET /api/verification?email=…` | 6-Hex-Code, Marken-Mail-Betreff `聚光AI邮箱验证邮件` — der Posteingang wird über Lanes hinweg geteilt, daher muss der Leser nach diesem Betreff filtern |
| Registrieren | `POST /api/user/register` | Benutzername + Passwort + `verification_code` |
| Anmelden | `POST /api/user/login` | setzt das Session-Cookie; der Fork benötigt außerdem den Header `New-Api-User` |
| Check-in | `POST /api/user/checkin` | zahlt das Tageskontingent auf das Konto ein |
| Schlüssel | `POST /api/token/` dann `POST /api/token/<id>/key` | rc.41 antwortet auf den Erstellungsaufruf mit einem **maskierten** Schlüssel; nur die Reveal-Route gibt den echten zurück |
| Nachweis | `POST /v1/chat/completions` | 200 mit echtem Inhalt (und `tool_calls`, wenn Tools gesendet werden) = der Schlüssel ist live |

## ⚙️ CLI-Optionen

```bash
node src/cli.js --count 10            # mint 10 accounts, one key each
node src/cli.js --count 5 --model deepseek-v4.1-flash
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # test the exits you have against the panel
node src/launcher.js                  # interactive menu
```

## 🛰️ Hinter einem Proxy

**Erforderlich.** Das Panel bindet eine Sitzung an den Exit, der sie erstellt hat, und sperrt missbräuchliche Exits, daher wird jedes Konto über einen Exit aus deiner Liste erstellt.

- Lege einen Exit pro Zeile in `proxies.txt` ab (`http://`, `socks5://`, `socks4://` oder bloßes `host:port`), oder setze `JUGUANG_PROXIES`, oder übergib `--pool <file>`.
- Ohne eine Liste stoppt das Tool und sagt es — es fällt nie auf deine eigene Adresse zurück.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein live-verifizierter Schlüssel pro Zeile — von Git ignoriert |
| `keys-dead.txt` | Schlüssel, die nicht mehr antworten, mit der Antwort des Panels wortgetreu erhalten |
| `accounts.json` | E-Mail, Passwort, Schritte und das Verifizierungsergebnis pro Konto — von Git ignoriert |
| `proxies.txt` | deine Exits — von Git ignoriert |
| `out/` | Logs pro Lauf — von Git ignoriert |

## 🔌 Mit 9Router verbinden

## 🔌 Mit OmniRoute verbinden
## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **Juguang (聚光AI)** — [ai.juguang.chat](https://ai.juguang.chat) |
| 🎁 Was der Anbieter gibt | ein Gmail-Konto pro Schlüssel · 121 Modelle · der tägliche Check-in zahlt das Guthaben · jeder Schlüssel chat-200 + Tools-verifiziert |
| 🔑 Was ein Schlüssel dir bringt | ein API-Schlüssel, der auf sein eigenes Konto beschränkt ist: die 121 Modell-IDs am unten stehenden Endpunkt, im Rahmen der Limits deines Tarifs. Das Kontingent liegt auf dem **Konto**, weshalb dieses Tool genau ein Konto pro Schlüssel erstellt |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://ai.juguang.chat/v1/chat/completions` |
| 🔒 Deine Daten | nur ai.juguang.chat und das von dir konfigurierte Posteingangs-Backend werden kontaktiert; Schlüssel bleiben auf deinem Rechner |

## 🐞 Probleme

Wenn Juguang (聚光AI) seine Registrierungsform oder Ratenlimits ändert, stoppt das Tool an diesem Schritt und sagt es. **[Öffne ein Issue](../../issues)** mit dem ausgeführten Befehl und der exakten Ausgabe; PRs sind willkommen.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 juguang-bulk-apikey contributors

</div>