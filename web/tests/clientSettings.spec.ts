import {test, expect} from "../playwright";

test.describe("clientSettings", () => {
  test.beforeEach(async ({page, uiClass}) => {
    await page.goto("_test/editor");

    // open client settings bar
    await uiClass("sessionState_stateButton").click();
  });

  test("change implicit limit to 10 and show up to 10 results", async ({
    page,
    uiClass,
  }) => {
    // wait until schema loaded and open panel button available
    await uiClass("sessionState_openPanel").click();

    // set implicit limit to 10
    await uiClass("sessionState_group")
      .nth(2)
      .locator(uiClass("sessionState_item").locator("input"))
      .fill("10");

    // close panel
    await uiClass("sessionState_closePanel").click();

    // run query with >10 results
    const editor = await page.locator(".cm-content");
    await editor.fill(`select range_unpack(range(1, 50))`);
    await editor.press("ControlOrMeta+Enter");

    const results = uiClass("queryeditor_queryResult");
    const resultHiddenNote = results.locator(
      uiClass("inspector_resultsHidden")
    );
    await expect(resultHiddenNote).toContainText("further results hidden");

    // check only 10 results returned
    await expect(
      results.locator(uiClass("inspector_scalar_number"))
    ).toHaveCount(10);
  });

  test(`remove settings and show "no configured settings" in  the client settings' topbar`, async ({
    uiClass,
  }) => {
    // show Implicit Limit := 10 inside client settings' topbar
    const sessionStateElement = uiClass("sessionState_chip");

    const sessionStateElementValue = sessionStateElement.locator(
      uiClass("sessionState_chipVal")
    );

    await expect(sessionStateElement).toContainText("Implicit Limit");
    await expect(sessionStateElementValue).toHaveText("100");

    // open the panel
    await uiClass("sessionState_openPanel").click();

    // remove the implicit limit setting
    await uiClass("sessionState_group")
      .nth(2)
      .locator(
        uiClass("sessionState_item").locator(uiClass("toggleSwitch_track"))
      )
      .click();

    // close panel
    await uiClass("sessionState_closePanel").click();

    const emptySessionElement = uiClass("sessionState_emptySessionBar");

    // show "no configured settings" inside client settings' topbar
    await expect(emptySessionElement).toHaveText("no configured settings");
  });

  test("add a setting and show correct elements in the the client settings' topbar", async ({
    uiClass,
  }) => {
    // open the panel
    await uiClass("sessionState_openPanel").click();

    // add the implicit limit setting
    const implicitLimitSettingElement = uiClass("sessionState_group")
      .nth(2)
      .locator(uiClass("sessionState_item"));

    await implicitLimitSettingElement.locator("input").fill("20");

    // close panel
    await uiClass("sessionState_closePanel").click();

    const sessionStateElement = uiClass("sessionState_chip");

    const sessionStateElementValue = sessionStateElement.locator(
      uiClass("sessionState_chipVal")
    );

    // show Implicit Limit := 20 inside client settings' topbar
    await expect(sessionStateElement).toContainText("Implicit Limit");
    await expect(sessionStateElementValue).toHaveText("20");
  });
});
