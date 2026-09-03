import { Link } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";
import { usePairPatrol } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

/** Eşleşme yoksa nazik bir yönlendirme, hidrasyon öncesi skeleton gösterir. */
export function Gate({ children }: { children: React.ReactNode }) {
  const { state, hydrated } = usePairPatrol();

  if (!hydrated) {
    return (
      <div className="space-y-4" aria-busy="true" aria-live="polite">
        <Skeleton className="h-28 w-full rounded-3xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
        <span className="sr-only">Yükleniyor</span>
      </div>
    );
  }

  if (!state.paired) {
    return (
      <div className="surface p-6 text-center">
        <HeartHandshake className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
        <h2 className="mt-3 font-display text-xl font-bold">Önce eşleşmelisiniz</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Pair Patrol iki kişilik bir oyun. Davet kodunu paylaş ya da partnerinin
          kodunu gir.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild className="rounded-xl">
            <Link to="/eslesme">Eşleşmeye git</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/">Karşılama ekranı</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
