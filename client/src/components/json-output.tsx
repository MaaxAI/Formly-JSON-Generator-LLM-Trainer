import { FormlyConfiguration, OutputFormat } from "@/lib/formly-types";
import { FormlyUtils } from "@/lib/formly-utils";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface JsonOutputProps {
  formConfiguration: FormlyConfiguration;
  outputMode: OutputFormat;
  onOutputModeChange: (mode: OutputFormat) => void;
}

export default function JsonOutput({ 
  formConfiguration, 
  outputMode, 
  onOutputModeChange 
}: JsonOutputProps) {
  const { toast } = useToast();
  const [formattedOutput, setFormattedOutput] = useState<string>("");
  
  // Update formatted output when the configuration changes
  useEffect(() => {
    const output = FormlyUtils.generateOutput(formConfiguration, outputMode);
    if (outputMode === OutputFormat.FORMLY_JSON) {
      setFormattedOutput(FormlyUtils.formatJsonString(output));
    } else {
      setFormattedOutput(output);
    }
  }, [formConfiguration, outputMode]);
  
  // Copy output to clipboard
  const copyToClipboard = () => {
    // Get raw output without HTML formatting
    const rawOutput = FormlyUtils.generateOutput(formConfiguration, outputMode);
    
    navigator.clipboard.writeText(rawOutput).then(() => {
      toast({
        title: "Copied!",
        description: "Output copied to clipboard.",
      });
    });
  };
  
  // Download output as file
  const downloadOutput = () => {
    // Get raw output without HTML formatting
    const rawOutput = FormlyUtils.generateOutput(formConfiguration, outputMode);
    
    let filename, contentType;
    
    switch (outputMode) {
      case OutputFormat.TYPESCRIPT:
      case OutputFormat.ANGULAR_COMPONENT:
        filename = `${FormlyUtils.toKebabCase(formConfiguration.className || 'formly-form')}.component.ts`;
        contentType = 'text/typescript';
        break;
      case OutputFormat.FORMLY_JSON:
      default:
        filename = 'formly-config.json';
        contentType = 'application/json';
        break;
    }
    
    const blob = new Blob([rawOutput], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `Output downloaded as ${filename}`,
    });
  };
  
  // Format output
  const formatOutput = () => {
    toast({
      title: "Formatted",
      description: "Output is already formatted.",
    });
  };
  
  return (
    <div className="md:col-span-4 bg-white rounded-lg shadow-md p-4 flex flex-col h-[calc(100vh-200px)] overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800 flex items-center">
          <span className="material-icons mr-2">code</span>
          Formly JSON
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={formatOutput}
            className="p-1 rounded-full hover:bg-gray-50 transition-colors text-gray-500" 
            title="Format JSON"
          >
            <span className="material-icons">format_align_left</span>
          </button>
          <button 
            onClick={copyToClipboard}
            className="p-1 rounded-full hover:bg-gray-50 transition-colors text-gray-500" 
            title="Copy to Clipboard"
          >
            <span className="material-icons">content_copy</span>
          </button>
          <button 
            onClick={downloadOutput}
            className="p-1 rounded-full hover:bg-gray-50 transition-colors text-gray-500" 
            title="Download JSON"
          >
            <span className="material-icons">download</span>
          </button>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-md flex-1 overflow-hidden flex flex-col">
        <div className="p-2 bg-gray-800/80 border-b border-black/20 flex justify-between items-center">
          <div className="text-gray-300 text-sm">
            {outputMode === OutputFormat.FORMLY_JSON ? 'formly-config.json' : 
             outputMode === OutputFormat.TYPESCRIPT ? 'formly-component.ts' :
             'formly-component-full.ts'}
          </div>
          <div>
            <select 
              value={outputMode}
              onChange={(e) => onOutputModeChange(e.target.value as OutputFormat)}
              className="text-xs bg-gray-800 text-gray-300 border border-gray-500 rounded px-2 py-1"
            >
              <option value={OutputFormat.FORMLY_JSON}>Formly JSON</option>
              <option value={OutputFormat.TYPESCRIPT}>TypeScript</option>
              <option value={OutputFormat.ANGULAR_COMPONENT}>Angular Component</option>
            </select>
          </div>
        </div>
        
        <pre 
          className="p-4 text-white overflow-auto flex-1 text-sm font-mono" 
          dangerouslySetInnerHTML={{ __html: formattedOutput }}
        />
      </div>
    </div>
  );
}
