"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AddNewSession } from "./add-new-session";
import { useAtomValue, useSetAtom } from "jotai";
import { reportAtom, ReportWithoutUserId } from "../../store/atom";
import { getReport } from "../../report";
import { ReportCard } from "./report-card";
import { ReportDialog } from "./report-dialog";
import { Loader2Icon } from "lucide-react";

export const HistoryList = () => {
  const [selectedReport, setSelectedReport] =
    useState<ReportWithoutUserId | null>(null);

  const reports = useAtomValue(reportAtom);
  const setReports = useSetAtom(reportAtom);

  const fetchReports = useCallback(async () => {
    const data = await getReport();
    if (data) {
      setReports(data);
    }
  }, [setReports]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  if (!reports) {
    return (
      <div className="flex items-center justify-center flex-1">
        <Loader2Icon className="size-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <ReportDialog
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
      <div>
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 border p-7 border-border border-dashed shadow rounded-2xl">
            <Image
              src={"/medical-assistance.png"}
              alt="empty"
              width={150}
              height={150}
            />
            <h2 className="text-xl font-bold">No Recent Consultations</h2>
            <p>
              It&apos; looks like you haven&apos;t consulted with any doctors
              yet!
            </p>

            <AddNewSession />
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onClick={() => setSelectedReport(report)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
