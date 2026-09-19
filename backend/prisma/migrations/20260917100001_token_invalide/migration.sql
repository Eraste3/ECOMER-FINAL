-- CreateTable: révocation des tokens JWT (logout réel)
CREATE TABLE "TokenInvalide" (
    "id" SERIAL NOT NULL,
    "jti" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenInvalide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TokenInvalide_jti_key" ON "TokenInvalide"("jti");

-- CreateIndex
CREATE INDEX "TokenInvalide_expiresAt_idx" ON "TokenInvalide"("expiresAt");