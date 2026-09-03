# Pair Patrol — iOS / TestFlight Yayın Rehberi

Bu adımlar **kendi macOS bilgisayarında** çalıştırılır. Lovable bulutunda Xcode ve
Apple imzalama araçları bulunmadığı için native derleme burada yapılamaz.

## Gereksinimler

- macOS + Xcode 16 veya üzeri (App Store'dan)
- Apple Developer Program üyeliği (yıllık 99 USD)
- Node.js 20+ ve npm (veya bun)

## 1. Depoyu klonla

```bash
git clone <github-repo-url> pair-patrol
cd pair-patrol
npm install     # veya: bun install
```

## 2. iOS projesini eşitle

Capacitor yapılandırması (`capacitor.config.ts`) ve native `ios/` projesi hazırdır.
Web veya yapılandırma değişikliklerinden sonra şunu çalıştır:

```bash
npm run ios:sync
```

> Not: Yapılandırma, native kabuğun yayınlanan web uygulamasını
> (`https://duo-duty-tracker.lovable.app`) yüklemesini sağlar. Böylece Lovable'da
> yaptığın her güncelleme, yeni bir App Store sürümü gerekmeden uygulamaya yansır.

## 3. Xcode'da aç ve imzala

```bash
npm run ios:open
```

Xcode içinde:

1. Sol panelden **App** hedefini seç → **Signing & Capabilities**.
2. **Team** olarak Apple Developer hesabını seç, **Automatically manage signing** işaretli olsun.
3. **Bundle Identifier**: `app.lovable.pairpatrol` (istersen kendi domainine göre değiştir; `capacitor.config.ts` içindeki `appId` ile aynı olmalı).
4. **Info** sekmesinde konum izni açıklamasını ekle:
   - `NSLocationWhenInUseUsageDescription` → "Partnerinle karşılıklı onaylı canlı konum paylaşımı için konumun kullanılır."

## 4. Uygulama ikonu

`src/assets/logo.png` dosyasını 1024×1024 PNG olarak dışa aktar ve Xcode'da
`Assets.xcassets → AppIcon` içine sürükle (şeffaflık olmamalı).

## 5. Cihazda test

Bir iPhone'u bağla, Xcode'da hedef cihaz olarak seç ve **Run** (⌘R).

## 6. Arşivle ve TestFlight'a yükle

1. Xcode üst menü: **Product → Destination → Any iOS Device (arm64)**.
2. **Product → Archive**.
3. Arşiv penceresinde **Distribute App → App Store Connect → Upload**.
4. Yükleme bittikten sonra [App Store Connect](https://appstoreconnect.apple.com) →
   **My Apps → Pair Patrol → TestFlight** bölümünde build işlenene kadar bekle (~10–30 dk).
5. **Test Information** alanını doldur, test kullanıcılarını davet et.

## 7. App Store incelemesi için hazırlık

- Gizlilik politikası URL'si zorunlu (konum verisi topladığın için).
- App Privacy formunda "Location — App Functionality" seçeneğini işaretle.
- Ekran görüntüleri: 6.7" ve 6.5" iPhone boyutları.
- Açıklama, anahtar kelimeler, kategori (Lifestyle / Social Networking).

## Sık karşılaşılan sorunlar

| Sorun | Çözüm |
| --- | --- |
| Swift Package hatası | Xcode → File → Packages → Reset Package Caches |
| Beyaz ekran | `capacitor.config.ts` içindeki `server.url` erişilebilir mi kontrol et |
| İmzalama hatası | Xcode → Settings → Accounts'ta Apple ID ekli mi bak |
| Konum çalışmıyor | Info.plist'te `NSLocationWhenInUseUsageDescription` var mı kontrol et |
