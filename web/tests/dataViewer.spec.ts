import {test, expect} from "../playwright";

test.describe("Account", () => {
  test.describe.configure({mode: "serial"});

  test.beforeEach(async ({page, uiClass}) => {
    await page.goto("_test/data/default::Account");

    await expect(uiClass("dataview_rowCount")).not.toContainText("loading");
  });

  test("insert new Account", async ({page, uiClass}) => {
    const itemsCountEl = uiClass("dataview_rowCount");
    const initialItemsCount = parseInt(
      (await itemsCountEl.textContent())!,
      10
    );

    // click insert button
    await page.getByRole("button", {name: "insert"}).click();

    // enter new username
    const usernameField = uiClass("dataInspector_editableCell").and(
      uiClass("dataInspector_hasErrors")
    );
    await usernameField.dblclick();

    const usernameInput = uiClass("dataEditor_dataEditor").locator("textarea");
    await usernameInput.fill("Test Account");
    await usernameInput.press("ControlOrMeta+Enter");

    // apply changes
    await uiClass("dataview_reviewChanges").click();
    await page.getByRole("button", {name: "commit changes"}).click();

    // wait for data refresh
    await expect(uiClass("modal_modalOverlay")).toBeHidden();

    const newItemsCount = parseInt((await itemsCountEl.textContent())!, 10);
    expect(newItemsCount).toBe(initialItemsCount + 1);
  });

  test("delete an Account", async ({page, uiClass}) => {
    const itemsCountEl = uiClass("dataview_rowCount");
    const initialItemsCount = parseInt(
      (await itemsCountEl.textContent())!,
      10
    );

    const firstAccountUsername = await uiClass("dataInspector_editableCell")
      .first()
      .textContent();
    expect(firstAccountUsername).not.toBeNull();

    // delete first account
    await uiClass("dataInspector_rowIndex")
      .first()
      .locator(uiClass("dataInspector_deleteRowAction"))
      .click();

    // apply changes
    await uiClass("dataview_reviewChanges").click();
    await page.getByRole("button", {name: "commit changes"}).click();

    // wait for data refresh
    await expect(uiClass("modal_modalOverlay")).toBeHidden();

    const newItemsCount = parseInt((await itemsCountEl.textContent())!, 10);
    expect(newItemsCount).toBe(initialItemsCount - 1);

    // assert that first account name is removed from the list
    expect(
      await uiClass("dataInspector_editableCell").allTextContents()
    ).not.toContain(firstAccountUsername);
  });
});

test.describe("Movie", () => {
  test.describe.configure({mode: "serial"});

  test.beforeEach(async ({page, uiClass}) => {
    await page.goto("_test/data/default::Movie");

    await expect(uiClass("dataview_rowCount")).not.toContainText("loading");
  });

  test("filter all movies that includes the specific actor and then clear the filter", async ({
    page,
    uiClass,
  }) => {
    const itemsCountEl = uiClass("dataview_rowCount");
    const initialItemsCount = await itemsCountEl.textContent();

    // click the filter button and open the textarea
    await uiClass("dataview_filterButton").click();

    await page.locator(".cm-activeLine").fill(`.actors.name='Chris Evans'`);

    // apply the filter
    await uiClass("dataview_applyFilterButton").click();

    // wait for rerender to finish
    await expect(itemsCountEl).not.toContainText(initialItemsCount!);
    await expect(itemsCountEl).not.toContainText("loading");

    const filteredElementsCount = await itemsCountEl.textContent();
    expect(filteredElementsCount).not.toBeNull();
    expect(parseInt(filteredElementsCount!, 10)).toBeLessThan(
      parseInt(initialItemsCount!, 10)
    );

    // clear the filter
    await uiClass("dataview_clearFilterButton").click();

    // wait for rerender to finish
    await expect(itemsCountEl).not.toContainText(filteredElementsCount!);
    await expect(itemsCountEl).not.toContainText("loading");

    const newItemsCount = await itemsCountEl.textContent();
    expect(newItemsCount).toBe(initialItemsCount);
  });
});
