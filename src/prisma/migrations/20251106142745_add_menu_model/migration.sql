-- CreateEnum
CREATE TYPE "StatutMenu" AS ENUM ('Brouillon', 'Publie');

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "entree" TEXT,
    "plat" TEXT,
    "dessert" TEXT,
    "statut" "StatutMenu" NOT NULL DEFAULT 'Brouillon',
    "creePar" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifieLe" TIMESTAMP(3) NOT NULL,
    "publieLe" TIMESTAMP(3),

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuAllergen" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "allergen" TEXT NOT NULL,

    CONSTRAINT "MenuAllergen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Menu_date_key" ON "Menu"("date");

-- CreateIndex
CREATE INDEX "Menu_date_idx" ON "Menu"("date");

-- CreateIndex
CREATE INDEX "Menu_statut_idx" ON "Menu"("statut");

-- CreateIndex
CREATE INDEX "MenuAllergen_menuId_idx" ON "MenuAllergen"("menuId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuAllergen_menuId_allergen_key" ON "MenuAllergen"("menuId", "allergen");

-- AddForeignKey
ALTER TABLE "MenuAllergen" ADD CONSTRAINT "MenuAllergen_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
