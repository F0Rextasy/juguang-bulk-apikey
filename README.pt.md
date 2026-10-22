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

**Crie contas Juguang (聚光AI) em massa com chaves de API geradas automaticamente — inferência compatível com OpenAI (121 modelos) com chamada de ferramentas + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-121%20served-412991?style=for-the-badge)](https://ai.juguang.chat)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Início rápido](#-quick-start) · [🎁 Nível gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-121-of-them) · [🧪 Use a API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Como funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opções](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por que isto existe

Juguang (聚光AI) é um painel New API (v1.0.0-rc.41) **sem captcha**, com cadastro simples por e-mail + senha e um **check-in diário pago** — o saldo que torna a chave digna de ser criada é a recompensa do check-in, não uma concessão única de cadastro. O grupo padrão serve 121 ids de modelos e toda a família padrão **chama ferramentas** (verificado: `get_time` retornou como um payload real de `tool_calls` com argumentos corretos).

## 🎁 Nível gratuito — quanto você recebe

| O quê | Valor |
| --- | --- |
| Concessão de cadastro | 0 de cota — a conta começa vazia (`self.quota = 0`) |
| Check-in diário | **habilitado e pago**: 662.984 – 2.235.284 de cota medidos entre contas no primeiro dia |
| Captcha no cadastro | **nenhum** (`turnstile_check: false`) |
| E-mail que o painel aceita | `@gmail.com` comum; Mailtrap/`inbound-mailtrap.io` é recusado com `This email address is not allowed by the administrator's email policy` |
| Chamada de ferramentas | **sim** em `deepseek-v4.1-flash`, `deepseek-v4-flash`, `[ccmax]claude-haiku-4-5-20251001`, `[0.4刀/次]gemini-3-flash` |
| A unidade que escala | **uma conta = uma chave** (a cota fica na conta) |

> 💡 O nível gratuito é definido pela Juguang (聚光AI) e pode mudar. Confira os números ao vivo em [ai.juguang.chat](https://ai.juguang.chat) — e deixe o próprio gate da ferramenta decidir:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — todos os 121

## 🧪 Como usar a API

A URL base é **\`https://ai.juguang.chat/v1\`** — compatível com OpenAI, então qualquer coisa que fale OpenAI funciona (SDKs, Cursor, OpenCode, Kilo Code, …).

```bash
curl https://ai.juguang.chat/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Início rápido

### 🖱️ O launcher

## ✅ Verificado e funcionando — toda chave é testada

Medido em 2026-10-22 através da frota de saídas WARP: a cadeia de criação rodou de ponta a ponta (registro → login → check-in → token → revelação → chat) e a chave de referência respondeu `200` com conteúdo real. A chamada de ferramentas foi testada com um schema `get_time` em quatro modelos do grupo padrão; todos responderam um payload real de `tool_calls`.

> **Portões de qualidade.** Toda chave aqui passou por um `chat-200` ao vivo antes de ser gravada em `keys.txt`
> (chaves mortas nunca são entregues). As combinações de roteadores seguem a mesma regra no nível do modelo: uma entrada é
> adicionada **somente se o modelo responder `chat-200` e conseguir chamar ferramentas** — um modelo sem suporte a ferramentas,
> uma chave morta ou um provedor morto é descartado em vez de adicionado. Reexecute a etapa de verificação a qualquer momento;
> as falhas são relatadas, nunca escondidas.

## 🧭 Como funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Juguang (聚光AI) page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://ai.juguang.chat/v1/chat/completions → real content = the key is live
```

| Etapa | Chamada | Observações |
| --- | --- | --- |
| portões | `GET /api/status` | registro + verificação de e-mail ativados, `turnstile_check: false`, check-in ativado |
| caixa de correio | Emailnator gmail | um endereço novo por conta; o painel recusa domínios que não sejam gmail |
| código | `GET /api/verification?email=…` | código de 6 hexadecimais, assunto do e-mail da marca `聚光AI邮箱验证邮件` — a caixa de entrada é compartilhada entre as vias, então o leitor precisa filtrar por esse assunto |
| registro | `POST /api/user/register` | nome de usuário + senha + `verification_code` |
| login | `POST /api/user/login` | define o cookie de sessão; o fork também precisa do cabeçalho `New-Api-User` |
| check-in | `POST /api/user/checkin` | credita a cota do dia na conta |
| chave | `POST /api/token/` e depois `POST /api/token/<id>/key` | a rc.41 responde à chamada de criação com uma chave **mascarada**; somente a rota de revelação retorna a real |
| prova | `POST /v1/chat/completions` | 200 com conteúdo real (e `tool_calls` quando ferramentas são enviadas) = a chave está ativa |

## ⚙️ Opções da CLI

```bash
node src/cli.js --count 10            # mint 10 accounts, one key each
node src/cli.js --count 5 --model deepseek-v4.1-flash
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # test the exits you have against the panel
node src/launcher.js                  # interactive menu
```

## 🛰️ Atrás de um proxy

**Obrigatório.** O painel vincula uma sessão à saída que a criou e bane saídas abusivas, então cada conta é criada através de uma saída da sua lista.

- Coloque uma saída por linha em `proxies.txt` (`http://`, `socks5://`, `socks4://` ou apenas `host:port`), ou defina `JUGUANG_PROXIES`, ou passe `--pool <file>`.
- Sem uma lista, a ferramenta para e avisa — ela nunca recorre ao seu próprio endereço.

## 📄 Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `keys.txt` | uma chave verificada ao vivo por linha — ignorada pelo git |
| `keys-dead.txt` | chaves que pararam de responder, com a resposta do painel mantida literalmente |
| `accounts.json` | e-mail, senha, etapas e o resultado da verificação por conta — ignorado pelo git |
| `proxies.txt` | suas saídas — ignorado pelo git |
| `out/` | logs por execução — ignorado pelo git |

## 🔌 Conectar ao 9Router

## 🔌 Conectar ao OmniRoute
## 🔑 O que uma chave te dá

| | |
| --- | --- |
| 🏢 Provedor | **Juguang (聚光AI)** — [ai.juguang.chat](https://ai.juguang.chat) |
| 🎁 O que o provedor oferece | uma conta gmail por chave · 121 modelos · o check-in diário paga o saldo · toda chave verificada com chat-200 + ferramentas |
| 🔑 O que uma chave te dá | uma chave de API limitada à sua própria conta: os 121 ids de modelos no endpoint abaixo, nos limites do seu plano. A cota fica na **conta**, e é exatamente por isso que esta ferramenta cria uma conta por chave |
| 🌐 Formato da API | Compatível com OpenAI: `POST https://ai.juguang.chat/v1/chat/completions` |
| 🔒 Seus dados | apenas ai.juguang.chat e o backend de caixa de entrada que você configurar são contatados; as chaves ficam na sua máquina |

## 🐞 Problemas

Se a Juguang (聚光AI) mudar o formato do cadastro ou os limites de taxa, a ferramenta para nessa etapa e avisa. **[Abra uma issue](../../issues)** com o comando que você executou e a saída exata; PRs são bem-vindos.

## 📄 Licença

MIT © 2026 — veja [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 juguang-bulk-apikey contributors

</div>