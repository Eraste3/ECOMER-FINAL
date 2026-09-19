-- AlterTable
ALTER TABLE "AppelOffres" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Operation" ADD COLUMN     "description" TEXT,
ADD COLUMN     "titre" TEXT;

-- AlterTable
ALTER TABLE "Signalement" ADD COLUMN     "description" TEXT;
