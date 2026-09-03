import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Pair Patrol logosu"
      className={cn("h-9 w-9", className)}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4">
        <path d="M8.5 24a15.5 15.5 0 0 1 4.6-11" opacity="0.45" />
        <path d="M39.5 24a15.5 15.5 0 0 0-4.6-11" opacity="0.45" />
        <path d="M14.5 25.5a9.5 9.5 0 0 1 2.8-6.8" opacity="0.7" />
        <path d="M33.5 25.5a9.5 9.5 0 0 0-2.8-6.8" opacity="0.7" />
      </g>
      <path
        d="M24 42c-6.2-7.6-10-12.2-10-17a7 7 0 0 1 12.1-4.8A7 7 0 0 1 38 25c0 4.8-3.8 9.4-10 17Z"
        fill="currentColor"
      />
      <circle cx="24" cy="24.5" r="2.6" className="fill-background" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <LogoMark className="h-7 w-7 text-primary" />
      <span className="font-display text-lg font-extrabold tracking-tight">
        Pair Patrol
      </span>
    </span>
  );
}
