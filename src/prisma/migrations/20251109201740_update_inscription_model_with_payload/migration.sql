/*
  Warnings:

  - The values [Candidature,ListeAttente,Admis,Actif,Inactif] on the enum `StatutInscription` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `classeId` on the `Inscription` table. All the data in the column will be lost.
  - You are about to drop the column `dateDebut` on the `Inscription` table. All the data in the column will be lost.
  - You are about to drop the column `dateFin` on the `Inscription` table. All the data in the column will be lost.
  - You are about to drop the column `priorite` on the `Inscription` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatutInscription_new" AS ENUM ('CANDIDATURE', 'EN_COURS', 'ACTIF', 'REJETEE');
ALTER TABLE "public"."Inscription" ALTER COLUMN "statut" DROP DEFAULT;
ALTER TABLE "Inscription" ALTER COLUMN "statut" TYPE "StatutInscription_new" USING ("statut"::text::"StatutInscription_new");
ALTER TYPE "StatutInscription" RENAME TO "StatutInscription_old";
ALTER TYPE "StatutInscription_new" RENAME TO "StatutInscription";
DROP TYPE "public"."StatutInscription_old";
ALTER TABLE "Inscription" ALTER COLUMN "statut" SET DEFAULT 'CANDIDATURE';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Inscription" DROP CONSTRAINT "Inscription_classeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inscription" DROP CONSTRAINT "Inscription_enfantId_fkey";

-- DropIndex
DROP INDEX "public"."Inscription_classeId_idx";

-- AlterTable
ALTER TABLE "Inscription" DROP COLUMN "classeId",
DROP COLUMN "dateDebut",
DROP COLUMN "dateFin",
DROP COLUMN "priorite",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "familleId" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "payload" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "enfantId" DROP NOT NULL,
ALTER COLUMN "statut" SET DEFAULT 'CANDIDATURE';

-- CreateIndex
CREATE INDEX "Inscription_statut_idx" ON "Inscription"("statut");

-- CreateIndex
CREATE INDEX "Inscription_createdAt_idx" ON "Inscription"("createdAt");

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "Enfant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_familleId_fkey" FOREIGN KEY ("familleId") REFERENCES "Famille"("id") ON DELETE SET NULL ON UPDATE CASCADE;
