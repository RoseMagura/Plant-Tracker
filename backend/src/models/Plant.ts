import { Schema, model, Document } from "mongoose";

export interface IWateringLog {
  date: Date;
  notes?: string;
}

export interface IPlant extends Document {
  name: string;
  species: string;
  wateringIntervalDays: number;
  lastWateredDate: Date;
  nextWateringDate: Date;
  wateringHistory: IWateringLog[];
  createdAt: Date;
  updatedAt: Date;
}

const wateringLogSchema = new Schema<IWateringLog>({
  date: { type: Date, required: true, default: Date.now },
  notes: { type: String, trim: true },
});

const plantSchema = new Schema<IPlant>(
  {
    name: { type: String, required: true, trim: true },
    species: { type: String, required: true, trim: true },
    wateringIntervalDays: { type: Number, required: true, min: 1 },
    lastWateredDate: { type: Date, required: true, default: Date.now },
    nextWateringDate: { type: Date, required: true },
    wateringHistory: [wateringLogSchema],
  },
  { timestamps: true },
);

// Add an index to optimize queries for upcoming care schedules
plantSchema.index({ nextWateringDate: 1 });

export const PlantModel = model<IPlant>("Plant", plantSchema);
