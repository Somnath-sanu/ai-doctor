import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { DEMO_DOCTOR_ACCOUNTS } from "../src/lib/doctor-roster";
import { UserRole } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  for (const doctor of DEMO_DOCTOR_ACCOUNTS) {
    const seededUserId = `seed:${doctor.email}`;

    await prisma.user.upsert({
      where: {
        email: doctor.email,
      },
      update: {
        name: doctor.name,
        role: UserRole.DOCTOR,
      },
      create: {
        id: seededUserId,
        name: doctor.name,
        email: doctor.email,
        credits: 0,
        role: UserRole.DOCTOR,
      },
    });

    const savedUser = await prisma.user.findUniqueOrThrow({
      where: {
        email: doctor.email,
      },
    });

    await prisma.doctorProfile.upsert({
      where: {
        userId: savedUser.id,
      },
      update: {
        specialty: doctor.specialty,
        licenseNumber: doctor.licenseNumber,
        bio: doctor.bio,
        active: true,
      },
      create: {
        userId: savedUser.id,
        specialty: doctor.specialty,
        licenseNumber: doctor.licenseNumber,
        bio: doctor.bio,
        active: true,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
