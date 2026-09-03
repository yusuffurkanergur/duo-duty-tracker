import * as React from "react";
import type { LatLng, Zone } from "@/lib/types";
import { cn } from "@/lib/utils";

const M_PER_DEG_LAT = 111_320;

export type MapPerson = {
  id: string;
  name: string;
  emoji: string;
  position: LatLng;
  tone: "me" | "partner";
};

export type MapPin = { id: string; label: string; position: LatLng };

type Props = {
  center: LatLng;
  /** Görüntülenen alanın yarı genişliği (metre) */
  span?: number;
  people?: MapPerson[];
  zones?: Zone[];
  pins?: MapPin[];
  draft?: { center: LatLng; radius: number } | null;
  onPick?: (p: LatLng) => void;
  className?: string;
};

export function DemoMap({
  center,
  span = 900,
  people = [],
  zones = [],
  pins = [],
  draft = null,
  onPick,
  className,
}: Props) {
  const size = 1000;
  const scale = size / (span * 2); // px per meter

  const project = React.useCallback(
    (p: LatLng) => {
      const dy = (p.lat - center.lat) * M_PER_DEG_LAT;
      const dx =
        (p.lng - center.lng) * M_PER_DEG_LAT * Math.cos((center.lat * Math.PI) / 180);
      return { x: size / 2 + dx * scale, y: size / 2 - dy * scale };
    },
    [center, scale],
  );

  const unproject = (x: number, y: number): LatLng => {
    const dx = (x - size / 2) / scale;
    const dy = (size / 2 - y) / scale;
    return {
      lat: center.lat + dy / M_PER_DEG_LAT,
      lng:
        center.lng + dx / (M_PER_DEG_LAT * Math.cos((center.lat * Math.PI) / 180)),
    };
  };

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onPick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * size;
    const y = ((e.clientY - rect.top) / rect.height) * size;
    onPick(unproject(x, y));
  };

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      onClick={handleClick}
      role="img"
      aria-label="Örnek harita görünümü"
      className={cn(
        "h-full w-full select-none rounded-3xl bg-sand",
        onPick && "cursor-crosshair",
        className,
      )}
    >
      <defs>
        <pattern id="pp-grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path
            d="M50 0H0V50"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border"
          />
        </pattern>
      </defs>

      <rect width={size} height={size} className="fill-sand" />
      <rect width={size} height={size} fill="url(#pp-grid)" opacity="0.7" />

      {/* stilize yollar ve park */}
      <g className="text-border" fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M0 640 H1000" strokeWidth="26" opacity="0.55" />
        <path d="M380 0 V1000" strokeWidth="20" opacity="0.5" />
        <path d="M0 220 H620 L1000 420" strokeWidth="14" opacity="0.4" />
      </g>
      <rect
        x="640"
        y="700"
        width="250"
        height="190"
        rx="28"
        className="fill-success/25"
      />
      <rect x="90" y="90" width="180" height="120" rx="22" className="fill-muted" />

      {zones
        .filter((z) => z.active)
        .map((z) => {
          const c = project(z.center);
          return (
            <g key={z.id}>
              <circle
                cx={c.x}
                cy={c.y}
                r={Math.max(14, z.radius * scale)}
                className="fill-primary/12 stroke-primary/70"
                strokeWidth="3"
                strokeDasharray="10 8"
              />
              <text
                x={c.x}
                y={c.y - Math.max(14, z.radius * scale) - 10}
                textAnchor="middle"
                className="fill-foreground text-[22px] font-semibold"
              >
                {z.name}
              </text>
            </g>
          );
        })}

      {draft ? (
        <circle
          cx={project(draft.center).x}
          cy={project(draft.center).y}
          r={Math.max(12, draft.radius * scale)}
          className="fill-warning/20 stroke-warning"
          strokeWidth="4"
          strokeDasharray="6 8"
        />
      ) : null}

      {pins.map((p) => {
        const c = project(p.position);
        return (
          <g key={p.id}>
            <circle cx={c.x} cy={c.y} r="14" className="fill-foreground" />
            <circle cx={c.x} cy={c.y} r="5" className="fill-background" />
            <text
              x={c.x}
              y={c.y + 38}
              textAnchor="middle"
              className="fill-foreground text-[22px] font-semibold"
            >
              {p.label}
            </text>
          </g>
        );
      })}

      {people.map((p) => {
        const c = project(p.position);
        const tone = p.tone === "me" ? "fill-foreground" : "fill-primary";
        return (
          <g key={p.id}>
            <circle
              cx={c.x}
              cy={c.y}
              r="46"
              className={p.tone === "me" ? "fill-foreground/10" : "fill-primary/15"}
            >
              <animate
                attributeName="r"
                values="34;54;34"
                dur="2.6s"
                repeatCount="indefinite"
              />
            </circle>
            <path
              d="M0 12c-5.6-6-9-8.8-9-12.9A5.2 5.2 0 0 1 0-4.4 5.2 5.2 0 0 1 9-.9C9 3.2 5.6 6 0 12Z"
              transform={`translate(${c.x} ${c.y}) scale(2)`}
              className={tone}
            />
            <text
              x={c.x}
              y={c.y - 46}
              textAnchor="middle"
              className="fill-foreground text-[24px] font-bold"
            >
              {p.emoji} {p.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
