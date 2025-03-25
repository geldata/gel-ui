import {test as base, Locator} from "@playwright/test";
import {Client, createClient} from "edgedb";

type Fixtures = {
  gelClient: Client;
  uiClass: (className: string) => Locator;
  mockClipboard: {
    getClipboardData: () => string;
  };
};

export const test = base.extend<Fixtures>({
  gelClient: ({}, use) => {
    use(createClient({port: 5656, tlsSecurity: "insecure", branch: "_test"}));
  },
  uiClass: ({page}, use) => {
    use((className: string) => page.locator(`[class*=${className}__]`));
  },
  mockClipboard: async ({page}, use) => {
    let clipboardData = "";
    await page.exposeFunction(
      "_mockClipboardWrite",
      (data: string) => (clipboardData = data)
    );
    await page.addInitScript(() => {
      // create a mock of the clipboard API
      const mockClipboard = {
        clipboardData: "",
        writeText: async (text: string) => {
          mockClipboard.clipboardData = text;
          // @ts-expect-error
          _mockClipboardWrite(text);
        },
        readText: async () => mockClipboard.clipboardData,
      };

      // override the native clipboard API
      Object.defineProperty(navigator, "clipboard", {
        value: mockClipboard,
        writable: false,
        enumerable: true,
        configurable: true,
      });
    });

    await use({
      getClipboardData() {
        return clipboardData;
      },
    });
  },
});
