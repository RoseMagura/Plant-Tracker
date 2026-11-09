import { Router } from "express";
import { PlantController } from "../controllers/plantController";

const router = Router();
const controller = new PlantController();

router.get("/", (req, res) => controller.getAllPlants(req, res));
router.post("/", (req, res) => controller.createPlant(req, res));
router.post("/:id/water", (req, res) => controller.recordWatering(req, res));
router.delete("/:id", (req, res) => controller.deletePlant(req, res));

export default router;
