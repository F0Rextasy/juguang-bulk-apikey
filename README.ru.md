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

**Массовое создание аккаунтов Juguang (聚光AI) с автоматически сгенерированными API-ключами — инференс, совместимый с OpenAI (121 модель), с вызовом инструментов + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-121%20served-412991?style=for-the-badge)](https://ai.juguang.chat)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-121-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Зачем это нужно

Juguang (聚光AI) — это панель New API (v1.0.0-rc.41) с **отсутствием капчи**, простой регистрацией по e-mail и паролю и **платной ежедневной отметкой** — баланс, ради которого стоит создавать ключ, это награда за отметку, а не единоразовый бонус за регистрацию. Группа по умолчанию обслуживает 121 идентификатор модели, и всё семейство по умолчанию **вызывает инструменты** (проверено: `get_time` вернулся как настоящая полезная нагрузка `tool_calls` с корректными аргументами).

## 🎁 Бесплатный тариф — сколько вы получаете

| Что | Значение |
| --- | --- |
| Бонус за регистрацию | 0 квоты — аккаунт начинается пустым (`self.quota = 0`) |
| Ежедневная отметка | **включена и платная**: от 662 984 до 2 235 284 квоты, измерено по аккаунтам в первый день |
| Капча при регистрации | **отсутствует** (`turnstile_check: false`) |
| E-mail, который принимает панель | обычный `@gmail.com`; Mailtrap/`inbound-mailtrap.io` отклоняется с `This email address is not allowed by the administrator's email policy` |
| Вызов инструментов | **да** на `deepseek-v4.1-flash`, `deepseek-v4-flash`, `[ccmax]claude-haiku-4-5-20251001`, `[0.4刀/次]gemini-3-flash` |
| Единица масштабирования | **один аккаунт = один ключ** (квота хранится на аккаунте) |

> 💡 Бесплатный тариф устанавливается Juguang (聚光AI) и может измениться. Проверяйте актуальные цифры на [ai.juguang.chat](https://ai.juguang.chat) — и пусть решение принимает собственный шлюз инструмента:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Модели — все 121

## 🧪 Как использовать API

Базовый URL — **\`https://ai.juguang.chat/v1\`** — совместим с OpenAI, поэтому работает всё, что говорит на OpenAI (SDK, Cursor, OpenCode, Kilo Code, …).

```bash
curl https://ai.juguang.chat/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Быстрый старт

### 🖱️ Лаунчер

## ✅ Проверено в работе — каждый ключ протестирован

Измерено 2026-10-22 через пул выходных узлов WARP: цепочка создания прошла от начала до конца (регистрация → вход → отметка → токен → раскрытие → чат), и эталонный ключ ответил `200` с реальным содержимым. Вызов инструментов был проверен со схемой `get_time` на четырёх моделях группы по умолчанию; каждая вернула настоящую полезную нагрузку `tool_calls`.

> **Контроль качества.** Каждый ключ здесь прошёл живой `chat-200` прежде чем был записан в `keys.txt`
> (мёртвые ключи никогда не поставляются). Комбинации роутера следуют тому же правилу на уровне модели: запись
> добавляется **только если модель отвечает `chat-200` и умеет вызывать инструменты** — модель без поддержки инструментов,
> мёртвый ключ или мёртвый провайдер отбрасывается, а не добавляется. Перезапускайте шаг проверки в любое время;
> сбои сообщаются, никогда не скрываются.

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Juguang (聚光AI) page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://ai.juguang.chat/v1/chat/completions → real content = the key is live
```

| Шаг | Вызов | Примечания |
| --- | --- | --- |
| шлюзы | `GET /api/status` | регистрация + подтверждение e-mail включены, `turnstile_check: false`, отметка включена |
| почтовый ящик | Emailnator gmail | новый адрес на каждый аккаунт; панель отклоняет домены, отличные от gmail |
| код | `GET /api/verification?email=…` | 6-символьный hex-код, тема письма бренда `聚光AI邮箱验证邮件` — почтовый ящик общий для всех линий, поэтому читатель должен фильтровать по этой теме |
| регистрация | `POST /api/user/register` | имя пользователя + пароль + `verification_code` |
| вход | `POST /api/user/login` | устанавливает cookie сессии; форку также нужен заголовок `New-Api-User` |
| отметка | `POST /api/user/checkin` | зачисляет дневную квоту на аккаунт |
| ключ | `POST /api/token/` затем `POST /api/token/<id>/key` | rc.41 отвечает на вызов создания **маскированным** ключом; только маршрут раскрытия возвращает настоящий |
| доказательство | `POST /v1/chat/completions` | 200 с реальным содержимым (и `tool_calls`, когда переданы инструменты) = ключ живой |

## ⚙️ Опции CLI

```bash
node src/cli.js --count 10            # mint 10 accounts, one key each
node src/cli.js --count 5 --model deepseek-v4.1-flash
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # test the exits you have against the panel
node src/launcher.js                  # interactive menu
```

## 🛰️ За прокси

**Обязательно.** Панель привязывает сессию к выходному узлу, который её создал, и блокирует злоупотребляющие выходы, поэтому каждый аккаунт создаётся через выход из вашего списка.

- Поместите по одному выходу на строку в `proxies.txt` (`http://`, `socks5://`, `socks4://` или просто `host:port`), либо задайте `JUGUANG_PROXIES`, либо передайте `--pool <file>`.
- Без списка инструмент останавливается и сообщает об этом — он никогда не откатывается к вашему собственному адресу.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | по одному проверенному в работе ключу на строку — игнорируется git |
| `keys-dead.txt` | ключи, которые перестали отвечать, с дословно сохранённым ответом панели |
| `accounts.json` | e-mail, пароль, шаги и результат проверки для каждого аккаунта — игнорируется git |
| `proxies.txt` | ваши выходные узлы — игнорируется git |
| `out/` | логи каждого запуска — игнорируется git |

## 🔌 Подключение к 9Router

## 🔌 Подключение к OmniRoute
## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **Juguang (聚光AI)** — [ai.juguang.chat](https://ai.juguang.chat) |
| 🎁 Что даёт провайдер | один gmail-аккаунт на ключ · 121 модель · ежедневная отметка пополняет баланс · каждый ключ проверен на chat-200 + инструменты |
| 🔑 Что даёт один ключ | один API-ключ, привязанный к своему аккаунту: 121 идентификатор модели на указанном ниже эндпоинте, в пределах лимитов вашего тарифа. Квота хранится на **аккаунте**, именно поэтому этот инструмент создаёт один аккаунт на ключ |
| 🌐 Форма API | Совместим с OpenAI: `POST https://ai.juguang.chat/v1/chat/completions` |
| 🔒 Ваши данные | связь только с ai.juguang.chat и настроенным вами бэкендом почтового ящика; ключи остаются на вашей машине |

## 🐞 Проблемы

Если Juguang (聚光AI) изменит форму регистрации или ограничения по частоте, инструмент остановится на этом шаге и сообщит об этом. **[Откройте issue](../../issues)** с командой, которую вы запустили, и точным выводом; PR приветствуются.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 juguang-bulk-apikey contributors

</div>