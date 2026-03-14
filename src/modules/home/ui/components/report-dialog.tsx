import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import { formatDistanceToNow } from "date-fns";
import { ReportWithoutUserId } from "../../store/atom";
import { ScrollablePane } from "@/src/components/layout/scrollable-pane";

interface ReportDialogProps {
  report: ReportWithoutUserId | null;
  onClose: () => void;
}

export const ReportDialog = ({ report, onClose }: ReportDialogProps) => {
  const isOpen = Boolean(report);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="flex h-[80vh] max-h-[80vh] w-full max-w-3xl md:max-w-4xl lg:max-w-5xl flex-col gap-2 p-4 sm:p-6 mx-auto justify-center"
        showCloseButton={false}
      >
        {report && (
          <>
            <DialogHeader className="mt-1">
              <DialogTitle className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-semibold">
                  Consultation with {report.specialist}
                </span>
                <span className="text-xs font-normal text-muted-foreground sm:text-sm">
                  {formatDistanceToNow(new Date(report.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </DialogTitle>
            </DialogHeader>
            <ScrollablePane className="mt-1 flex-1 rounded-lg border bg-muted/40 p-4 font-serif max-h-none">
              <div className="prose prose-sm prose-slate prose-a:text-blue-600 lg:prose-base dark:prose-invert">
                <ReactMarkdown>{report.content}</ReactMarkdown>
              </div>
            </ScrollablePane>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
