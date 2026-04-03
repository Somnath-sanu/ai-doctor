import { cn } from "@/src/lib/utils";

const urgencyClasses: Record<string, string> = {
  LOW: "bg-emerald-100 text-emerald-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-orange-100 text-orange-700",
  EMERGENCY: "bg-rose-100 text-rose-700",
};

const statusClasses: Record<string, string> = {
  OPEN: "bg-sky-100 text-sky-700",
  CLAIMED: "bg-violet-100 text-violet-700",
  IN_REVIEW: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-slate-200 text-slate-700",
};

type BadgeProps = {
  label: string;
  tone: "urgency" | "status";
};

export function TicketStatusBadge({ label, tone }: BadgeProps) {
  const toneMap = tone === "urgency" ? urgencyClasses : statusClasses;

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        toneMap[label] ?? "bg-muted text-muted-foreground"
      )}
    >
      {label.replaceAll("_", " ")}
    </span>
  );
}
