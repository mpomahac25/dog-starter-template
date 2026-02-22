/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getRandomDogImage } from "../services/dogService";

// Positive tests (Test 1)
describe("Positive tests", () => {
    const mockedResponse = {
        "message": "https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg",
        "status": "success"
    };

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("Gets called once and returns url of dog image, when status is \"success\"", async () => {
        const mockedRequest = vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockedResponse
        } as Response);

        const result = await getRandomDogImage();

        expect(result.imageUrl).toBe(mockedResponse.message);
        expect(result.status).toBe(mockedResponse.status);
        expect(mockedRequest).toHaveBeenCalledOnce();
    });
});

// Negative tests (Test 2)
describe("Negative tests", () => {
    const mockedResponse = {
        ok: false,
        status: 500
    };

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("Throws if response is error", async () => {
        const mockedRequest = vi.spyOn(globalThis, "fetch").mockResolvedValue(mockedResponse as Response);

        await expect(getRandomDogImage()).rejects.toThrow(`Failed to fetch dog image: Dog API returned status ${mockedResponse.status}`);
    });
});
