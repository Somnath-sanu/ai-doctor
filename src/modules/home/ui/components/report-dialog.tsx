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
        className="mx-auto flex h-[84vh] max-h-[84vh] w-full max-w-4xl flex-col gap-3 rounded-[1.75rem] border border-border/70 bg-card/96 p-4 shadow-2xl sm:p-6 lg:max-w-5xl"
        showCloseButton={false}
      >
        {report && (
          <>
            <DialogHeader className="surface-subtle mt-1 rounded-[1.25rem] px-4 py-4">
              <DialogTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-base font-semibold tracking-tight">
                  Consultation with {report.specialist}
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-sm">
                  {formatDistanceToNow(new Date(report.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </DialogTitle>
            </DialogHeader>
            <ScrollablePane className="surface-panel mt-1 max-h-none flex-1 rounded-[1.5rem] p-5 font-serif">
              <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/85 prose-a:text-primary lg:prose-base dark:prose-invert dark:prose-p:text-foreground/90 dark:prose-li:text-foreground/85">
                <ReactMarkdown>{report.content}</ReactMarkdown>
              </div>
            </ScrollablePane>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
