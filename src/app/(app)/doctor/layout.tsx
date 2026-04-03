import type { ReactNode } from "react";

import { requireDoctorUser } from "@/src/lib/auth";

export default async function DoctorLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireDoctorUser();

  return <>{children}</>;
}
