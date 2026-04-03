-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PATIENT', 'DOCTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "UrgencyLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "ConfidenceBand" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ConsultationStatus" AS ENUM ('AI_COMPLETED', 'ESCALATED', 'DOCTOR_COMPLETED');

-- CreateEnum
CREATE TYPE "DoctorTicketStatus" AS ENUM ('OPEN', 'CLAIMED', 'IN_REVIEW', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReportKind" AS ENUM ('AI_DRAFT', 'DOCTOR_FINAL');

-- AlterTable
ALTER TABLE "User"
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'PATIENT',
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "credits" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Report"
ADD COLUMN "consultationId" TEXT,
ADD COLUMN "finalCarePlanId" TEXT,
ADD COLUMN "kind" "ReportKind" NOT NULL DEFAULT 'AI_DRAFT',
ADD COLUMN "title" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "DoctorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "bio" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoctorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "specialist" TEXT NOT NULL,
    "transcript" JSONB NOT NULL,
    "presentingComplaint" TEXT,
    "symptomSummary" TEXT,
    "durationContext" TEXT,
    "aiStructuredReport" JSONB,
    "aiDraftReport" TEXT NOT NULL,
    "confidenceBand" "ConfidenceBand" NOT NULL,
    "urgency" "UrgencyLevel" NOT NULL,
    "riskFlags" JSONB,
    "suggestedNextSteps" JSONB,
    "draftMedications" JSONB,
    "requiresDoctorReview" BOOLEAN NOT NULL DEFAULT false,
    "doctorReviewReason" TEXT,
    "status" "ConsultationStatus" NOT NULL DEFAULT 'AI_COMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorTicket" (
    "id" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "urgency" "UrgencyLevel" NOT NULL,
    "status" "DoctorTicketStatus" NOT NULL DEFAULT 'OPEN',
    "summary" TEXT NOT NULL,
    "aiDraftReport" TEXT NOT NULL,
    "aiStructuredReport" JSONB,
    "claimedByDoctorId" TEXT,
    "claimedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoctorTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinalCarePlan" (
    "id" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "advice" TEXT NOT NULL,
    "medications" JSONB NOT NULL,
    "tests" JSONB NOT NULL,
    "followUp" TEXT,
    "finalReport" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinalCarePlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DoctorProfile_userId_key" ON "DoctorProfile"("userId");

-- CreateIndex
CREATE INDEX "Consultation_patientId_createdAt_idx" ON "Consultation"("patientId", "createdAt");

-- CreateIndex
CREATE INDEX "Consultation_status_createdAt_idx" ON "Consultation"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorTicket_consultationId_key" ON "DoctorTicket"("consultationId");

-- CreateIndex
CREATE INDEX "DoctorTicket_specialty_status_createdAt_idx" ON "DoctorTicket"("specialty", "status", "createdAt");

-- CreateIndex
CREATE INDEX "DoctorTicket_claimedByDoctorId_status_idx" ON "DoctorTicket"("claimedByDoctorId", "status");

-- CreateIndex
CREATE INDEX "DoctorTicket_patientId_createdAt_idx" ON "DoctorTicket"("patientId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "FinalCarePlan_consultationId_key" ON "FinalCarePlan"("consultationId");

-- CreateIndex
CREATE UNIQUE INDEX "FinalCarePlan_ticketId_key" ON "FinalCarePlan"("ticketId");

-- CreateIndex
CREATE INDEX "FinalCarePlan_patientId_createdAt_idx" ON "FinalCarePlan"("patientId", "createdAt");

-- CreateIndex
CREATE INDEX "FinalCarePlan_doctorId_createdAt_idx" ON "FinalCarePlan"("doctorId", "createdAt");

-- CreateIndex
CREATE INDEX "Report_consultationId_idx" ON "Report"("consultationId");

-- CreateIndex
CREATE INDEX "Report_finalCarePlanId_idx" ON "Report"("finalCarePlanId");

-- AddForeignKey
ALTER TABLE "DoctorProfile" ADD CONSTRAINT "DoctorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorTicket" ADD CONSTRAINT "DoctorTicket_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorTicket" ADD CONSTRAINT "DoctorTicket_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorTicket" ADD CONSTRAINT "DoctorTicket_claimedByDoctorId_fkey" FOREIGN KEY ("claimedByDoctorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalCarePlan" ADD CONSTRAINT "FinalCarePlan_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalCarePlan" ADD CONSTRAINT "FinalCarePlan_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "DoctorTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalCarePlan" ADD CONSTRAINT "FinalCarePlan_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalCarePlan" ADD CONSTRAINT "FinalCarePlan_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_finalCarePlanId_fkey" FOREIGN KEY ("finalCarePlanId") REFERENCES "FinalCarePlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
