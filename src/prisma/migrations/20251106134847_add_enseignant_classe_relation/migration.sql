-- CreateTable
CREATE TABLE "Enseignant" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Enseignant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnseignantClasse" (
    "id" TEXT NOT NULL,
    "enseignantId" TEXT NOT NULL,
    "classeId" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateFin" TIMESTAMP(3),

    CONSTRAINT "EnseignantClasse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EnseignantClasse_enseignantId_idx" ON "EnseignantClasse"("enseignantId");

-- CreateIndex
CREATE INDEX "EnseignantClasse_classeId_idx" ON "EnseignantClasse"("classeId");

-- CreateIndex
CREATE UNIQUE INDEX "EnseignantClasse_enseignantId_classeId_key" ON "EnseignantClasse"("enseignantId", "classeId");

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_enseignantId_fkey" FOREIGN KEY ("enseignantId") REFERENCES "Enseignant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnseignantClasse" ADD CONSTRAINT "EnseignantClasse_enseignantId_fkey" FOREIGN KEY ("enseignantId") REFERENCES "Enseignant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnseignantClasse" ADD CONSTRAINT "EnseignantClasse_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
