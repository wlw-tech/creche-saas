/*
  Warnings:

  - You are about to drop the column `actif` on the `Utilisateur` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authUserId]` on the table `Utilisateur` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tuteurId]` on the table `Utilisateur` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[enseignantId]` on the table `Utilisateur` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `modifieLe` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatutUtilisateur" AS ENUM ('INVITED', 'ACTIVE', 'DISABLED');

-- AlterTable
ALTER TABLE "Utilisateur" DROP COLUMN "actif",
ADD COLUMN     "activeLe" TIMESTAMP(3),
ADD COLUMN     "authUserId" TEXT,
ADD COLUMN     "dernierAcces" TIMESTAMP(3),
ADD COLUMN     "enseignantId" TEXT,
ADD COLUMN     "inviteLe" TIMESTAMP(3),
ADD COLUMN     "modifieLe" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "statut" "StatutUtilisateur" NOT NULL DEFAULT 'INVITED',
ADD COLUMN     "tuteurId" TEXT;

-- CreateIndex
CREATE INDEX "Tuteur_familleId_idx" ON "Tuteur"("familleId");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_authUserId_key" ON "Utilisateur"("authUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_tuteurId_key" ON "Utilisateur"("tuteurId");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_enseignantId_key" ON "Utilisateur"("enseignantId");

-- CreateIndex
CREATE INDEX "Utilisateur_role_idx" ON "Utilisateur"("role");

-- CreateIndex
CREATE INDEX "Utilisateur_statut_idx" ON "Utilisateur"("statut");

-- CreateIndex
CREATE INDEX "Utilisateur_email_idx" ON "Utilisateur"("email");

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_tuteurId_fkey" FOREIGN KEY ("tuteurId") REFERENCES "Tuteur"("id") ON DELETE SET NULL ON UPDATE CASCADE;
