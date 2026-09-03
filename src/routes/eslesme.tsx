import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, Copy, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { usePairPatrol } from "@/lib/store";
import { LogoMark } from "@/components/app/Logo";

const TITLE = "Eşleşme — Pair Patrol";
const DESCRIPTION =
  "Davet kodunu paylaş veya partnerinin kodunu gir; Pair Patrol iki kişiyle çalışır.";

export const Route = createFileRoute("/eslesme")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: PairPage,
});

function PairPage() {
  const { state, hydrated, regenerateCode, pairWithCode } = usePairPatrol();
  const navigate = useNavigate();
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(state.inviteCode);
      setCopied(true);
      toast.success("Kod kopyalandı");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Kopyalanamadı, kodu elle yazabilirsin.");
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setTimeout(() => {
      const res = pairWithCode(code);
      setBusy(false);
      if (!res.ok) {
        setError(res.message);
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
      navigate({ to: "/panel" });
    }, 500);
  };

  return (
    <div className="grain-bg min-h-dvh">
      <div className="mx-auto max-w-md px-5 py-10">
        <Link to="/" className="text-sm font-semibold text-muted-foreground underline">
          ← Karşılama
        </Link>

        <header className="mt-6 text-center">
          <LogoMark className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-3 font-display text-3xl font-extrabold">Eşleşme</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pair Patrol iki kişiyle çalışır. Biriniz kodu paylaşır, diğeriniz girer.
          </p>
        </header>

        <section className="surface mt-7 p-5" aria-labelledby="kod-baslik">
          <h2 id="kod-baslik" className="font-display text-lg font-bold">
            Davet kodun
          </h2>
          {hydrated ? (
            <motion.p
              key={state.inviteCode}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 rounded-2xl bg-sand px-4 py-4 text-center font-display text-3xl font-extrabold tracking-[0.35em]"
            >
              {state.inviteCode}
            </motion.p>
          ) : (
            <Skeleton className="mt-3 h-16 w-full rounded-2xl" />
          )}
          <div className="mt-3 flex gap-2">
            <Button onClick={copy} className="tactile h-11 flex-1 rounded-xl">
              {copied ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              {copied ? "Kopyalandı" : "Kodu kopyala"}
            </Button>
            <Button
              variant="outline"
              className="tactile h-11 rounded-xl"
              onClick={() => {
                regenerateCode();
                toast("Yeni kod üretildi");
              }}
              aria-label="Yeni kod üret"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </section>

        <form onSubmit={submit} className="surface mt-4 p-5">
          <Label htmlFor="kod" className="font-display text-lg font-bold">
            Partnerinin kodu
          </Label>
          <Input
            id="kod"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ÖRN. K7HD2P"
            autoComplete="off"
            aria-invalid={!!error}
            aria-describedby={error ? "kod-hata" : undefined}
            className="mt-3 h-14 rounded-2xl text-center text-xl font-bold tracking-[0.3em]"
          />
          {error ? (
            <p id="kod-hata" role="alert" className="mt-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={busy || code.trim().length === 0}
            className="tactile mt-4 h-13 w-full rounded-2xl py-4 text-base font-bold"
          >
            {busy ? "Eşleşiliyor…" : "Eşleş"}
          </Button>
        </form>

        <p className="mt-5 flex gap-2 rounded-2xl bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Konum paylaşımı eşleşmeyle otomatik açılmaz. İkiniz de ayrı ayrı onay
          vermeden kimse kimsenin konumunu göremez.
        </p>
      </div>
    </div>
  );
}
