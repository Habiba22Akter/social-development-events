import puppeteer from "puppeteer-core";

const BASE = "http://localhost:3000";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
const logs = [];

page.on("console", (m) => logs.push(`console.${m.type()}: ${m.text()}`));
page.on("pageerror", (e) => logs.push(`pageerror: ${e.message}`));
page.on("response", async (res) => {
  const url = res.url();
  if (!url.includes("/api/auth/")) return;
  let body = "";
  try {
    body = (await res.text()).slice(0, 400);
  } catch {}
  logs.push(`HTTP ${res.status()} ${res.request().method()} ${url} -> ${body}`);
});

const email = `dbg.${Date.now()}@example.com`;

try {
  await page.goto(`${BASE}/register`, { waitUntil: "networkidle0" });
  await page.type("#register-name", "Debug Volunteer");
  await page.type("#register-email", email);
  await page.type("#register-password", "Passw0rd");
  console.log("VALUES:", await page.evaluate(() => ({
    name: document.querySelector("#register-name").value,
    email: document.querySelector("#register-email").value,
    password: document.querySelector("#register-password").value,
  })));

  await page.click('button[type="submit"]');
  await sleep(6000);

  console.log("URL:", page.url());
  console.log("ALERTS:", await page.$$eval('[role="alert"]', (n) => n.map((x) => x.textContent.trim())));
  console.log("TOASTS:", await page.$$eval("[data-sonner-toast]", (n) => n.map((x) => x.textContent.trim())));
  console.log("BUTTON_TEXT:", await page.$$eval('button[type="submit"]', (n) => n.map((x) => x.textContent.trim())));
  console.log("BODY_START:", (await page.evaluate(() => document.body.innerText)).slice(0, 500));
  console.log("LOGS:\n" + logs.join("\n"));
} finally {
  await browser.close();
}
