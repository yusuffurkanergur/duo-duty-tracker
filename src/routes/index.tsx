import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ListChecks, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/app/Logo";
import { usePairPatrol } from "@/lib/store";

const TITLE = "Pair Patrol — Birlikte, eğlenceli";
const DESCRIPTION =
  "Çiftler için oyunlaştırılmış görev, karşılıklı onaylı konum paylaşımı ve bölge hatırlatmaları. Tek cevap var: TAMAMDIR.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Landing,
});

const BENEFITS = [
  {
    icon: ListChecks,
    title: "Tek yanıtlı görevler",
    body: "“Dönüşte ekmek al.” Cevap seçeneği bir tane: TAMAMDIR.",
  },
  {
    icon: MapPinned,
    title: "Karşılıklı onaylı konum",
    body: "İkiniz de açmadan hiçbir konum görünmez. Gizli takip yok.",
  },
  {
    icon: ShieldCheck,
    title: "Nazik bölge uyarıları",
    body: "Halı saha yine 3 saat mi sürdü? Bölge tatlı tatlı hatırlatsın.",
  },
];

function Landing() {
  const { startDemo, state, hydrated } = usePairPatrol();
  const navigate = useNavigate();

  return (
    <div className="grain-bg min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-5 pb-12 pt-10">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <LogoMark className="mx-auto h-16 w-16 text-primary" />
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Çiftler için minik bir devriye
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl">
            Pair Patrol
            <span className="block text-primary">Birlikte, eğlenceli</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-balance text-[15px] leading-relaxed text-muted-foreground">
            Görev gönder, birlikte gülün, konumu yalnızca ikiniz de isterse paylaşın. Kavga değil,
            oyun.
          </p>
        </motion.header>

        <ul className="mt-9 grid gap-3 sm:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <motion.li
              key={b.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 * (i + 1) }}
              className="surface p-4"
            >
              <b.icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-3 font-display text-base font-bold">{b.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{b.body}</p>
            </motion.li>
          ))}
        </ul>

        <div className="mt-auto pt-10">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="tactile h-14 flex-1 rounded-2xl text-base font-bold"
            >
              <Link to={state.onboarded ? "/eslesme" : "/profil-olustur"}>
                {state.onboarded ? "Eşleşmeye devam et" : "Profilini oluştur"}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="tactile h-14 flex-1 rounded-2xl border-2 text-base font-bold"
              onClick={() => {
                startDemo();
                navigate({ to: "/panel" });
              }}
            >
              Demo'yu gör
            </Button>
          </div>
          {hydrated && state.paired ? (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Zaten eşleştiniz.{" "}
              <Link to="/panel" className="font-semibold text-primary underline">
                Panele dön
              </Link>
            </p>
          ) : (
            <div className="mt-4 space-y-2 text-center text-xs text-muted-foreground">
              <p>Demo veriler cihazında kalır, hiçbir yere gönderilmez.</p>
              <Link to="/gizlilik" className="font-semibold underline">
                Gizlilik ve veri kullanımı
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
