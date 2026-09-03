import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  LogOut,
  MapPin,
  Moon,
  Shield,
  Smile,
  Unlink,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { usePairPatrol } from "@/lib/store";

const TITLE = "Profil ve ayarlar — Pair Patrol";
const DESCRIPTION =
  "Bildirimler, konum izni, tema, partner bağlantısı ve gizlilik ayarlarını yönet.";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { state, hydrated, setSettings, setSharing, reset } = usePairPatrol();
  const navigate = useNavigate();

  const askLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Tarayıcın konum desteklemiyor.");
      setSettings({ locationPermission: "denied" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setSettings({ locationPermission: "granted" });
        toast.success("Konum izni verildi");
      },
      () => {
        setSettings({ locationPermission: "denied" });
        toast.error("Konum izni reddedildi. Uygulama izinsiz de çalışır.");
      },
    );
  };

  return (
    <AppShell title="Profil" subtitle="Her şeyi buradan kontrol edersin.">
      {!hydrated ? (
        <div className="space-y-3" aria-busy="true">
          <Skeleton className="h-24 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
        </div>
      ) : (
        <div className="space-y-4">
          <section className="surface flex items-center gap-3 p-5">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-2xl">
              {state.me.emoji}
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg font-bold">{state.me.name}</p>
              <p className="text-sm text-muted-foreground">
                {state.paired
                  ? `${state.partner.name} ile eşleşti`
                  : "Henüz eşleşmedin"}
              </p>
            </div>
          </section>

          <section className="surface divide-y divide-border p-2" aria-label="Ayarlar">
            <Row
              icon={Bell}
              title="Bildirimler"
              desc="Görev ve bölge uyarıları"
              control={
                <Switch
                  checked={state.settings.notifications}
                  onCheckedChange={(v) => setSettings({ notifications: v })}
                  aria-label="Bildirimler"
                />
              }
            />
            <Row
              icon={MapPin}
              title="Konumumu paylaş"
              desc="İstediğin an durdurabilirsin"
              control={
                <Switch
                  checked={state.me.sharing}
                  onCheckedChange={(v) => {
                    setSharing("me", v);
                    toast[v ? "success" : "message"](
                      v ? "Paylaşım açık" : "Paylaşımı durdurdun",
                    );
                  }}
                  aria-label="Konum paylaşımı"
                />
              }
            />
            <Row
              icon={Shield}
              title="Konum izni"
              desc={
                state.settings.locationPermission === "granted"
                  ? "Verildi"
                  : state.settings.locationPermission === "denied"
                    ? "Reddedildi — örnek konumla devam ediliyor"
                    : "Henüz sorulmadı"
              }
              control={
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                  onClick={askLocation}
                >
                  İzin iste
                </Button>
              }
            />
            <Row
              icon={Moon}
              title="Koyu tema"
              desc="Gece devriyesi için"
              control={
                <Switch
                  checked={state.settings.theme === "dark"}
                  onCheckedChange={(v) => setSettings({ theme: v ? "dark" : "light" })}
                  aria-label="Koyu tema"
                />
              }
            />
            <Row
              icon={Smile}
              title="Mizahı azalt"
              desc="Daha sade mikro metinler"
              control={
                <Switch
                  checked={state.settings.reduceHumor}
                  onCheckedChange={(v) => setSettings({ reduceHumor: v })}
                  aria-label="Mizahı azalt"
                />
              }
            />
          </section>

          <section className="surface p-5">
            <h2 className="font-display text-base font-bold">Gizlilik</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Pair Patrol gizli takip yapmaz. Konumun yalnızca sen açtığında ve
              partnerin de paylaşımı açıkken görünür. Tüm demo verilerin bu cihazda
              saklanır.
            </p>
          </section>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="tactile h-12 w-full rounded-2xl"
              onClick={() => {
                setSharing("me", false);
                setSharing("partner", false);
                toast("Tüm paylaşımlar durduruldu");
              }}
            >
              <Unlink className="h-4 w-4" aria-hidden="true" /> Paylaşımı durdur
            </Button>
            <Button
              variant="destructive"
              className="tactile h-12 w-full rounded-2xl"
              onClick={() => {
                reset();
                toast("Çıkış yapıldı");
                navigate({ to: "/" });
              }}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" /> Çıkış yap ve verileri sil
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Row({
  icon: Icon,
  title,
  desc,
  control,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  desc: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-4">
      <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden={true} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      {control}
    </div>
  );
}
