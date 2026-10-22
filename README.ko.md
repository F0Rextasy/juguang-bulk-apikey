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

**자동 생성된 API 키로 Juguang (聚光AI) 계정을 대량 생성 — 도구 호출을 지원하는 OpenAI 호환 추론(121개 모델) + 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-121%20served-412991?style=for-the-badge)](https://ai.juguang.chat)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-121-of-them) · [🧪 API 사용하기](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 이 도구가 존재하는 이유

Juguang (聚光AI)은 **캡차가 없는** New API 패널(v1.0.0-rc.41)로, 이메일 + 비밀번호로 간단히 가입할 수 있으며 **유료 일일 출석 체크**를 제공합니다. 키를 만들 가치가 있게 하는 잔액은 일회성 가입 지급금이 아니라 출석 체크 보상입니다. 기본 그룹은 121개의 모델 ID를 제공하며, 기본 패밀리 전체가 **도구를 호출**합니다(검증됨: `get_time`이 올바른 인수와 함께 실제 `tool_calls` 페이로드로 반환됨).

## 🎁 무료 티어 — 얼마나 받을 수 있나

| 항목 | 값 |
| --- | --- |
| 가입 지급금 | 0 쿼터 — 계정은 빈 상태로 시작합니다(`self.quota = 0`) |
| 일일 출석 체크 | **활성화 및 유료**: 첫날 계정별로 측정된 662,984 – 2,235,284 쿼터 |
| 가입 시 캡차 | **없음**(`turnstile_check: false`) |
| 패널이 허용하는 이메일 | 일반 `@gmail.com`; Mailtrap/`inbound-mailtrap.io`는 `This email address is not allowed by the administrator's email policy`와 함께 거부됩니다 |
| 도구 호출 | `deepseek-v4.1-flash`, `deepseek-v4-flash`, `[ccmax]claude-haiku-4-5-20251001`, `[0.4刀/次]gemini-3-flash`에서 **지원됨** |
| 확장되는 단위 | **계정 하나 = 키 하나**(쿼터는 계정에 있습니다) |

> 💡 무료 티어는 Juguang (聚光AI)이 설정하며 변경될 수 있습니다. 실시간 수치는 [ai.juguang.chat](https://ai.juguang.chat)에서 확인하세요 — 그리고 도구 자체의 게이트가 판단하도록 하세요:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 모델 — 121개 전부

## 🧪 API 사용 방법

기본 URL은 **\`https://ai.juguang.chat/v1\`** 입니다 — OpenAI 호환이므로 OpenAI를 지원하는 모든 것(SDK, Cursor, OpenCode, Kilo Code 등)이 작동합니다.

```bash
curl https://ai.juguang.chat/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 빠른 시작

### 🖱️ 런처

## ✅ 검증됨 — 모든 키가 테스트됩니다

2026-10-22에 WARP 출구 플릿을 통해 측정: 발급 체인이 처음부터 끝까지 실행되었고(등록 → 로그인 → 출석 체크 → 토큰 → 공개 → 채팅), 참조 키가 실제 콘텐츠와 함께 `200`을 응답했습니다. 도구 호출은 네 개의 기본 그룹 모델에서 `get_time` 스키마로 검사되었으며, 모두 실제 `tool_calls` 페이로드를 응답했습니다.

> **품질 게이트.** 여기의 모든 키는 `keys.txt`에 기록되기 전에 실시간 `chat-200`을 통과했습니다
> (죽은 키는 절대 배포되지 않습니다). 라우터 조합도 모델 수준에서 동일한 규칙을 따릅니다: 항목은
> **모델이 `chat-200`을 응답하고 도구를 호출할 수 있는 경우에만** 추가됩니다 — 도구 지원이 없는 모델,
> 죽은 키 또는 죽은 제공자는 추가되지 않고 제거됩니다. 언제든지 검증 단계를 다시 실행하세요;
> 실패는 보고되며, 절대 숨겨지지 않습니다.

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Juguang (聚光AI) page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://ai.juguang.chat/v1/chat/completions → real content = the key is live
```

| 단계 | 호출 | 비고 |
| --- | --- | --- |
| 게이트 | `GET /api/status` | 등록 + 이메일 인증 활성화, `turnstile_check: false`, 출석 체크 활성화 |
| 메일함 | Emailnator gmail | 계정마다 새 주소; 패널은 gmail이 아닌 도메인을 거부합니다 |
| 코드 | `GET /api/verification?email=…` | 6자리 16진수 코드, 브랜드 메일 제목 `聚光AI邮箱验证邮件` — 메일함은 레인 간에 공유되므로 리더는 해당 제목으로 필터링해야 합니다 |
| 등록 | `POST /api/user/register` | 사용자 이름 + 비밀번호 + `verification_code` |
| 로그인 | `POST /api/user/login` | 세션 쿠키를 설정합니다; 포크는 `New-Api-User` 헤더도 필요합니다 |
| 출석 체크 | `POST /api/user/checkin` | 그날의 쿼터를 계정에 지급합니다 |
| 키 | `POST /api/token/` 그다음 `POST /api/token/<id>/key` | rc.41은 생성 호출에 **마스킹된** 키로 응답합니다; 실제 키를 반환하는 것은 공개 라우트뿐입니다 |
| 증명 | `POST /v1/chat/completions` | 실제 콘텐츠와 함께 200(도구가 전송되면 `tool_calls`도) = 키가 살아 있음 |

## ⚙️ CLI 옵션

```bash
node src/cli.js --count 10            # mint 10 accounts, one key each
node src/cli.js --count 5 --model deepseek-v4.1-flash
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # test the exits you have against the panel
node src/launcher.js                  # interactive menu
```

## 🛰️ 프록시 뒤에서

**필수입니다.** 패널은 세션을 생성한 출구에 바인딩하고 악용하는 출구를 차단하므로, 모든 계정은 목록의 출구를 통해 발급됩니다.

- `proxies.txt`에 한 줄에 하나의 출구를 넣거나(`http://`, `socks5://`, `socks4://` 또는 `host:port`만), `JUGUANG_PROXIES`를 설정하거나, `--pool <file>`을 전달하세요.
- 목록이 없으면 도구는 중단하고 그렇게 알립니다 — 절대 자신의 주소로 폴백하지 않습니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 한 줄에 하나의 실시간 검증된 키 — git에서 무시됨 |
| `keys-dead.txt` | 응답을 멈춘 키, 패널의 응답을 그대로 보존 |
| `accounts.json` | 계정별 이메일, 비밀번호, 단계 및 검증 결과 — git에서 무시됨 |
| `proxies.txt` | 사용자의 출구 — git에서 무시됨 |
| `out/` | 실행별 로그 — git에서 무시됨 |

## 🔌 9Router에 연결

## 🔌 OmniRoute에 연결
## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 제공자 | **Juguang (聚光AI)** — [ai.juguang.chat](https://ai.juguang.chat) |
| 🎁 제공자가 주는 것 | 키마다 gmail 계정 하나 · 121개 모델 · 일일 출석 체크가 잔액을 지급 · 모든 키가 chat-200 + 도구 검증됨 |
| 🔑 키 하나로 얻는 것 | 자체 계정에 범위가 지정된 API 키 하나: 아래 엔드포인트의 121개 모델 ID를 사용자의 플랜 한도 내에서. 쿼터는 **계정**에 있으므로, 이 도구가 키마다 계정 하나를 생성하는 것입니다 |
| 🌐 API 형태 | OpenAI 호환: `POST https://ai.juguang.chat/v1/chat/completions` |
| 🔒 사용자 데이터 | ai.juguang.chat과 사용자가 구성한 메일함 백엔드만 접속됩니다; 키는 사용자의 컴퓨터에 남습니다 |

## 🐞 이슈

Juguang (聚光AI)이 가입 형태나 속도 제한을 변경하면, 도구는 해당 단계에서 중단하고 그렇게 알립니다. 실행한 명령과 정확한 출력을 포함하여 **[이슈를 열어주세요](../../issues)**; PR을 환영합니다.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE)를 참조하세요.

<div align="center">

**[MIT](LICENSE)** © 2026 juguang-bulk-apikey contributors

</div>