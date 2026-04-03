type Report = {
  id: string;
  userId: string;
  consultationId?: string | null;
  finalCarePlanId?: string | null;
  specialist: string;
  title?: string | null;
  content: string;
  kind: "AI_DRAFT" | "DOCTOR_FINAL";
  createdAt: Date;
  updatedAt?: Date;
};

import { atom } from "jotai";

export type ReportWithoutUserId = Omit<Report, "userId">;

export const reportAtom = atom<ReportWithoutUserId[] | null>(null);
