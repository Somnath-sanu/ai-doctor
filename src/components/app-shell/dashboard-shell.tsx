import type { ReactNode } from "react";

import { AppSidebar } from "@/src/components/app-shell/app-sidebar";
import { AppTopbar } from "@/src/components/app-shell/app-topbar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/src/components/ui/sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-transparent">
        <AppTopbar />
        <div className="flex flex-1 flex-col px-4 py-4 md:px-8 md:py-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
