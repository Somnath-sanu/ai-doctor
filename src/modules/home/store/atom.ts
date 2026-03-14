// import { Report } from "@/src/generated/prisma";

type Report = {
  id: string;
  userId: string;
  specialist: string;
  content: string;
  createdAt: Date;
};

import { atom } from "jotai";

export type ReportWithoutUserId = Omit<Report, "userId">;

export const reportAtom = atom<ReportWithoutUserId[] | null>(null);
