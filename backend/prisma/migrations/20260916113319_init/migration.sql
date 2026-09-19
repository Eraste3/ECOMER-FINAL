-- CreateEnum
CREATE TYPE "Role" AS ENUM ('citoyen', 'agent', 'admin', 'recycleur');

-- CreateEnum
CREATE TYPE "StatutSignalement" AS ENUM ('en_attente', 'valide', 'rejete');

-- CreateEnum
CREATE TYPE "Gravite" AS ENUM ('faible', 'moyenne', 'elevee');

-- CreateEnum
CREATE TYPE "StatutZone" AS ENUM ('en_attente', 'validee', 'rejetee');

-- CreateEnum
CREATE TYPE "Criticite" AS ENUM ('faible', 'moyenne', 'elevee', 'critique');

-- CreateEnum
CREATE TYPE "TypeAppel" AS ENUM ('collecte', 'detection');

-- CreateEnum
CREATE TYPE "StatutAppel" AS ENUM ('ouvert', 'complet', 'termine', 'annule');

-- CreateEnum
CREATE TYPE "StatutOperation" AS ENUM ('planifiee', 'en_cours', 'terminee', 'annulee');

-- CreateEnum
CREATE TYPE "QualiteDechet" AS ENUM ('trie', 'prepare', 'rejete');

-- CreateEnum
CREATE TYPE "StatutLot" AS ENUM ('disponible', 'reserve', 'vendu', 'annule');

-- CreateEnum
CREATE TYPE "TypeTransaction" AS ENUM ('achat', 'offre');

-- CreateEnum
CREATE TYPE "StatutCommande" AS ENUM ('en_attente', 'confirmee', 'livree', 'payee', 'annulee');

