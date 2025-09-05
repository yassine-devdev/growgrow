const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const logs = [];

  page.on("console", (msg) => {
    logs.push({
      type: "console." + msg.type(),
      text: msg.text(),
      location: msg.location ? msg.location() : null,
    });
  });

  page.on("pageerror", (err) => {
    logs.push({ type: "pageerror", message: err.message, stack: err.stack });
  });

  page.on("requestfailed", (req) => {
    const f = req.failure ? req.failure() : null;
    logs.push({
      type: "requestfailed",
      url: req.url(),
      failure: f ? f.errorText : null,
    });
  });

  try {
    await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  } catch (e) {
    logs.push({ type: "gotoError", message: e.message });
  }

  // give runtime a moment
  await page.waitForTimeout(2000);

  console.log("---BROWSER-LOGS-START---");
  console.log(JSON.stringify(logs, null, 2));
  console.log("---BROWSER-LOGS-END---");

  await browser.close();
  process.exit(0);
})().catch((e) => {
  console.error("SCRIPT-ERROR", e && e.stack ? e.stack : e);
  process.exit(2);
});
