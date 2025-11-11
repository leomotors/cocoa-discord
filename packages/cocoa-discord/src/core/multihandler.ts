import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from "discord.js";

import { SlashCommandHandler, SupportedCommand } from "./handler";

export class MultiHandler {
  private readonly commandMap: Map<string, SlashCommandHandler>;
  private readonly commands: Array<SupportedCommand>;

  constructor(public readonly handlers: SlashCommandHandler[]) {
    this.commands = [];
    this.commandMap = new Map();

    const seen = new Set<string>();

    for (const handler of handlers) {
      for (const command of handler.getCommands()) {
        if (seen.has(command.name)) {
          throw new Error(`Duplicate command name detected: ${command.name}`);
        }
        seen.add(command.name);

        this.commandMap.set(command.name, handler);
        this.commands.push(command);
      }
    }
  }

  public getCommands() {
    return this.commands;
  }

  public async handleChatInputCommand(
    interaction: ChatInputCommandInteraction,
  ) {
    const handler = this.commandMap.get(interaction.commandName);
    if (!handler) {
      return false;
    }

    return await handler.handleCommandInteraction(interaction);
  }

  public async handleAutocomplete(interaction: AutocompleteInteraction) {
    const handler = this.commandMap.get(interaction.commandName);
    if (!handler) {
      return false;
    }

    return await handler.handleAutocomplete(interaction);
  }
}
