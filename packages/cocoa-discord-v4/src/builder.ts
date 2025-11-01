import {
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  SlashCommandStringOption,
} from "discord.js";

export class MyBuilder<
  T extends Record<string, unknown> = Record<never, never>,
> {
  readonly builder: SlashCommandBuilder = new SlashCommandBuilder();

  setName(name: string): MyBuilder<T> {
    this.builder.setName(name);
    return this;
  }

  setDescription(description: string): MyBuilder<T> {
    this.builder.setDescription(description);
    return this;
  }

  addStringOption<N extends string, Req extends boolean = true>(
    name: N,
    {
      description = "",
      option,
      required = true as Req,
    }: {
      description?: string;
      option?: (option: SlashCommandStringOption) => SlashCommandStringOption;
      required?: Req;
    } = {},
  ): MyBuilder<T & Record<N, Req extends true ? string : string | null>> {
    this.builder.addStringOption((o) => {
      if (option) {
        o = option(o);
      }
      o.setName(name).setDescription(description).setRequired(required);
      return o;
    });
    return this;
  }

  addIntegerOption<N extends string, Req extends boolean = true>(
    name: N,
    {
      description = "",
      option,
      required = true as Req,
    }: {
      description?: string;
      option?: (option: SlashCommandIntegerOption) => SlashCommandIntegerOption;
      required?: Req;
    } = {},
  ): MyBuilder<T & Record<N, Req extends true ? number : number | null>> {
    this.builder.addIntegerOption((o) => {
      if (option) {
        o = option(o);
      }
      o.setName(name).setDescription(description).setRequired(required);
      return o;
    });
    return this;
  }

  // choiceOption<N extends string[]>(
  //   name: string,
  //   choices: N,
  // ): MyBuilder<T & Record<string, N[number]>> {
  //   this.builder.addStringOption((option) => {
  //     for (const choice of choices) {
  //       option.addChoices({ name: choice, value: choice });
  //     }
  //     return option.setName(name);
  //   });
  //   return this;
  // }
}
