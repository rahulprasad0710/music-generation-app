-- CreateEnum
CREATE TYPE "JobEventType" AS ENUM ('JOB_COMPLETED', 'JOB_FAILED', 'JOB_PROCESSING');

-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('PENDING', 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ;

-- CreateTable
CREATE TABLE "Prompt" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "prompt" TEXT NOT NULL,
    "prompt_tsv" tsvector,
    "status" "GenerationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "startedAt" TIMESTAMPTZ,
    "completedAt" TIMESTAMPTZ,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "result" JSONB,
    "errorMessage" TEXT,
    "eventEmitted" BOOLEAN NOT NULL DEFAULT false,
    "jobId" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobEvent" (
    "id" SERIAL NOT NULL,
    "promptId" INTEGER NOT NULL,
    "type" "JobEventType" NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prompt_jobId_key" ON "Prompt"("jobId");

-- CreateIndex
CREATE INDEX "Prompt_status_idx" ON "Prompt"("status");

-- CreateIndex
CREATE INDEX "Prompt_status_priority_idx" ON "Prompt"("status", "priority");

-- CreateIndex
CREATE INDEX "Prompt_userId_idx" ON "Prompt"("userId");

-- CreateIndex
CREATE INDEX "Prompt_createdAt_id_idx" ON "Prompt"("createdAt", "id");

-- CreateIndex
CREATE INDEX "JobEvent_promptId_idx" ON "JobEvent"("promptId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_isActive_isBlacklisted_idx" ON "User"("isActive", "isBlacklisted");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobEvent" ADD CONSTRAINT "JobEvent_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
