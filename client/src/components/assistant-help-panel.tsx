import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AssistantHelpPanelProps {
  onSelectQuestion: (question: string) => void;
}

export default function AssistantHelpPanel({ onSelectQuestion }: AssistantHelpPanelProps) {
  // Common questions
  const commonQuestions = [
    "How do I add validation to my form?",
    "What are wrappers in Formly?",
    "How to create custom field types?",
    "Can I nest fields in Formly?"
  ];

  // Sample templates
  const sampleTemplates = [
    "Create a login form with validation",
    "Show me a multi-step registration form example",
    "How to create a survey form with conditional fields",
    "Example of a payment form with Formly"
  ];

  // Check model status
  const { data: models, isLoading } = useQuery({
    queryKey: ['/api/models'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/models');
      return response.json();
    }
  });

  // Get model status (complete, training, etc.)
  const getModelStatus = () => {
    if (isLoading) return { status: 'loading', text: 'Checking...' };
    
    if (!models || models.length === 0) {
      return { status: 'not-started', text: 'Not Trained' };
    }
    
    // Get the most recent model
    const latestModel = models.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    
    switch (latestModel.status) {
      case 'complete':
        return { status: 'ready', text: 'Ready' };
      case 'training':
        return { status: 'training', text: 'Training' };
      case 'failed':
        return { status: 'failed', text: 'Failed' };
      default:
        return { status: 'unknown', text: 'Unknown' };
    }
  };

  // Handle click on a learning resource
  const handleResourceClick = (url: string) => {
    window.open(url, '_blank');
  };

  const modelStatus = getModelStatus();

  return (
    <div className="md:col-span-4 bg-white rounded-lg shadow-md p-4 flex flex-col h-[calc(100vh-200px)] overflow-hidden">
      <h2 className="text-lg font-medium text-gray-800 flex items-center mb-4">
        <span className="material-icons mr-2">help_outline</span>
        Quick Help
      </h2>
      
      <div className="overflow-y-auto flex-1">
        <div className="space-y-4">
          <Card className="border border-gray-200 rounded-md p-3 hover:border-primary/50 transition-colors">
            <h3 className="font-medium mb-1">Common Questions</h3>
            <ul className="text-sm space-y-2">
              {commonQuestions.map((question, index) => (
                <li 
                  key={index} 
                  className="hover:text-primary cursor-pointer transition-colors"
                  onClick={() => onSelectQuestion(question)}
                >
                  {question}
                </li>
              ))}
            </ul>
          </Card>
          
          <Card className="border border-gray-200 rounded-md p-3 hover:border-primary/50 transition-colors">
            <h3 className="font-medium mb-1">Sample Templates</h3>
            <ul className="text-sm space-y-2">
              {sampleTemplates.map((template, index) => (
                <li 
                  key={index} 
                  className="hover:text-primary cursor-pointer transition-colors"
                  onClick={() => onSelectQuestion(template)}
                >
                  {template}
                </li>
              ))}
            </ul>
          </Card>
          
          <Card className="border border-gray-200 rounded-md p-3 hover:border-primary/50 transition-colors">
            <h3 className="font-medium mb-1">Learning Resources</h3>
            <ul className="text-sm space-y-2">
              <li 
                className="hover:text-primary cursor-pointer transition-colors flex items-center"
                onClick={() => handleResourceClick('https://formly.dev/')}
              >
                <span className="material-icons text-xs mr-1">open_in_new</span>
                Formly Documentation
              </li>
              <li 
                className="hover:text-primary cursor-pointer transition-colors flex items-center"
                onClick={() => handleResourceClick('https://github.com/ngx-formly/ngx-formly')}
              >
                <span className="material-icons text-xs mr-1">open_in_new</span>
                Angular Formly GitHub
              </li>
              <li 
                className="hover:text-primary cursor-pointer transition-colors flex items-center"
                onClick={() => handleResourceClick('https://formly.dev/examples')}
              >
                <span className="material-icons text-xs mr-1">open_in_new</span>
                Formly Examples
              </li>
            </ul>
          </Card>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-2">Model Status</p>
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className={`h-2 rounded-full ${
                modelStatus.status === 'ready' ? 'bg-green-500' :
                modelStatus.status === 'training' ? 'bg-yellow-500' :
                modelStatus.status === 'failed' ? 'bg-red-500' :
                'bg-gray-400'
              }`} 
              style={{ 
                width: modelStatus.status === 'ready' ? '100%' : 
                       modelStatus.status === 'training' ? '50%' : 
                       modelStatus.status === 'failed' ? '100%' : '0%' 
              }}
            ></div>
          </div>
          <span className={`text-xs font-medium ${
            modelStatus.status === 'ready' ? 'text-green-500' :
            modelStatus.status === 'training' ? 'text-yellow-500' :
            modelStatus.status === 'failed' ? 'text-red-500' :
            'text-gray-500'
          }`}>
            {modelStatus.text}
          </span>
        </div>
      </div>
    </div>
  );
}
