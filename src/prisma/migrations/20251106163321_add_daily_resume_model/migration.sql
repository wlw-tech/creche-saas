-- CreateEnum
CREATE TYPE "NiveauAppetit" AS ENUM ('Excellent', 'Bon', 'Moyen', 'Faible', 'Refus');

-- CreateEnum
CREATE TYPE "NiveauHumeur" AS ENUM ('Excellent', 'Bon', 'Moyen', 'Difficile', 'Tres_difficile');

-- CreateEnum
CREATE TYPE "NiveauSieste" AS ENUM ('Excellent', 'Bon', 'Moyen', 'Difficile', 'Pas_de_sieste');

-- CreateEnum
CREATE TYPE "NiveauParticipation" AS ENUM ('Excellent', 'Bon', 'Moyen', 'Faible', 'Absent');

-- CreateTable
CREATE TABLE "DailyResume" (
    "id" TEXT NOT NULL,
    "enfantId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "appetit" "NiveauAppetit",
    "humeur" "NiveauHumeur",
    "sieste" "NiveauSieste",
    "participation" "NiveauParticipation",
    "creePar" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifieLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyResume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyResumeObservation" (
    "id" TEXT NOT NULL,
    "dailyResumeId" TEXT NOT NULL,
    "observation" TEXT NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyResumeObservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyResume_date_idx" ON "DailyResume"("date");

-- CreateIndex
CREATE INDEX "DailyResume_enfantId_idx" ON "DailyResume"("enfantId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyResume_enfantId_date_key" ON "DailyResume"("enfantId", "date");

-- CreateIndex
CREATE INDEX "DailyResumeObservation_dailyResumeId_idx" ON "DailyResumeObservation"("dailyResumeId");

-- AddForeignKey
ALTER TABLE "DailyResume" ADD CONSTRAINT "DailyResume_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "Enfant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyResumeObservation" ADD CONSTRAINT "DailyResumeObservation_dailyResumeId_fkey" FOREIGN KEY ("dailyResumeId") REFERENCES "DailyResume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
