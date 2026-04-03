"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Stethoscope,
  FileText,
  Users,
  CreditCard,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/src/components/ui/sidebar";
import Image from "next/image";

const patientPrimaryNav = [
  {
    label: "Dashboard",
    href: "/app",
    icon: LayoutDashboard,
  },
  {
    label: "Consultations",
    href: "/app/consultations",
    icon: Stethoscope,
  },
  {
    label: "Reports",
    href: "/app/reports",
    icon: FileText,
  },
  {
    label: "AI Specialists",
    href: "/app/doctors",
    icon: Users,
  },
];

const doctorPrimaryNav = [
  {
    label: "Doctor Desk",
    href: "/doctor",
    icon: LayoutDashboard,
  },
  {
    label: "Specialty Queue",
    href: "/doctor/queue",
    icon: Stethoscope,
  },
  {
    label: "My Tickets",
    href: "/doctor/my-tickets",
    icon: FileText,
  },
];

const secondaryNav = [
  {
    label: "Billing & Plans",
    href: "/billing",
    icon: CreditCard,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isDoctorRoute = pathname.startsWith("/doctor");
  const primaryNav = isDoctorRoute ? doctorPrimaryNav : patientPrimaryNav;

  const isActive = (href: string) => {
    if (href === "/app" || href === "/doctor") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <Sidebar collapsible="icon" variant="floating" className="p-3">
      <SidebarHeader hidden={state === "collapsed"}>
        <div className="surface-subtle flex items-center gap-3 px-3 py-3">
          <Image
            src="/logo.svg"
            alt="MEDIVA AI"
            width={20}
            height={20}
            className="size-9 rounded-2xl bg-white/80 p-1.5 dark:bg-white/10"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight tracking-[0.16em] uppercase text-primary/80">
              MEDIVA AI
            </span>
            <span className="text-xs text-sidebar-foreground/65">
              {isDoctorRoute ? "Doctor command center" : "Patient care workspace"}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{isDoctorRoute ? "Doctor Workspace" : "Overview"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNav.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.label}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-2"
                      >
                        <Icon className="shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.label}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-2"
                      >
                        <Icon className="shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter hidden={state === "collapsed"}>
        <div className="surface-subtle px-3 py-3 text-[11px] text-sidebar-foreground/70">
          <span className="font-medium text-sidebar-foreground">
            Ctrl/Cmd + B
          </span>{" "}
          to toggle sidebar
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
