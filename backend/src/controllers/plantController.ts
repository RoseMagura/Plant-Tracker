import { Request, Response } from "express";
import { PlantRepository } from "../repositories/PlantRepository";

const plantRepo = new PlantRepository();

export class PlantController {
  // GET /api/plants
  async getAllPlants(req: Request, res: Response): Promise<void> {
    try {
      const plants = await plantRepo.findAll();
      res.status(200).json(plants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plants" });
    }
  }

  // POST /api/plants
  async createPlant(req: Request, res: Response): Promise<void> {
    try {
      const { name, species, wateringIntervalDays, lastWateredDate } = req.body;

      const lastWatered = lastWateredDate
        ? new Date(lastWateredDate)
        : new Date();
      const nextWateringDate = new Date(lastWatered);
      nextWateringDate.setDate(
        nextWateringDate.getDate() + (wateringIntervalDays || 7),
      );

      const newPlant = await plantRepo.create({
        name,
        species,
        wateringIntervalDays,
        lastWateredDate: lastWatered,
        nextWateringDate,
        wateringHistory: [{ date: lastWatered, notes: "Initial creation" }],
      });

      res.status(201).json(newPlant);
    } catch (error) {
      res.status(400).json({ error: "Failed to create plant" });
    }
  }

  // POST /api/plants/:id/water
  async recordWatering(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { notes } = req.body || {}; // Safe fallback if body is undefined

      // Ensure id is a single string and not an array
      const plantId = Array.isArray(id) ? id[0] : id;

      if (!plantId) {
        res.status(400).json({ error: "Invalid plant ID provided" });
        return;
      }

      const plant = await plantRepo.findById(plantId);
      if (!plant) {
        res.status(404).json({ error: "Plant not found" });
        return;
      }

      const now = new Date();
      const nextWateringDate = new Date(now);
      nextWateringDate.setDate(
        nextWateringDate.getDate() + plant.wateringIntervalDays,
      );

      const updatedPlant = await plantRepo.recordWatering(
        plantId,
        { date: now, notes: notes || "Watered plant" },
        nextWateringDate,
      );

      res.status(200).json(updatedPlant);
    } catch (error) {
      res.status(500).json({ error: "Failed to record watering event" });
    }
  }

  // DELETE /api/plants/:id
  async deletePlant(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      // Ensure id is a single string and not an array
      const plantId = Array.isArray(id) ? id[0] : id;

      if (!plantId) {
        res.status(400).json({ error: "Invalid plant ID provided" });
        return;
      }

      const deleted = await plantRepo.delete(plantId);

      if (!deleted) {
        res.status(404).json({ error: "Plant not found" });
        return;
      }

      res.status(200).json({ message: "Plant deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete plant" });
    }
  }
}
