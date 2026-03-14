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
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/consultations")) return "Consultations";
  if (pathname.startsWith("/reports")) return "Reports";
  if (pathname.startsWith("/doctors")) return "Doctors";
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

  const title = useMemo(() => getTitle(pathname), [pathname]);

  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-3 md:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <div className="flex flex-col">
            <h1 className="text-base font-semibold tracking-tight md:text-lg">
              {title}
            </h1>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1.5 text-xs text-muted-foreground max-w-xs">
            <Search className="size-3.5" />
            <Input
              placeholder="Search consultations"
              className="h-6 border-none px-0 text-xs focus-visible:ring-0 focus-visible:ring-offset-0 bg-background/60 shadow-none text-foreground"
            />
          </div>

          <ThemeToggle />

          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm hover:text-foreground"
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

