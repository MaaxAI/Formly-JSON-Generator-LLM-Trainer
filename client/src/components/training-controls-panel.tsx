import { useState } from "react";
import { TrainingModel } from "@/lib/formly-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TrainingControlsPanelProps {
  models: TrainingModel[];
  trainingLog: string[];
  isLoading: boolean;
  onStartTraining: (model: Omit<TrainingModel, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
}

export default function TrainingControlsPanel({
  models,
  trainingLog,
  isLoading,
  onStartTraining
}: TrainingControlsPanelProps) {
  // Form state
  const [modelName, setModelName] = useState("formly-assistant-model");
  const [baseModel, setBaseModel] = useState("gpt-3.5-turbo");
  const [epochs, setEpochs] = useState(3);
  const [learningRate, setLearningRate] = useState("1e-4");
  const [includeDocs, setIncludeDocs] = useState(true);
  const [includeExamples, setIncludeExamples] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Start training
  const handleStartTraining = () => {
    onStartTraining({
      name: modelName,
      baseModel,
      epochs,
      learningRate,
      includeDocs,
      includeExamples
    });
  };

  // Save configuration
  const handleSaveConfig = () => {
    setIsSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      alert("Configuration saved!");
    }, 1000);
  };

  // Get model status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'training':
        return 'bg-yellow-100 text-yellow-800';
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="md:col-span-5 bg-white rounded-lg shadow-md p-4 flex flex-col h-[calc(100vh-200px)] overflow-hidden">
      <h2 className="text-lg font-medium text-gray-800 flex items-center mb-4">
        <span className="material-icons mr-2">psychology</span>
        Model Training
      </h2>
      
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
          <Input 
            type="text" 
            value={modelName} 
            onChange={(e) => setModelName(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Base Model</label>
          <select 
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={baseModel}
            onChange={(e) => setBaseModel(e.target.value)}
          >
            <option value="gpt-3.5-turbo">OpenAI GPT-3.5 Turbo</option>
            <option value="gpt-4">OpenAI GPT-4</option>
            <option value="bert">Hugging Face BERT</option>
            <option value="llama-2">Local LLaMA 2</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Training Epochs</label>
          <Input 
            type="number" 
            min={1} 
            max={10} 
            value={epochs} 
            onChange={(e) => setEpochs(Number(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Learning Rate</label>
          <select 
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={learningRate}
            onChange={(e) => setLearningRate(e.target.value)}
          >
            <option value="1e-4">1e-4 (Default)</option>
            <option value="1e-5">1e-5 (Conservative)</option>
            <option value="5e-5">5e-5 (Moderate)</option>
            <option value="1e-3">1e-3 (Aggressive)</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="include-docs" 
            checked={includeDocs} 
            onChange={(e) => setIncludeDocs(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="include-docs" className="text-sm">Include Formly Documentation in Training</label>
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="include-examples" 
            checked={includeExamples} 
            onChange={(e) => setIncludeExamples(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="include-examples" className="text-sm">Include Formly Examples in Training</label>
        </div>
      </div>
      
      <div className="relative flex-1 bg-gray-50 rounded-md p-4 mb-4 overflow-hidden">
        <h3 className="font-medium mb-2">Training Log</h3>
        <ScrollArea className="h-[calc(100%-2rem)] font-mono text-xs">
          <div className="space-y-1">
            {trainingLog.map((log, index) => (
              <p key={index} className="text-gray-500">{log}</p>
            ))}
          </div>
        </ScrollArea>

        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm">Loading models...</p>
            </div>
          </div>
        )}
      </div>
      
      {models.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2 text-sm">Existing Models</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {models.map(model => (
              <div 
                key={model.id} 
                className="p-2 border border-gray-200 rounded-md flex justify-between items-center text-sm"
              >
                <div>
                  <span className="font-medium">{model.name}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    {model.baseModel}
                  </span>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadgeColor(model.status)}`}>
                  {model.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleSaveConfig}
          disabled={isSaving}
          className="flex items-center justify-center"
        >
          <span className="material-icons mr-2 text-gray-500">save</span>
          Save Config
        </Button>
        <Button
          onClick={handleStartTraining}
          className="flex items-center justify-center"
        >
          <span className="material-icons mr-2">play_arrow</span>
          Start Training
        </Button>
      </div>
    </div>
  );
}
