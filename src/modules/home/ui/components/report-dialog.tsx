import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import { formatDistanceToNow } from "date-fns";
import { ReportWithoutUserId } from "../../store/atom";

interface ReportDialogProps {
  report: ReportWithoutUserId | null;
  onClose: () => void;
}

export const ReportDialog = ({ report, onClose }: ReportDialogProps) => {
  const isOpen = Boolean(report);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[80vh] sm:min-w-[60%] p-4 rounded" showCloseButton={false}>
        {report && (
          <>
            <DialogHeader className="mt-2">
              <DialogTitle className="flex items-center justify-between">
                <span className="font-mono">Consultation with {report.specialist}</span>
                <span className="text-sm font-normal font-mono text-muted-foreground">
                  {formatDistanceToNow(new Date(report.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto flex-1 pr-2 p-4 font-serif">
              <div className="prose prose-sm prose-slate prose-headings:underline prose-a:text-blue-600 lg:prose-lg dark:prose-invert">
                <ReactMarkdown>{report.content}</ReactMarkdown>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
