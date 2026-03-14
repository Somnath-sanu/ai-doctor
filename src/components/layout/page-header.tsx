"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 pb-4 md:pb-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm text-muted-foreground font-medium">
              {description}
            </p>
          ) : null}
        </div>
        {action ? (
          <div className="mt-2 md:mt-0 flex items-center gap-2">{action}</div>
        ) : null}
      </div>
    </div>
  );
}

