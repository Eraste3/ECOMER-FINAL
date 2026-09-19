-- CreateEnum
CREATE TYPE "Niveau" AS ENUM ('bronze', 'argent', 'or');

-- CreateEnum
CREATE TYPE "TypeOperation" AS ENUM ('ecomer', 'citoyenne');

-- AlterTable
ALTER TABLE "Citoyen" ADD COLUMN     "ecoPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "niveau" "Niveau" NOT NULL DEFAULT 'bronze';

-- AlterTable
ALTER TABLE "Operation" ADD COLUMN     "agentEcomerId" INTEGER;

-- CreateTable
CREATE TABLE "Badge" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "iconeUrl" TEXT,
    "seuilEcoPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BadgeAcquis" (
    "id" SERIAL NOT NULL,
    "badgeId" INTEGER NOT NULL,
    "citoyenId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BadgeAcquis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Badge_nom_key" ON "Badge"("nom");

-- CreateIndex
CREATE INDEX "Badge_seuilEcoPoints_idx" ON "Badge"("seuilEcoPoints");

-- CreateIndex
CREATE UNIQUE INDEX "BadgeAcquis_badgeId_citoyenId_key" ON "BadgeAcquis"("badgeId", "citoyenId");

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_agentEcomerId_fkey" FOREIGN KEY ("agentEcomerId") REFERENCES "AgentEcomer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeAcquis" ADD CONSTRAINT "BadgeAcquis_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeAcquis" ADD CONSTRAINT "BadgeAcquis_citoyenId_fkey" FOREIGN KEY ("citoyenId") REFERENCES "Citoyen"("id") ON DELETE CASCADE ON UPDATE CASCADE;
