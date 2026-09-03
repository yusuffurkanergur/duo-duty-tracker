import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, House, ListChecks, MapPinned, Shield, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Wordmark } from "./Logo";
import { usePairPatrol } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

const NAV = [
  { to: "/panel", label: "Panel", icon: House },
  { to: "/gorevler", label: "Görevler", icon: ListChecks },
  { to: "/harita", label: "Harita", icon: MapPinned },
  { to: "/bolgeler", label: "Bölgeler", icon: Shield },
  { to: "/profil", label: "Profil", icon: UserRound },
] as const;

export function AppShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { state } = usePairPatrol();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const unread = state.alerts.filter((a) => !a.read).length;

  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        İçeriğe geç
      </a>

      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/panel" className="tactile rounded-xl" aria-label="Panele git">
            <Wordmark />
          </Link>
          <div className="flex items-center gap-2">
            {state.demo ? (
              <Badge variant="secondary" className="rounded-full">
                Demo
              </Badge>
            ) : null}
            <Link
              to="/aktivite"
              className="tactile relative rounded-xl border border-border bg-card p-2"
              aria-label="Aktivite ve bildirimler"
            >
              <Activity className="h-5 w-5" aria-hidden="true" />
              {unread > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {unread}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </header>

      <main id="icerik" className="mx-auto w-full max-w-3xl px-4 pb-32 pt-5">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {action}
        </div>
        {children}
      </main>

      <nav
        aria-label="Ana gezinme"
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 pt-1 backdrop-blur-md"
      >
        <ul className="mx-auto flex max-w-3xl items-stretch justify-between px-2">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <li key={to} className="flex-1">
                <Link
                  to={to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "tactile flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-semibold",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-12 items-center justify-center rounded-full transition-colors",
                      active && "bg-primary/12",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
