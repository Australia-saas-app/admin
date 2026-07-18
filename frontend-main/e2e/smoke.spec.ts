import { test, expect } from "@playwright/test";

test.describe("Public site smoke", () => {
  test("home page loads with brand signal", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/System DB|App/i);
    await expect(page.locator("body")).toBeVisible();
  });

  test("marketplace listing is reachable", async ({ page }) => {
    await page.goto("/marketplace");
    await expect(page.getByRole("heading", { name: /marketplace/i })).toBeVisible();
  });

  test("blogs listing is reachable", async ({ page }) => {
    await page.goto("/blogs");
    await expect(page.getByRole("heading", { name: /blog|news/i }).first()).toBeVisible();
  });

  test("404 page renders for unknown routes", async ({ page }) => {
    const response = await page.goto("/this-route-should-not-exist-xyz");
    expect(response?.status()).toBe(404);
    await expect(page.locator("body")).toContainText(/not found|404/i);
  });

  test("login page is reachable", async ({ page }) => {
    await page.goto("/account/user/login");
    await expect(
      page
        .getByLabel(/email|phone/i)
        .or(page.getByPlaceholder(/email|company/i))
        .first()
    ).toBeVisible();
  });
});
