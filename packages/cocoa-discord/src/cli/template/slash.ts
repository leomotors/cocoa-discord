export function slashTemplate(name: string) {
  return `import { CocoaSlash } from "cocoa-discord/slash";
import { CocoaBuilder } from "cocoa-discord/template";

export const ${name}: CocoaSlash = {
    command: CocoaBuilder("${name}").toJSON(),
    func: async (ctx) => {

    },
};
`;
}
