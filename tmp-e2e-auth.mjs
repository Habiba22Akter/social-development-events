import puppeteer from "puppeteer-core";

const BASE = "http://localhost:3000";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
const consoleErrors = [];

page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => consoleErrors.push(`PAGEERROR: ${error.message}`));

const email = `e2e.${Date.now()}@example.com`;

try {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle0" });
  console.log("LOGIN_HEADING:", await page.$eval("h1", (el) => el.textContent.trim()));

  await page.goto(`${BASE}/register`, { waitUntil: "networkidle0" });
  await page.type("#register-name", "E2E Volunteer");
  await page.type("#register-email", email);
  await page.type("#register-password", "abc");
  await page.click('button[type="submit"]');
  await sleep(900);
  console.log(
    "VALIDATION_ERRORS:",
    await page.$$eval('[role="alert"]', (nodes) =>
      nodes.map((node) => node.textContent.trim()).join(" | "),
    ),
  );

  await page.click("#register-password");
  await page.keyboard.down("Control");
  await page.keyboard.press("KeyA");
  await page.keyboard.up("Control");
  await page.keyboard.press("Backspace");
  await page.type("#register-password", "Passw0rd");
  await page.click('button[type="submit"]');

  await page.waitForFunction(() => location.pathname === "/events", {
    timeout: 25000,
  });
  console.log("AFTER_SIGNUP_URL:", page.url());

  await page.waitForFunction(
    () => document.body.innerText.includes("Logout"),
    { timeout: 25000 },
  );
  console.log("NAVBAR_LOGOUT_AFTER_SIGNUP: true");

  await page.goto(`${BASE}/events/create`, { waitUntil: "networkidle0" });
  await sleep(2500);
  console.log("PRIVATE_RELOAD_URL:", page.url());
  console.log(
    "PROTECTED_CONTENT:",
    await page.$eval("body", (el) =>
      el.innerText.includes("Put your neighbourhood on the map"),
    ),
  );

  const buttons = await page.$$("button");
  for (const button of buttons) {
    const text = await button.evaluate((el) => el.textContent.trim());
    if (text === "Logout") {
      await button.click();
      break;
    }
  }

  await page.waitForFunction(() => location.pathname === "/", {
    timeout: 25000,
  });
  console.log("AFTER_LOGOUT_URL:", page.url());

  await page.goto(`${BASE}/events/create`, { waitUntil: "networkidle0" });
  await sleep(1200);
  console.log("ANON_PRIVATE_URL:", page.url());

  await page.goto(`${BASE}/login`, { waitUntil: "networkidle0" });
  await page.type("#login-email", email);
  await page.type("#login-password", "Passw0rd");
  await page.click('button[type="submit"]');

  await page.waitForFunction(() => location.pathname === "/events", {
    timeout: 25000,
  });
  await page.waitForFunction(
    () => document.body.innerText.includes("Logout"),
    { timeout: 25000 },
  );
  console.log("AFTER_LOGIN_URL:", page.url());
  console.log("LOGIN_NAVBAR_LOGOUT: true");

  console.log("CONSOLE_ERRORS:", JSON.stringify(consoleErrors));
} finally {
  await browser.close();
}
