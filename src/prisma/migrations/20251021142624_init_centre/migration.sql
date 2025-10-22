-- CreateTable
CREATE TABLE "Centre" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "pays" TEXT,
    "adresse" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Centre_pkey" PRIMARY KEY ("id")
);
