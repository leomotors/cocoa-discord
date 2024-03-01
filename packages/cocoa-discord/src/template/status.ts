import { APIEmbedField } from "discord-api-types/v10";
import { CommandInteraction, Message } from "discord.js";

import { parseTime } from "../main/index.js";
import { getLinuxUptime, getRAM, getTemp } from "../meta/index.js";

export interface GetStatusFieldsOption {
  inline?: boolean;
  runningOn?: string;
  temperature?: string;
  systemMemory?: string;
  botMemory?: string;
  systemUptime?: string;
  botUptime?: string;
}

export function getRuntimeVersion() {
  // @ts-expect-error Bun Types
  if (typeof Bun !== "undefined") {
    // @ts-expect-error Bun Types
    return `Bun v${Bun.version}`;
  } else {
    return `Node.js ${process.version}`;
  }
}

/**
 * Template Field for Bot Status, deconstruct this in `.addFields()` method
 *
 * You can pass your string to override any field name
 * Or pass `inline: false` to make all fields block
 */
export async function getStatusFields(
  ctx: CommandInteraction | Message,
  overrideDefault?: GetStatusFieldsOption,
): Promise<APIEmbedField[]> {
  const {
    botMemory,
    botUptime,
    inline = true,
    runningOn,
    systemMemory,
    systemUptime,
    temperature,
  } = overrideDefault ?? {};

  const temp = await getTemp();
  const tempStr = temp ? `${temp} °C` : "Unknown";
  const ram = await getRAM();

  return [
    {
      name: runningOn ?? "Running On",
      value: `${process.platform} ${process.arch}, ${getRuntimeVersion()}`,
      inline,
    },
    {
      name: "Websocket Ping",
      value: `${ctx.client.ws.ping}ms`,
      inline,
    },
    {
      name: temperature ?? "Temperature",
      value: tempStr,
      inline,
    },
    {
      name: systemMemory ?? "System Memory",
      value: `${ram ? `${ram[0]}/${ram[1]} MB` : "Unknown"}`,
      inline,
    },
    {
      name: botMemory ?? "Bot Memory Usage",
      value: `${Math.round(process.memoryUsage().rss / 1e3) / 1000} MB`,
      inline,
    },
    {
      name: systemUptime ?? "System Uptime",
      value: `${(await getLinuxUptime()) ?? "Unknown"}`,
      inline,
    },
    {
      name: botUptime ?? "Process Uptime",
      value: `${parseTime(process.uptime() * 1000)}`,
      inline,
    },
  ];
}
