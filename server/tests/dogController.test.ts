/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Request, Response } from "express";
import { getDogImage } from "../controllers/dogController";
import { getRandomDogImage } from "../services/dogService";

// Mock getRandomDogImage; we don't care about the function running, just the mocked value
vi.mock("../services/dogService", () => ({
    getRandomDogImage: vi.fn()
}));

// Positive tests (Test 3)
describe("Positive tests", () => {
    const mockedApiResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
            imageUrl: "https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg",
            status: "success"
        })
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("Returns with success true and mocked JSON", async () => {
        const mockedApiResponseJson = await mockedApiResponse.json();

        vi.mocked(getRandomDogImage).mockResolvedValue(mockedApiResponseJson);

        const json = vi.fn();
        const controllerResponse = { json } as unknown as Response;

        await getDogImage({} as Request, controllerResponse);

        expect(json).toHaveBeenCalledWith({
            success: true,
            data: mockedApiResponseJson
        });
    });
});
