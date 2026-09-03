import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Info, Plus, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { Gate } from "@/components/app/Gate";
import { DemoMap } from "@/components/app/DemoMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { geofenceActive, usePairPatrol } from "@/lib/store";
import { HOME } from "@/lib/demo-data";
import type { LatLng, ZoneLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const TITLE = "Bölgeler — Pair Patrol";
const DESCRIPTION =
  "Ad, yarıçap ve seviye seçerek bölge oluştur; istediğin an aç, kapat veya sil.";

export const Route = createFileRoute("/bolgeler")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ZonesPage,
});

const LEVELS: { value: ZoneLevel; label: string; hint: string }[] = [
  { value: "yumusak", label: "Yumuşak", hint: "Sadece bilgi ver" },
  { value: "orta", label: "Orta", hint: "Bildirim gönder" },
  { value: "sert", label: "Sert", hint: "Anında uyar" },
];

function ZonesPage() {
  const [open, setOpen] = React.useState(false);
  return (
    <AppShell
      title="Bölgeler"
      subtitle="Yasak değil; nazik hatırlatma alanları."
      action={
        <Button className="tactile rounded-xl" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Bölge
        </Button>
      }
    >
      <Gate>
        <ZonesContent onCreate={() => setOpen(true)} />
        <ZoneDialog open={open} onOpenChange={setOpen} />
      </Gate>
    </AppShell>
  );
}

function ZonesContent({ onCreate }: { onCreate: () => void }) {
  const { state, toggleZone, removeZone, setSharing } = usePairPatrol();
  const geo = geofenceActive(state);

  return (
    <div className="space-y-4">
      <section className="surface p-4" aria-labelledby="onay-baslik">
        <h2 id="onay-baslik" className="font-display text-base font-bold">
          Karşılıklı onay
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Bölge takibi yalnızca iki taraf da konum paylaşımını açtığında çalışır.
        </p>
        <div className="mt-3 space-y-2">
          <ConsentRow
            label="Senin paylaşımın"
            checked={state.me.sharing}
            onChange={(v) => {
              setSharing("me", v);
              toast[v ? "success" : "message"](
                v ? "Paylaşım açık" : "Paylaşımı durdurdun",
              );
            }}
          />
          <ConsentRow
            label={`${state.partner.name} paylaşımı`}
            checked={state.partner.sharing}
            onChange={(v) => setSharing("partner", v)}
          />
        </div>
        <p
          className={cn(
            "mt-3 rounded-xl px-3 py-2 text-sm font-semibold",
            geo ? "bg-success/20 text-success-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {geo ? "Geofence aktif" : "Geofence pasif — kimse takip edilmiyor"}
        </p>
      </section>

      {state.zones.length === 0 ? (
        <div className="surface p-8 text-center">
          <Shield className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
          <p className="mt-3 font-display text-lg font-bold">Henüz bölge yok</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Halı saha, berber, kafe… Hangisi 3 saat sürüyorsa.
          </p>
          <Button className="mt-4 rounded-xl" onClick={onCreate}>
            İlk bölgeyi oluştur
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {state.zones.map((z) => (
              <motion.li
                key={z.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="surface p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12">
                    <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-base font-bold">{z.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {z.radius} m ·{" "}
                      {LEVELS.find((l) => l.value === z.level)?.label ?? z.level} ·{" "}
                      {z.createdBy === "me" ? "sen kurdun" : "partnerin kurdu"}
                    </p>
                  </div>
                  <Switch
                    checked={z.active}
                    onCheckedChange={() => toggleZone(z.id)}
                    aria-label={`${z.name} bölgesini aç veya kapat`}
                  />
                </div>
                <button
                  onClick={() => {
                    removeZone(z.id);
                    toast("Bölge silindi");
                  }}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground underline"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Sil
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <p className="flex gap-2 rounded-2xl bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Pair Patrol gizli takip için tasarlanmadı. Her iki taraf da paylaşımı görür ve
        tek dokunuşla durdurabilir.
      </p>
    </div>
  );
}

function ConsentRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-sand px-3 py-2">
      <span className="text-sm font-semibold">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}

function ZoneDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { state, addZone } = usePairPatrol();
  const [name, setName] = React.useState("");
  const [radius, setRadius] = React.useState(200);
  const [level, setLevel] = React.useState<ZoneLevel>("orta");
  const [center, setCenter] = React.useState<LatLng>(state.me.position ?? HOME);
  const [error, setError] = React.useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError("Bölgeye kısa bir ad ver.");
      return;
    }
    addZone({ name, center, radius, level });
    toast.success("Bölge oluşturuldu");
    setName("");
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88dvh] overflow-y-auto rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-extrabold">
            Yeni bölge
          </DialogTitle>
          <DialogDescription>
            Haritaya dokunarak merkezi seç, yarıçapı ayarla.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-2xl border border-border">
            <DemoMap
              center={state.me.position ?? HOME}
              zones={state.zones}
              draft={{ center, radius }}
              onPick={setCenter}
            />
          </div>

          <div>
            <Label htmlFor="bolge-ad">Bölge adı</Label>
            <Input
              id="bolge-ad"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Halı saha"
              className="mt-1.5 h-12 rounded-xl"
              aria-invalid={!!error}
            />
            {error ? (
              <p role="alert" className="mt-1 text-sm text-destructive">
                {error}
              </p>
            ) : null}
          </div>

          <div>
            <Label htmlFor="yaricap">Yarıçap: {radius} m</Label>
            <Slider
              id="yaricap"
              value={[radius]}
              min={50}
              max={1000}
              step={25}
              onValueChange={(v) => setRadius(v[0] ?? radius)}
              className="mt-3"
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium">Seviye</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setLevel(l.value)}
                  aria-pressed={level === l.value}
                  className={cn(
                    "tactile rounded-xl border px-2 py-3 text-center",
                    level === l.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card",
                  )}
                >
                  <span className="block text-sm font-bold">{l.label}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {l.hint}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <Button type="submit" className="tactile h-13 w-full rounded-2xl py-4 font-bold">
            Bölgeyi kaydet
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
