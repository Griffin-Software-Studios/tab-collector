import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");
const resultsPath = path.join(repoRoot, "tests", "manual", "edge-release-results.json");

const REQUIRED_PASSING_CHECKS = [
  "options-page",
  "collector-page",
  "collector-theme-selection",
  "collector-tablet-layout",
  "collector-mobile-layout",
  "popup-page"
];

const REQUIRED_SCREENSHOTS = [
  "options",
  "collector",
  "collectorTablet",
  "collectorMobile",
  "popup"
];

async function main() {
  const raw = await readFile(resultsPath, "utf8");
  const results = JSON.parse(raw);
  const checks = new Map((results.checks || []).map((check) => [check.id, check.status]));
  const missingChecks = [];

  for (const checkId of REQUIRED_PASSING_CHECKS) {
    if (checks.get(checkId) !== "passed") {
      missingChecks.push(`${checkId}=${checks.get(checkId) || "missing"}`);
    }
  }

  const missingScreenshots = [];

  for (const screenshotKey of REQUIRED_SCREENSHOTS) {
    const relativePath = results.screenshots?.[screenshotKey];
    if (!relativePath) {
      missingScreenshots.push(`${screenshotKey}=missing-path`);
      continue;
    }

    const absolutePath = path.join(repoRoot, relativePath);
    try {
      await access(absolutePath);
    } catch {
      missingScreenshots.push(`${screenshotKey}=${relativePath}`);
    }
  }

  if (missingChecks.length || missingScreenshots.length) {
    const problems = [];
    if (missingChecks.length) {
      problems.push(`Checks not passing: ${missingChecks.join(", ")}`);
    }
    if (missingScreenshots.length) {
      problems.push(`Screenshots missing: ${missingScreenshots.join(", ")}`);
    }
    throw new Error(problems.join(" | "));
  }

  console.log(
    `Edge evidence verification passed for ${REQUIRED_PASSING_CHECKS.length} checks and ${REQUIRED_SCREENSHOTS.length} screenshots.`
  );
}

await main();
