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
      className="p-2 hover:bg-accent transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <h3 className="font-medium font-mono">{report.specialist}</h3>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(report.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <div className="text-sm text-muted-foreground line-clamp-1">
          <ReactMarkdown>{report.content}</ReactMarkdown>
        </div>
      </div>
    </Card>
  );
};
