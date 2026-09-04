import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { LogoMark } from "@/components/app/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePairPatrol } from "@/lib/store";
import { cn } from "@/lib/utils";

const EMOJIS = ["🫶", "💜", "🌷", "😎", "🐣", "✨"];

export const Route = createFileRoute("/profil-olustur")({
  head: () => ({
    meta: [
      { title: "Profilini oluştur — Pair Patrol" },
      {
        name: "description",
        content: "Pair Patrol için görünen adını ve profil simgeni seç.",
      },
    ],
  }),
  component: CreateProfilePage,
});

function CreateProfilePage() {
  const { state, hydrated, createProfile } = usePairPatrol();
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [emoji, setEmoji] = React.useState("🫶");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!hydrated || !state.onboarded) return;
    setName(state.me.name === "Sen" ? "" : state.me.name);
    setEmoji(state.me.emoji);
  }, [hydrated, state.me.emoji, state.me.name, state.onboarded]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      setError("Görünen ad en az 2 karakter olmalı.");
      return;
    }
    if (cleanName.length > 30) {
      setError("Görünen ad en fazla 30 karakter olabilir.");
      return;
    }
    createProfile(cleanName, emoji);
    toast.success(state.onboarded ? "Profilin güncellendi" : "Profilin hazır 🎉");
    navigate({ to: state.paired ? "/profil" : "/eslesme" });
  };

  return (
    <div className="grain-bg min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col px-5 py-8">
        <Link
          to={state.paired ? "/profil" : "/"}
          className="text-sm font-semibold text-muted-foreground underline"
        >
          ← Geri
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-7 text-center"
        >
          <LogoMark className="mx-auto h-14 w-14 text-primary" />
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> İlk adım
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold">
            {state.onboarded ? "Profilini düzenle" : "Seni nasıl tanıyalım?"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Bu bilgiler yalnızca senin ve eşleştiğin partnerin için görünür.
          </p>
        </motion.header>

        <form onSubmit={submit} className="surface mt-7 space-y-6 p-5">
          <div>
            <Label htmlFor="display-name">Görünen ad</Label>
            <Input
              id="display-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError(null);
              }}
              placeholder="Örn. Yusuf"
              autoComplete="name"
              maxLength={30}
              aria-invalid={!!error}
              aria-describedby={error ? "name-error" : "name-help"}
              className="mt-2 h-13 rounded-2xl text-base"
            />
            {error ? (
              <p id="name-error" role="alert" className="mt-2 text-sm text-destructive">
                {error}
              </p>
            ) : (
              <p id="name-help" className="mt-2 text-xs text-muted-foreground">
                Soyadını yazman gerekmez.
              </p>
            )}
          </div>

          <fieldset>
            <legend className="text-sm font-medium">Profil simgesi</legend>
            <div className="mt-3 grid grid-cols-6 gap-2">
              {EMOJIS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setEmoji(item)}
                  aria-label={`${item} simgesini seç`}
                  aria-pressed={emoji === item}
                  className={cn(
                    "relative aspect-square rounded-2xl border-2 text-2xl transition",
                    emoji === item
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border bg-card hover:border-primary/40",
                  )}
                >
                  {item}
                  {emoji === item ? (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </fieldset>

          <Button type="submit" className="tactile h-13 w-full rounded-2xl text-base font-bold">
            {state.onboarded ? "Değişiklikleri kaydet" : "Devam et"}
          </Button>
        </form>

        <p className="mt-4 flex gap-2 rounded-2xl bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Konum paylaşımı profil oluşturunca açılmaz. İzinler her zaman ayrı ve açık onayla istenir.
        </p>
      </div>
    </div>
  );
}
