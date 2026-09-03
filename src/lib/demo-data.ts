import type { AppState, Task, Zone } from "./types";

export const HOME = { lat: 41.0431, lng: 28.9862 };

const now = Date.now();
const iso = (msAgo: number) => new Date(now - msAgo).toISOString();

export function makeInviteCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export const demoTasks: Task[] = [
  {
    id: "t1",
    title: "Dönüşte ekmek al",
    note: "Tam buğday olsun, dünkü gibi olmasın 🙂",
    place: "Fırın, Moda Cd.",
    placeAt: { lat: 41.0455, lng: 28.9905 },
    due: "Eve gelene kadar",
    createdAt: iso(9 * 60 * 1000),
    completedAt: null,
    responseMs: null,
    from: "partner",
  },
  {
    id: "t2",
    title: "Kediye mama koy",
    note: "Bakışlarını üzerimde hissediyorum.",
    place: null,
    placeAt: null,
    due: "Akşam 20.00",
    createdAt: iso(3 * 3600 * 1000),
    completedAt: iso(3 * 3600 * 1000 - 2400),
    responseMs: 2400,
    from: "partner",
  },
  {
    id: "t3",
    title: "Sinema biletlerini al",
    note: "Arka sıra, ortadan iki koltuk.",
    place: "Kadıköy",
    placeAt: { lat: 41.04, lng: 29.0 },
    due: "Bugün",
    createdAt: iso(26 * 3600 * 1000),
    completedAt: iso(26 * 3600 * 1000 - 900),
    responseMs: 900,
    from: "me",
  },
  {
    id: "t4",
    title: "Anneni ara",
    note: "Bu sefer gerçekten.",
    place: null,
    placeAt: null,
    due: null,
    createdAt: iso(50 * 3600 * 1000),
    completedAt: iso(50 * 3600 * 1000 - 5400),
    responseMs: 5400,
    from: "partner",
  },
];

export const demoZones: Zone[] = [
  {
    id: "z1",
    name: "Halı Saha",
    center: { lat: 41.0398, lng: 28.9799 },
    radius: 250,
    level: "orta",
    active: true,
    createdBy: "me",
  },
  {
    id: "z2",
    name: "Berber (3 saatlik seans)",
    center: { lat: 41.0475, lng: 28.9955 },
    radius: 150,
    level: "yumusak",
    active: true,
    createdBy: "partner",
  },
];

export function initialState(): AppState {
  return {
    onboarded: false,
    demo: false,
    inviteCode: makeInviteCode(),
    paired: false,
    me: {
      id: "me",
      name: "Sen",
      emoji: "🫶",
      sharing: false,
      position: null,
      lastSeen: null,
    },
    partner: {
      id: "partner",
      name: "Partner",
      emoji: "💞",
      sharing: false,
      position: null,
      lastSeen: null,
    },
    tasks: [],
    zones: [],
    alerts: [],
    settings: {
      notifications: true,
      locationPermission: "unknown",
      theme: "light",
      reduceHumor: false,
    },
  };
}

export function demoState(): AppState {
  const base = initialState();
  return {
    ...base,
    onboarded: true,
    demo: true,
    paired: true,
    inviteCode: "PP-DEMO",
    me: {
      ...base.me,
      name: "Sen",
      sharing: true,
      position: HOME,
      lastSeen: iso(40 * 1000),
    },
    partner: {
      ...base.partner,
      name: "Elif",
      emoji: "🌷",
      sharing: true,
      position: { lat: 41.0412, lng: 28.9831 },
      lastSeen: iso(70 * 1000),
    },
    tasks: demoTasks,
    zones: demoZones,
    alerts: [
      {
        id: "a1",
        kind: "proximity",
        title: "Görev alanına yaklaşıyorsun",
        body: "Fırın 180 m ileride. Ekmek seni bekliyor.",
        createdAt: iso(6 * 60 * 1000),
        read: false,
      },
      {
        id: "a2",
        kind: "violation",
        title: "Rota sapması: Halı Saha",
        body: "Elif bölgeye giriş yaptı. Maç 90 dakika sürer, biliyoruz.",
        createdAt: iso(20 * 3600 * 1000),
        read: true,
      },
    ],
  };
}
