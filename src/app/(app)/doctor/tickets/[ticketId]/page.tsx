import { notFound } from "next/navigation";
import { Card } from "@/src/components/ui/card";
import { PageHeader } from "@/src/components/layout/page-header";
import { DoctorCompleteTicketForm } from "@/src/modules/doctor/ui/doctor-complete-ticket-form";
import { DoctorTicketActions } from "@/src/modules/doctor/ui/doctor-ticket-actions";
import { TicketStatusBadge } from "@/src/modules/doctor/ui/ticket-status-badge";
import { getDoctorTicketById } from "@/src/modules/doctor/server";
import { ScrollArea } from "@/src/components/ui/scroll-area";

type TicketDetailPageProps = {
  params: Promise<{
    ticketId: string;
  }>;
};

function renderList(value: unknown, emptyLabel: string) {
  if (!Array.isArray(value) || value.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-2 text-sm text-muted-foreground">
      {value.map((item, index) => (
        <li key={`${index}-${String(item)}`}>- {String(item)}</li>
      ))}
    </ul>
  );
}

export default async function TicketDetailPage({
  params,
}: TicketDetailPageProps) {
  const { ticketId } = await params;
  const data = await getDoctorTicketById(ticketId);

  if (!data) {
    notFound();
  }

  const { doctor, ticket } = data;
  const consultation = ticket.consultation;
  const transcript = Array.isArray(consultation.transcript)
    ? consultation.transcript
    : [];
  const claimedByMe = ticket.claimedByDoctorId === doctor.id;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Ticket for ${ticket.patient.name}`}
        description="Review the AI handoff summary, transcript, and finalise a validated care plan."
      />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="space-y-5 border bg-card/80 p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {ticket.specialty}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {consultation.presentingComplaint || "Patient escalation"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {consultation.symptomSummary || ticket.summary}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <TicketStatusBadge label={ticket.urgency} tone="urgency" />
                <TicketStatusBadge label={ticket.status} tone="status" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="surface-subtle p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/75">
                  Patient
                </p>
                <p className="mt-2 font-medium">{ticket.patient.name}</p>
                <p className="text-sm text-muted-foreground">{ticket.patient.email}</p>
              </div>
              <div className="surface-subtle p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/75">
                  Review reason
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {consultation.doctorReviewReason ||
                    "The AI requested doctor validation for this case."}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="surface-subtle p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/75">
                  Duration and Context
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {consultation.durationContext || "Not clearly specified."}
                </p>
              </div>
              <div className="surface-subtle p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/75">
                  Future uploads
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  File attachments are not live yet, but this ticket is ready for
                  future reports, images, and medical document uploads.
                </p>
              </div>
            </div>

            <div className="surface-subtle p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/75">
                Risk flags
              </p>
              <div className="mt-3">
                {renderList(consultation.riskFlags, "No explicit risk flags were captured.")}
              </div>
            </div>

            <div className="surface-subtle p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/75">
                Suggested next steps
              </p>
              <div className="mt-3">
                {renderList(
                  consultation.suggestedNextSteps,
                  "No next-step guidance was captured."
                )}
              </div>
            </div>

            <div className="surface-subtle p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/75">
                AI transcript
              </p>
              <ScrollArea className="mt-3 h-[200px] space-y-3 text-sm">
                {transcript.length === 0 ? (
                  <p className="text-muted-foreground">No transcript captured.</p>
                ) : (
                  transcript.map((message, index) => {
                    const item = message as { role?: string; text?: string };

                    return (
                      <div key={`${index}-${item.text || "entry"}`}>
                        <p className="font-medium capitalize text-foreground">
                          {item.role || "unknown"}
                        </p>
                        <p className="text-muted-foreground">{item.text || ""}</p>
                      </div>
                    );
                  })
                )}
              </ScrollArea>
            </div>

            <div className="surface-subtle p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/75">
                AI draft report
              </p>
              <pre className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {ticket.aiDraftReport}
              </pre>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4 border bg-card/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Doctor actions</h2>
            <DoctorTicketActions
              ticketId={ticket.id}
              canClaim={ticket.status === "OPEN"}
              canStartReview={
                claimedByMe &&
                (ticket.status === "CLAIMED" || ticket.status === "OPEN")
              }
            />
            <div className="surface-subtle p-4 text-sm text-muted-foreground">
              Doctors can review AI drafts, then publish the validated care plan
              that becomes visible to the patient as the final report.
            </div>
          </Card>

          <Card className="space-y-4 border bg-card/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Complete ticket</h2>
            {ticket.finalCarePlan ? (
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>This ticket already has a final doctor-approved care plan.</p>
                <pre className="surface-subtle whitespace-pre-wrap p-4 text-sm leading-6 text-muted-foreground">
                  {ticket.finalCarePlan.finalReport}
                </pre>
              </div>
            ) : (
              <DoctorCompleteTicketForm
                ticketId={ticket.id}
                disabled={!claimedByMe && doctor.role !== "ADMIN"}
              />
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
