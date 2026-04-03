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
        "surface-panel flex flex-col items-center justify-center gap-5 border-dashed px-6 py-12 text-center",
        className,
      )}
    >
      {Icon ? (
        <div className="inline-flex size-14 items-center justify-center rounded-full bg-primary/12 text-primary shadow-xs ring-8 ring-primary/6">
          <Icon className="size-6" />
        </div>
      ) : null}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
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
