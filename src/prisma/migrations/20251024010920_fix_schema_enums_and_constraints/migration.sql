/*
  Warnings:

  - The values [Centre] on the enum `VisibiliteEvenement` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `centreId` on the `Classe` table. All the data in the column will be lost.
  - You are about to drop the column `centreId` on the `EvenementCalendrier` table. All the data in the column will be lost.
  - You are about to drop the column `centreId` on the `Utilisateur` table. All the data in the column will be lost.
  - You are about to drop the `Annonce` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Centre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RapportReglementaire` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[classeId,date]` on the table `JournalDeClasse` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[enfantId,date]` on the table `JournalQuotidien` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VisibiliteEvenement_new" AS ENUM ('Global', 'Classe', 'Prive');
ALTER TABLE "public"."EvenementCalendrier" ALTER COLUMN "visibilite" DROP DEFAULT;
ALTER TABLE "EvenementCalendrier" ALTER COLUMN "visibilite" TYPE "VisibiliteEvenement_new" USING ("visibilite"::text::"VisibiliteEvenement_new");
ALTER TYPE "VisibiliteEvenement" RENAME TO "VisibiliteEvenement_old";
ALTER TYPE "VisibiliteEvenement_new" RENAME TO "VisibiliteEvenement";
DROP TYPE "public"."VisibiliteEvenement_old";
ALTER TABLE "EvenementCalendrier" ALTER COLUMN "visibilite" SET DEFAULT 'Global';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Annonce" DROP CONSTRAINT "Annonce_centreId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Classe" DROP CONSTRAINT "Classe_centreId_fkey";

-- DropForeignKey
ALTER TABLE "public"."EvenementCalendrier" DROP CONSTRAINT "EvenementCalendrier_centreId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RapportReglementaire" DROP CONSTRAINT "RapportReglementaire_centreId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Utilisateur" DROP CONSTRAINT "Utilisateur_centreId_fkey";

-- AlterTable
ALTER TABLE "Classe" DROP COLUMN "centreId";

-- AlterTable
ALTER TABLE "EvenementCalendrier" DROP COLUMN "centreId",
ALTER COLUMN "visibilite" SET DEFAULT 'Global';

-- AlterTable
ALTER TABLE "Utilisateur" DROP COLUMN "centreId",
ADD COLUMN     "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "public"."Annonce";

-- DropTable
DROP TABLE "public"."Centre";

-- DropTable
DROP TABLE "public"."RapportReglementaire";

-- DropEnum
DROP TYPE "public"."CentreStatut";

-- CreateIndex
CREATE INDEX "EvenementCalendrier_debutA_idx" ON "EvenementCalendrier"("debutA");

-- CreateIndex
CREATE INDEX "Facture_dateEmission_idx" ON "Facture"("dateEmission");

-- CreateIndex
CREATE INDEX "Inscription_classeId_idx" ON "Inscription"("classeId");

-- CreateIndex
CREATE INDEX "JournalDeClasse_date_idx" ON "JournalDeClasse"("date");

-- CreateIndex
CREATE UNIQUE INDEX "JournalDeClasse_classeId_date_key" ON "JournalDeClasse"("classeId", "date");

-- CreateIndex
CREATE INDEX "JournalQuotidien_date_idx" ON "JournalQuotidien"("date");

-- CreateIndex
CREATE UNIQUE INDEX "JournalQuotidien_enfantId_date_key" ON "JournalQuotidien"("enfantId", "date");

-- CreateIndex
CREATE INDEX "Presence_date_idx" ON "Presence"("date");
