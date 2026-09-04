import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { LogoMark } from "@/components/app/Logo";

export const Route = createFileRoute("/gizlilik")({
  head: () => ({
    meta: [
      { title: "Gizlilik — Pair Patrol" },
      { name: "description", content: "Pair Patrol gizlilik ve veri kullanımı açıklaması." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="grain-bg min-h-dvh px-5 py-8">
      <main className="mx-auto max-w-2xl">
        <Link to="/" className="text-sm font-semibold text-muted-foreground underline">
          ← Ana sayfa
        </Link>
        <header className="mt-7">
          <LogoMark className="h-12 w-12 text-primary" />
          <h1 className="mt-4 font-display text-3xl font-extrabold">Gizlilik ve veri kullanımı</h1>
          <p className="mt-2 text-sm text-muted-foreground">Son güncelleme: 4 Eylül 2026</p>
        </header>

        <div className="surface mt-7 space-y-6 p-6 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-bold">Kısa özet</h2>
            <p className="mt-2 text-muted-foreground">
              Pair Patrol gizli takip için tasarlanmamıştır. Konum paylaşımı kapalı başlar ve
              yalnızca açık onayınla etkinleşir.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold">İşlenen bilgiler</h2>
            <p className="mt-2 text-muted-foreground">
              Görünen adın, seçtiğin profil simgesi, görevler, eşleşme bilgileri, oluşturduğun
              bölgeler ve izin verirsen cihaz konumu uygulama özelliklerini sağlamak için
              kullanılır.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold">Konum</h2>
            <p className="mt-2 text-muted-foreground">
              Konum izni yalnızca harita, görev noktası ve karşılıklı onaylı bölge uyarıları için
              istenir. Arka planda gizli takip yapılmaz; paylaşımı Profil ekranından istediğin an
              kapatabilirsin.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-bold">Kontrol sende</h2>
            <p className="mt-2 text-muted-foreground">
              Profil ekranındaki “Çıkış yap ve verileri sil” seçeneği bu cihazdaki uygulama
              verilerini temizler. Eşleşmeyi ve konum paylaşımını ayrıca durdurabilirsin.
            </p>
          </section>
          <section className="rounded-2xl bg-primary/10 p-4">
            <p className="flex gap-2 font-semibold text-primary">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> Uygulama
              geliştikçe bu metin, kullanılan canlı servisleri ve saklama sürelerini açıkça
              belirtecek şekilde güncellenecektir.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
