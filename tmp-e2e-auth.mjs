import puppeteer from "puppeteer-core";

const BASE = "http://localhost:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const email = `utsho.e2e.${Date.now()}@example.com`;
const password = "Passw0rd";

const results = [];
const check = (label, ok, extra = "") => {
  results.push({ label, ok, extra });
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${extra ? ` :: ${extra}` : ""}`);
};

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error" && !m.text().includes("401")) pageErrors.push(m.text());
});

async function goto(path) {
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
  await sleep(1200);
}

async function bodyText() {
  return page.evaluate(() => document.body.innerText);
}

async function toasts() {
  return page.$$eval("[data-sonner-toast]", (n) => n.map((x) => x.innerText.trim()));
}

try {
  // 1. Anonymous private route -> login with redirect param
  await goto("/events/create");
  check("anon /events/create redirects to /login", page.url().includes("/login"), page.url());

  // 2. Register page renders
  await goto("/register");
  check("register heading", (await bodyText()).includes("One account, every drive in your city."));
  const socialLabels = await page.$$eval("button", (n) => n.map((x) => x.innerText.trim().toLowerCase()));
  check(
    "google + github buttons",
    socialLabels.some((t) => t.includes("google")) && socialLabels.some((t) => t.includes("github")),
    socialLabels.join(","),
  );

  // 3. Weak password blocked client-side
  await page.type("#register-name", "E2E Volunteer");
  await page.type("#register-email", email);
  await page.type("#register-password", "abc");
  await page.click('button[type="submit"]');
  await sleep(600);
  let alerts = await page.$$eval('[role="alert"]', (n) => n.map((x) => x.innerText.trim()));
  check("weak password inline error", alerts.some((t) => t.includes("at least 6 characters")), alerts.join(" | "));
  check("weak password toast", (await toasts()).some((t) => t.includes("uppercase")), (await toasts()).join(" | "));
  check("weak password not submitted (still /register)", page.url().includes("/register"));

  // 4. Valid signup
  await page.click("#register-password");
  await page.keyboard.down("Control");
  await page.keyboard.press("KeyA");
  await page.keyboard.up("Control");
  await page.keyboard.press("Backspace");
  await page.type("#register-password", password);
  await page.click('button[type="submit"]');
  await page.waitForFunction(() => location.pathname !== "/register", { timeout: 30000 });
  const afterSignup = page.url();
  check("signup redirects away from /register", afterSignup.includes("/events"), afterSignup);
  check("signup success toast", (await toasts()).some((t) => t.includes("Welcome to Utsho")), (await toasts()).join(" | "));
  check("navbar shows Logout after signup", (await bodyText()).includes("Logout"));

  // 5. Reload a private route while logged in
  await goto("/events/create");
  check("logged-in reload of /events/create stays", page.url().includes("/events/create"), page.url());

  // 6. Session survives a fresh tab (cookie persisted)
  const page2 = await browser.newPage();
  await page2.goto(`${BASE}/events/joined`, { waitUntil: "domcontentloaded" });
  await sleep(1500);
  check("new tab session on /events/joined", page2.url().includes("/events/joined"), page2.url());
  await page2.close();

  // 7. Logout
  const clicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) => b.innerText.trim() === "Logout");
    if (btn) btn.click();
    return Boolean(btn);
  });
  check("logout button visible", clicked);
  await page.waitForFunction(() => location.pathname === "/", { timeout: 30000 });
  check("logout redirects home", page.url().endsWith("/"), page.url());
  check("logout clears session", !(await bodyText()).includes("Logout"), page.url());

  // 8. Private route anonymous again
  await goto("/events/create");
  check("anon after logout redirected to /login", page.url().includes("/login"), page.url());

  // 9. Login with the registered account
  await page.type("#login-email", email);
  await page.type("#login-password", password);
  await page.click('button[type="submit"]');
  await page.waitForFunction(() => location.pathname !== "/login", { timeout: 30000 });
  check("login redirects to /events", page.url().includes("/events"), page.url());
  check("login success toast", (await toasts()).some((t) => t.includes("Welcome back")), (await toasts()).join(" | "));

  // 10. Wrong password error
  await goto("/login");
  await page.type("#login-email", email);
  await page.type("#login-password", "Wrongpass1");
  await page.click('button[type="submit"]');
  await sleep(3000);
  alerts = await page.$$eval('[role="alert"]', (n) => n.map((x) => x.innerText.trim()));
  check("wrong password error", alerts.length > 0, alerts.join(" | "));
  check("wrong password stays on /login", page.url().includes("/login"));

  console.log("EMAIL_USED:", email);
  const failures = results.filter((r) => !r.ok);
  console.log(`SUMMARY: ${results.length - failures.length}/${results.length} passed`);
  console.log("PAGE_ERRORS:", JSON.stringify(pageErrors.slice(0, 10)));
  if (failures.length) process.exitCode = 1;
} catch (error) {
  console.log("E2E_ERROR:", error.message);
  console.log("URL_AT_ERROR:", page.url());
  console.log("BODY:", (await bodyText().catch(() => "")).slice(0, 800));
  console.log("PAGE_ERRORS:", JSON.stringify(pageErrors.slice(0, 10)));
  process.exitCode = 1;
} finally {
  await browser.close();
}
