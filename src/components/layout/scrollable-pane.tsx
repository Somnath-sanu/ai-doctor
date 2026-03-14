"use client";

import { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

interface ScrollablePaneProps {
  children: ReactNode;
  className?: string;
}

export function ScrollablePane({ children, className }: ScrollablePaneProps) {
  return (
    <div
      className={cn(
        "relative flex-1 min-h-[200px] max-h-[480px] overflow-y-auto pr-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

