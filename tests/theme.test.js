import test from "node:test";
import assert from "node:assert/strict";

const theme = await import("../theme.js");

function createRoot() {
  const properties = {};
  return {
    dataset: {},
    style: {
      colorScheme: "",
      setProperty(name, value) {
        properties[name] = value;
      },
      removeProperty(name) {
        if (name === "color-scheme") {
          this.colorScheme = "";
          return;
        }

        delete properties[name];
      }
    },
    removeAttribute(name) {
      if (name === "data-theme") {
        delete this.dataset.theme;
      }

      if (name === "data-theme-mode") {
        delete this.dataset.themeMode;
      }
    }
  };
}

test("normalizeTheme keeps only supported values", () => {
  assert.equal(theme.normalizeTheme("griffin"), theme.THEME_IDS.GRIFFIN);
  assert.equal(theme.normalizeTheme("cobalt"), theme.THEME_IDS.COBALT);
  assert.equal(theme.normalizeTheme("custom"), theme.THEME_IDS.GRIFFIN);
  assert.equal(theme.normalizeTheme(undefined), theme.THEME_IDS.GRIFFIN);
});

test("normalizeThemeMode keeps only supported values", () => {
  assert.equal(theme.normalizeThemeMode("light"), theme.THEME_MODES.LIGHT);
  assert.equal(theme.normalizeThemeMode("dark"), theme.THEME_MODES.DARK);
  assert.equal(theme.normalizeThemeMode("system"), theme.THEME_MODES.SYSTEM);
  assert.equal(theme.normalizeThemeMode("custom"), theme.THEME_MODES.SYSTEM);
  assert.equal(theme.normalizeThemeMode(undefined), theme.THEME_MODES.SYSTEM);
});

test("applyDocumentTheme sets and clears the root theme contract", () => {
  const root = createRoot();

  assert.deepEqual(
    theme.applyDocumentTheme({ theme: "griffin", themeMode: "light" }, root),
    {
      theme: "griffin",
      themeMode: "light"
    }
  );
  assert.equal(root.dataset.theme, "griffin");
  assert.equal(root.dataset.themeMode, "light");
  assert.equal(root.style.colorScheme, "light");

  assert.deepEqual(
    theme.applyDocumentTheme({ theme: "griffin", themeMode: "dark" }, root),
    {
      theme: "griffin",
      themeMode: "dark"
    }
  );
  assert.equal(root.dataset.theme, "griffin");
  assert.equal(root.dataset.themeMode, "dark");
  assert.equal(root.style.colorScheme, "dark");

  assert.deepEqual(
    theme.applyDocumentTheme({ theme: "griffin", themeMode: "system" }, root),
    {
      theme: "griffin",
      themeMode: "system"
    }
  );
  assert.equal(root.dataset.theme, "griffin");
  assert.equal(root.dataset.themeMode, undefined);
  assert.equal(root.style.colorScheme, "");
});

test("applyDocumentTheme sets named custom themes without a theme mode attribute", () => {
  const root = createRoot();

  assert.deepEqual(
    theme.applyDocumentTheme({ theme: "cobalt", themeMode: "light" }, root),
    {
      theme: "cobalt",
      themeMode: "light"
    }
  );
  assert.equal(root.dataset.theme, "cobalt");
  assert.equal(root.dataset.themeMode, undefined);
  assert.equal(root.style.colorScheme, "dark");
});
