/* eslint-disable @typescript-eslint/no-unused-vars */
import express from "express";
import type { Request, Response } from "express";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import dogRoutes from "../routes/dogRoutes";
import { getDogImage } from "../controllers/dogController";

vi.mock("../controllers/dogController", () => ({
    getDogImage: vi.fn(),
}));

// Positive tests (Test 4)
describe("Positive tests", () => {
    const mockedControllerResponse = {
        success: true,
        data: {
            imageUrl: "https://images.dog.ceo/breeds/stbernard/n02109525_15579.jpg",
            status: "success",
        },
    };

    let server: ReturnType<express.Express["listen"]>;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(async () => {
        await new Promise<void>((resolve, reject) => {
            if (!server) {
                resolve();
                return;
            }

            server.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    });

    it("Returns with status 200 and JSON with success true and mocked image url", async () => {
        vi.mocked(getDogImage).mockImplementation(async (_req: Request, res: Response) => {
            res.status(200).json(mockedControllerResponse);
        });

        const app = express();
        app.use("/api/dogs", dogRoutes);

        server = app.listen(0);

        const address = server.address();

        // Just in case :)
        if (address === null || typeof address === "string") {
            throw new Error("Failed to determine test server port");
        }

        const response = await fetch(`http://127.0.0.1:${address.port}/api/dogs/random`);
        const body = (await response.json()) as typeof mockedControllerResponse;

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.data.imageUrl).toContain(mockedControllerResponse.data.imageUrl);
    });
});

// Negative tests (Test 5)
describe("Negative tests", () => {
    const mockedErrorResponse = {
        success: false,
        error: "Failed to fetch dog image: Network error",
    };

    let server: ReturnType<express.Express["listen"]>;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(async () => {
        await new Promise<void>((resolve, reject) => {
            if (!server) {
                resolve();
                return;
            }

            server.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    });

    it("Returns with status 500 and error JSON", async () => {
        vi.mocked(getDogImage).mockImplementation(async (_req: Request, res: Response) => {
            res.status(500).json(mockedErrorResponse);
        });

        const app = express();
        app.use("/api/dogs", dogRoutes);

        server = app.listen(0);

        const address = server.address();

        // Just in case :)
        if (address === null || typeof address === "string") {
            throw new Error("Failed to determine test server port");
        }

        const response = await fetch(`http://127.0.0.1:${address.port}/api/dogs/random`);
        const body = (await response.json()) as typeof mockedErrorResponse;

        expect(response.status).toBe(500);
        expect(body.success).toBe(false);
        expect(body.error).toBe(mockedErrorResponse.error);
    });
})
