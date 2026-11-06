import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Local browser runs use a deterministic API fixture. Production runs exercise
  // the deployed API and database end to end.
  if (!process.env.E2E_BASE_URL) {
    await page.route("**/api/products", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: 1, name: "E2E гречишный мёд", price: 3500, category: "Мёд", stock: 5 },
        ]),
      }),
    );
    await page.route("**/api/auth/register", (route) =>
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          user: { id: 1, name: "E2E Покупатель", role: "buyer" },
          token: "e2e-local-token",
        }),
      }),
    );
  }
});

test("каталог загружается с сервера", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/АгроМаркет/i);
  await expect(page.getByTestId("product-card").first()).toBeVisible();
});

test("прямая ссылка на страницу загружается без 404", async ({ page }) => {
  const response = await page.goto("/login");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/АгроМаркет/i);
});

test("покупатель регистрируется и входит", async ({ page }) => {
  const email = `e2e+${Date.now()}@example.com`;
  await page.goto("/");
  await page.getByRole("button", { name: /нет аккаунта/i }).click();
  await page.locator("#login-name").fill("E2E Покупатель");
  await page.locator("#login-email").fill(email);
  await page.locator("#login-password").fill("E2e-Test-Password-123");
  await page.getByRole("button", { name: /зарегистрироваться/i }).click();
  await expect(page.getByRole("button", { name: "Выйти" })).toBeVisible();
  await page.getByTestId("product-card").first().getByRole("button", { name: /в заявку/i }).click();
  await expect(page.getByText(/корзина: 1/i)).toBeVisible();
});
