/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Tuteur` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Tuteur" ADD COLUMN     "nom" TEXT,
ADD COLUMN     "prenom" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Tuteur_email_key" ON "Tuteur"("email");

-- CreateIndex
CREATE INDEX "Tuteur_email_idx" ON "Tuteur"("email");
