"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="surface-panel flex flex-col gap-4 p-6 md:p-7">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
            MEDIVA Workspace
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {action ? (
          <div className="mt-2 flex items-center gap-2 md:mt-0">{action}</div>
        ) : null}
      </div>
    </div>
  );
}
