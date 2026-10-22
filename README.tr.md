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

**Otomatik oluşturulan API anahtarlarıyla toplu Juguang (聚光AI) hesabı oluşturun — araç çağırma destekli OpenAI uyumlu çıkarım (121 model) + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-121%20served-412991?style=for-the-badge)](https://ai.juguang.chat)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-121-of-them) · [🧪 API'yi kullanma](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Bu neden var

Juguang (聚光AI), **captcha'sı olmayan**, düz e-posta + parola ile kayıt olunan ve **ücretli günlük giriş** sunan bir New API panelidir (v1.0.0-rc.41) — anahtarı basmaya değer kılan bakiye, tek seferlik kayıt hibesi değil, günlük giriş ödülüdür. Varsayılan grup 121 model kimliği sunar ve tüm varsayılan aile **araçları çağırır** (doğrulandı: `get_time`, doğru argümanlarla gerçek bir `tool_calls` yükü olarak döndü).

## 🎁 Ücretsiz katman — ne kadar alıyorsunuz

| Ne | Değer |
| --- | --- |
| Kayıt hibesi | 0 kota — hesap boş başlar (`self.quota = 0`) |
| Günlük giriş | **etkin ve ücretli**: hesaplar arasında ilk gün ölçülen 662.984 – 2.235.284 kota |
| Kayıtta captcha | **yok** (`turnstile_check: false`) |
| Panelin kabul ettiği e-posta | düz `@gmail.com`; Mailtrap/`inbound-mailtrap.io` şu hatayla reddedilir: `This email address is not allowed by the administrator's email policy` |
| Araç çağırma | `deepseek-v4.1-flash`, `deepseek-v4-flash`, `[ccmax]claude-haiku-4-5-20251001`, `[0.4刀/次]gemini-3-flash` üzerinde **evet** |
| Ölçeklenen birim | **bir hesap = bir anahtar** (kota hesapta yaşar) |

> 💡 Ücretsiz katman Juguang (聚光AI) tarafından belirlenir ve değişebilir. Güncel sayıları [ai.juguang.chat](https://ai.juguang.chat) adresinden kontrol edin — ve kararı aracın kendi kapısına bırakın:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modeller — 121'inin tamamı

## 🧪 API nasıl kullanılır

Temel URL **\`https://ai.juguang.chat/v1\`** — OpenAI uyumlu, yani OpenAI konuşan her şey çalışır (SDK'lar, Cursor, OpenCode, Kilo Code, …).

```bash
curl https://ai.juguang.chat/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"<model id>","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Hızlı başlangıç

### 🖱️ Başlatıcı

## ✅ Çalıştığı doğrulandı — her anahtar test edilir

2026-10-22'de WARP çıkış filosu üzerinden ölçüldü: basım zinciri baştan sona çalıştı (kayıt → giriş → günlük giriş → token → açığa çıkarma → sohbet) ve referans anahtar gerçek içerikle `200` yanıtı verdi. Araç çağırma, dört varsayılan grup modelinde bir `get_time` şemasıyla denendi; her biri gerçek bir `tool_calls` yükü yanıtladı.

> **Kalite kapıları.** Buradaki her anahtar, `keys.txt` dosyasına yazılmadan önce canlı bir `chat-200` geçti
> (ölü anahtarlar asla gönderilmez). Router kombinasyonları model düzeyinde aynı kuralı izler: bir giriş
> **yalnızca model `chat-200` yanıtlıyorsa ve araçları çağırabiliyorsa** eklenir — araç desteği olmayan bir model,
> ölü bir anahtar veya ölü bir sağlayıcı eklenmek yerine çıkarılır. Doğrulama adımını istediğiniz zaman yeniden çalıştırın;
> hatalar bildirilir, asla gizlenmez.

## 🧭 Nasıl çalışır

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Juguang (聚光AI) page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://ai.juguang.chat/v1/chat/completions → real content = the key is live
```

| Adım | Çağrı | Notlar |
| --- | --- | --- |
| kapılar | `GET /api/status` | kayıt + e-posta doğrulama açık, `turnstile_check: false`, günlük giriş açık |
| posta kutusu | Emailnator gmail | hesap başına yeni bir adres; panel gmail dışı alan adlarını reddeder |
| kod | `GET /api/verification?email=…` | 6 haneli hex kod, marka postası konusu `聚光AI邮箱验证邮件` — gelen kutusu şeritler arasında paylaşılır, bu yüzden okuyucu bu konuya göre filtrelemelidir |
| kayıt | `POST /api/user/register` | kullanıcı adı + parola + `verification_code` |
| giriş | `POST /api/user/login` | oturum çerezini ayarlar; çatal ayrıca `New-Api-User` başlığına ihtiyaç duyar |
| günlük giriş | `POST /api/user/checkin` | günün kotasını hesaba öder |
| anahtar | `POST /api/token/` ardından `POST /api/token/<id>/key` | rc.41, oluşturma çağrısına **maskelenmiş** bir anahtar yanıtlar; gerçek anahtarı yalnızca açığa çıkarma rotası döndürür |
| kanıt | `POST /v1/chat/completions` | gerçek içerikle 200 (ve araçlar gönderildiğinde `tool_calls`) = anahtar canlı |

## ⚙️ CLI seçenekleri

```bash
node src/cli.js --count 10            # mint 10 accounts, one key each
node src/cli.js --count 5 --model deepseek-v4.1-flash
node src/cli.js --verify-only         # re-check every key in keys.txt
node src/cli.js --screen              # test the exits you have against the panel
node src/launcher.js                  # interactive menu
```

## 🛰️ Proxy arkasında

**Gerekli.** Panel, bir oturumu onu oluşturan çıkışa bağlar ve kötüye kullanan çıkışları yasaklar, bu yüzden her hesap listenizdeki bir çıkış üzerinden basılır.

- `proxies.txt` dosyasına her satıra bir çıkış koyun (`http://`, `socks5://`, `socks4://` veya çıplak `host:port`), ya da `JUGUANG_PROXIES` ayarlayın, ya da `--pool <file>` geçin.
- Liste olmadan araç durur ve bunu söyler — asla kendi adresinize geri dönmez.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | satır başına bir canlı doğrulanmış anahtar — git tarafından yok sayılır |
| `keys-dead.txt` | yanıt vermeyi bırakan anahtarlar, panelin yanıtı birebir saklanır |
| `accounts.json` | hesap başına e-posta, parola, adımlar ve doğrulama sonucu — git tarafından yok sayılır |
| `proxies.txt` | çıkışlarınız — git tarafından yok sayılır |
| `out/` | çalıştırma başına günlükler — git tarafından yok sayılır |

## 🔌 9Router'a bağlanın

## 🔌 OmniRoute'a bağlanın
## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **Juguang (聚光AI)** — [ai.juguang.chat](https://ai.juguang.chat) |
| 🎁 Sağlayıcının verdikleri | anahtar başına bir gmail hesabı · 121 model · günlük giriş bakiyeyi öder · her anahtar chat-200 + araçlarla doğrulanmış |
| 🔑 Bir anahtar size ne kazandırır | kendi hesabına kapsanmış bir API anahtarı: aşağıdaki uç noktada 121 model kimliği, planınızın sınırlarında. Kota **hesapta** yaşar, bu aracın anahtar başına bir hesap oluşturmasının nedeni tam da budur |
| 🌐 API şekli | OpenAI uyumlu: `POST https://ai.juguang.chat/v1/chat/completions` |
| 🔒 Verileriniz | yalnızca ai.juguang.chat ve yapılandırdığınız gelen kutusu arka ucuyla iletişim kurulur; anahtarlar makinenizde kalır |

## 🐞 Sorunlar

Juguang (聚光AI) kayıt şeklini veya hız sınırlarını değiştirirse, araç o adımda durur ve bunu söyler. Çalıştırdığınız komut ve tam çıktıyla birlikte **[bir sorun açın](../../issues)**; PR'lar memnuniyetle karşılanır.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 juguang-bulk-apikey katkıda bulunanlar

</div>