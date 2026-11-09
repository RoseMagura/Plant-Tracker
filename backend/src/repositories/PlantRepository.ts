import { PlantModel, IPlant, IWateringLog } from "../models/Plant";

export class PlantRepository {
  // Fetch all plants, sorted by upcoming watering date
  async findAll(): Promise<IPlant[]> {
    return PlantModel.find().sort({ nextWateringDate: 1 });
  }

  // Find a single plant by ID
  async findById(id: string): Promise<IPlant | null> {
    return PlantModel.findById(id);
  }

  // Create a new plant document
  async create(plantData: Partial<IPlant>): Promise<IPlant> {
    return PlantModel.create(plantData);
  }

  // Update general plant details
  async update(
    id: string,
    updateData: Partial<IPlant>,
  ): Promise<IPlant | null> {
    return PlantModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  // Delete a plant
  async delete(id: string): Promise<IPlant | null> {
    return PlantModel.findByIdAndDelete(id);
  }

  // Custom method: Water a plant (pushes to embedded history & updates care dates)
  async recordWatering(
    id: string,
    wateringLog: IWateringLog,
    nextWateringDate: Date,
  ): Promise<IPlant | null> {
    return PlantModel.findByIdAndUpdate(
      id,
      {
        $set: {
          lastWateredDate: wateringLog.date,
          nextWateringDate,
        },
        $push: { wateringHistory: wateringLog },
      },
      { new: true, runValidators: true },
    );
  }
}
