# 🚀 Vercel Deployment Rehberi - YDN Oyuncak

**500 hatası çözüldü!** Vercel'de çalışması için gerekli dosyalar eklendi.

---

## ⚡ **Sorun ve Çözüm**

### Nedir Sorun?
```
❌ GitHub Pages: Çalışıyor (statik site)
   https://yuchell.github.io/YDN1/ ✅

❌ Vercel: 500 INTERNAL_SERVER_ERROR
   https://ydnoyuncak.vercel.app/ ❌
   
   Sebep: Node.js backend çalışmıyor
```

### Çözüm
Vercel'de Node.js uygulamasını çalıştırmak için 3 dosya lazım:
1. ✅ `vercel.json` - Route konfigürasyonu
2. ✅ `package.json` - Start script
3. ✅ `server.js` - Vercel-uyumlu

---

## 📦 **Adım 1: Dosyaları Güncelle**

Proje klasörüne bu dosyaları kopyala:

```
YDN/
├── vercel.json          ← YENİ
├── package.json         ← Güncellendi
├── server.js            ← Güncellendi
├── .gitignore           ← Güncellendi
├── .vercelignore        ← YENİ
├── admin.html
├── index.html
├── iletisim.html
└── catalog/
    └── .gitkeep         ← YENİ (klasörü Git'e ekler)
```

---

## 📝 **Adım 2: GitHub'a Push Et**

```bash
cd YDN
git add .
git commit -m "Vercel deployment için konfigürasyon eklendi"
git push origin main
```

**Önemli:** Tüm yeni dosyaları ekle:
- ✅ `vercel.json`
- ✅ `server.js` (güncellenmiş)
- ✅ `package.json` (güncellenmiş)
- ✅ `.gitignore` (güncellenmiş)

---

## 🌐 **Adım 3: Vercel'de Deploy Et**

### Seçenek A: CLI Üzerinden
```bash
# 1. Vercel CLI yükle
npm install -g vercel

# 2. Deploy et
vercel --prod
```

### Seçenek B: Web Üzerinden (Tavsiye Edilen)

1. https://vercel.com/dashboard adresine git
2. "Add New..." → "Project" tıkla
3. GitHub repo'sunu seç (YDN1)
4. **Framework**: Node.js seç
5. **Build Command** (otomatik algılanmalı):
   ```
   npm install
   ```
6. **Start Command**:
   ```
   npm start
   ```
7. "Deploy" tıkla

---

## ✅ **Adım 4: Test Et**

Deploy bittikten sonra:

### A. Siteyi Açın
```
https://ydnoyuncak.vercel.app/
```

### B. Health Check
```
https://ydnoyuncak.vercel.app/api/health
```

Yanıt:
```json
{
  "status": "ok",
  "environment": "vercel",
  "timestamp": "2024-04-06T..."
}
```

### C. Admin Panel
```
https://ydnoyuncak.vercel.app/admin.html
```

Login: `admin` / `admin123`

### D. İletişim
```
https://ydnoyuncak.vercel.app/iletisim.html
```

---

