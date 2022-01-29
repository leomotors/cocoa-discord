import { APIEmbedField } from "discord-api-types";

import { parseTime } from "../main";
import { getLinuxUptime, getRAM, getTemp } from "../meta";

export interface getStatusFieldsOption {
    inline?: boolean;
    runningOn?: string;
    temperature?: string;
    systemMemory?: string;
    botMemory?: string;
    systemUptime?: string;
    botUptime?: string;
}

/**
 * Template Field for Bot Status, deconstruct this in `.addFields()` method
 *
 * You can pass your string to override any field name
 * Or pass `inline: false` to make all fields block
 */
export async function getStatusFields(
    overrideDefault?: getStatusFieldsOption
): Promise<APIEmbedField[]> {
    const {
        inline = true,
        runningOn,
        temperature,
        systemMemory,
        botMemory,
        systemUptime,
        botUptime,
    } = overrideDefault ?? {};

    let temp: string | number = await getTemp();
    temp = temp == -273 ? "Unknown" : `${temp}`;
    const ram = await getRAM();

    return [
        {
            name: runningOn ?? "Running On",
            value: `${process.platform} ${process.arch}, Node.js ${process.version}`,
            inline: false,
        },
        {
            name: temperature ?? "Temperature",
            value: temp,
            inline,
        },
        {
            name: systemMemory ?? "System Memory",
            value: `${ram[0] > 0 ? `${ram[0]}/${ram[1]} MB` : "Unknown"}`,
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
