import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prisma from "@/src/lib/db";
import { CREDITS } from "@/src/constants";
import { findDemoDoctorByEmail } from "@/src/lib/doctor-roster";
import { Prisma, UserRole } from "@/src/generated/prisma/client";

type SyncedUser = Awaited<ReturnType<typeof syncCurrentUser>>;

export async function syncCurrentUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const rawEmail = clerkUser.emailAddresses[0]?.emailAddress;

  if (!rawEmail) {
    throw new Error("Signed-in user is missing an email address.");
  }

  const email = rawEmail.trim().toLowerCase();

  const displayName =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    clerkUser.username ||
    email.split("@")[0];

  const doctorSeed = findDemoDoctorByEmail(email);
  const role = doctorSeed ? UserRole.DOCTOR : UserRole.PATIENT;

  const existingById = await prisma.user.findUnique({
    where: { id: clerkUser.id },
    include: { doctorProfile: true },
  });

  const existingByEmail =
    existingById ??
    (await prisma.user.findUnique({
      where: { email },
      include: { doctorProfile: true },
    }));

  let user: NonNullable<typeof existingByEmail>;

  if (existingByEmail) {
    user = await prisma.user.update({
      where: { email },
      data: {
        id: clerkUser.id,
        email,
        name: displayName,
        role: doctorSeed ? UserRole.DOCTOR : existingByEmail.role,
        credits: existingByEmail.credits ?? CREDITS,
      },
      include: { doctorProfile: true },
    });
  } else {
    try {
      user = await prisma.user.create({
        data: {
          id: clerkUser.id,
          email,
          name: displayName,
          credits: CREDITS,
          role,
        },
        include: { doctorProfile: true },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        const row = await prisma.user.findUniqueOrThrow({
          where: { email },
          include: { doctorProfile: true },
        });
        user = await prisma.user.update({
          where: { id: row.id },
          data: {
            id: clerkUser.id,
            email,
            name: displayName,
            role: doctorSeed ? UserRole.DOCTOR : row.role,
            credits: row.credits ?? CREDITS,
          },
          include: { doctorProfile: true },
        });
      } else {
        throw e;
      }
    }
  }

  if (doctorSeed) {
    await prisma.doctorProfile.upsert({
      where: {
        userId: user.id,
      },
      update: {
        specialty: doctorSeed.specialty,
        licenseNumber: doctorSeed.licenseNumber,
        bio: doctorSeed.bio,
        active: true,
      },
      create: {
        userId: user.id,
        specialty: doctorSeed.specialty,
        licenseNumber: doctorSeed.licenseNumber,
        bio: doctorSeed.bio,
        active: true,
      },
    });
  }

  return prisma.user.findUnique({
    where: {
      id: clerkUser.id,
    },
    include: {
      doctorProfile: true,
    },
  });
}

export async function getCurrentDbUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const syncedUser = await syncCurrentUser();

  if (syncedUser) {
    return syncedUser;
  }

  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      doctorProfile: true,
    },
  });
}

export async function requireCurrentUser(redirectTo = "/sign-in") {
  const user = await getCurrentDbUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user as NonNullable<SyncedUser>;
}

export async function requireDoctorUser() {
  const user = await requireCurrentUser("/sign-in?redirect_url=/doctor");

  if (user.role !== UserRole.DOCTOR && user.role !== UserRole.ADMIN) {
    redirect("/app");
  }

  return user;
}
