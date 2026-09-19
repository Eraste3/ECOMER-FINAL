require('dotenv').config();

const required = ['DATABASE_URL', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`${key} est obligatoire dans .env`);
}

module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  port: Number(process.env.PORT || 8000),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  clusteringRadiusMeters: Number(process.env.CLUSTERING_RADIUS_METERS || 500),
  clusteringMinSamples: Number(process.env.CLUSTERING_MIN_SAMPLES || 3),

  iaServiceUrl: process.env.IA_SERVICE_URL || '',
  iaTimeoutMs: Number(process.env.IA_TIMEOUT_MS || 20000),
  iaApiKey: process.env.IA_API_KEY || '',

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
  cloudinaryFolder: process.env.CLOUDINARY_FOLDER || 'ecomer/signalements'
};
