/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { test, expect, APIRequestContext } from '@playwright/test';

// Following https://playwright.dev/docs/api-testing "Establishing preconditions"
let apiContext: APIRequestContext;

test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
        // Set to 5001 for test due to conflict when having API already running from command prompt
        baseURL: "http://localhost:5001"
    });
});

test.afterAll(async () => {
    await apiContext.dispose();
});

test.describe("Positive API tests", () => {
    // Success expected for /api/dogs/random (Test 1)
    test("GET request to /api/dogs/random succeeds with HTTP status 200 and returns success JSON", async () => {
        const url: string = "/api/dogs/random";
        const apiResponse = await apiContext.get(url);

        const responseJson = await apiResponse.json() as {
            success: boolean;
            data?: {
                imageUrl: string;
                status: string;
            };
        };

        // Validate response: HTTP 200, success true, data and imageUrl defined, imageUrl is string
        expect(apiResponse.status()).toBe(200);
        expect(responseJson.success).toBe(true);
        expect(responseJson.data).toBeDefined();
        expect(responseJson.data?.imageUrl).toBeDefined();
        expect(typeof responseJson.data?.imageUrl).toBe("string");
    });
});

test.describe("Negative API tests", () => {
    // Error response expected for invalid url, e.g. /api/dogs/invalid (Test 2)
    test("GET request to invalid url fails with HTTP status 404 and returns failure JSON", async () => {
        const url: string = "/api/dogs/invalid";
        const apiResponse = await apiContext.get(url);

        const responseJson = await apiResponse.json() as {
            success: boolean,
            error?: string
        };

        // Validate response: HTTP 404, success false, has error message, error message "Route not found"
        expect(apiResponse.status()).toBe(404);
        expect(responseJson.success).toBe(false);
        expect(responseJson.error).toBeDefined();
        expect(responseJson.error).toBe("Route not found");
    });
});
