export type Report = {
  id: string;
  userId: string;
  consultationId?: string | null;
  finalCarePlanId?: string | null;
  specialist: string;
  title?: string | null;
  content: string;
  kind: "AI_DRAFT" | "DOCTOR_FINAL";
  createdAt: Date;
  updatedAt?: Date;
};

export type ConsultationResponse = {
  consultation: {
    id: string;
    specialist: string;
    urgency: string;
    requiresDoctorReview: boolean;
  };
  report: Report;
  ticket: {
    id: string;
    specialty: string;
    status: string;
  } | null;
  ticketCreated: boolean;
  urgency: string;
};

/**
 * Generates a medical report ( can work on clien side as well )
 */

export const generateReport = async (
  specialist: string,
  transcript: Array<{ role: string; text: string }>,
): Promise<ConsultationResponse | null> => {
  try {
    const response = await fetch("/api/report", {
      method: "POST",
      body: JSON.stringify({ specialist, transcript }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error generating report:", error);
    return null;
  }
};

/**
 * Get reports for the authenticated user. ( prisma can work server side only so using fetch )
 */

export const getReport = async (): Promise<Report[] | null> => {
  try {
    const response = await fetch("/api/report", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching report:", error);
    return null;
  }
};
