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

**批量创建聚光AI（Juguang）账号并自动生成 API 密钥 — 兼容 OpenAI 的推理服务（121 个模型），支持工具调用 + 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-121%20served-412991?style=for-the-badge)](https://ai.juguang.chat)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-121-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题反馈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么会有这个项目

聚光AI（Juguang）是一个 New API 面板（v1.0.0-rc.41），**没有验证码**，只需邮箱 + 密码即可注册，并且有**付费的每日签到**——让密钥真正有价值的余额来自签到奖励，而不是一次性的注册赠送。默认分组提供 121 个模型 id，整个默认系列**都支持工具调用**（已验证：`get_time` 返回了真实的 `tool_calls` 载荷，且参数正确）。

## 🎁 免费额度 — 你能拿到多少

| 项目 | 数值 |
| --- | --- |
| 注册赠送 | 0 额度 — 账号初始为空（`self.quota = 0`） |
| 每日签到 | **已启用且付费**：首日跨账号实测为 662,984 – 2,235,284 额度 |
| 注册验证码 | **无**（`turnstile_check: false`） |
| 面板接受的邮箱 | 普通 `@gmail.com`；Mailtrap/`inbound-mailtrap.io` 会被拒绝，提示 `This email address is not allowed by the administrator's email policy` |
| 工具调用 | **支持**，适用于 `deepseek-v4.1-flash`、`deepseek-v4-flash`、`[ccmax]claude-haiku-4-5-20251001`、`[0.4刀/次]gemini-3-flash` |
| 可扩展的单位 | **一个账号 = 一个密钥**（额度存在于账号上） |

> 💡 免费额度由聚光AI（Juguang）设定，可能会变化。请到 [ai.juguang.chat](https://ai.juguang.chat) 查看实时数值——并让工具自身的校验来决定：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 — 全部 121 个

## 🧪 如何使用 API

基础 URL 是 **\`https://ai.juguang.chat/v1\`** — 兼容 OpenAI，因此任何支持 OpenAI 的工具都能用（SDK、Cursor、OpenCode、Kilo Code 等）。

```bash
curl https://ai.juguang.chat/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 快速开始

### 🖱️ 启动器

## ✅ 已验证可用 — 每个密钥都经过测试

2026-10-22 通过 WARP 出口池实测：铸造链路端到端跑通（注册 → 登录 → 签到 → 令牌 → 揭示 → 对话），参考密钥返回 `200` 及真实内容。工具调用在四个默认分组模型上用 `get_time` schema 进行了探测；每一个都返回了真实的 `tool_calls` 载荷。

> **质量门槛。** 这里的每个密钥在写入 `keys.txt` 之前都通过了实时 `chat-200`
> （失效密钥绝不发布）。路由组合在模型层面遵循同样的规则：只有当模型能返回 `chat-200`
> **且能调用工具**时才会被加入——不支持工具、密钥失效或提供方失效的模型会被剔除而非加入。
> 可随时重新运行验证步骤；失败会被报告，绝不隐藏。

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Juguang (聚光AI) page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://ai.juguang.chat/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 | 说明 |
| --- | --- | --- |
| 门槛 | `GET /api/status` | 注册 + 邮箱验证开启，`turnstile_check: false`，签到开启 |
| 邮箱 | Emailnator gmail | 每个账号一个全新地址；面板拒绝非 gmail 域名 |
| 验证码 | `GET /api/verification?email=…` | 6 位十六进制验证码，品牌邮件主题为 `聚光AI邮箱验证邮件` — 收件箱在多个通道间共享，因此读取方必须按该主题过滤 |
| 注册 | `POST /api/user/register` | 用户名 + 密码 + `verification_code` |
| 登录 | `POST /api/user/login` | 设置会话 cookie；该分支还需要 `New-Api-User` 请求头 |
| 签到 | `POST /api/user/checkin` | 将当日额度发放到账号 |
| 密钥 | `POST /api/token/` 然后 `POST /api/token/<id>/key` | rc.41 在创建调用中返回**掩码**密钥；只有揭示路由才返回真实密钥 |
| 验证 | `POST /v1/chat/completions` | 返回 200 及真实内容（发送工具时还有 `tool_calls`）= 密钥可用 |

## ⚙️ CLI 选项

```bash
node src/cli.js --count 10            # mint 10 accounts, one key each
node src/cli.js --count 5 --model deepseek-v4.1-flash
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # test the exits you have against the panel
node src/launcher.js                  # interactive menu
```

## 🛰️ 代理之后

**必需。** 面板会将会话绑定到创建它的出口，并封禁滥用出口，因此每个账号都必须通过你列表中的出口来铸造。

- 在 `proxies.txt` 中每行放一个出口（`http://`、`socks5://`、`socks4://` 或裸 `host:port`），或设置 `JUGUANG_PROXIES`，或传入 `--pool <file>`。
- 没有列表时工具会停止并提示——它绝不会回退到你自己的地址。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个实时验证过的密钥 — 已被 git 忽略 |
| `keys-dead.txt` | 不再响应的密钥，原样保留面板的回复 |
| `accounts.json` | 每个账号的邮箱、密码、步骤及验证结果 — 已被 git 忽略 |
| `proxies.txt` | 你的出口 — 已被 git 忽略 |
| `out/` | 每次运行的日志 — 已被 git 忽略 |

## 🔌 连接到 9Router

## 🔌 连接到 OmniRoute

## 🔌 连接到 OmniRoute
## 🔑 一个密钥能给你什么

| | |
| --- | --- |
| 🏢 提供方 | **聚光AI（Juguang）** — [ai.juguang.chat](https://ai.juguang.chat) |
| 🎁 提供方给什么 | 每个密钥一个 gmail 账号 · 121 个模型 · 每日签到发放余额 · 每个密钥都经过 chat-200 + 工具验证 |
| 🔑 一个密钥能给你什么 | 一个绑定其自身账号的 API 密钥：下方端点上的 121 个模型 id，受你套餐限制。额度存在于**账号**上，这正是本工具为每个密钥创建一个账号的原因 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://ai.juguang.chat/v1/chat/completions` |
| 🔒 你的数据 | 只会联系 ai.juguang.chat 和你配置的收件箱后端；密钥保留在你本机 |

## 🐞 问题反馈

如果聚光AI（Juguang）更改了注册形态或速率限制，工具会在该步骤停止并提示。请**[提交 issue](../../issues)**，附上你运行的命令和确切输出；欢迎 PR。

## 📄 许可证

MIT © 2026 — 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 juguang-bulk-apikey contributors

</div>