import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Award, BellRing, History, Timer, Trophy, Zap } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Gate } from "@/components/app/Gate";
import { stats, usePairPatrol } from "@/lib/store";
import { formatMs, formatRelative, rankTitle } from "@/lib/geo";
import { cn } from "@/lib/utils";

const TITLE = "Aktivite — Pair Patrol";
const DESCRIPTION =
  "Yanıt süreleri, tamamlama serisi, rozetler ve son bölge hareketleri tek yerde.";

export const Route = createFileRoute("/aktivite")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ActivityPage,
});

function ActivityPage() {
  return (
    <AppShell title="Aktivite" subtitle="Küçük istatistikler, büyük övünme payı.">
      <Gate>
        <ActivityContent />
      </Gate>
    </AppShell>
  );
}

function ActivityContent() {
  const { state, markAlertsRead } = usePairPatrol();
  const s = stats(state);

  React.useEffect(() => {
    if (state.alerts.some((a) => !a.read)) markAlertsRead();
    // yalnızca ilk görüntülemede okundu işaretle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = state.tasks
    .filter((t) => t.completedAt && t.responseMs)
    .sort(
      (a, b) =>
        new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime(),
    );
  const maxMs = Math.max(1, ...done.map((t) => t.responseMs!));

  const badges = [
    {
      icon: Zap,
      label: "Şimşek Yanıt",
      earned: s.bestMs > 0 && s.bestMs < 60_000,
      hint: "1 dakikanın altında bir TAMAMDIR",
    },
    {
      icon: Trophy,
      label: "Beş Görev Kulübü",
      earned: s.total >= 5,
      hint: "5 görev tamamla",
    },
    {
      icon: Award,
      label: "Temiz Sicil",
      earned: s.violations === 0,
      hint: "Hiç bölge ihlali yok",
    },
  ];

  return (
    <div className="space-y-4">
      <section className="surface grain-bg p-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Sezon ünvanınız
        </p>
        <p className="mt-1 font-display text-3xl font-extrabold text-primary">
          {rankTitle(s.violations)}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="Tamamlanan" value={String(s.total)} />
          <Stat label="Ortalama" value={s.avgMs ? formatMs(s.avgMs) : "—"} />
          <Stat label="En hızlı" value={s.bestMs ? formatMs(s.bestMs) : "—"} />
        </div>
      </section>

      <section className="surface p-5" aria-labelledby="sure-baslik">
        <h2 id="sure-baslik" className="flex items-center gap-2 font-display text-lg font-bold">
          <Timer className="h-5 w-5 text-primary" aria-hidden="true" /> Yanıt süreleri
        </h2>
        {done.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
            Henüz tamamlanan görev yok. İlk grafik ilk TAMAMDIR ile gelir.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {done.slice(0, 6).map((t, i) => (
              <li key={t.id}>
                <div className="flex justify-between text-sm">
                  <span className="truncate pr-2 font-medium">{t.title}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {formatMs(t.responseMs!)}
                  </span>
                </div>
                <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(t.responseMs! / maxMs) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="surface p-5" aria-labelledby="rozet-baslik">
        <h2 id="rozet-baslik" className="font-display text-lg font-bold">
          Rozetler
        </h2>
        <ul className="mt-3 grid grid-cols-3 gap-3">
          {badges.map((b) => (
            <li
              key={b.label}
              className={cn(
                "rounded-2xl border p-3 text-center",
                b.earned ? "border-primary/40 bg-primary/8" : "border-border bg-muted/60",
              )}
            >
              <b.icon
                className={cn(
                  "mx-auto h-5 w-5",
                  b.earned ? "text-primary" : "text-muted-foreground",
                )}
                aria-hidden="true"
              />
              <p className="mt-2 text-xs font-bold leading-tight">{b.label}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{b.hint}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="surface p-5" aria-labelledby="gecmis-baslik">
        <h2
          id="gecmis-baslik"
          className="flex items-center gap-2 font-display text-lg font-bold"
        >
          <History className="h-5 w-5 text-primary" aria-hidden="true" /> Geçmiş
        </h2>
        {state.alerts.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
            Kayıtlı hareket yok. Sakin bir hafta.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {state.alerts.map((a) => (
              <li key={a.id} className="flex gap-3">
                <BellRing className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.body}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatRelative(a.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card/70 p-3">
      <p className="font-display text-lg font-extrabold leading-none">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
