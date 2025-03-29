import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertFormConfigurationSchema, 
  insertTrainingDataSchema, 
  insertTrainingModelSchema
} from "@shared/schema";
import { formlyService } from "./services/formly-service";
import { modelService } from "./services/model-service";
import { openaiService } from "./services/openai-service";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Form Configuration endpoints
  app.get("/api/forms", async (req: Request, res: Response) => {
    try {
      const forms = await storage.getFormConfigurations();
      res.json(forms);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve form configurations" });
    }
  });

  app.get("/api/forms/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const form = await storage.getFormConfiguration(id);
      
      if (!form) {
        return res.status(404).json({ message: "Form configuration not found" });
      }
      
      res.json(form);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve form configuration" });
    }
  });

  app.post("/api/forms", async (req: Request, res: Response) => {
    try {
      const parseResult = insertFormConfigurationSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid form configuration data",
          errors: parseResult.error.format() 
        });
      }
      
      const form = await storage.createFormConfiguration(parseResult.data);
      res.status(201).json(form);
    } catch (error) {
      res.status(500).json({ message: "Failed to create form configuration" });
    }
  });

  app.put("/api/forms/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const parseResult = insertFormConfigurationSchema.partial().safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid form configuration data",
          errors: parseResult.error.format() 
        });
      }
      
      const updatedForm = await storage.updateFormConfiguration(id, parseResult.data);
      
      if (!updatedForm) {
        return res.status(404).json({ message: "Form configuration not found" });
      }
      
      res.json(updatedForm);
    } catch (error) {
      res.status(500).json({ message: "Failed to update form configuration" });
    }
  });

  app.delete("/api/forms/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteFormConfiguration(id);
      
      if (!success) {
        return res.status(404).json({ message: "Form configuration not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete form configuration" });
    }
  });

  // Training Data endpoints
  app.get("/api/training-data", async (req: Request, res: Response) => {
    try {
      const source = req.query.source as string | undefined;
      
      if (source) {
        const data = await storage.getTrainingDataBySource(source);
        return res.json(data);
      }
      
      const allData = await storage.getAllTrainingData();
      res.json(allData);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve training data" });
    }
  });

  app.post("/api/training-data", async (req: Request, res: Response) => {
    try {
      const parseResult = insertTrainingDataSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid training data",
          errors: parseResult.error.format() 
        });
      }
      
      const data = await storage.createTrainingData(parseResult.data);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to create training data" });
    }
  });

  app.delete("/api/training-data/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTrainingData(id);
      
      if (!success) {
        return res.status(404).json({ message: "Training data not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete training data" });
    }
  });

  // Training Model endpoints
  app.get("/api/models", async (req: Request, res: Response) => {
    try {
      const models = await storage.getTrainingModels();
      res.json(models);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve training models" });
    }
  });

  app.post("/api/models", async (req: Request, res: Response) => {
    try {
      const parseResult = insertTrainingModelSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          message: "Invalid training model data",
          errors: parseResult.error.format() 
        });
      }
      
      const model = await storage.createTrainingModel(parseResult.data);
      
      // Start model training in background
      modelService.trainModel(model.id)
        .catch(err => console.error("Error training model:", err));
      
      res.status(201).json(model);
    } catch (error) {
      res.status(500).json({ message: "Failed to create training model" });
    }
  });

  app.get("/api/models/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const model = await storage.getTrainingModel(id);
      
      if (!model) {
        return res.status(404).json({ message: "Training model not found" });
      }
      
      res.json({ status: model.status });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve model status" });
    }
  });

  // Assistant/Query endpoints
  app.post("/api/assistant/query", async (req: Request, res: Response) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }
      
      const response = await modelService.queryModel(query);
      res.json({ response });
    } catch (error) {
      res.status(500).json({ message: "Failed to process query" });
    }
  });

  // Generate sample data endpoint
  app.get("/api/formly/sample-data", async (req: Request, res: Response) => {
    try {
      const sampleData = formlyService.generateSampleForms();
      res.json(sampleData);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate sample data" });
    }
  });

  return httpServer;
}
