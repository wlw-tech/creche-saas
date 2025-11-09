-- CreateEnum
CREATE TYPE "EventAudience" AS ENUM ('CLASS', 'PARENTS_ALL');

-- AlterTable
ALTER TABLE "Tuteur" ADD COLUMN     "adresse" TEXT;

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "classeId" TEXT NOT NULL,
    "audience" "EventAudience" NOT NULL DEFAULT 'CLASS',
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_classeId_startAt_idx" ON "Event"("classeId", "startAt");

-- CreateIndex
CREATE INDEX "Event_startAt_idx" ON "Event"("startAt");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
