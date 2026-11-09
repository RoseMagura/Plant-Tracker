import { Request, Response } from "express";
import { PlantController } from "../plantController";
import { PlantRepository } from "../../repositories/PlantRepository";

// Mock the PlantRepository module
jest.mock("../../repositories/PlantRepository");

describe("PlantController", () => {
  let plantController: PlantController;
  let mockPlantRepo: jest.Mocked<PlantRepository>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    plantController = new PlantController();
    // Clear all mock instances and calls before each test
    jest.clearAllMocks();
    mockPlantRepo = new PlantRepository() as jest.Mocked<PlantRepository>;

    // Setup mock Express response object
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("getAllPlants", () => {
    it("should return 200 and a list of plants on success", async () => {
      const mockPlants = [{ name: "Monstera", species: "Deliciosa" }];
      (PlantRepository.prototype.findAll as jest.Mock).mockResolvedValue(
        mockPlants,
      );

      mockReq = {};

      await plantController.getAllPlants(
        mockReq as Request,
        mockRes as Response,
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPlants);
    });

    it("should return 500 when repository throws an error", async () => {
      (PlantRepository.prototype.findAll as jest.Mock).mockRejectedValue(
        new Error("DB Error"),
      );

      mockReq = {};

      await plantController.getAllPlants(
        mockReq as Request,
        mockRes as Response,
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to fetch plants",
      });
    });
  });

  describe("createPlant", () => {
    it("should return 201 and the created plant on success", async () => {
      const newPlantInput = {
        name: "Pothos",
        species: "Epipremnum aureum",
        wateringIntervalDays: 7,
      };
      const createdPlant = { ...newPlantInput, _id: "123" };

      (PlantRepository.prototype.create as jest.Mock).mockResolvedValue(
        createdPlant,
      );

      mockReq = { body: newPlantInput };

      await plantController.createPlant(
        mockReq as Request,
        mockRes as Response,
      );

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Pothos" }),
      );
    });

    it("should return 400 when creation fails", async () => {
      (PlantRepository.prototype.create as jest.Mock).mockRejectedValue(
        new Error("Validation Error"),
      );

      mockReq = { body: {} };

      await plantController.createPlant(
        mockReq as Request,
        mockRes as Response,
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to create plant",
      });
    });
  });

  describe("recordWatering", () => {
    it("should return 200 when plant is successfully watered", async () => {
      const existingPlant = { _id: "123", wateringIntervalDays: 5 };
      const updatedPlant = { _id: "123", lastWateredDate: new Date() };

      (PlantRepository.prototype.findById as jest.Mock).mockResolvedValue(
        existingPlant,
      );
      (PlantRepository.prototype.recordWatering as jest.Mock).mockResolvedValue(
        updatedPlant,
      );

      mockReq = {
        params: { id: "123" },
        body: { notes: "Thirsty" },
      };

      await plantController.recordWatering(
        mockReq as Request,
        mockRes as Response,
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedPlant);
    });

    it("should return 404 if plant is not found", async () => {
      (PlantRepository.prototype.findById as jest.Mock).mockResolvedValue(null);

      mockReq = { params: { id: "999" } };

      await plantController.recordWatering(
        mockReq as Request,
        mockRes as Response,
      );

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Plant not found" });
    });
  });
});
