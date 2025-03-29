import { apiRequest } from "@/lib/queryClient";
import { TrainingModel, TrainingData, ChatMessage } from "./formly-types";

/**
 * Utility functions for working with the LLM model
 */
export class ModelUtils {
  /**
   * Create a new training model
   */
  static async createModel(model: Omit<TrainingModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<TrainingModel> {
    const response = await apiRequest('POST', '/api/models', model);
    return await response.json();
  }

  /**
   * Get all training models
   */
  static async getModels(): Promise<TrainingModel[]> {
    const response = await apiRequest('GET', '/api/models');
    return await response.json();
  }

  /**
   * Get model status
   */
  static async getModelStatus(id: number): Promise<string> {
    const response = await apiRequest('GET', `/api/models/${id}/status`);
    const data = await response.json();
    return data.status;
  }

  /**
   * Add training data
   */
  static async addTrainingData(data: Omit<TrainingData, 'id' | 'createdAt'>): Promise<TrainingData> {
    const response = await apiRequest('POST', '/api/training-data', data);
    return await response.json();
  }

  /**
   * Get all training data
   */
  static async getTrainingData(source?: string): Promise<TrainingData[]> {
    let url = '/api/training-data';
    if (source) {
      url += `?source=${source}`;
    }
    const response = await apiRequest('GET', url);
    return await response.json();
  }

  /**
   * Delete training data
   */
  static async deleteTrainingData(id: number): Promise<void> {
    await apiRequest('DELETE', `/api/training-data/${id}`);
  }

  /**
   * Query the model with a question
   */
  static async queryModel(question: string): Promise<string> {
    const response = await apiRequest('POST', '/api/assistant/query', { query: question });
    const data = await response.json();
    return data.response;
  }

  /**
   * Generate sample forms for training
   */
  static async generateSampleForms(): Promise<any[]> {
    const response = await apiRequest('GET', '/api/formly/sample-data');
    return await response.json();
  }
}
