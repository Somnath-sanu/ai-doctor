import { Card } from "@/src/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ReportWithoutUserId } from "../../store/atom";
import ReactMarkdown from "react-markdown";

interface ReportCardProps {
  report: ReportWithoutUserId;
  onClick: () => void;
}

export const ReportCard = ({ report, onClick }: ReportCardProps) => {
  return (
    <Card
      className="cursor-pointer gap-4 border-border/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-accent/30 hover:shadow-sm"
      onClick={onClick}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{report.specialist}</h3>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                {report.kind === "DOCTOR_FINAL" ? "Doctor final" : "AI draft"}
              </span>
            </div>
            {report.title ? (
              <p className="text-xs text-muted-foreground">{report.title}</p>
            ) : null}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(report.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <div className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          <ReactMarkdown>{report.content}</ReactMarkdown>
        </div>
      </div>
    </Card>
  );
};
