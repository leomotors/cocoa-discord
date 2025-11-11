import {
  AnySelectMenuInteraction,
  AutocompleteInteraction,
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  ChatInputCommandInteraction,
  Interaction,
  MentionableSelectMenuInteraction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
} from "discord.js";

import { Awaitable } from "./types";

type CreateInteractionHandlerOptions = {
  command?: (interaction: ChatInputCommandInteraction) => Awaitable<boolean>;
  autocomplete?: (interaction: AutocompleteInteraction) => Awaitable<boolean>;
  selectMenu?: {
    string?: (interaction: StringSelectMenuInteraction) => Awaitable<boolean>;
    user?: (interaction: UserSelectMenuInteraction) => Awaitable<boolean>;
    role?: (interaction: RoleSelectMenuInteraction) => Awaitable<boolean>;
    mentionable?: (
      interaction: MentionableSelectMenuInteraction,
    ) => Awaitable<boolean>;
    channel?: (interaction: ChannelSelectMenuInteraction) => Awaitable<boolean>;
    /**
     * Fallback if interaction is not handled by typed select menu handlers
     */
    any?: (interaction: AnySelectMenuInteraction) => Awaitable<boolean>;
  };
  button?: (interaction: ButtonInteraction) => Awaitable<boolean>;
  modalSubmit?: (interaction: ModalSubmitInteraction) => Awaitable<boolean>;
  onUnhandled?: (interaction: Interaction) => Awaitable<boolean>;
  onError?: (error: unknown, interaction: Interaction) => Awaitable<boolean>;
};

export function createInteractionHandler({
  command,
  autocomplete,
  selectMenu,
  button,
  modalSubmit,
  onUnhandled,
  onError,
}: CreateInteractionHandlerOptions) {
  return async (interaction: Interaction) => {
    try {
      if (command && interaction.isChatInputCommand()) {
        if (await command(interaction)) {
          return;
        }
      } else if (autocomplete && interaction.isAutocomplete()) {
        if (await autocomplete(interaction)) {
          return;
        }
      } else if (selectMenu && interaction.isAnySelectMenu()) {
        const { string, user, role, mentionable, channel, any } = selectMenu;

        if (string && interaction.isStringSelectMenu()) {
          if (await string(interaction)) {
            return;
          }
        } else if (user && interaction.isUserSelectMenu()) {
          if (await user(interaction)) {
            return;
          }
        } else if (role && interaction.isRoleSelectMenu()) {
          if (await role(interaction)) {
            return;
          }
        } else if (mentionable && interaction.isMentionableSelectMenu()) {
          if (await mentionable(interaction)) {
            return;
          }
        } else if (channel && interaction.isChannelSelectMenu()) {
          if (await channel(interaction)) {
            return;
          }
        }

        if (any) {
          if (await any(interaction)) {
            return;
          }
        }
      } else if (button && interaction.isButton()) {
        if (await button(interaction)) {
          return;
        }
      } else if (modalSubmit && interaction.isModalSubmit()) {
        if (await modalSubmit(interaction)) {
          return;
        }
      }

      if (onUnhandled) {
        if (await onUnhandled(interaction)) {
          return;
        }
      }
    } catch (error) {
      if (onError) {
        if (await onError(error, interaction)) {
          return;
        }
      } else {
        console.error(`Unhandled interaction error: ${error}`);
      }
    }
  };
}
