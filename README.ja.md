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

**Juguang (聚光AI) アカウントを自動生成された API キーとともに一括作成 — OpenAI 互換の推論（121 モデル）、ツール呼び出し対応 + 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-121%20served-412991?style=for-the-badge)](https://ai.juguang.chat)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-121-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題報告](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ これが存在する理由

Juguang (聚光AI) は New API パネル（v1.0.0-rc.41）で、**キャプチャなし**、シンプルなメールアドレス + パスワードによるサインアップ、そして**有料のデイリーチェックイン**を備えています — キーを作成する価値がある残高は、一度きりのサインアップ特典ではなく、チェックイン報酬によるものです。デフォルトグループは 121 のモデル ID を提供しており、デフォルトファミリー全体が**ツールを呼び出せます**（検証済み: `get_time` が正しい引数を持つ本物の `tool_calls` ペイロードとして返ってきました）。

## 🎁 無料枠 — どれだけ得られるか

| 項目 | 値 |
| --- | --- |
| サインアップ特典 | クォータ 0 — アカウントは空の状態で始まります（`self.quota = 0`） |
| デイリーチェックイン | **有効かつ有料**: 初日にアカウント間で計測された 662,984 ～ 2,235,284 クォータ |
| サインアップ時のキャプチャ | **なし**（`turnstile_check: false`） |
| パネルが受け付けるメール | 通常の `@gmail.com`。Mailtrap/`inbound-mailtrap.io` は `This email address is not allowed by the administrator's email policy` で拒否されます |
| ツール呼び出し | `deepseek-v4.1-flash`、`deepseek-v4-flash`、`[ccmax]claude-haiku-4-5-20251001`、`[0.4刀/次]gemini-3-flash` で**対応** |
| スケールする単位 | **1 アカウント = 1 キー**（クォータはアカウントに紐づきます） |

> 💡 無料枠は Juguang (聚光AI) によって設定されており、変更される可能性があります。最新の数値は [ai.juguang.chat](https://ai.juguang.chat) で確認してください — そしてツール自身のゲートに判断を委ねてください:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — 全 121 モデル

## 🧪 API の使い方

ベース URL は **\`https://ai.juguang.chat/v1\`** です — OpenAI 互換なので、OpenAI を扱えるものなら何でも動作します（SDK、Cursor、OpenCode、Kilo Code など）。

```bash
curl https://ai.juguang.chat/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 クイックスタート

### 🖱️ ランチャー

## ✅ 検証済み — すべてのキーがテストされています

2026-10-22 に WARP 出口フリートを通じて計測: 作成チェーンは端から端まで実行され（登録 → ログイン → チェックイン → トークン → 公開 → チャット）、参照キーは実コンテンツとともに `200` を返しました。ツール呼び出しは 4 つのデフォルトグループモデルで `get_time` スキーマを用いて調査され、すべてが本物の `tool_calls` ペイロードを返しました。

> **品質ゲート。** ここにあるすべてのキーは、`keys.txt` に書き込まれる前にライブの `chat-200` を通過しています
> （死んだキーは決して出荷されません）。ルーターのコンボもモデルレベルで同じルールに従います: エントリは
> **モデルが `chat-200` を返し、かつツールを呼び出せる場合にのみ**追加されます — ツールサポートのないモデル、
> 死んだキー、死んだプロバイダーは追加されずに除外されます。検証ステップはいつでも再実行できます;
> 失敗は報告され、決して隠されません。

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Juguang (聚光AI) page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://ai.juguang.chat/v1/chat/completions → real content = the key is live
```

| ステップ | 呼び出し | 備考 |
| --- | --- | --- |
| ゲート | `GET /api/status` | 登録 + メール認証が有効、`turnstile_check: false`、チェックイン有効 |
| メールボックス | Emailnator gmail | アカウントごとに新しいアドレス。パネルは非 gmail ドメインを拒否します |
| コード | `GET /api/verification?email=…` | 6 桁の 16 進コード、ブランドメールの件名は `聚光AI邮箱验证邮件` — 受信箱はレーン間で共有されるため、リーダーはその件名でフィルタリングする必要があります |
| 登録 | `POST /api/user/register` | ユーザー名 + パスワード + `verification_code` |
| ログイン | `POST /api/user/login` | セッション Cookie を設定します。フォークには `New-Api-User` ヘッダーも必要です |
| チェックイン | `POST /api/user/checkin` | その日のクォータをアカウントに支払います |
| キー | `POST /api/token/` の後に `POST /api/token/<id>/key` | rc.41 は作成呼び出しに**マスクされた**キーを返します; 実際のキーを返すのは公開ルートのみです |
| 証明 | `POST /v1/chat/completions` | 実コンテンツとともに 200（ツールが送信された場合は `tool_calls` も）= キーがライブ |

## ⚙️ CLI オプション

```bash
node src/cli.js --count 10            # mint 10 accounts, one key each
node src/cli.js --count 5 --model deepseek-v4.1-flash
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # test the exits you have against the panel
node src/launcher.js                  # interactive menu
```

## 🛰️ プロキシの背後で

**必須です。** パネルはセッションを作成した出口に紐づけ、悪用された出口を禁止するため、すべてのアカウントはあなたのリストにある出口を通じて作成されます。

- `proxies.txt` に 1 行につき 1 つの出口を記述するか（`http://`、`socks5://`、`socks4://` または素の `host:port`）、`JUGUANG_PROXIES` を設定するか、`--pool <file>` を渡してください。
- リストがない場合、ツールは停止してその旨を伝えます — 自身のアドレスにフォールバックすることは決してありません。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | ライブ検証済みのキーを 1 行に 1 つ — git 無視 |
| `keys-dead.txt` | 応答しなくなったキー、パネルの応答をそのまま保持 |
| `accounts.json` | アカウントごとのメール、パスワード、ステップ、検証結果 — git 無視 |
| `proxies.txt` | あなたの出口 — git 無視 |
| `out/` | 実行ごとのログ — git 無視 |

## 🔌 9Router に接続

## 🔌 OmniRoute に接続
## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダー | **Juguang (聚光AI)** — [ai.juguang.chat](https://ai.juguang.chat) |
| 🎁 プロバイダーが提供するもの | キーごとに 1 つの gmail アカウント · 121 モデル · デイリーチェックインが残高を支払う · すべてのキーが chat-200 + ツール検証済み |
| 🔑 1 つのキーで得られるもの | 自身のアカウントにスコープされた 1 つの API キー: 以下のエンドポイントにある 121 のモデル ID を、あなたのプランの制限で利用できます。クォータは**アカウント**に紐づいており、まさにそれがこのツールがキーごとに 1 つのアカウントを作成する理由です |
| 🌐 API の形式 | OpenAI 互換: `POST https://ai.juguang.chat/v1/chat/completions` |
| 🔒 あなたのデータ | 接触するのは ai.juguang.chat と、あなたが設定した受信箱バックエンドのみです; キーはあなたのマシン上に留まります |

## 🐞 問題報告

Juguang (聚光AI) がサインアップの形式やレート制限を変更した場合、ツールはそのステップで停止してその旨を伝えます。実行したコマンドと正確な出力を添えて **[issue を作成してください](../../issues)**; PR も歓迎します。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照してください。

<div align="center">

**[MIT](LICENSE)** © 2026 juguang-bulk-apikey contributors

</div>