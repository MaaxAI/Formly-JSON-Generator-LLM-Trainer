import { 
  FormConfigurationRecord, TrainingDataRecord, TrainingModelRecord,
  InsertFormConfiguration, InsertTrainingData, InsertTrainingModel
} from "@shared/schema";

// Storage interface for all CRUD operations
export interface IStorage {
  // Form Configuration operations
  getFormConfiguration(id: number): Promise<FormConfigurationRecord | undefined>;
  getFormConfigurations(): Promise<FormConfigurationRecord[]>;
  createFormConfiguration(config: InsertFormConfiguration): Promise<FormConfigurationRecord>;
  updateFormConfiguration(id: number, config: Partial<InsertFormConfiguration>): Promise<FormConfigurationRecord | undefined>;
  deleteFormConfiguration(id: number): Promise<boolean>;

  // Training Data operations
  getTrainingData(id: number): Promise<TrainingDataRecord | undefined>;
  getTrainingDataBySource(source: string): Promise<TrainingDataRecord[]>;
  getAllTrainingData(): Promise<TrainingDataRecord[]>;
  createTrainingData(data: InsertTrainingData): Promise<TrainingDataRecord>;
  deleteTrainingData(id: number): Promise<boolean>;

  // Training Model operations
  getTrainingModel(id: number): Promise<TrainingModelRecord | undefined>;
  getTrainingModels(): Promise<TrainingModelRecord[]>;
  createTrainingModel(model: InsertTrainingModel): Promise<TrainingModelRecord>;
  updateTrainingModelStatus(id: number, status: string): Promise<TrainingModelRecord | undefined>;
  deleteTrainingModel(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private formConfigurations: Map<number, FormConfigurationRecord>;
  private trainingData: Map<number, TrainingDataRecord>;
  private trainingModels: Map<number, TrainingModelRecord>;
  private formConfigCurrentId: number;
  private trainingDataCurrentId: number;
  private trainingModelCurrentId: number;

  constructor() {
    this.formConfigurations = new Map();
    this.trainingData = new Map();
    this.trainingModels = new Map();
    this.formConfigCurrentId = 1;
    this.trainingDataCurrentId = 1;
    this.trainingModelCurrentId = 1;
  }

  // Form Configuration methods
  async getFormConfiguration(id: number): Promise<FormConfigurationRecord | undefined> {
    return this.formConfigurations.get(id);
  }

  async getFormConfigurations(): Promise<FormConfigurationRecord[]> {
    return Array.from(this.formConfigurations.values());
  }

  async createFormConfiguration(config: InsertFormConfiguration): Promise<FormConfigurationRecord> {
    const id = this.formConfigCurrentId++;
    const timestamp = new Date().toISOString();
    const record: FormConfigurationRecord = { 
      ...config, 
      id, 
      createdAt: timestamp, 
      updatedAt: timestamp 
    };
    this.formConfigurations.set(id, record);
    return record;
  }

  async updateFormConfiguration(id: number, config: Partial<InsertFormConfiguration>): Promise<FormConfigurationRecord | undefined> {
    const existing = this.formConfigurations.get(id);
    if (!existing) return undefined;

    const updated: FormConfigurationRecord = {
      ...existing,
      ...config,
      updatedAt: new Date().toISOString()
    };
    
    this.formConfigurations.set(id, updated);
    return updated;
  }

  async deleteFormConfiguration(id: number): Promise<boolean> {
    return this.formConfigurations.delete(id);
  }

  // Training Data methods
  async getTrainingData(id: number): Promise<TrainingDataRecord | undefined> {
    return this.trainingData.get(id);
  }

  async getTrainingDataBySource(source: string): Promise<TrainingDataRecord[]> {
    return Array.from(this.trainingData.values())
      .filter(data => data.source === source);
  }

  async getAllTrainingData(): Promise<TrainingDataRecord[]> {
    return Array.from(this.trainingData.values());
  }

  async createTrainingData(data: InsertTrainingData): Promise<TrainingDataRecord> {
    const id = this.trainingDataCurrentId++;
    const timestamp = new Date().toISOString();
    const record: TrainingDataRecord = { 
      ...data, 
      id, 
      createdAt: timestamp 
    };
    this.trainingData.set(id, record);
    return record;
  }

  async deleteTrainingData(id: number): Promise<boolean> {
    return this.trainingData.delete(id);
  }

  // Training Model methods
  async getTrainingModel(id: number): Promise<TrainingModelRecord | undefined> {
    return this.trainingModels.get(id);
  }

  async getTrainingModels(): Promise<TrainingModelRecord[]> {
    return Array.from(this.trainingModels.values());
  }

  async createTrainingModel(model: InsertTrainingModel): Promise<TrainingModelRecord> {
    const id = this.trainingModelCurrentId++;
    const timestamp = new Date().toISOString();
    const record: TrainingModelRecord = { 
      ...model, 
      id, 
      createdAt: timestamp, 
      updatedAt: timestamp 
    };
    this.trainingModels.set(id, record);
    return record;
  }

  async updateTrainingModelStatus(id: number, status: string): Promise<TrainingModelRecord | undefined> {
    const existing = this.trainingModels.get(id);
    if (!existing) return undefined;

    const updated: TrainingModelRecord = {
      ...existing,
      status,
      updatedAt: new Date().toISOString()
    };
    
    this.trainingModels.set(id, updated);
    return updated;
  }

  async deleteTrainingModel(id: number): Promise<boolean> {
    return this.trainingModels.delete(id);
  }
}

// Initialize and export default storage instance
export const storage = new MemStorage();
