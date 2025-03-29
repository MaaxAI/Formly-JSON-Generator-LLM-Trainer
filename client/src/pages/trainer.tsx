import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import TrainingDataPanel from "@/components/training-data-panel";
import TrainingControlsPanel from "@/components/training-controls-panel";
import { TrainingData, TrainingModel, FormlyConfiguration } from "@/lib/formly-types";
import { ModelUtils } from "@/lib/model-utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Trainer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [trainingLog, setTrainingLog] = useState<string[]>(["Waiting to start training..."]);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  
  // Fetch training data
  const { 
    data: trainingData = [],
    isLoading: isLoadingData
  } = useQuery({
    queryKey: ['/api/training-data'],
    queryFn: () => ModelUtils.getTrainingData()
  });
  
  // Fetch models
  const { 
    data: models = [],
    isLoading: isLoadingModels
  } = useQuery({
    queryKey: ['/api/models'],
    queryFn: () => ModelUtils.getModels()
  });
  
  // Fetch form configurations
  const { 
    data: forms = [],
    isLoading: isLoadingForms
  } = useQuery({
    queryKey: ['/api/forms'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/forms');
      return response.json();
    }
  });
  
  // Create training data mutation
  const createTrainingDataMutation = useMutation({
    mutationFn: (data: Omit<TrainingData, 'id' | 'createdAt'>) => 
      ModelUtils.addTrainingData(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/training-data'] });
      toast({
        title: "Success",
        description: "Training data added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add training data",
        variant: "destructive",
      });
    }
  });
  
  // Delete training data mutation
  const deleteTrainingDataMutation = useMutation({
    mutationFn: (id: number) => ModelUtils.deleteTrainingData(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/training-data'] });
      toast({
        title: "Success",
        description: "Training data deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete training data",
        variant: "destructive",
      });
    }
  });
  
  // Create model mutation
  const createModelMutation = useMutation({
    mutationFn: (model: Omit<TrainingModel, 'id' | 'createdAt' | 'updatedAt'>) => 
      ModelUtils.createModel(model),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/models'] });
      setSelectedModelId(data.id || null);
      setTrainingLog(prev => [...prev, "Starting training process..."]);
      toast({
        title: "Success",
        description: "Model creation started",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create model",
        variant: "destructive",
      });
    }
  });
  
  // Add form to training data
  const addFormToTrainingData = async (form: FormlyConfiguration) => {
    createTrainingDataMutation.mutate({
      source: 'form',
      content: JSON.stringify(form),
      type: 'form-configuration'
    });
  };
  
  // Generate sample data
  const generateSampleData = async () => {
    try {
      const samples = await ModelUtils.generateSampleForms();
      
      for (const sample of samples) {
        await createTrainingDataMutation.mutateAsync({
          source: 'example',
          content: JSON.stringify(sample),
          type: 'form-configuration'
        });
      }
      
      toast({
        title: "Success",
        description: "Sample data generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate sample data",
        variant: "destructive",
      });
    }
  };
  
  // Create and start training a model
  const startTraining = (modelData: Omit<TrainingModel, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    createModelMutation.mutate({
      ...modelData,
      status: 'training'
    });
  };
  
  // Check model status periodically
  useEffect(() => {
    if (!selectedModelId) return;
    
    const checkStatus = async () => {
      try {
        const status = await ModelUtils.getModelStatus(selectedModelId);
        if (status === 'training') {
          setTrainingLog(prev => [...prev, "Training in progress..."]);
        } else if (status === 'complete') {
          setTrainingLog(prev => [...prev, "Training completed successfully!"]);
        } else if (status === 'failed') {
          setTrainingLog(prev => [...prev, "Training failed. Check logs for details."]);
        }
      } catch (error) {
        console.error("Error checking model status:", error);
      }
    };
    
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [selectedModelId]);
  
  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
        {/* Training Data Panel */}
        <TrainingDataPanel 
          trainingData={trainingData}
          forms={forms}
          isLoading={isLoadingData || isLoadingForms}
          onAddFormToTrainingData={addFormToTrainingData}
          onDeleteTrainingData={(id) => deleteTrainingDataMutation.mutate(id)}
          onGenerateSampleData={generateSampleData}
        />
        
        {/* Training Controls Panel */}
        <TrainingControlsPanel 
          models={models}
          trainingLog={trainingLog}
          isLoading={isLoadingModels}
          onStartTraining={startTraining}
        />
      </div>
    </div>
  );
}
