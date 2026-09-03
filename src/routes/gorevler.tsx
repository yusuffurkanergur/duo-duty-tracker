import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Clock, ListChecks, LocateFixed, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { Gate } from "@/components/app/Gate";
import { TamamdirButton } from "@/components/app/TamamdirButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePairPatrol } from "@/lib/store";
import { formatMs, formatRelative } from "@/lib/geo";
import type { LatLng, Task } from "@/lib/types";

const TITLE = "Görevler — Pair Patrol";
const DESCRIPTION =
  "Mizahi görevler oluştur, bekleyen ve tamamlananları filtrele, tek dokunuşla TAMAMDIR de.";

export const Route = createFileRoute("/gorevler")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const [open, setOpen] = React.useState(false);
  return (
    <AppShell
      title="Görevler"
      subtitle="Mizahi ama saygılı. Cevap hep aynı."
      action={
        <Button className="tactile rounded-xl" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Yeni
        </Button>
      }
    >
      <Gate>
        <TaskList onCreate={() => setOpen(true)} />
        <TaskSheet open={open} onOpenChange={setOpen} />
      </Gate>
    </AppShell>
  );
}

function TaskList({ onCreate }: { onCreate: () => void }) {
  const { state, completeTask, removeTask } = usePairPatrol();
  const [filter, setFilter] = React.useState<"pending" | "done">("pending");

  const list = state.tasks.filter((t) =>
    filter === "pending" ? !t.completedAt : !!t.completedAt,
  );

  return (
    <div className="space-y-4">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as "pending" | "done")}>
        <TabsList className="grid w-full grid-cols-2 rounded-2xl">
          <TabsTrigger value="pending" className="rounded-xl">
            Bekleyen ({state.tasks.filter((t) => !t.completedAt).length})
          </TabsTrigger>
          <TabsTrigger value="done" className="rounded-xl">
            Tamamlanan ({state.tasks.filter((t) => t.completedAt).length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {list.length === 0 ? (
        <div className="surface p-8 text-center">
          <ListChecks className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
          <p className="mt-3 font-display text-lg font-bold">
            {filter === "pending" ? "Sıra tertemiz" : "Henüz tamamlanan yok"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {filter === "pending"
              ? "İlk görevi sen yaz. Ekmek klasiktir."
              : "İlk TAMAMDIR’ı bekliyoruz."}
          </p>
          {filter === "pending" ? (
            <Button className="mt-4 rounded-xl" onClick={onCreate}>
              Görev oluştur
            </Button>
          ) : null}
        </div>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {list.map((t) => (
              <motion.li
                key={t.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="surface p-4"
              >
                <TaskCard
                  task={t}
                  onComplete={() => {
                    const ms = completeTask(t.id);
                    toast.success(`Tamamdır! ${formatMs(ms)} içinde hallettin 🎉`);
                  }}
                  onRemove={() => {
                    removeTask(t.id);
                    toast("Görev silindi");
                  }}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

function TaskCard({
  task,
  onComplete,
  onRemove,
}: {
  task: Task;
  onComplete: () => void;
  onRemove: () => void;
}) {
  const done = !!task.completedAt;
  return (
    <div>
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            done ? "bg-success/25" : "bg-primary/12"
          }`}
        >
          {done ? (
            <CheckCircle2 className="h-5 w-5 text-success-foreground" aria-hidden="true" />
          ) : (
            <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-bold leading-snug">{task.title}</p>
          {task.note ? (
            <p className="mt-1 text-sm text-muted-foreground">{task.note}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            <span className="rounded-full bg-muted px-2 py-1">
              {task.from === "me" ? "Sen gönderdin" : "Partnerin gönderdi"}
            </span>
            {task.place ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                <MapPin className="h-3 w-3" aria-hidden="true" /> {task.place}
              </span>
            ) : null}
            {task.due ? (
              <span className="rounded-full bg-muted px-2 py-1">{task.due}</span>
            ) : null}
            <span className="rounded-full bg-muted px-2 py-1">
              {formatRelative(task.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {done ? (
        <p className="mt-3 rounded-xl bg-success/20 px-3 py-2 text-sm font-semibold text-success-foreground">
          Tamamlandı · yanıt süresi {task.responseMs ? formatMs(task.responseMs) : "—"}
        </p>
      ) : (
        <>
          <TamamdirButton className="mt-3" onDone={onComplete} />
          <button
            onClick={onRemove}
            className="mt-2 w-full rounded-xl py-2 text-xs font-semibold text-muted-foreground underline"
          >
            Görevi sil
          </button>
        </>
      )}
    </div>
  );
}

function TaskSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { addTask } = usePairPatrol();
  const [title, setTitle] = React.useState("");
  const [note, setNote] = React.useState("");
  const [place, setPlace] = React.useState("");
  const [due, setDue] = React.useState("");
  const [coords, setCoords] = React.useState<LatLng | null>(null);
  const [locating, setLocating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const reset = () => {
    setTitle("");
    setNote("");
    setPlace("");
    setDue("");
    setCoords(null);
    setError(null);
  };

  const useMyLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Tarayıcın konum desteklemiyor.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        toast.success("Konum eklendi");
      },
      () => {
        setLocating(false);
        toast.error("Konum izni verilmedi. Yer adını elle yazabilirsin.");
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 3) {
      setError("Görev başlığı en az 3 karakter olmalı.");
      return;
    }
    addTask({
      title,
      note,
      place: place.trim() || null,
      placeAt: coords,
      due: due.trim() || null,
    });
    toast.success("Görev gönderildi. Kaçış yok 😌");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[88dvh] overflow-y-auto rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-extrabold">
            Yeni görev
          </DialogTitle>
          <DialogDescription>
            Kısa, net ve biraz eğlenceli yaz. Kırıcı olmasın.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="baslik">Başlık</Label>
            <Input
              id="baslik"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dönüşte ekmek al"
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
            <Label htmlFor="aciklama">Açıklama</Label>
            <Textarea
              id="aciklama"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tam buğday olsun lütfen."
              className="mt-1.5 min-h-20 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="yer">Konum adı</Label>
              <Input
                id="yer"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Fırın"
                className="mt-1.5 h-12 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="sure">Zaman</Label>
              <Input
                id="sure"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                placeholder="Akşam 20.00"
                className="mt-1.5 h-12 rounded-xl"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={useMyLocation}
            disabled={locating}
            className="tactile h-12 w-full rounded-xl"
          >
            <LocateFixed className="h-4 w-4" aria-hidden="true" />
            {coords
              ? "Konum eklendi ✓"
              : locating
                ? "Konum alınıyor…"
                : "Bulunduğum yeri iliştir"}
          </Button>

          <Button type="submit" className="tactile h-13 w-full rounded-2xl py-4 font-bold">
            Görevi gönder
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
