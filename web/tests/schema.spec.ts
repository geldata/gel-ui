import {test, expect} from "../playwright";

const getTypeName = (header: string) => {
  const secondPart = header.substring(header.indexOf("type") + 5);
  const emptySpaceIndex = secondPart.indexOf(" ");
  return secondPart.substring(0, emptySpaceIndex);
};

test.describe("schema", () => {
  test.beforeEach(async ({page}) => {
    await page.goto("_test/schema");
  });

  test("check basic UI", async ({uiClass}) => {
    const filterControls = uiClass("textView_filterControls");
    const filters = uiClass("textView_filterSelect");

    // 2 filter dropdowns rendered
    await expect(filters).toHaveCount(2);

    // there is search input rendered
    await expect(
      filterControls.locator("//input[@placeholder='search...']")
    ).toBeVisible();

    // search filter with expected options
    await expect(
      filters.first().locator(uiClass("textView_filterSelectName"))
    ).toHaveText("Schema");

    const schemaOptions = filters
      .first()
      .locator(uiClass("select_tabDropdown"));
    const schemaDropdownItems = schemaOptions.locator(
      uiClass("textView_selectItem")
    );

    await expect(schemaDropdownItems).toHaveCount(3);

    // types filter with expected options
    await expect(
      filters.nth(1).locator(uiClass("textView_filterSelectName"))
    ).toHaveText("Types");

    const typesOptions = filters.nth(1).locator(uiClass("select_tabDropdown"));
    const typesDropdownItems = typesOptions.locator(
      uiClass("select_dropdownItem")
    );

    await expect(typesDropdownItems).toHaveCount(7);
  });

  test("'show in graph' button change focus inside graph", async ({
    uiClass,
  }) => {
    // find second type (first one is already selected in the graph)
    const typesItems = uiClass("textView_typeItem");

    const typeHeaderText = await typesItems
      .nth(1)
      .locator(uiClass("textView_copyHighlight"))
      .first()
      .textContent();

    await expect(typeHeaderText).not.toBeNull();
    const typeName = getTypeName(typeHeaderText!);

    // click show in graph button
    await typesItems
      .nth(1)
      .locator(uiClass("textView_showInGraphButton"))
      .click();

    // find and check selected node in the graph window
    const selectedNode = uiClass("schemaGraph_selectedNode");

    await expect(
      selectedNode.locator(uiClass("schemaGraph_header"))
    ).toHaveText(typeName);
  });
});