-- CreateEnum
CREATE TYPE "MouvementType" AS ENUM ('entree', 'sortie');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'citoyen',
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Citoyen" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "operateurMobile" TEXT,

    CONSTRAINT "Citoyen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentEcomer" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,

    CONSTRAINT "AgentEcomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Administrateur" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,

    CONSTRAINT "Administrateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recycleur" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "entreprise" TEXT NOT NULL,
    "typesMateriaux" TEXT[],

    CONSTRAINT "Recycleur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipe" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "agentId" INTEGER,

    CONSTRAINT "Equipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Signalement" (
    "id" SERIAL NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "typeDechet" TEXT,
    "suggestionIa" TEXT,
    "gravite" "Gravite",
    "statut" "StatutSignalement" NOT NULL DEFAULT 'en_attente',
    "utilisateurId" INTEGER NOT NULL,
    "zoneId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Signalement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZonePollution" (
    "id" SERIAL NOT NULL,
    "nom" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "rayonMetres" DOUBLE PRECISION NOT NULL,
    "criticite" "Criticite" NOT NULL DEFAULT 'faible',
    "tonnageEstimeKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "typeDechetDominant" TEXT,
    "statut" "StatutZone" NOT NULL DEFAULT 'en_attente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZonePollution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppelOffres" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "type" "TypeAppel" NOT NULL,
    "dateIntervention" TIMESTAMP(3) NOT NULL,
    "placesRequises" INTEGER NOT NULL DEFAULT 1,
    "remuneration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "equipement" TEXT,
    "statut" "StatutAppel" NOT NULL DEFAULT 'ouvert',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppelOffres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participation" (
    "id" SERIAL NOT NULL,
    "appelOffresId" INTEGER NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "equipeId" INTEGER,
    "statut" TEXT NOT NULL DEFAULT 'inscrit',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "equipeId" INTEGER,
    "createurId" INTEGER NOT NULL,
    "statut" "StatutOperation" NOT NULL DEFAULT 'planifiee',
    "photoAvantUrl" TEXT,
    "photoApresUrl" TEXT,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dechet" (
    "id" SERIAL NOT NULL,
    "operationId" INTEGER NOT NULL,
    "categorie" TEXT NOT NULL,
    "poidsKg" DOUBLE PRECISION NOT NULL,
    "qualite" "QualiteDechet" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dechet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockEcomer" (
    "id" SERIAL NOT NULL,
    "categorie" TEXT NOT NULL,
    "quantiteKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockEcomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MouvementStock" (
    "id" SERIAL NOT NULL,
    "stockId" INTEGER NOT NULL,
    "type" "MouvementType" NOT NULL,
    "quantiteKg" DOUBLE PRECISION NOT NULL,
    "motif" TEXT NOT NULL,
    "referenceId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MouvementStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LotEcoshop" (
    "id" SERIAL NOT NULL,
    "categorie" TEXT NOT NULL,
    "quantiteKg" DOUBLE PRECISION NOT NULL,
    "qualite" "QualiteDechet" NOT NULL,
    "prixUnitaire" DOUBLE PRECISION NOT NULL,
    "statut" "StatutLot" NOT NULL DEFAULT 'disponible',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LotEcoshop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commande" (
    "id" SERIAL NOT NULL,
    "lotId" INTEGER NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "quantiteKg" DOUBLE PRECISION NOT NULL,
    "typeTransaction" "TypeTransaction" NOT NULL,
    "montantOffre" DOUBLE PRECISION,
    "statut" "StatutCommande" NOT NULL DEFAULT 'en_attente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "titre" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "lue" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE INDEX "Utilisateur_role_idx" ON "Utilisateur"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Citoyen_utilisateurId_key" ON "Citoyen"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "AgentEcomer_utilisateurId_key" ON "AgentEcomer"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "Administrateur_utilisateurId_key" ON "Administrateur"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "Recycleur_utilisateurId_key" ON "Recycleur"("utilisateurId");

-- CreateIndex
CREATE INDEX "Signalement_latitude_longitude_idx" ON "Signalement"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Signalement_zoneId_idx" ON "Signalement"("zoneId");

-- CreateIndex
CREATE INDEX "Signalement_statut_idx" ON "Signalement"("statut");

-- CreateIndex
CREATE INDEX "AppelOffres_zoneId_idx" ON "AppelOffres"("zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "Participation_appelOffresId_utilisateurId_key" ON "Participation"("appelOffresId", "utilisateurId");

-- CreateIndex
CREATE INDEX "Operation_zoneId_idx" ON "Operation"("zoneId");

-- CreateIndex
CREATE INDEX "Operation_statut_idx" ON "Operation"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "StockEcomer_categorie_key" ON "StockEcomer"("categorie");

-- CreateIndex
CREATE INDEX "MouvementStock_stockId_idx" ON "MouvementStock"("stockId");

-- CreateIndex
CREATE INDEX "Commande_lotId_idx" ON "Commande"("lotId");

-- CreateIndex
CREATE INDEX "Commande_utilisateurId_idx" ON "Commande"("utilisateurId");

-- CreateIndex
CREATE INDEX "Notification_utilisateurId_lue_idx" ON "Notification"("utilisateurId", "lue");

-- AddForeignKey
ALTER TABLE "Citoyen" ADD CONSTRAINT "Citoyen_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentEcomer" ADD CONSTRAINT "AgentEcomer_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administrateur" ADD CONSTRAINT "Administrateur_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recycleur" ADD CONSTRAINT "Recycleur_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipe" ADD CONSTRAINT "Equipe_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "AgentEcomer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signalement" ADD CONSTRAINT "Signalement_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signalement" ADD CONSTRAINT "Signalement_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "ZonePollution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppelOffres" ADD CONSTRAINT "AppelOffres_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "ZonePollution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_appelOffresId_fkey" FOREIGN KEY ("appelOffresId") REFERENCES "AppelOffres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "ZonePollution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_createurId_fkey" FOREIGN KEY ("createurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dechet" ADD CONSTRAINT "Dechet_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "Operation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MouvementStock" ADD CONSTRAINT "MouvementStock_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "StockEcomer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "LotEcoshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
