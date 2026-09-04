# Pair Patrol — Android / Google Play Yayın Rehberi

Native Android projesi `android/` klasöründe hazırdır. Uygulama kimliği
`app.lovable.pairpatrol`, görünen adı **Pair Patrol** ve sürümü `1.0` olarak
ayarlanmıştır.

## Gereksinimler

- Güncel Android Studio
- Google Play Console geliştirici hesabı
- Test için Android cihaz veya emülatör

## Projeyi aç

```bash
npm install
npm run android:sync
npm run android:open
```

Android Studio Gradle eşitlemesini tamamladıktan sonra cihaz seçip **Run** ile
test edebilirsin.

## İmzalı mağaza paketi

1. Android Studio → **Build → Generate Signed Bundle / APK**.
2. **Android App Bundle** seç.
3. Yeni bir `.jks` imzalama anahtarı oluştur ve güvenli bir yerde yedekle.
4. `release` seçeneğiyle `.aab` paketini üret.
5. Google Play Console'da uygulama oluşturup önce **Internal testing** kanalına yükle.

## Mağaza kontrol listesi

- Gizlilik politikası: `https://duo-duty-tracker.lovable.app/gizlilik`
- Kategori: Lifestyle veya Social
- Konum izni açıklaması: görev noktaları ve karşılıklı onaylı bölge uyarıları
- Data safety formu, uygulamadaki gerçek veri akışına göre doldurulmalı
- Telefon ekran görüntüleri ve 512×512 mağaza ikonu hazırlanmalı

> İmzalama anahtarını kaybedersen aynı Google Play uygulamasına güncelleme
> yayınlamak zorlaşır. Anahtarı GitHub'a yükleme.
