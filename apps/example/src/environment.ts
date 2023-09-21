import "dotenv/config";

import { z } from "zod";

const baseEnvSchema = z.object({
  DISCORD_TOKEN: z.string().min(10),
});

const productionSchema = z.object({
  ENVIRONMENT: z.literal("PRODUCTION"),
  DEV_GUILD_ID: z.undefined(),
});

const developmentSchema = z.object({
  ENVIRONMENT: z.literal("DEVELOPMENT").optional(),
  DEV_GUILD_ID: z.string().min(10),
});

const environmentSchema = z.intersection(
  baseEnvSchema,
  z.union([productionSchema, developmentSchema]),
);

export const environment = environmentSchema.parse(process.env);

export const GuildIds =
  environment.ENVIRONMENT === "PRODUCTION"
    ? "Global"
    : [environment.DEV_GUILD_ID];
