import * as React from "react";
import type { AppAlert, AppState, LatLng, Settings, Task, Zone, ZoneLevel } from "./types";
import { demoState, initialState, makeInviteCode } from "./demo-data";
import { distanceMeters } from "./geo";

const STORAGE_KEY = "pairpatrol.v1";

/**
 * Service katmanı: şu an localStorage üzerinde çalışıyor.
 * Supabase bağlandığında yalnızca load/save fonksiyonları değiştirilir.
 */
export const storage = {
  load(): AppState | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AppState;
    } catch {
      return null;
    }
  },
  save(state: AppState) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* kota dolu olabilir, sessiz geç */
    }
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  },
};

const uid = () => Math.random().toString(36).slice(2, 10);

export type NewTaskInput = {
  title: string;
  note?: string;
  place?: string | null;
  placeAt?: LatLng | null;
  due?: string | null;
};

export type NewZoneInput = {
  name: string;
  center: LatLng;
  radius: number;
  level: ZoneLevel;
};

type Ctx = {
  state: AppState;
  hydrated: boolean;
  update: (fn: (s: AppState) => AppState) => void;
  startDemo: () => void;
  reset: () => void;
  regenerateCode: () => void;
  pairWithCode: (code: string) => { ok: boolean; message: string };
  addTask: (input: NewTaskInput) => Task;
  completeTask: (id: string) => number;
  removeTask: (id: string) => void;
  addZone: (input: NewZoneInput) => Zone;
  toggleZone: (id: string) => void;
  removeZone: (id: string) => void;
  setSharing: (who: "me" | "partner", value: boolean) => void;
  setSettings: (patch: Partial<Settings>) => void;
  pushAlert: (alert: Omit<AppAlert, "id" | "createdAt" | "read">) => void;
  markAlertsRead: () => void;
};

const PairPatrolContext = React.createContext<Ctx | null>(null);

export function PairPatrolProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AppState>(() => initialState());
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const saved = storage.load();
    if (saved) setState({ ...initialState(), ...saved });
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (hydrated) storage.save(state);
  }, [state, hydrated]);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", state.settings.theme === "dark");
  }, [state.settings.theme]);

  const update = React.useCallback((fn: (s: AppState) => AppState) => {
    setState((prev) => fn(prev));
  }, []);

  const value = React.useMemo<Ctx>(() => {
    const pushAlertInto = (
      s: AppState,
      alert: Omit<AppAlert, "id" | "createdAt" | "read">,
    ): AppState => ({
      ...s,
      alerts: [
        { ...alert, id: uid(), createdAt: new Date().toISOString(), read: false },
        ...s.alerts,
      ].slice(0, 40),
    });

    return {
      state,
      hydrated,
      update,
      startDemo: () => setState(demoState()),
      reset: () => {
        storage.clear();
        setState(initialState());
      },
      regenerateCode: () =>
        update((s) => ({ ...s, inviteCode: makeInviteCode() })),
      pairWithCode: (code) => {
        const clean = code.trim().toUpperCase();
        if (clean.length < 4) {
          return { ok: false, message: "Kod en az 4 karakter olmalı." };
        }
        if (clean === state.inviteCode) {
          return { ok: false, message: "Bu senin kendi kodun 🙂" };
        }
        setState((s) => ({
          ...demoState(),
          inviteCode: s.inviteCode,
          settings: s.settings,
          demo: false,
        }));
        return { ok: true, message: "Eşleşme tamam! Artık aynı takımdasınız." };
      },
      addTask: (input) => {
        const task: Task = {
          id: uid(),
          title: input.title.trim(),
          note: (input.note ?? "").trim(),
          place: input.place ?? null,
          placeAt: input.placeAt ?? null,
          due: input.due ?? null,
          createdAt: new Date().toISOString(),
          completedAt: null,
          responseMs: null,
          from: "me",
        };
        update((s) => ({ ...s, tasks: [task, ...s.tasks] }));
        return task;
      },
      completeTask: (id) => {
        let elapsed = 0;
        update((s) => ({
          ...s,
          tasks: s.tasks.map((t) => {
            if (t.id !== id || t.completedAt) return t;
            elapsed = Math.max(1, Date.now() - new Date(t.createdAt).getTime());
            return {
              ...t,
              completedAt: new Date().toISOString(),
              responseMs: elapsed,
            };
          }),
        }));
        return elapsed;
      },
      removeTask: (id) =>
        update((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) })),
      addZone: (input) => {
        const zone: Zone = {
          id: uid(),
          name: input.name.trim(),
          center: input.center,
          radius: input.radius,
          level: input.level,
          active: true,
          createdBy: "me",
        };
        update((s) => ({ ...s, zones: [zone, ...s.zones] }));
        return zone;
      },
      toggleZone: (id) =>
        update((s) => ({
          ...s,
          zones: s.zones.map((z) => (z.id === id ? { ...z, active: !z.active } : z)),
        })),
      removeZone: (id) =>
        update((s) => ({ ...s, zones: s.zones.filter((z) => z.id !== id) })),
      setSharing: (who, val) =>
        update((s) => ({ ...s, [who]: { ...s[who], sharing: val } })),
      setSettings: (patch) =>
        update((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
      pushAlert: (alert) => update((s) => pushAlertInto(s, alert)),
      markAlertsRead: () =>
        update((s) => ({ ...s, alerts: s.alerts.map((a) => ({ ...a, read: true })) })),
    };
  }, [state, hydrated, update]);

  return (
    <PairPatrolContext.Provider value={value}>{children}</PairPatrolContext.Provider>
  );
}

export function usePairPatrol(): Ctx {
  const ctx = React.useContext(PairPatrolContext);
  if (!ctx) throw new Error("usePairPatrol, PairPatrolProvider içinde kullanılmalı");
  return ctx;
}

/** İki taraf da onay verdiyse geofence çalışır. */
export function geofenceActive(s: AppState): boolean {
  return s.paired && s.me.sharing && s.partner.sharing;
}

export function partnerZoneBreach(s: AppState): Zone | null {
  if (!geofenceActive(s) || !s.partner.position) return null;
  for (const z of s.zones) {
    if (!z.active) continue;
    if (distanceMeters(s.partner.position, z.center) <= z.radius) return z;
  }
  return null;
}

export function stats(s: AppState) {
  const done = s.tasks.filter((t) => t.completedAt && t.responseMs);
  const times = done.map((t) => t.responseMs!) as number[];
  const violations = s.alerts.filter((a) => a.kind === "violation").length;
  return {
    total: done.length,
    pending: s.tasks.filter((t) => !t.completedAt).length,
    avgMs: times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0,
    bestMs: times.length ? Math.min(...times) : 0,
    violations,
  };
}
