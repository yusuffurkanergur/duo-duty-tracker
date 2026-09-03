export type ID = string;

export type LatLng = { lat: number; lng: number };

export type Person = {
  id: ID;
  name: string;
  emoji: string;
  /** Konum paylaşımını bu kişi açık onayla etkinleştirdi mi? */
  sharing: boolean;
  position: LatLng | null;
  lastSeen: string | null;
};

export type TaskStatus = "pending" | "done";

export type Task = {
  id: ID;
  title: string;
  note: string;
  place: string | null;
  placeAt: LatLng | null;
  /** "Eve gelene kadar" gibi serbest metin süre notu */
  due: string | null;
  createdAt: string;
  completedAt: string | null;
  responseMs: number | null;
  /** Görevi kim gönderdi */
  from: "me" | "partner";
};

export type ZoneLevel = "yumusak" | "orta" | "sert";

export type Zone = {
  id: ID;
  name: string;
  center: LatLng;
  radius: number;
  level: ZoneLevel;
  active: boolean;
  createdBy: "me" | "partner";
};

export type AlertKind = "proximity" | "violation" | "call";

export type AppAlert = {
  id: ID;
  kind: AlertKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type Settings = {
  notifications: boolean;
  locationPermission: "unknown" | "granted" | "denied";
  theme: "light" | "dark";
  reduceHumor: boolean;
};

export type AppState = {
  onboarded: boolean;
  demo: boolean;
  inviteCode: string;
  paired: boolean;
  me: Person;
  partner: Person;
  tasks: Task[];
  zones: Zone[];
  alerts: AppAlert[];
  settings: Settings;
};
