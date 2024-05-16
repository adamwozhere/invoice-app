import dotenv from 'dotenv';
import { z } from 'zod';
import { CorsOptions } from 'cors';
import { CookieOptions } from 'express';
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

// TODO: refresh token cookie options - now working with updated @types/react-serve-static-core
const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: 'none' as const, // is as const needed?
  secure: true, // set to false if testing with thunderclient
  // maxAge: 30000, // 30 sec
  maxAge: 60 * 60 * 24 * 365, // 1 year
  partitioned: true,
};

const CORS_OPTIONS: CorsOptions = {
  origin: [
    'https://mint-invoicing.onrender.com',
    'http://localhost:4173', // Vite preview
    'http://localhost:5173', // Vite dev
  ],
  credentials: true,
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

