export function slashTemplate(name: string) {
    return `import { CocoaSlash } from "cocoa-discord-utils/slash";
import { CocoaBuilder } from "cocoa-discord-utils/template";

export const ${name}: CocoaSlash = {
    command: CocoaBuilder("${name}").toJSON(),
    func: async (ctx) => {

    },
};
`;
}
