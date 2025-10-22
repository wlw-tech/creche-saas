-- CreateEnum
CREATE TYPE "CentreStatut" AS ENUM ('Active', 'Suspendu');

-- CreateEnum
CREATE TYPE "Langue" AS ENUM ('fr', 'ar');

-- CreateEnum
CREATE TYPE "RoleUtilisateur" AS ENUM ('PARENT', 'ENSEIGNANT', 'ADMIN');

-- CreateEnum
CREATE TYPE "LienTuteur" AS ENUM ('Mere', 'Pere', 'Proche', 'Tuteur', 'Autre');

-- CreateEnum
CREATE TYPE "StatutInscription" AS ENUM ('Candidature', 'ListeAttente', 'Admis', 'Actif', 'Inactif');

-- CreateEnum
CREATE TYPE "StatutPresence" AS ENUM ('Present', 'Absent', 'Justifie');

-- CreateEnum
CREATE TYPE "TypeEntree" AS ENUM ('Repas', 'Sieste', 'Humeur', 'Participation', 'Libre');

-- CreateEnum
CREATE TYPE "VisibiliteEvenement" AS ENUM ('Centre', 'Classe', 'Prive');

-- CreateEnum
CREATE TYPE "Audience" AS ENUM ('Parents', 'Enseignants', 'Tous');

-- CreateEnum
CREATE TYPE "CanalNotification" AS ENUM ('App', 'Email', 'WhatsApp');

-- CreateEnum
CREATE TYPE "StatutDiffusion" AS ENUM ('AEnvoyer', 'Envoye', 'Echec', 'Annule');

-- AlterTable
ALTER TABLE "Centre" ADD COLUMN     "fuseauHoraire" TEXT,
ADD COLUMN     "statut" "CentreStatut" NOT NULL DEFAULT 'Active';

