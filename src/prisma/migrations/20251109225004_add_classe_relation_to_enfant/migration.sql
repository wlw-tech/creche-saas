-- AlterTable
ALTER TABLE "Enfant" ADD COLUMN     "classeId" TEXT;

-- CreateIndex
CREATE INDEX "Enfant_classeId_idx" ON "Enfant"("classeId");

-- AddForeignKey
ALTER TABLE "Enfant" ADD CONSTRAINT "Enfant_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
