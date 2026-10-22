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

**Crea cuentas de Juguang (聚光AI) en masa con claves API autogeneradas — inferencia compatible con OpenAI (121 modelos) con llamada a herramientas + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-121%20served-412991?style=for-the-badge)](https://ai.juguang.chat)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-121-of-them) · [🧪 Usa la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por qué existe esto

Juguang (聚光AI) es un panel de New API (v1.0.0-rc.41) **sin captcha**, con un registro simple de correo electrónico + contraseña y un **check-in diario de pago** — el saldo que hace que valga la pena acuñar la clave es la recompensa del check-in, no una concesión única de registro. El grupo predeterminado sirve 121 ids de modelos y toda la familia predeterminada **llama a herramientas** (verificado: `get_time` volvió como un payload real de `tool_calls` con argumentos correctos).

## 🎁 Nivel gratuito — cuánto obtienes

| Qué | Valor |
| --- | --- |
| Concesión de registro | 0 de cuota — la cuenta empieza vacía (`self.quota = 0`) |
| Check-in diario | **habilitado y de pago**: 662,984 – 2,235,284 de cuota medidos entre cuentas el primer día |
| Captcha en el registro | **ninguno** (`turnstile_check: false`) |
| Correo electrónico que acepta el panel | `@gmail.com` simple; Mailtrap/`inbound-mailtrap.io` se rechaza con `This email address is not allowed by the administrator's email policy` |
| Llamada a herramientas | **sí** en `deepseek-v4.1-flash`, `deepseek-v4-flash`, `[ccmax]claude-haiku-4-5-20251001`, `[0.4刀/次]gemini-3-flash` |
| La unidad que escala | **una cuenta = una clave** (la cuota vive en la cuenta) |

> 💡 El nivel gratuito lo define Juguang (聚光AI) y puede cambiar. Consulta los números en vivo en [ai.juguang.chat](https://ai.juguang.chat) — y deja que la propia verificación de la herramienta decida:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — los 121

## 🧪 Cómo usar la API

La URL base es **\`https://ai.juguang.chat/v1\`** — compatible con OpenAI, así que cualquier cosa que hable OpenAI funciona (SDKs, Cursor, OpenCode, Kilo Code, …).

```bash
curl https://ai.juguang.chat/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Inicio rápido

### 🖱️ El lanzador

## ✅ Verificado y funcionando — cada clave se prueba

Medido el 2026-10-22 a través de la flota de salidas WARP: la cadena de acuñación se ejecutó de principio a fin (registro → inicio de sesión → check-in → token → revelación → chat) y la clave de referencia respondió `200` con contenido real. La llamada a herramientas se sondeó con un esquema `get_time` en cuatro modelos del grupo predeterminado; todos respondieron un payload real de `tool_calls`.

> **Controles de calidad.** Cada clave aquí pasó un `chat-200` en vivo antes de escribirse en `keys.txt`
> (las claves muertas nunca se entregan). Las combinaciones del enrutador siguen la misma regla a nivel de modelo: una entrada se
> añade **solo si el modelo responde `chat-200` y puede llamar a herramientas** — un modelo sin soporte de herramientas,
> una clave muerta o un proveedor muerto se descarta en lugar de añadirse. Vuelve a ejecutar el paso de verificación cuando quieras;
> los fallos se reportan, nunca se ocultan.

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Juguang (聚光AI) page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://ai.juguang.chat/v1/chat/completions → real content = the key is live
```

| Paso | Llamada | Notas |
| --- | --- | --- |
| puertas | `GET /api/status` | registro + verificación por correo activados, `turnstile_check: false`, check-in activado |
| buzón | Emailnator gmail | una dirección nueva por cuenta; el panel rechaza dominios que no sean gmail |
| código | `GET /api/verification?email=…` | código de 6 hex, asunto del correo de marca `聚光AI邮箱验证邮件` — el buzón se comparte entre carriles, así que el lector debe filtrar por ese asunto |
| registro | `POST /api/user/register` | nombre de usuario + contraseña + `verification_code` |
| inicio de sesión | `POST /api/user/login` | establece la cookie de sesión; el fork también necesita el encabezado `New-Api-User` |
| check-in | `POST /api/user/checkin` | paga la cuota del día a la cuenta |
| clave | `POST /api/token/` y luego `POST /api/token/<id>/key` | rc.41 responde a la llamada de creación con una clave **enmascarada**; solo la ruta de revelación devuelve la real |
| prueba | `POST /v1/chat/completions` | 200 con contenido real (y `tool_calls` cuando se envían herramientas) = la clave está viva |

## ⚙️ Opciones de CLI

```bash
node src/cli.js --count 10            # mint 10 accounts, one key each
node src/cli.js --count 5 --model deepseek-v4.1-flash
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # test the exits you have against the panel
node src/launcher.js                  # interactive menu
```

## 🛰️ Detrás de un proxy

**Obligatorio.** El panel vincula una sesión a la salida que la creó y banea las salidas abusivas, así que cada cuenta se acuña a través de una salida de tu lista.

- Pon una salida por línea en `proxies.txt` (`http://`, `socks5://`, `socks4://` o `host:port` sin más), o define `JUGUANG_PROXIES`, o pasa `--pool <file>`.
- Sin una lista, la herramienta se detiene y lo indica — nunca recurre a tu propia dirección.

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | una clave verificada en vivo por línea — ignorada por git |
| `keys-dead.txt` | claves que dejaron de responder, con la respuesta del panel conservada textualmente |
| `accounts.json` | correo electrónico, contraseña, pasos y el resultado de la verificación por cuenta — ignorado por git |
| `proxies.txt` | tus salidas — ignorado por git |
| `out/` | registros por ejecución — ignorado por git |

## 🔌 Conectar con 9Router

## 🔌 Conectar con OmniRoute
## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **Juguang (聚光AI)** — [ai.juguang.chat](https://ai.juguang.chat) |
| 🎁 Qué da el proveedor | una cuenta de gmail por clave · 121 modelos · el check-in diario paga el saldo · cada clave verificada con chat-200 + herramientas |
| 🔑 Qué te da una clave | una clave API limitada a su propia cuenta: los 121 ids de modelos en el endpoint de abajo, con los límites de tu plan. La cuota vive en la **cuenta**, que es exactamente por lo que esta herramienta crea una cuenta por clave |
| 🌐 Forma de la API | Compatible con OpenAI: `POST https://ai.juguang.chat/v1/chat/completions` |
| 🔒 Tus datos | solo se contacta con ai.juguang.chat y el backend de buzón que configures; las claves se quedan en tu máquina |

## 🐞 Problemas

Si Juguang (聚光AI) cambia la forma de su registro o sus límites de velocidad, la herramienta se detiene en ese paso y lo indica. **[Abre un issue](../../issues)** con el comando que ejecutaste y la salida exacta; los PR son bienvenidos.

## 📄 Licencia

MIT © 2026 — consulta [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 juguang-bulk-apikey contributors

</div>