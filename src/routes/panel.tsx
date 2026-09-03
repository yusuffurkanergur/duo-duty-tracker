import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  BellRing,
  Clock,
  Flame,
  MapPin,
  Plus,
  Radar,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { Gate } from "@/components/app/Gate";
import { TamamdirButton } from "@/components/app/TamamdirButton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { partnerZoneBreach, stats, usePairPatrol, geofenceActive } from "@/lib/store";
import { distanceMeters, formatDistance, formatMs, formatRelative } from "@/lib/geo";

const TITLE = "Panel — Pair Patrol";
const DESCRIPTION =
  "Partner durumu, günün özeti, bekleyen görev ve konum paylaşımı tek ekranda.";

export const Route = createFileRoute("/panel")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: PanelPage,
});

function PanelPage() {
  return (
    <AppShell
      title="Merhaba 👋"
      subtitle="Bugünün devriye raporu hazır."
      action={
        <Button asChild className="tactile rounded-xl">
          <Link to="/gorevler">
            <Plus className="h-4 w-4" aria-hidden="true" /> Görev
          </Link>
        </Button>
      }
    >
      <Gate>
        <PanelContent />
      </Gate>
    </AppShell>
  );
}

function PanelContent() {
  const { state, setSharing, completeTask } = usePairPatrol();
  const s = stats(state);
  const pending = state.tasks.filter((t) => !t.completedAt);
  const next = pending[0];
  const breach = partnerZoneBreach(state);
  const geo = geofenceActive(state);

  const nearest = (() => {
    if (!state.me.position) return null;
    let best: { name: string; d: number } | null = null;
    for (const z of state.zones) {
      if (!z.active) continue;
      const d = distanceMeters(state.me.position, z.center) - z.radius;
      if (!best || d < best.d) best = { name: z.name, d };
    }
    return best;
  })();

  return (
    <div className="space-y-4">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface grain-bg p-5"
        aria-labelledby="partner-baslik"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-2xl">
            {state.partner.emoji}
          </span>
          <div className="min-w-0">
            <h2 id="partner-baslik" className="font-display text-lg font-bold">
              {state.partner.name}
            </h2>
            <p className="truncate text-sm text-muted-foreground">
              {state.partner.sharing && state.partner.lastSeen
                ? `Konum paylaşıyor · ${formatRelative(state.partner.lastSeen)}`
                : "Konum paylaşımı kapalı"}
            </p>
          </div>
          <Badge
            variant={geo ? "default" : "secondary"}
            className="ml-auto rounded-full"
          >
            {geo ? "Devriye açık" : "Beklemede"}
          </Badge>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-card/70 p-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold">Kendi konumumu paylaş</p>
            <p className="text-xs text-muted-foreground">
              İstediğin an kapatabilirsin. Gizli takip yok.
            </p>
          </div>
          <Switch
            checked={state.me.sharing}
            onCheckedChange={(v) => {
              setSharing("me", v);
              toast[v ? "success" : "message"](
                v ? "Konum paylaşımı açık" : "Paylaşım durduruldu",
              );
            }}
            aria-label="Konum paylaşımını aç veya kapat"
          />
        </div>
      </motion.section>

      {breach ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          role="status"
          className="surface flex gap-3 border-primary/40 bg-primary/8 p-4"
        >
          <ShieldAlert className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="font-semibold">Bölge ziyareti: {breach.name}</p>
            <p className="text-sm text-muted-foreground">
              {state.partner.name} burada. Panik yok, sadece bilgin olsun.
            </p>
          </div>
        </motion.div>
      ) : null}

      <section className="grid grid-cols-3 gap-3" aria-label="Günün özeti">
        <SummaryCard icon={Clock} label="Bekleyen" value={String(s.pending)} />
        <SummaryCard icon={Flame} label="Tamamlanan" value={String(s.total)} />
        <SummaryCard
          icon={Sparkles}
          label="Ort. yanıt"
          value={s.avgMs ? formatMs(s.avgMs) : "—"}
        />
      </section>

      <section className="surface p-5" aria-labelledby="gorev-baslik">
        <h2 id="gorev-baslik" className="font-display text-lg font-bold">
          Bekleyen görev
        </h2>
        {next ? (
          <div className="mt-3">
            <p className="font-display text-xl font-extrabold">{next.title}</p>
            {next.note ? (
              <p className="mt-1 text-sm text-muted-foreground">{next.note}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {next.place ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                  <MapPin className="h-3 w-3" aria-hidden="true" /> {next.place}
                </span>
              ) : null}
              {next.due ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                  <Clock className="h-3 w-3" aria-hidden="true" /> {next.due}
                </span>
              ) : null}
            </div>
            <TamamdirButton
              className="mt-4"
              onDone={() => {
                const ms = completeTask(next.id);
                toast.success(`Tamamdır! Yanıt süresi ${formatMs(ms)} 🎉`);
              }}
            />
          </div>
        ) : (
          <p className="mt-3 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
            Bekleyen görev yok. Vicdanın rahat, bu şüpheli.
          </p>
        )}
      </section>

      <section className="surface flex items-center gap-3 p-4">
        <Radar className="h-5 w-5 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Yaklaşan bölge</p>
          <p className="truncate text-sm text-muted-foreground">
            {nearest
              ? `${nearest.name} · ${nearest.d <= 0 ? "içindesin" : formatDistance(nearest.d)}`
              : "Konum paylaşımı kapalıyken bölge takibi çalışmaz."}
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link to="/harita">Harita</Link>
        </Button>
      </section>

      <section className="surface flex items-center gap-3 p-4">
        <BellRing className="h-5 w-5 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Son hareketler</p>
          <p className="truncate text-sm text-muted-foreground">
            {state.alerts[0]?.title ?? "Henüz bir uyarı yok."}
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link to="/aktivite">Tümü</Link>
        </Button>
      </section>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
}) {
  return (
    <div className="surface p-3 text-center">
      <Icon className="mx-auto h-4 w-4 text-primary" aria-hidden={true} />
      <p className="mt-2 font-display text-lg font-extrabold leading-none">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
