export function messageTemplate(name: string) {
  return `import { CocoaMessage } from "cocoa-discord-utils/message";

export const ${name}: CocoaMessage = {
    command: {
        name: "${name}",
        description: "",
    },
    func: async (msg, strp) => {

    },
};
`;
}
