import { Report } from "@/src/generated/prisma";

/**
 * Generates a medical report ( can work on clien side as well )
 */

export const generateReport = async (
  specialist: string,
  transcript: string[]
): Promise<Report | null> => {
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
    console.error("Error generating report:", error);
    return null;
  }
};
