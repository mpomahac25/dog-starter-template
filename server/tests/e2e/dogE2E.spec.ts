/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { test, expect } from '@playwright/test';

const apiRoute: string = "**/api/dogs/random";

test.describe("Positive E2E Tests", () => {
    // Dog image fetched successfully on loading web page (Test 3)
    test("Loading http://localhost:5173 successfully loads and displays dog image", async ({ page }) => {
        const responsePromise = page.waitForResponse(apiRoute);

        await page.goto("/");

        await responsePromise;

        // <img src={dogImage} alt="Random dog" className="dog-image" />
        const dogImageElement = page.getByAltText("Random dog");

        await expect(dogImageElement).toBeVisible();
        await expect(dogImageElement).toHaveAttribute("src");
        await expect(dogImageElement).toHaveAttribute("src", /^https:\/\//);
    });

    // Dog image fetched successfully on button click (Test 4)
    test("Clicking on button fetches new dog image", async ({ page }) => {
        await page.goto("/");

        // Wait for page to finish loading first
        await page.waitForResponse(apiRoute);

        const promiseResponse = page.waitForResponse(apiRoute);

        // {loading ? 'Loading...' : 'Get Another Dog'}
        await page.getByRole("button", { name: "Get Another Dog" }).click();
        await promiseResponse;

        // <img src={dogImage} alt="Random dog" className="dog-image" />
        const dogImageElement = page.getByAltText("Random dog");

        await expect(dogImageElement).toBeVisible();
        await expect(dogImageElement).toHaveAttribute("src");
        await expect(dogImageElement).toHaveAttribute("src", /^https:\/\//);
    });
});

test.describe("Negative E2E Tests", () => {
    // Error when API fails (Test 5)
    test("Aborting API route call results in error message", async ({ page }) => {
        await page.route(apiRoute, route => route.abort());

        await page.goto("/");

        // <p>Error: {error}</p>
        const errorElement = page.getByText(/^Error:/);

        await expect(errorElement).toBeVisible();
    });
});
