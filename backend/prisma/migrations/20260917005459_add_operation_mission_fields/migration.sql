-- AlterTable
ALTER TABLE "Operation" ADD COLUMN     "agents" INTEGER,
ADD COLUMN     "areaM2" DOUBLE PRECISION,
ADD COLUMN     "collectedTons" DOUBLE PRECISION,
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "interventionType" TEXT,
ADD COLUMN     "lead" TEXT,
ADD COLUMN     "materials" TEXT[],
ADD COLUMN     "priority" "Gravite",
ADD COLUMN     "severity" "Gravite",
ADD COLUMN     "teamName" TEXT;
