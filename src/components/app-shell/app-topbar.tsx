"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, Moon, Sun } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";

import { SidebarTrigger } from "@/src/components/ui/sidebar";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

function getTitle(pathname: string): string {
  if (pathname === "/app") return "Dashboard";
  if (pathname.startsWith("/app/consultations")) return "Consultations";
  if (pathname.startsWith("/app/reports")) return "Reports";
  if (pathname.startsWith("/app/doctors")) return "AI Specialists";
  if (pathname === "/doctor") return "Doctor Desk";
  if (pathname.startsWith("/doctor/queue")) return "Specialty Queue";
  if (pathname.startsWith("/doctor/my-tickets")) return "My Tickets";
  if (pathname.startsWith("/doctor/tickets")) return "Ticket Review";
  if (pathname.startsWith("/billing")) return "Billing & Plans";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Dashboard";
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-8 rounded-full border border-border/60 bg-background/80"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

export function AppTopbar() {
  const pathname = usePathname();
  const searchPlaceholder = pathname.startsWith("/doctor")
    ? "Search tickets"
    : "Search consultations";

  const title = useMemo(() => getTitle(pathname), [pathname]);

  return (
    <header className="sticky top-0 z-20 px-1 pb-4">
      <div className="surface-panel flex h-16 items-center gap-3 px-3 md:px-5">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/75">
              MEDIVA
            </span>
            <h1 className="text-base font-semibold tracking-tight md:text-lg">
              {title}
            </h1>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden max-w-xs items-center gap-2 rounded-full border border-border/70 bg-background/75 px-3 py-1.5 text-xs text-muted-foreground md:flex">
            <Search className="size-3.5" />
            <Input
              placeholder={searchPlaceholder}
              className="h-6 border-none bg-transparent px-0 text-xs text-foreground shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <ThemeToggle />

          <button
            type="button"
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-border/70 bg-background/85 text-muted-foreground shadow-xs transition hover:-translate-y-0.5 hover:text-foreground"
          >
            <Bell className="size-4" />
            <span className="sr-only">Notifications</span>
          </button>

          <UserButton />
        </div>
      </div>
    </header>
  );
}
