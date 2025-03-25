import {test as base, Locator} from "@playwright/test";
import {Client, createClient} from "edgedb";

type Fixtures = {
  gelClient: Client;
  uiClass: (className: string) => Locator;
};

export const test = base.extend<Fixtures>({
  gelClient: ({}, use) => {
    use(createClient({port: 5656, tlsSecurity: "insecure", branch: "_test"}));
  },
  uiClass: ({page}, use) => {
    use((className: string) => page.locator(`[class*=${className}__]`));
  },
});
