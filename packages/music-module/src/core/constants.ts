import { v4 as uuid } from "uuid";

export const SearchEmbedIdPrefix = "@leomotors__music-bot_select-embed-";

export function generateId(prefix: string) {
  return prefix + uuid().split("-")[0];
}