-- CreateTable
CREATE TABLE "Classe" (
    "id" TEXT NOT NULL,
    "centreId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "capacite" INTEGER,
    "trancheAge" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Classe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" TEXT NOT NULL,
    "centreId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "langue" "Langue" NOT NULL DEFAULT 'fr',
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "role" "RoleUtilisateur" NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Famille" (
    "id" TEXT NOT NULL,
    "emailPrincipal" TEXT NOT NULL,
    "languePreferee" "Langue" NOT NULL DEFAULT 'fr',
    "adresseFacturation" TEXT,

    CONSTRAINT "Famille_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tuteur" (
    "id" TEXT NOT NULL,
    "familleId" TEXT NOT NULL,
    "lien" "LienTuteur" NOT NULL,
    "telephone" TEXT,
    "email" TEXT,
    "principal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Tuteur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enfant" (
    "id" TEXT NOT NULL,
    "familleId" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "genre" TEXT,
    "photoUrl" TEXT,

    CONSTRAINT "Enfant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscription" (
    "id" TEXT NOT NULL,
    "enfantId" TEXT NOT NULL,
    "classeId" TEXT NOT NULL,
    "statut" "StatutInscription" NOT NULL DEFAULT 'Candidature',
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "priorite" INTEGER,

    CONSTRAINT "Inscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presence" (
    "id" TEXT NOT NULL,
    "enfantId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "statut" "StatutPresence" NOT NULL DEFAULT 'Present',
    "arriveeA" TIMESTAMP(3),
    "departA" TIMESTAMP(3),
    "enregistrePar" TEXT,

    CONSTRAINT "Presence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalQuotidien" (
    "id" TEXT NOT NULL,
    "enfantId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "JournalQuotidien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntreeJournal" (
    "id" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "type" "TypeEntree" NOT NULL,
    "valeur" TEXT NOT NULL,
    "creePar" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntreeJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalDeClasse" (
    "id" TEXT NOT NULL,
    "classeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "resume" TEXT,
    "creePar" TEXT,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalDeClasse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiffusionResume" (
    "id" TEXT NOT NULL,
    "journalClasseId" TEXT NOT NULL,
    "tuteurId" TEXT NOT NULL,
    "canal" "CanalNotification" NOT NULL,
    "statut" "StatutDiffusion" NOT NULL DEFAULT 'AEnvoyer',
    "envoyeLe" TIMESTAMP(3),

    CONSTRAINT "DiffusionResume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfilSante" (
    "id" TEXT NOT NULL,
    "enfantId" TEXT NOT NULL,
    "medecin" TEXT,
    "notes" TEXT,

    CONSTRAINT "ProfilSante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaccination" (
    "id" TEXT NOT NULL,
    "profilSanteId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "lot" TEXT,

    CONSTRAINT "Vaccination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allergie" (
    "id" TEXT NOT NULL,
    "profilSanteId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "severite" TEXT,
    "notes" TEXT,

    CONSTRAINT "Allergie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutorisationMedicament" (
    "id" TEXT NOT NULL,
    "profilSanteId" TEXT NOT NULL,
    "medicament" TEXT NOT NULL,
    "dosage" TEXT,
    "autorisePar" TEXT,
    "signeLe" TIMESTAMP(3),

    CONSTRAINT "AutorisationMedicament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facture" (
    "id" TEXT NOT NULL,
    "familleId" TEXT NOT NULL,
    "dateEmission" TIMESTAMP(3) NOT NULL,
    "dateEcheance" TIMESTAMP(3),
    "statut" TEXT NOT NULL DEFAULT 'Brouillon',
    "devise" TEXT NOT NULL DEFAULT 'MAD',
    "total" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LigneFacture" (
    "id" TEXT NOT NULL,
    "factureId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL DEFAULT 1,
    "prixUnitaire" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "tauxTaxe" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "LigneFacture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" TEXT NOT NULL,
    "factureId" TEXT NOT NULL,
    "montant" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL DEFAULT 'EnAttente',
    "methode" TEXT,
    "referenceFournisseur" TEXT,
    "payeLe" TIMESTAMP(3),

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvenementCalendrier" (
    "id" TEXT NOT NULL,
    "centreId" TEXT NOT NULL,
    "classeId" TEXT,
    "titre" TEXT NOT NULL,
    "debutA" TIMESTAMP(3) NOT NULL,
    "finA" TIMESTAMP(3) NOT NULL,
    "lieu" TEXT,
    "visibilite" "VisibiliteEvenement" NOT NULL DEFAULT 'Centre',

    CONSTRAINT "EvenementCalendrier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Annonce" (
    "id" TEXT NOT NULL,
    "centreId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "audience" "Audience" NOT NULL,

    CONSTRAINT "Annonce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RapportReglementaire" (
    "id" TEXT NOT NULL,
    "centreId" TEXT NOT NULL,
    "periodeDebut" TIMESTAMP(3) NOT NULL,
    "periodeFin" TIMESTAMP(3) NOT NULL,
    "ratioAdultesEnfants" DOUBLE PRECISION,
    "nbIncidents" INTEGER,
    "nbInspections" INTEGER,
    "exportUrl" TEXT,

    CONSTRAINT "RapportReglementaire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Famille_emailPrincipal_key" ON "Famille"("emailPrincipal");

-- CreateIndex
CREATE UNIQUE INDEX "Presence_enfantId_date_key" ON "Presence"("enfantId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilSante_enfantId_key" ON "ProfilSante"("enfantId");

-- AddForeignKey
ALTER TABLE "Classe" ADD CONSTRAINT "Classe_centreId_fkey" FOREIGN KEY ("centreId") REFERENCES "Centre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_centreId_fkey" FOREIGN KEY ("centreId") REFERENCES "Centre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tuteur" ADD CONSTRAINT "Tuteur_familleId_fkey" FOREIGN KEY ("familleId") REFERENCES "Famille"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enfant" ADD CONSTRAINT "Enfant_familleId_fkey" FOREIGN KEY ("familleId") REFERENCES "Famille"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "Enfant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presence" ADD CONSTRAINT "Presence_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "Enfant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalQuotidien" ADD CONSTRAINT "JournalQuotidien_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "Enfant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntreeJournal" ADD CONSTRAINT "EntreeJournal_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "JournalQuotidien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalDeClasse" ADD CONSTRAINT "JournalDeClasse_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiffusionResume" ADD CONSTRAINT "DiffusionResume_journalClasseId_fkey" FOREIGN KEY ("journalClasseId") REFERENCES "JournalDeClasse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilSante" ADD CONSTRAINT "ProfilSante_enfantId_fkey" FOREIGN KEY ("enfantId") REFERENCES "Enfant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_profilSanteId_fkey" FOREIGN KEY ("profilSanteId") REFERENCES "ProfilSante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allergie" ADD CONSTRAINT "Allergie_profilSanteId_fkey" FOREIGN KEY ("profilSanteId") REFERENCES "ProfilSante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutorisationMedicament" ADD CONSTRAINT "AutorisationMedicament_profilSanteId_fkey" FOREIGN KEY ("profilSanteId") REFERENCES "ProfilSante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_familleId_fkey" FOREIGN KEY ("familleId") REFERENCES "Famille"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneFacture" ADD CONSTRAINT "LigneFacture_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "Facture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "Facture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvenementCalendrier" ADD CONSTRAINT "EvenementCalendrier_centreId_fkey" FOREIGN KEY ("centreId") REFERENCES "Centre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvenementCalendrier" ADD CONSTRAINT "EvenementCalendrier_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Annonce" ADD CONSTRAINT "Annonce_centreId_fkey" FOREIGN KEY ("centreId") REFERENCES "Centre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapportReglementaire" ADD CONSTRAINT "RapportReglementaire_centreId_fkey" FOREIGN KEY ("centreId") REFERENCES "Centre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
