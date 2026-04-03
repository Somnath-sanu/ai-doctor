import type { ReactNode } from "react";

import { DashboardShell } from "@/src/components/app-shell/dashboard-shell";
import { syncCurrentUser } from "@/src/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  await syncCurrentUser();

  return <DashboardShell>{children}</DashboardShell>;
}

