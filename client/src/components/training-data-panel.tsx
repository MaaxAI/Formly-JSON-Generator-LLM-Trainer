import { useState } from "react";
import { TrainingData, FormlyConfiguration } from "@/lib/formly-types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TrainingDataPanelProps {
  trainingData: TrainingData[];
  forms: FormlyConfiguration[];
  isLoading: boolean;
  onAddFormToTrainingData: (form: FormlyConfiguration) => void;
  onDeleteTrainingData: (id: number) => void;
  onGenerateSampleData: () => void;
}

export default function TrainingDataPanel({
  trainingData,
  forms,
  isLoading,
  onAddFormToTrainingData,
  onDeleteTrainingData,
  onGenerateSampleData
}: TrainingDataPanelProps) {
  const [selectedForm, setSelectedForm] = useState<number | null>(null);

  // Handle form selection
  const handleFormSelect = (id: number) => {
    setSelectedForm(id === selectedForm ? null : id);
  };

  // Add selected form to training data
  const addSelectedFormToTraining = () => {
    if (selectedForm !== null) {
      const form = forms.find(f => f.id === selectedForm);
      if (form) {
        onAddFormToTrainingData(form);
      }
    }
  };

  // Get source badge color
  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'form':
        return 'bg-primary/10 text-primary';
      case 'documentation':
        return 'bg-blue-100 text-blue-800';
      case 'example':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Truncate JSON to a reasonable length
  const truncateJson = (json: string, maxLength = 100) => {
    if (json.length <= maxLength) return json;
    return json.substring(0, maxLength) + '...';
  };

  // Get a human-readable name from the training data content
  const getDataName = (data: TrainingData) => {
    try {
      const parsed = JSON.parse(data.content);
      return parsed.name || parsed.className || 'Unnamed Form';
    } catch (e) {
      // If it's not parseable JSON, just return the first few characters
      return data.content.substring(0, 20) + '...';
    }
  };

  // Get a short description from the training data content
  const getDataDescription = (data: TrainingData) => {
    try {
      const parsed = JSON.parse(data.content);
      return parsed.description || 
             `${parsed.fields?.length || 0} fields` || 
             'No description available';
    } catch (e) {
      return 'Raw data';
    }
  };

  return (
    <div className="md:col-span-7 bg-white rounded-lg shadow-md p-4 flex flex-col h-[calc(100vh-200px)] overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800 flex items-center">
          <span className="material-icons mr-2">dataset</span>
          Training Dataset
        </h2>
        <div className="flex space-x-2">
          <button 
            className="p-1 rounded-full hover:bg-gray-50 transition-colors text-gray-500" 
            title="Generate Sample Data"
            onClick={onGenerateSampleData}
          >
            <span className="material-icons">auto_awesome</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          // Loading state
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-4">
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-12 w-full" />
              </Card>
            ))}
          </div>
        ) : trainingData.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <span className="material-icons text-5xl mb-3">dataset</span>
            <p className="text-center">No training data available</p>
            <p className="text-center text-sm mt-2">
              Generate sample data or add your form configurations
            </p>
            <Button 
              onClick={onGenerateSampleData}
              className="mt-4 flex items-center"
            >
              <span className="material-icons mr-2 text-sm">auto_awesome</span>
              Generate Sample Data
            </Button>
          </div>
        ) : (
          // Training data list
          <div className="space-y-4">
            {trainingData.map(data => (
              <div 
                key={data.id} 
                className="border border-gray-200 rounded-md p-4 transition-colors hover:border-primary/50"
              >
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <h3 className="font-medium">{getDataName(data)}</h3>
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getSourceBadgeColor(data.source)}`}>
                      {data.source}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => onDeleteTrainingData(data.id!)}
                      className="p-1 text-gray-500 hover:text-red-500 transition-colors" 
                      title="Remove"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{getDataDescription(data)}</p>
                <div className="text-xs font-mono bg-gray-50 p-2 rounded-md truncate">
                  <code className="text-primary-dark">
                    {truncateJson(data.content)}
                  </code>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select a Form to Add</label>
          <select 
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={selectedForm || ''}
            onChange={(e) => handleFormSelect(Number(e.target.value))}
          >
            <option value="">Select a form...</option>
            {forms.map(form => (
              <option key={form.id} value={form.id}>
                {form.name} ({form.fields.length} fields)
              </option>
            ))}
          </select>
        </div>
        <Button
          onClick={addSelectedFormToTraining}
          disabled={selectedForm === null}
          className="w-full flex items-center justify-center"
        >
          <span className="material-icons mr-2">add</span>
          Add Form to Training Data
        </Button>
      </div>
    </div>
  );
}
