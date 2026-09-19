-- Table de journalisation des requêtes (diagnostic). Créée aussi à la volée
-- par src/middleware/requestLog.js ; IF NOT EXISTS rend la migration idempotente.
CREATE TABLE IF NOT EXISTS "request_log" (
    "id" BIGSERIAL PRIMARY KEY,
    "at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "method" TEXT,
    "path" TEXT,
    "status" INT,
    "origin" TEXT,
    "ip" TEXT,
    "ua" TEXT,
    "has_auth" BOOLEAN,
    "body" TEXT
);