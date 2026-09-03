# Pair Patrol

Rol & Sistem Tanımı

Sen kıdemli bir Full-Stack ve Mobil Uygulama Geliştiricisisin. Çiftler arasında mizahi görev atama, anlık konum takibi ve yasaklı bölge (geofence) denetimi yapan "Kılıbık" isimli mobil uyumlu web/mobil uygulamasını geliştireceksin.

Teknoloji Yığını (Tech Stack)

Frontend: React / React Native (Expo) veya Next.js (App Router), Tailwind CSS, Framer Motion (Animasyonlar için).

Harita & Konum: Leaflet.js / Mapbox veya React Native Maps, HTML5 Geolocation / Native Location API.

Backend & Veritabanı: Supabase (Realtime Database, Authentication, Push Notifications) veya Firebase.

State Management: Zustand veya React Context.

Detaylı Modüller ve Çalışma Mantığı

1. Kullanıcı Eşleşme (Pairing) Sistemi

Kullanıcılar hesap oluşturduktan sonra bir "Eşleşme Kodu" (Invite Code) üretilir.

Kod girildiğinde iki kullanıcı tek bir "Çift Paneli" altında birleşir. Sistem yalnızca iki kişinin veri paylaşımına izin verir.

2. Tek Yanıtlı Görev (Task) Modülü

Görev Gönderme: A partneri, B partnerine yapılacaklar listesi (metin) ve isteğe bağlı süre sınırı ("Eve gelene kadar") tanımlar.

Tek Yanıt Zorunluluğu: B partnerine görev ulaştığında ekranda devasa bir "TAMAMDIR" butonu çıkar. Reddetme, erteleme veya pas geçme seçeneği kesinlikle bulunmaz.

Zaman Sayıcısı: "TAMAMDIR" butonuna basıldığı an geçen süre (milisaniye cinsinden) kaydedilir ve veri tabanına işlenir.

3. Canlı Konum ve "Red Zone" (Yasaklı Bölge) Engine

Canlı Takip: Haritada partnerlerin konumu üzerinde özel "Kalp" ikonu olan canlı bir marker ile gösterilir.

Yaklaşma Uyarısı: Görev noktasına (ör. "Migros") 200m kaldığında otomatik bildirim tetiklenir: "Görev alanına yaklaşıyorsun".

Yasaklı Bölge (Red Zone) Tanımlama: Partner A, haritadan belirli noktaları (Örn: "Halı Saha", "Berber") daire şeklinde yarıçap (radius) seçerek yasaklı bölge ilan edebilir.

İhlal Algılama (Geofencing): Partner B bu bölgeye girdiğinde her iki telefona da anlık uyarı düşer:

B'nin ekranı: "Burada ne işin var kardeşim?" (Tek seçenek: "TAMAMDIR").

A'nın ekranı: "Kılıbık rotadan çıktı! [Konum İsmi]'ne giriş yaptı."

4. Acil Çağrı (Beni Ara) Overdrive Modülü

Partner A "Beni Ara" butonuna bastığında, Partner B'nin telefonunda en yüksek öncelikli uyarı tetiklenir.

Ekran mor/neon animasyonlu bir radyo dalgası görseliyle kaplanır. Telefon aralıksız ve güçlü ritimle titrer/ses çıkarır.

Ekranı kapatmanın veya sessize almanın tek yolu yine ekranın altındaki "TAMAMDIR" butonuna basmaktır.

5. Kılıbık Wrapped (Yıllık / Aylık Özet Paneli)

Spotify Wrapped tarzında, kaydırılabilir veya görsel olarak indirilebilir istatistik kartı:

Toplam Tamamlanan Görev: (Örn: 1.284)

Ortalama Onay Süresi: (Örn: 2,4 saniye)

En Hızlı Tamamdır: (Örn: 0,8 saniye)

Rota İhlali Sayısı: (Örn: 3)

Seviye Unvanı: İhlal sayısı 0-2 ise "Efsane Kılıbık", 3-5 ise "Şüpheli Kılıbık", 5+ ise "Tehlikeli Kılıbık".

Geliştirme Adımları (Execution Plan)

Proceyi geliştirirken bana adım adım ilerle:

1. Adım 1: Veritabanı şemasını (Users, Couples, Tasks, RedZones, Analytics) oluştur ve eşleşme mantığını kodla.

2. Adım 2: Görev gönderme ve "Tek Yanıtlı" modal arayüzünü tasarla.

3. Adım 3: Harita entegrasyonunu, canlı konum paylaşımını ve Red Zone sınır denetimi algoritmasını yaz.

4. Adım 4: "Beni Ara" ekranı ile "Kılıbık Wrapped" istatistik kartı UI tasarımını tamamla.

Bütün arayüzün mobil cihazlarda kusursuz görünmesi için Tailwind CSS kullan ve mor/neon pembe/koyu gri renk paletini baz al. Kodları yazmaya başla.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://duo-duty-tracker.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aac94559-6e26-40b0-90fb-f689846b4b57).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
