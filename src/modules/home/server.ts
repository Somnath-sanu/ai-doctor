"server-only";

import { CREDITS } from "@/src/constants";
import prisma from "@/src/lib/db";

export const upserUser = async (
  firstName: string | null,
  lastName: string | null,
  email: string
) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: email,
          name: `${firstName} ${lastName}`,
          credits: CREDITS,
        },
      });
    }
  } catch {
    console.error("Error saving user data to DB");
  }
};
