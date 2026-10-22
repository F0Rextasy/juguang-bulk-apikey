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

**Créez en masse des comptes Juguang (聚光AI) avec des clés API générées automatiquement — inférence compatible OpenAI (121 modèles) avec appel d'outils + connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-121%20served-412991?style=for-the-badge)](https://ai.juguang.chat)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Niveau gratuit](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-121-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Comment ça marche](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Pourquoi cela existe

Juguang (聚光AI) est un panneau New API (v1.0.0-rc.41) **sans captcha**, avec une inscription simple par e-mail + mot de passe et un **check-in quotidien payant** — le solde qui rend la clé intéressante à générer provient du check-in, et non d'une attribution unique à l'inscription. Le groupe par défaut sert 121 identifiants de modèles et toute la famille par défaut **appelle des outils** (vérifié : `get_time` est revenu sous forme de véritable charge utile `tool_calls` avec les arguments corrects).

## 🎁 Niveau gratuit — ce que vous obtenez

| Élément | Valeur |
| --- | --- |
| Attribution à l'inscription | 0 quota — le compte démarre vide (`self.quota = 0`) |
| Check-in quotidien | **activé et payant** : 662 984 – 2 235 284 quota mesurés sur les comptes le premier jour |
| Captcha à l'inscription | **aucun** (`turnstile_check: false`) |
| E-mail accepté par le panneau | un simple `@gmail.com` ; Mailtrap/`inbound-mailtrap.io` est refusé avec `This email address is not allowed by the administrator's email policy` |
| Appel d'outils | **oui** sur `deepseek-v4.1-flash`, `deepseek-v4-flash`, `[ccmax]claude-haiku-4-5-20251001`, `[0.4刀/次]gemini-3-flash` |
| L'unité qui évolue | **un compte = une clé** (le quota vit sur le compte) |

> 💡 Le niveau gratuit est défini par Juguang (聚光AI) et peut changer. Consultez les chiffres en direct sur [ai.juguang.chat](https://ai.juguang.chat) — et laissez le propre contrôle de l'outil décider :

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modèles — les 121

## 🧪 Comment utiliser l'API

L'URL de base est **\`https://ai.juguang.chat/v1\`** — compatible OpenAI, donc tout ce qui parle OpenAI fonctionne (SDK, Cursor, OpenCode, Kilo Code, …).

```bash
curl https://ai.juguang.chat/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Démarrage rapide

### 🖱️ Le lanceur

## ✅ Vérifié fonctionnel — chaque clé est testée

Mesuré le 2026-10-22 via la flotte de sorties WARP : la chaîne de génération s'est déroulée de bout en bout (inscription → connexion → check-in → token → révélation → chat) et la clé de référence a répondu `200` avec du contenu réel. L'appel d'outils a été testé avec un schéma `get_time` sur quatre modèles du groupe par défaut ; chacun a répondu une véritable charge utile `tool_calls`.

> **Contrôles qualité.** Chaque clé ici a passé un `chat-200` en direct avant d'être écrite dans `keys.txt`
> (les clés mortes ne sont jamais livrées). Les combinaisons de routeur suivent la même règle au niveau du modèle : une entrée n'est
> ajoutée **que si le modèle répond `chat-200` et peut appeler des outils** — un modèle sans support des outils,
> une clé morte ou un fournisseur mort est écarté plutôt qu'ajouté. Relancez l'étape de vérification à tout moment ;
> les échecs sont signalés, jamais masqués.

## 🧭 Comment ça marche

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Juguang (聚光AI) page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://ai.juguang.chat/v1/chat/completions → real content = the key is live
```

| Étape | Appel | Remarques |
| --- | --- | --- |
| barrières | `GET /api/status` | inscription + vérification e-mail activées, `turnstile_check: false`, check-in activé |
| boîte mail | Emailnator gmail | une adresse fraîche par compte ; le panneau refuse les domaines non-gmail |
| code | `GET /api/verification?email=…` | code à 6 caractères hexadécimaux, objet du mail de marque `聚光AI邮箱验证邮件` — la boîte mail est partagée entre les voies, le lecteur doit donc filtrer sur cet objet |
| inscription | `POST /api/user/register` | nom d'utilisateur + mot de passe + `verification_code` |
| connexion | `POST /api/user/login` | définit le cookie de session ; le fork a aussi besoin de l'en-tête `New-Api-User` |
| check-in | `POST /api/user/checkin` | verse le quota du jour sur le compte |
| clé | `POST /api/token/` puis `POST /api/token/<id>/key` | rc.41 répond à l'appel de création avec une clé **masquée** ; seule la route de révélation renvoie la vraie |
| preuve | `POST /v1/chat/completions` | 200 avec du contenu réel (et `tool_calls` lorsque des outils sont envoyés) = la clé est active |

## ⚙️ Options CLI

```bash
node src/cli.js --count 10            # mint 10 accounts, one key each
node src/cli.js --count 5 --model deepseek-v4.1-flash
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # test the exits you have against the panel
node src/launcher.js                  # interactive menu
```

## 🛰️ Derrière un proxy

**Requis.** Le panneau lie une session à la sortie qui l'a créée et bannit les sorties abusives, donc chaque compte est généré via une sortie de votre liste.

- Placez une sortie par ligne dans `proxies.txt` (`http://`, `socks5://`, `socks4://` ou simplement `host:port`), ou définissez `JUGUANG_PROXIES`, ou passez `--pool <file>`.
- Sans liste, l'outil s'arrête et le signale — il ne se rabat jamais sur votre propre adresse.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé vérifiée en direct par ligne — ignoré par git |
| `keys-dead.txt` | les clés qui ont cessé de répondre, avec la réponse du panneau conservée mot pour mot |
| `accounts.json` | e-mail, mot de passe, étapes et résultat de vérification par compte — ignoré par git |
| `proxies.txt` | vos sorties — ignoré par git |
| `out/` | journaux par exécution — ignoré par git |

## 🔌 Se connecter à 9Router

## 🔌 Se connecter à OmniRoute
## 🔑 Ce qu'une clé vous apporte

| | |
| --- | --- |
| 🏢 Fournisseur | **Juguang (聚光AI)** — [ai.juguang.chat](https://ai.juguang.chat) |
| 🎁 Ce que le fournisseur donne | un compte gmail par clé · 121 modèles · le check-in quotidien alimente le solde · chaque clé vérifiée chat-200 + outils |
| 🔑 Ce qu'une clé vous apporte | une clé API limitée à son propre compte : les 121 identifiants de modèles sur le point de terminaison ci-dessous, dans les limites de votre forfait. Le quota vit sur le **compte**, c'est précisément pourquoi cet outil crée un compte par clé |
| 🌐 Forme de l'API | compatible OpenAI : `POST https://ai.juguang.chat/v1/chat/completions` |
| 🔒 Vos données | seuls ai.juguang.chat et le backend de boîte mail que vous configurez sont contactés ; les clés restent sur votre machine |

## 🐞 Problèmes

Si Juguang (聚光AI) modifie la forme de son inscription ou ses limites de débit, l'outil s'arrête à cette étape et le signale. **[Ouvrez un ticket](../../issues)** avec la commande que vous avez exécutée et la sortie exacte ; les PR sont bienvenues.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 juguang-bulk-apikey contributors

</div>