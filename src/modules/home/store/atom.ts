import { Report } from "@/src/generated/prisma";
import { atom } from "jotai";

export type ReportWithoutUserId = Omit<Report, "userId">;

export const reportAtom = atom<ReportWithoutUserId[] | null>(null);
