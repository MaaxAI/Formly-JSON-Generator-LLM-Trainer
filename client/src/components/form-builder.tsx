import { useState, useEffect } from "react";
import { FormlyField } from "@/lib/formly-types";
import { FormlyUtils } from "@/lib/formly-utils";

interface FormBuilderProps {
  formFields: FormlyField[];
  formModelName: string;
  formClassName: string;
  formName: string;
  formDescription: string;
  showFieldNameSettings: boolean;
  showFormPreview: boolean;
  onFieldMove: (index: number, direction: number) => void;
  onFieldRemove: (index: number) => void;
  onFieldDuplicate: (index: number) => void;
  onFieldUpdate: (index: number, field: FormlyField) => void;
  onToggleFieldNameSettings: () => void;
  onToggleFormPreview: () => void;
  onModelNameChange: (name: string) => void;
  onClassNameChange: (name: string) => void;
  onFormNameChange: (name: string) => void;
  onFormDescriptionChange: (desc: string) => void;
  onAddField: (field: FormlyField) => void;
  onSaveForm: () => void;
}

export default function FormBuilder({ 
  formFields, 
  formModelName,
  formClassName,
  formName,
  formDescription,
  showFieldNameSettings,
  showFormPreview,
  onFieldMove,
  onFieldRemove,
  onFieldDuplicate,
  onFieldUpdate,
  onToggleFieldNameSettings,
  onToggleFormPreview,
  onModelNameChange,
  onClassNameChange,
  onFormNameChange,
  onFormDescriptionChange,
  onAddField,
  onSaveForm
}: FormBuilderProps) {
  // New option state
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');
  
  // Expanded fields state
  const [expandedFields, setExpandedFields] = useState<Record<number, boolean>>({});
  
  // Initialize all fields as expanded
  useEffect(() => {
    const newExpanded: Record<number, boolean> = {};
    formFields.forEach((_, index) => {
      newExpanded[index] = true;
    });
    setExpandedFields(newExpanded);
  }, [formFields.length]);
  
  // Toggle field expansion
  const toggleFieldExpanded = (index: number) => {
    setExpandedFields({
      ...expandedFields,
      [index]: !expandedFields[index]
    });
  };
  
  // Add option to field
  const addOption = (index: number) => {
    if (!newOptionLabel || !newOptionValue) return;
    
    const field = { ...formFields[index] };
    if (!field.props.options) {
      field.props.options = [];
    }
    
    field.props.options.push({
      label: newOptionLabel,
      value: newOptionValue
    });
    
    onFieldUpdate(index, field);
    setNewOptionLabel('');
    setNewOptionValue('');
  };
  
  // Remove option from field
  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const field = { ...formFields[fieldIndex] };
    if (!field.props.options) return;
    
    field.props.options = field.props.options.filter((_, i) => i !== optionIndex);
    onFieldUpdate(fieldIndex, field);
  };
  
  // Update field property
  const updateFieldProp = (index: number, propPath: string, value: any) => {
    const field = { ...formFields[index] };
    
    // Handle nested properties
    const parts = propPath.split('.');
    let current: any = field;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
    
    current[parts[parts.length - 1]] = value;
    onFieldUpdate(index, field);
  };
  
  // Handle drop event for drag and drop
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    try {
      const fieldData = event.dataTransfer.getData('field');
      if (fieldData) {
        const field = JSON.parse(fieldData);
        onAddField(field);
      }
    } catch (err) {
      console.error('Error adding field:', err);
    }
  };
  
  return (
    <div 
      className="md:col-span-5 bg-white rounded-lg shadow-md p-4 flex flex-col h-[calc(100vh-200px)] overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800 flex items-center">
          <span className="material-icons mr-2">edit</span>
          Form Builder
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={onToggleFieldNameSettings}
            className={`p-1 rounded-full hover:bg-gray-50 transition-colors ${showFieldNameSettings ? 'bg-primary/10 text-primary' : 'text-gray-500'}`}
            title="Settings"
          >
            <span className="material-icons">settings</span>
          </button>
          <button 
            onClick={onToggleFormPreview}
            className="p-1 rounded-full hover:bg-gray-50 transition-colors text-gray-500"
            title="Preview"
          >
            <span className="material-icons">visibility</span>
          </button>
          <button 
            onClick={onSaveForm}
            className="p-1 rounded-full hover:bg-gray-50 transition-colors text-gray-500"
            title="Save"
          >
            <span className="material-icons">save</span>
          </button>
        </div>
      </div>

      {/* Form Meta Settings */}
      {showFieldNameSettings && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="form-name" className="block text-sm font-medium text-gray-700 mb-1">Form Name</label>
              <input 
                type="text" 
                id="form-name" 
                value={formName}
                onChange={(e) => onFormNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label htmlFor="form-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input 
                type="text" 
                id="form-description" 
                value={formDescription}
                onChange={(e) => onFormDescriptionChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label htmlFor="form-model" className="block text-sm font-medium text-gray-700 mb-1">Form Model Name</label>
              <input 
                type="text" 
                id="form-model" 
                value={formModelName}
                onChange={(e) => onModelNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label htmlFor="form-class" className="block text-sm font-medium text-gray-700 mb-1">Form Class Name</label>
              <input 
                type="text" 
                id="form-class" 
                value={formClassName}
                onChange={(e) => onClassNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Form Builder Content */}
      <div className="overflow-y-auto flex-1">
        {formFields.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <span className="material-icons text-5xl mb-3">drag_indicator</span>
            <p className="text-center">Drag fields here to build your form<br/>or click on the fields from the left panel</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Display fields for editing */}
            {!showFormPreview && formFields.map((field, index) => (
              <div 
                key={`field-edit-${index}`}
                className="border border-gray-200 hover:border-primary/50 rounded-md p-4 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <span className="material-icons text-primary mr-2">{field.icon}</span>
                    <h3 className="font-medium">{field.label || field.props.label}</h3>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => onFieldMove(index, -1)}
                      className="p-1 text-gray-500 hover:text-primary transition-colors" 
                      title="Move Up"
                    >
                      <span className="material-icons text-sm">arrow_upward</span>
                    </button>
                    <button 
                      onClick={() => onFieldMove(index, 1)}
                      className="p-1 text-gray-500 hover:text-primary transition-colors" 
                      title="Move Down"
                    >
                      <span className="material-icons text-sm">arrow_downward</span>
                    </button>
                    <button 
                      onClick={() => toggleFieldExpanded(index)}
                      className="p-1 text-gray-500 hover:text-primary transition-colors"
                    >
                      <span className="material-icons text-sm">
                        {expandedFields[index] ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    <button 
                      onClick={() => onFieldDuplicate(index)}
                      className="p-1 text-gray-500 hover:text-primary transition-colors" 
                      title="Duplicate"
                    >
                      <span className="material-icons text-sm">content_copy</span>
                    </button>
                    <button 
                      onClick={() => onFieldRemove(index)}
                      className="p-1 text-gray-500 hover:text-red-500 transition-colors" 
                      title="Remove"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                </div>
                
                {expandedFields[index] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Field Key</label>
                      <input 
                        type="text" 
                        value={field.key}
                        onChange={(e) => updateFieldProp(index, 'key', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
                      <select 
                        value={field.type === 'input' ? field.props.type || 'text' : field.type}
                        onChange={(e) => {
                          if (field.type === 'input') {
                            updateFieldProp(index, 'props.type', e.target.value);
                          } else {
                            // Handle type change if needed
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        {FormlyUtils.getFieldTypeOptions(field.type).map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Field Label</label>
                      <input 
                        type="text" 
                        value={field.props.label || ''}
                        onChange={(e) => updateFieldProp(index, 'props.label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                      <input 
                        type="text" 
                        value={field.props.placeholder || ''}
                        onChange={(e) => updateFieldProp(index, 'props.placeholder', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input 
                        type="text" 
                        value={field.props.description || ''}
                        onChange={(e) => updateFieldProp(index, 'props.description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    
                    {/* Field-specific options */}
                    {(field.type === 'select' || field.type === 'radio') && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                        <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                          <div className="mb-2 flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Label" 
                              value={newOptionLabel}
                              onChange={(e) => setNewOptionLabel(e.target.value)}
                              className="flex-1 px-3 py-1 border border-gray-200 rounded-md"
                            />
                            <input 
                              type="text" 
                              placeholder="Value" 
                              value={newOptionValue}
                              onChange={(e) => setNewOptionValue(e.target.value)}
                              className="flex-1 px-3 py-1 border border-gray-200 rounded-md"
                            />
                            <button 
                              onClick={() => addOption(index)}
                              className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                            >
                              Add
                            </button>
                          </div>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {field.props.options && field.props.options.map((option, optIndex) => (
                              <div 
                                key={`option-${index}-${optIndex}`}
                                className="flex justify-between items-center bg-white p-2 rounded border border-gray-200"
                              >
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                  <span>{option.label}</span>
                                  <span className="text-gray-500">{option.value}</span>
                                </div>
                                <button 
                                  onClick={() => removeOption(index, optIndex)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <span className="material-icons text-sm">delete</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="md:col-span-2 pt-2 border-t border-gray-200">
                      <h4 className="font-medium text-sm mb-2">Validation</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`required-${index}`} 
                            checked={field.validation?.required || false}
                            onChange={(e) => updateFieldProp(index, 'validation.required', e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor={`required-${index}`} className="text-sm">Required</label>
                        </div>
                        
                        {field.type === 'input' && field.props.type === 'number' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Min Value</label>
                              <input 
                                type="number" 
                                value={field.validation?.min || ''}
                                onChange={(e) => updateFieldProp(index, 'validation.min', e.target.value ? Number(e.target.value) : '')}
                                className="w-full px-3 py-1 border border-gray-200 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
                              <input 
                                type="number" 
                                value={field.validation?.max || ''}
                                onChange={(e) => updateFieldProp(index, 'validation.max', e.target.value ? Number(e.target.value) : '')}
                                className="w-full px-3 py-1 border border-gray-200 rounded-md"
                              />
                            </div>
                          </>
                        )}
                        
                        {(['input', 'textarea'].includes(field.type)) && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Min Length</label>
                              <input 
                                type="number" 
                                value={field.validation?.minLength || ''}
                                onChange={(e) => updateFieldProp(index, 'validation.minLength', e.target.value ? Number(e.target.value) : '')}
                                className="w-full px-3 py-1 border border-gray-200 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Max Length</label>
                              <input 
                                type="number" 
                                value={field.validation?.maxLength || ''}
                                onChange={(e) => updateFieldProp(index, 'validation.maxLength', e.target.value ? Number(e.target.value) : '')}
                                className="w-full px-3 py-1 border border-gray-200 rounded-md"
                              />
                            </div>
                          </>
                        )}
                        
                        {field.type === 'input' && field.props.type === 'text' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pattern</label>
                            <select 
                              value={field.validation?.patternType || ''}
                              onChange={(e) => {
                                const patternType = e.target.value;
                                updateFieldProp(index, 'validation.patternType', patternType);
                                
                                // Set predefined patterns
                                if (patternType === 'email') {
                                  updateFieldProp(index, 'validation.pattern', '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
                                } else if (patternType === 'url') {
                                  updateFieldProp(index, 'validation.pattern', '^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w .-]*)*\\/?$');
                                } else if (patternType === 'alphanumeric') {
                                  updateFieldProp(index, 'validation.pattern', '^[a-zA-Z0-9]+$');
                                }
                              }}
                              className="w-full px-3 py-1 border border-gray-200 rounded-md"
                            >
                              <option value="">None</option>
                              <option value="email">Email</option>
                              <option value="url">URL</option>
                              <option value="alphanumeric">Alphanumeric</option>
                              <option value="custom">Custom</option>
                            </select>
                          </div>
                        )}
                        
                        {field.type === 'input' && field.props.type === 'text' && field.validation?.patternType === 'custom' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Pattern</label>
                            <input 
                              type="text" 
                              value={field.validation?.pattern || ''}
                              onChange={(e) => updateFieldProp(index, 'validation.pattern', e.target.value)}
                              className="w-full px-3 py-1 border border-gray-200 rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 pt-2 border-t border-gray-200">
                      <h4 className="font-medium text-sm mb-2">UI Settings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`disabled-${index}`} 
                            checked={field.props.disabled || false}
                            onChange={(e) => updateFieldProp(index, 'props.disabled', e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor={`disabled-${index}`} className="text-sm">Disabled</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`hidden-${index}`} 
                            checked={field.props.hidden || false}
                            onChange={(e) => updateFieldProp(index, 'props.hidden', e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor={`hidden-${index}`} className="text-sm">Hidden</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id={`readonly-${index}`} 
                            checked={field.props.readonly || false}
                            onChange={(e) => updateFieldProp(index, 'props.readonly', e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor={`readonly-${index}`} className="text-sm">Readonly</label>
                        </div>
                      </div>
                    </div>
                    
                    {(field.type === 'input' || field.type === 'select' || field.type === 'radio') && (
                      <div className="md:col-span-2 pt-2 border-t border-gray-200">
                        <h4 className="font-medium text-sm mb-2">Conditional Display</h4>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hide Expression</label>
                            <input 
                              type="text" 
                              placeholder="E.g. !model.showField"
                              value={field.expressions?.hide || ''}
                              onChange={(e) => {
                                if (!field.expressions) {
                                  updateFieldProp(index, 'expressions', { hide: e.target.value });
                                } else {
                                  updateFieldProp(index, 'expressions.hide', e.target.value);
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              Enter a condition when this field should be hidden. E.g. "!model.showField" or "model.type !== 'business'"
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {/* Form Preview */}
            {showFormPreview && formFields.length > 0 && (
              <div className="border border-gray-200 rounded-md p-4 transition-colors">
                <h3 className="font-medium mb-4 text-lg">Form Preview</h3>
                
                <div className="space-y-4">
                  {formFields.map((field, index) => (
                    <div key={`preview-${index}`} className="mb-4">
                      {/* Input */}
                      {field.type === 'input' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{field.props.label}</label>
                          <input 
                            type={field.props.type || 'text'} 
                            placeholder={field.props.placeholder} 
                            disabled={field.props.disabled}
                            readOnly={field.props.readonly}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          {field.props.description && (
                            <p className="mt-1 text-sm text-gray-500">{field.props.description}</p>
                          )}
                        </div>
                      )}
                      
                      {/* Textarea */}
                      {field.type === 'textarea' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{field.props.label}</label>
                          <textarea 
                            placeholder={field.props.placeholder} 
                            disabled={field.props.disabled}
                            readOnly={field.props.readonly}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                          ></textarea>
                          {field.props.description && (
                            <p className="mt-1 text-sm text-gray-500">{field.props.description}</p>
                          )}
                        </div>
                      )}
                      
                      {/* Select */}
                      {field.type === 'select' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{field.props.label}</label>
                          <select 
                            disabled={field.props.disabled}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            <option value="" disabled selected>Select an option</option>
                            {field.props.options && field.props.options.map((option, i) => (
                              <option key={`select-option-${index}-${i}`} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                          {field.props.description && (
                            <p className="mt-1 text-sm text-gray-500">{field.props.description}</p>
                          )}
                        </div>
                      )}
                      
                      {/* Checkbox */}
                      {field.type === 'checkbox' && (
                        <div>
                          <div className="flex items-center">
                            <input 
                              type="checkbox" 
                              disabled={field.props.disabled}
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-200 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">{field.props.label}</label>
                          </div>
                          {field.props.description && (
                            <p className="mt-1 text-sm text-gray-500">{field.props.description}</p>
                          )}
                        </div>
                      )}
                      
                      {/* Radio Group */}
                      {field.type === 'radio' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{field.props.label}</label>
                          <div className="space-y-2">
                            {field.props.options && field.props.options.map((option, i) => (
                              <div key={`radio-option-${index}-${i}`} className="flex items-center">
                                <input 
                                  type="radio" 
                                  name={`preview-${field.key}`}
                                  value={option.value}
                                  disabled={field.props.disabled}
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-200"
                                />
                                <label className="ml-2 block text-sm text-gray-700">{option.label}</label>
                              </div>
                            ))}
                          </div>
                          {field.props.description && (
                            <p className="mt-1 text-sm text-gray-500">{field.props.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
