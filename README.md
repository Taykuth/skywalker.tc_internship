# AI Ürün Görsel Üretim Platformu — Görev 10

> **Frontend — Görsel Önizleme, Onay ve İndirme Sayfası**

Bu proje, e-ticaret satıcılarının eksik ürün görsellerini yapay zeka ile otomatik tamamlamasını sağlayan **AI Ürün Görsel Üretim Platformu**'nun 10 kişilik staj ekibi tarafından geliştirilen modüllerinden biridir. Bu depo, **Görev 10**'un (görsel önizleme, onay ve indirme sayfası) implementasyonunu içerir.

---

## Proje Hakkında

Satıcı Trendyol'dan indirdiği Excel dosyasını sisteme yükler, sistem eksik görselleri tespit eder ve AI (Photoroom API) ile eksik ürün görsellerini otomatik tamamlar. Giysi ürünleri için AI model üzerinde giydirilmiş görseller, diğer ürünler (ayakkabı, çanta, elektronik vb.) için profesyonel arka planlı görseller üretilir.

**Bu depodaki sayfa**, AI tarafından üretilen görsellerin kullanıcıya sunulduğu, onay/red ile filtrelendiği ve indirildiği son aşamadır.

---

## Özellikler

| Özellik | Açıklama |
|---------|----------|
| **Yan yana karşılaştırma** | Solda orijinal görsel, sağda üretilen 2-3 varyant |
| **Zoom modal** | Herhangi bir görsele tıklayınca tam ekran büyütme |
| **Onayla / Reddet** | Her varyant altında yeşil/kırmızı aksiyon butonları |
| **Yeniden Üret** | Reddedilen görseller için farklı varyant üretme |
| **Tek görsel indirme** | Onaylı görseli PNG olarak kaydetme |
| **Toplu ZIP indirme** | Tüm onaylı görselleri JSZip ile tek dosyada indirme |
| **Filtreleme** | Tümü / Bekleyen / Onaylı / Reddedilen filtre sekmeleri |
| **Demo modu** | Backend hazır olmadan placeholder verilerle çalışır |

---

## Teknolojiler

- **Next.js 16** (App Router, Turbopack)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (Dialog, Card, Button, Badge)
- **JSZip** — Tarayıcıda ZIP dosyası oluşturma
- **file-saver** — Dosya indirme

---

## Hızlı Başlangıç

### Seçenek 1: Tek Tıkla (Windows)

Proje klasöründeki **`start.bat`** dosyasına çift tıkla. Script otomatik olarak:

- Node.js varlığını kontrol eder
- Gerekirse `npm install` çalıştırır
- Boş bir port bulur (3000 doluysa 3001, 3002...)
- Tarayıcıyı `/preview` sayfasında açar

### Seçenek 2: Manuel

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Geliştirme sunucusunu başlat
npm run dev

# 3. Tarayıcıda aç
# http://localhost:3000/preview
```

---

## Proje Yapısı

```
src/
├── app/
│   └── preview/
│       └── page.tsx              # Ana önizleme sayfası
├── components/
│   ├── ImagePreviewCard.tsx      # Yan yana karşılaştırma kartı
│   ├── ImageZoomModal.tsx        # Tam ekran büyütme modalı
│   └── ui/                        # shadcn/ui bileşenleri
├── services/
│   └── api.ts                     # Backend API servisi
└── types/
    └── index.ts                   # TypeScript tip tanımları
```

---

## Kullanım Akışı

1. Sayfa açıldığında üretilmiş görseller ürün kartları halinde listelenir
2. Her ürünün solunda orijinal görsel, sağında 2-3 AI varyantı görünür
3. Kullanıcı beğendiği varyantı **"Onayla"**, beğenmediğini **"Reddet"** ile işaretler
4. Reddedilen varyantlar için **"Yeniden Üret"** butonu ile yeni varyant istenebilir
5. Onaylı görseller tek tek **"İndir"** butonuyla veya toplu halde **"Tüm Onaylı Görselleri İndir (ZIP)"** butonuyla indirilir

---

## Ekran Görüntüsü

Demo modunda 4 farklı kategoride ürün (giyim, aksesuar, elektronik) ile çalışır. Backend hazır olunca `src/app/preview/page.tsx` içindeki `useDemoMode = false` yapılarak gerçek API'ye bağlanır.

---

## Backend Entegrasyonu

`src/services/api.ts` içindeki servisler şu endpoint'lere bağlanacak:

| Endpoint | Açıklama |
|----------|----------|
| `GET /api/images/generated` | Üretilmiş görselleri listele |
| `PUT /api/images/{id}/approve` | Görseli onayla |
| `PUT /api/images/{id}/reject` | Görseli reddet |
| `POST /api/generation/regenerate/{id}` | Yeniden üret |
| `GET /api/images/{id}/download` | Tek görsel indir |
| `GET /api/images/download-zip` | Toplu ZIP indir |

Environment değişkeni:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Geliştirme Komutları

```bash
npm run dev      # Geliştirme sunucusu (hot reload)
npm run build    # Production build
npm run start    # Production sunucu
npm run lint     # ESLint kontrol
```

---

## Ekip

10 kişilik staj ekibinin görev dağılımı:

| # | Görev | Teknoloji |
|---|-------|-----------|
| 1 | Docker ortam hazırlama | Docker, PostgreSQL, Redis |
| 2 | Backend iskelet + DB | FastAPI, SQLAlchemy, Alembic |
| 3 | Excel/CSV parser | Python, pandas |
| 4 | Kullanıcı giriş sistemi | JWT, bcrypt |
| 5 | Photoroom API servisi | Python, Photoroom API |
| 6 | Üretim endpoint'leri | FastAPI, Celery, Redis |
| 7 | Frontend layout + login | Next.js, Tailwind, shadcn/ui |
| 8 | Dashboard + Excel yükleme | React, recharts |
| 9 | Ürün listesi + üretim | React, shadcn/ui Table |
| **10** | **Önizleme + onay + indirme** | **React, JSZip, file-saver** |

---

## Lisans

Bu proje staj kapsamında geliştirilmiştir.
