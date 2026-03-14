import type { ReactNode } from "react";

import { AppSidebar } from "@/src/components/app-shell/app-sidebar";
import { AppTopbar } from "@/src/components/app-shell/app-topbar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/src/components/ui/sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppTopbar />
        <div className="flex-1 flex flex-col px-4 py-4 md:px-8 md:py-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


