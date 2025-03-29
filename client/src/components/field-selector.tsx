import { FieldDefinition } from "@/lib/formly-types";
import { Fragment } from "react";

interface FieldSelectorProps {
  onAddField: (field: FieldDefinition) => void;
  onClearForm: () => void;
}

export default function FieldSelector({ onAddField, onClearForm }: FieldSelectorProps) {
  // Available fields
  const availableFields: FieldDefinition[] = [
    { type: 'input', props: { type: 'text' }, label: 'Text Input', icon: 'text_fields', description: 'Single line text field', key: '' },
    { type: 'input', props: { type: 'number' }, label: 'Number', icon: 'pin', description: 'Numeric input field', key: '' },
    { type: 'input', props: { type: 'email' }, label: 'Email', icon: 'email', description: 'Email input with validation', key: '' },
    { type: 'textarea', props: {}, label: 'Text Area', icon: 'notes', description: 'Multi-line text field', key: '' },
    { type: 'select', props: { options: [] }, label: 'Dropdown', icon: 'arrow_drop_down_circle', description: 'Select from options', key: '' },
    { type: 'checkbox', props: {}, label: 'Checkbox', icon: 'check_box', description: 'Boolean checkbox field', key: '' },
    { type: 'radio', props: { options: [] }, label: 'Radio Group', icon: 'radio_button_checked', description: 'Single-select radio buttons', key: '' }
  ];

  // Field drag start handler
  const handleDragStart = (event: React.DragEvent, field: FieldDefinition) => {
    event.dataTransfer.setData('field', JSON.stringify(field));
  };
  
  return (
    <div className="md:col-span-3 bg-white rounded-lg shadow-md p-4 flex flex-col h-[calc(100vh-200px)] overflow-hidden">
      <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
        <span className="material-icons mr-2">add_box</span>
        Form Fields
      </h2>
      
      <div className="overflow-y-auto flex-1">
        <div className="space-y-3">
          {availableFields.map((field, index) => (
            <div 
              key={`field-${index}`}
              className="border border-gray-200 rounded-md p-3 cursor-move hover:bg-gray-50 transition-colors"
              draggable={true}
              onDragStart={(e) => handleDragStart(e, field)}
              onClick={() => onAddField(field)}
            >
              <div className="flex items-center">
                <span className="material-icons text-primary mr-2">{field.icon}</span>
                <div>
                  <h3 className="font-medium">{field.label}</h3>
                  <p className="text-sm text-gray-500">{field.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <button 
          onClick={onClearForm}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          <span className="material-icons mr-2 text-gray-500">delete_outline</span>
          Clear Form
        </button>
      </div>
    </div>
  );
}