## 📂 **vercel.json Açıklaması**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"      // Node.js runtime kullan
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",         // /api/* istekleri server.js'e git
      "dest": "server.js"
    },
    {
      "src": "/admin.html",       // Admin sayfası
      "dest": "server.js"
    },
    {
      "src": "/uploads/(.*)",     // Upload edilen dosyalar
      "dest": "/uploads/$1"
    },
    {
      "src": "/catalog/(.*)",     // Katalog resimleri
      "dest": "/catalog/$1"
    },
    {
      "src": "/(.*\\..*)",        // Statik dosyalar (. içerenler)
      "dest": "/$1"
    },
    {
      "src": "/(.*)",             // Geri kalan her şey server.js'e
      "dest": "server.js"
    }
  ]
}
```

---

## 🔧 **package.json Güncelleme**

```json
{
  "scripts": {
    "start": "node server.js",    // ← ÖNEMLI!
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "engines": {
    "node": "18.x"               // ← Vercel'de kullanılacak Node versiyon
  }
}
```

---

## 🗂️ **server.js Vercel Uyumluluğu**

```javascript
// Vercel'de /tmp kullan, local'de catalog/ kullan
const isVercel = process.env.VERCEL === '1';
const uploadPath = isVercel 
  ? '/tmp/catalog'
  : path.join(__dirname, 'catalog');
```

---

## ⚠️ **Önemli Notlar**

### Upload Limitasyonları
- **Lokal**: Dosyalar `catalog/` klasörüne kalıcı kaydedilir
- **Vercel**: Dosyalar `/tmp/` klasörüne kaydedilir ve deployment'ta silinir

**Çözüm:** Kalıcı dosya depolaması için:
- AWS S3
- Firebase Storage
- Cloudinary
- Supabase Storage

### Environment Variables
Vercel'de secret değerler için:

1. Vercel Dashboard → Project Settings
2. Environment Variables
3. Ekle: `API_KEY`, `DATABASE_URL`, vb.

Kodda kullan:
```javascript
const apiKey = process.env.API_KEY;
```

---

## 🐛 **Sorun Giderme**

### Hata: "FUNCTION_INVOCATION_FAILED"
```
Çözüm: vercel.json doğru mu kontrol et
       package.json'da start script var mı?
```

### Hata: "Cannot find module"
```bash
# Vercel'de dependency yükle
npm install [paket-adı]
git add package.json package-lock.json
git push
```

### Hata: "ENOENT: no such file or directory"
```
Çözüm: Dosya path'leri kontrol et
       /tmp/ vs catalog/ karışırken sorun olabilir
```

### Upload çalışmıyor
```
Lokal: Çalışır (catalog/ klasörüne kaydedilir)
Vercel: Sınırlı (serverless environment)
Çözüm: Cloud storage kullan
```

---

## 🔄 **Deployment Pipeline**

```
1. Kod düzenle
   ↓
2. Git'e push et
   git push origin main
   ↓
3. Vercel otomatik deploy eder
   (3-5 saniye sürer)
   ↓
4. https://ydnoyuncak.vercel.app/ canlı olur
```

---

## 📊 **Vercel Dashboard**

Deploy edildikten sonra:

1. **Deployments** → Tüm deploy'ları gör
2. **Logs** → Hataları kontrol et
3. **Settings** → Domain, environment değişkenleri
4. **Analytics** → Traffic ve performance

---

## 🎯 **GitHub Pages vs Vercel**

| Özellik | GitHub Pages | Vercel |
|---------|-------------|--------|
| **Tip** | Statik hosting | Node.js + Static |
| **Backend** | ❌ Yok | ✅ Express.js |
| **API** | ❌ Yok | ✅ /api/* endpoints |
| **File Upload** | ❌ Yok | ✅ Sınırlı (/tmp) |
| **Database** | ❌ Yok | ✅ Entegre edilebilir |
| **Fiyat** | ✅ Ücretsiz | ✅ Ücretsiz (Hobby) |
| **Scaling** | ❌ Statik | ✅ Serverless |

---

## ✨ **Gelecek İyileştirmeler**

Production'a hazırlamak için:

1. ✅ **Kalıcı Depolama** - AWS S3 / Firebase
2. ✅ **Veritabanı** - MongoDB / PostgreSQL
3. ✅ **Authentication** - JWT Tokens
4. ✅ **Email Gönderme** - Nodemailer / SendGrid
5. ✅ **Logging** - Sentry / LogRocket
6. ✅ **Caching** - Redis
7. ✅ **CDN** - Cloudflare

---

## 📞 **Kontrol Listesi**

Deploy öncesi kontrol et:

- [ ] vercel.json dosyası var mı?
- [ ] package.json'da "start" script var mı?
- [ ] server.js Vercel-uyumlu mu?
- [ ] .gitignore ve .vercelignore var mı?
- [ ] GitHub'a push ettim mi?
- [ ] Vercel project oluşturduk mu?

Deploy sonrası test et:

- [ ] https://ydnoyuncak.vercel.app/ açılıyor mu?
- [ ] /api/health endpoint yanıt veriyor mu?
- [ ] Admin paneli açılıyor mu?
- [ ] Ürün ekleyebiliyor muyum?
- [ ] İletişim sayfası çalışıyor mu?

---

## 💡 **Pro Tips**

1. **Vercel CLI kullan** → Lokal teste önce `vercel dev`
2. **Logs'u kontrol et** → Hataları anlamak için
3. **Environments ayarla** → production/staging ayrı yapı
4. **Custom domain ekle** → ydnoyuncak.com gibi

---

**Versiyon:** 3.0 (Vercel Deployment)  
**Güncelleme:** 2024-04-06  
**Durum:** ✅ Hazır Deploy
