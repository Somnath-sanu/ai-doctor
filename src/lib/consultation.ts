import { z } from "zod";

export const SPECIALTY_OPTIONS = [
  "General Physician",
  "Pediatrician",
  "Dermatologist",
  "Psychologist",
  "Nutritionist",
  "Cardiologist",
  "ENT Specialist",
  "Orthopedic",
  "Gynecologist",
  "Dentist",
] as const;

export const consultationIntakeSchema = z.object({
  presentingComplaint: z
    .string()
    .min(1)
    .describe("The patient's main issue in one short sentence."),
  symptomSummary: z
    .string()
    .min(1)
    .describe("A concise summary of relevant symptoms and clinical context."),
  durationContext: z
    .string()
    .min(1)
    .describe("How long the issue has been present and any useful context."),
  likelySpecialty: z.enum(SPECIALTY_OPTIONS),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "EMERGENCY"]),
  confidenceBand: z.enum(["LOW", "MEDIUM", "HIGH"]),
  riskFlags: z
    .array(z.string())
    .describe("Red flags, uncertainty, or safety issues identified from the transcript."),
  suggestedNextSteps: z
    .array(z.string())
    .describe("Safe next-step guidance that does not replace a doctor's final treatment plan."),
  draftMedications: z
    .array(z.string())
    .describe("Unapproved draft medication ideas mentioned by the AI, if any."),
  doctorReviewRequired: z.boolean(),
  doctorReviewReason: z
    .string()
    .min(1)
    .describe("Why a doctor should or should not review the case."),
});

export type ConsultationIntake = z.infer<typeof consultationIntakeSchema>;

export const CONSULTATION_INTAKE_PROMPT = `You are MEDIVA AI, a cautious clinical intake assistant.
You are analyzing a transcript between a patient and an AI medical assistant.

Rules:
- Choose likelySpecialty from the allowed enum values only.
- Be medically conservative and avoid overclaiming.
- If symptoms sound risky, unclear, severe, or incomplete, set doctorReviewRequired to true.
- Set urgency to HIGH or EMERGENCY for severe warning signs.
- Draft medications are internal-only suggestions and must remain unapproved.
- Keep every field grounded in the transcript. If details are missing, say so plainly.
- Prefer doctor review when you are uncertain.
`;

export function buildTranscriptPrompt(transcript: string[]) {
  if (transcript.length === 0) {
    return "No transcript was captured for this consultation.";
  }

  return `Transcript:\n${transcript.join("\n")}`;
}

export function buildDraftMarkdownReport(intake: ConsultationIntake) {
  const riskFlags =
    intake.riskFlags.length > 0
      ? intake.riskFlags.map((flag) => `- ${flag}`).join("\n")
      : "- No major red flags captured from the transcript.";

  const nextSteps =
    intake.suggestedNextSteps.length > 0
      ? intake.suggestedNextSteps.map((step) => `- ${step}`).join("\n")
      : "- Further clarification may be needed.";

  const draftMedications =
    intake.draftMedications.length > 0
      ? intake.draftMedications.map((item) => `- ${item}`).join("\n")
      : "- No medication suggestions were drafted.";

  return `# MEDIVA AI Draft Consultation Summary

## Presenting Complaint
${intake.presentingComplaint}

## Symptom Summary
${intake.symptomSummary}

## Duration and Context
${intake.durationContext}

## Triage Assessment
- Likely specialty: ${intake.likelySpecialty}
- Urgency: ${intake.urgency}
- Confidence: ${intake.confidenceBand}
- Doctor review required: ${intake.doctorReviewRequired ? "Yes" : "No"}

## Risk Flags
${riskFlags}

## Suggested Next Steps
${nextSteps}

## Draft Medication Ideas (Not Doctor Approved)
${draftMedications}

## Review Note
${intake.doctorReviewReason}
`;
}

export function shouldEscalateToDoctor(intake: ConsultationIntake) {
  if (intake.doctorReviewRequired) {
    return true;
  }

  if (intake.confidenceBand !== "HIGH") {
    return true;
  }

  return intake.urgency === "HIGH" || intake.urgency === "EMERGENCY";
}

export function buildDoctorFinalReport(input: {
  specialty: string;
  diagnosis: string;
  advice: string;
  medications: string[];
  tests: string[];
  followUp?: string;
}) {
  const medications =
    input.medications.length > 0
      ? input.medications.map((item) => `- ${item}`).join("\n")
      : "- No medications prescribed.";

  const tests =
    input.tests.length > 0
      ? input.tests.map((item) => `- ${item}`).join("\n")
      : "- No tests ordered.";

  return `# Doctor Validated Care Plan

## Specialty
${input.specialty}

## Clinical Impression
${input.diagnosis}

## Advice
${input.advice}

## Medications
${medications}

## Tests and Follow-Up
${tests}

## Follow-Up Notes
${input.followUp || "Follow-up as clinically indicated."}
`;
}
