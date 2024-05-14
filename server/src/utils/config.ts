import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const dotEnvSchema = z.object({
  MONGODB_URI: z.string().min(1),
  PORT: z.coerce.number(),
  ACCESS_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),
});

// frontend path no longer needed as deploying on separate instances
const FRONTEND_PATH = '../frontend';
const ACCESS_TOKEN_TTL = '10m'; // 10 mins
const REFRESH_TOKEN_TTL = '1y'; // 1 year

// refresh token cookie options
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'none' as const,
  secure: true, // set to false if testing with thunderclient
  // maxAge: 30000, // 30 sec
  maxAge: 60 * 60 * 24 * 365, // 1 year
};

const CORS_OPTIONS = {
  origin: ['https://mint-invoicing-api.onrender.com', 'http://localhost:4173'],
};

const config = {
  ...dotEnvSchema.parse(process.env),
  FRONTEND_PATH,
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  COOKIE_OPTIONS,
  CORS_OPTIONS,
} as const;

export default config;

