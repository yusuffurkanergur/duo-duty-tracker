import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { EyeOff, Navigation, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Gate } from "@/components/app/Gate";
import { DemoMap, type MapPerson, type MapPin } from "@/components/app/DemoMap";
import { Button } from "@/components/ui/button";
import { geofenceActive, partnerZoneBreach, usePairPatrol } from "@/lib/store";
import { distanceMeters, formatDistance } from "@/lib/geo";
import { HOME } from "@/lib/demo-data";

const TITLE = "Harita — Pair Patrol";
const DESCRIPTION =
  "Karşılıklı onayla açılan canlı konum görünümü, görev noktaları ve bölge daireleri.";

export const Route = createFileRoute("/harita")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: MapRoute,
});

function MapRoute() {
  return (
    <AppShell title="Harita" subtitle="Örnek harita görünümü, API anahtarı gerekmez.">
      <Gate>
        <MapContent />
      </Gate>
    </AppShell>
  );
}

function MapContent() {
  const { state } = usePairPatrol();
  const geo = geofenceActive(state);
  const breach = partnerZoneBreach(state);

  const people: MapPerson[] = [];
  if (state.me.position && state.me.sharing) {
    people.push({
      id: "me",
      name: "Sen",
      emoji: state.me.emoji,
      position: state.me.position,
      tone: "me",
    });
  }
  if (geo && state.partner.position) {
    people.push({
      id: "partner",
      name: state.partner.name,
      emoji: state.partner.emoji,
      position: state.partner.position,
      tone: "partner",
    });
  }

  const pins: MapPin[] = state.tasks
    .filter((t) => !t.completedAt && t.placeAt)
    .map((t) => ({ id: t.id, label: t.place ?? t.title, position: t.placeAt! }));

  const center = state.me.position ?? state.partner.position ?? HOME;

  const proximity = (() => {
    if (!state.me.position) return null;
    let best: { name: string; d: number } | null = null;
    for (const z of state.zones) {
      if (!z.active) continue;
      const d = distanceMeters(state.me.position, z.center) - z.radius;
      if (!best || d < best.d) best = { name: z.name, d };
    }
    return best && best.d > 0 && best.d < 400 ? best : null;
  })();

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="surface overflow-hidden p-2"
      >
        <div className="aspect-square w-full overflow-hidden rounded-2xl">
          <DemoMap center={center} people={people} zones={state.zones} pins={pins} />
        </div>
      </motion.div>

      {!geo ? (
        <div className="surface flex gap-3 p-4">
          <EyeOff className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="font-semibold">Canlı konum kapalı</p>
            <p className="text-sm text-muted-foreground">
              Harita ancak ikiniz de paylaşımı açtığında canlı çalışır. Şu an örnek
              görünümdesin.
            </p>
            <Button asChild size="sm" className="mt-3 rounded-xl">
              <Link to="/profil">Paylaşım ayarları</Link>
            </Button>
          </div>
        </div>
      ) : null}

      {breach ? (
        <div
          role="status"
          className="surface flex gap-3 border-primary/40 bg-primary/8 p-4"
        >
          <ShieldAlert className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="font-semibold">İhlal: {breach.name}</p>
            <p className="text-sm text-muted-foreground">
              {state.partner.name} bölgenin içinde. Nazikçe hatırlatabilirsin.
            </p>
          </div>
        </div>
      ) : null}

      {proximity ? (
        <div role="status" className="surface flex gap-3 p-4">
          <Navigation className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="font-semibold">Yaklaşma: {proximity.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatDistance(proximity.d)} kaldı.
            </p>
          </div>
        </div>
      ) : null}

      {pins.length === 0 ? (
        <p className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
          Haritada görev noktası yok. Görev oluştururken konum iliştirirsen burada
          görünür.
        </p>
      ) : null}
    </div>
  );
}
