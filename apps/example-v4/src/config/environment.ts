import { z } from "zod";

const environmentSchema = z.object({
  DISCORD_TOKEN: z.string().min(10),
  DEV_GUILD_ID: z.string().min(10),
});

export const environment = environmentSchema.parse(process.env);
