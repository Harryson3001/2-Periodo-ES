import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 3333),
  jwtSecret: process.env.JWT_SECRET ?? 'change-me',
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  corsOrigins: (process.env.FRONTEND_URL ?? '*').split(',').map(value => value.trim())
};
