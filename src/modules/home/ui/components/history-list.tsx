"use client";

import { useCallback, useEffect, useState } from "react";
import { AddNewSession } from "./add-new-session";
import { useAtomValue, useSetAtom } from "jotai";
import { reportAtom, ReportWithoutUserId } from "../../store/atom";
import { getReport } from "../../report";
import { ReportCard } from "./report-card";
import { ReportDialog } from "./report-dialog";
import { Loader2Icon } from "lucide-react";
import { EmptyState } from "@/src/components/layout/empty-state";
import { ScrollablePane } from "@/src/components/layout/scrollable-pane";
import { Stethoscope } from "lucide-react";

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
      <div className="flex items-center justify-center py-10">
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
      {reports.length === 0 ? (
        <EmptyState
          title="No recent consultations yet"
          description="Start a new consultation and your summaries will appear here for quick reference."
          icon={Stethoscope}
          action={
            <AddNewSession />
          }
        />
      ) : (
        <ScrollablePane className="mt-1 space-y-3 py-1">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => setSelectedReport(report)}
            />
          ))}
        </ScrollablePane>
      )}
    </>
  );
};
