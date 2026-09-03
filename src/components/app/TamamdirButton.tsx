import * as React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function TamamdirButton({
  onDone,
  label = "TAMAMDIR",
  className,
}: {
  onDone: () => void;
  label?: string;
  className?: string;
}) {
  const [pressed, setPressed] = React.useState(false);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={() => {
        if (pressed) return;
        setPressed(true);
        onDone();
      }}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl bg-primary px-6 py-6 text-center font-display text-2xl font-extrabold tracking-wide text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/92 disabled:opacity-70",
        className,
      )}
      disabled={pressed}
    >
      <span className="flex items-center justify-center gap-3">
        <Check className="h-7 w-7" aria-hidden="true" />
        {pressed ? "TAMAMDIR!" : label}
      </span>
      <span className="mt-1 block text-xs font-medium uppercase tracking-[0.18em] opacity-80">
        tek seçenek bu
      </span>
    </motion.button>
  );
}
