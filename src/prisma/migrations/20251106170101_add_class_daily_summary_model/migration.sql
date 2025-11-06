-- CreateEnum
CREATE TYPE "StatutResume" AS ENUM ('Brouillon', 'Publie');

-- CreateTable
CREATE TABLE "ClassDailySummary" (
    "id" TEXT NOT NULL,
    "classeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "activites" TEXT NOT NULL,
    "apprentissages" TEXT NOT NULL,
    "humeurGroupe" TEXT NOT NULL,
    "observations" TEXT,
    "statut" "StatutResume" NOT NULL DEFAULT 'Brouillon',
    "creePar" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifieLe" TIMESTAMP(3) NOT NULL,
    "publieLe" TIMESTAMP(3),

    CONSTRAINT "ClassDailySummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClassDailySummary_date_idx" ON "ClassDailySummary"("date");

-- CreateIndex
CREATE INDEX "ClassDailySummary_classeId_idx" ON "ClassDailySummary"("classeId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassDailySummary_classeId_date_key" ON "ClassDailySummary"("classeId", "date");

-- AddForeignKey
ALTER TABLE "ClassDailySummary" ADD CONSTRAINT "ClassDailySummary_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
