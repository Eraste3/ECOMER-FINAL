-- Enable PostGIS (Neon : prise en charge native)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Index GIST fonctionnel sur Signalement : recherche spatiale (proximite / rayon) indexee
CREATE INDEX IF NOT EXISTS "Signalement_geom_gist" ON "Signalement" USING GIST (ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326));

-- Index GIST fonctionnel sur ZonePollution : recherche spatiale indexee
CREATE INDEX IF NOT EXISTS "ZonePollution_geom_gist" ON "ZonePollution" USING GIST (ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326));
