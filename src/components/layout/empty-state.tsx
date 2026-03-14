"use client";

import { ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onActionClick?: () => void;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  onActionClick,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-card/60 px-6 py-10 text-center shadow-sm",
        className,
      )}
    >
      {Icon ? (
        <div className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
      ) : null}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? (
          <p className="max-w-md text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        action
      ) : actionLabel && onActionClick ? (
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={onActionClick}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

