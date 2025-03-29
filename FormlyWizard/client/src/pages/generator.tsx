import { useState } from "react";
import FieldSelector from "@/components/field-selector";
import FormBuilder from "@/components/form-builder";
import JsonOutput from "@/components/json-output";
import { FormlyConfiguration, FormlyField, OutputFormat } from "@/lib/formly-types";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Generator() {
  const { toast } = useToast();
  
  // Form state
  const [formFields, setFormFields] = useState<FormlyField[]>([]);
  const [formModelName, setFormModelName] = useState<string>("formData");
  const [formClassName, setFormClassName] = useState<string>("FormlyForm");
  const [formName, setFormName] = useState<string>("My Form");
  const [formDescription, setFormDescription] = useState<string>("");
  const [showFieldNameSettings, setShowFieldNameSettings] = useState<boolean>(false);
  const [showFormPreview, setShowFormPreview] = useState<boolean>(false);
  const [jsonOutputMode, setJsonOutputMode] = useState<OutputFormat>(OutputFormat.FORMLY_JSON);

  // Add a field to the form
  const addFieldToForm = (field: FormlyField) => {
    // Clone the field to avoid modifying the original
    const newField: FormlyField = { ...field };
    
    // Set a default key if empty
    if (!newField.key) {
      newField.key = `${newField.type}${formFields.length + 1}`;
    }
    
    // Ensure props
    newField.props = newField.props || {};
    
    // Set default label if empty
    if (!newField.props.label) {
      newField.props.label = newField.key.charAt(0).toUpperCase() + newField.key.slice(1);
    }
    
    // Add validation object
    newField.validation = newField.validation || {
      required: false
    };
    
    setFormFields([...formFields, newField]);
  };

  // Remove a field from the form
  const removeField = (index: number) => {
    const newFields = [...formFields];
    newFields.splice(index, 1);
    setFormFields(newFields);
  };

  // Duplicate a field
  const duplicateField = (index: number) => {
    const originalField = formFields[index];
    const newField = { ...originalField, key: `${originalField.key}_copy` };
    const newFields = [...formFields];
    newFields.splice(index + 1, 0, newField);
    setFormFields(newFields);
  };

  // Move a field up or down
  const moveField = (index: number, direction: number) => {
    if (
      (direction < 0 && index === 0) || 
      (direction > 0 && index === formFields.length - 1)
    ) {
      return; // Can't move beyond bounds
    }
    
    const newIndex = index + direction;
    const newFields = [...formFields];
    const [movedField] = newFields.splice(index, 1);
    newFields.splice(newIndex, 0, movedField);
    setFormFields(newFields);
  };

  // Update a field
  const updateField = (index: number, field: FormlyField) => {
    const newFields = [...formFields];
    newFields[index] = field;
    setFormFields(newFields);
  };

  // Clear all fields
  const clearForm = () => {
    if (confirm('Are you sure you want to clear the form? All fields will be removed.')) {
      setFormFields([]);
    }
  };

  // Save the form configuration
  const saveForm = async () => {
    try {
      const formConfig: FormlyConfiguration = {
        name: formName,
        description: formDescription,
        model: formModelName,
        className: formClassName,
        fields: formFields
      };

      await apiRequest('POST', '/api/forms', formConfig);
      
      toast({
        title: "Form Saved",
        description: "Your form configuration has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save form configuration.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
        {/* Field Selector Panel */}
        <FieldSelector 
          onAddField={addFieldToForm} 
          onClearForm={clearForm} 
        />
        
        {/* Form Builder Panel */}
        <FormBuilder 
          formFields={formFields}
          formModelName={formModelName}
          formClassName={formClassName}
          formName={formName}
          formDescription={formDescription}
          showFieldNameSettings={showFieldNameSettings}
          showFormPreview={showFormPreview}
          onFieldMove={moveField}
          onFieldRemove={removeField}
          onFieldDuplicate={duplicateField}
          onFieldUpdate={updateField}
          onToggleFieldNameSettings={() => setShowFieldNameSettings(!showFieldNameSettings)}
          onToggleFormPreview={() => setShowFormPreview(!showFormPreview)}
          onModelNameChange={setFormModelName}
          onClassNameChange={setFormClassName}
          onFormNameChange={setFormName}
          onFormDescriptionChange={setFormDescription}
          onAddField={addFieldToForm}
          onSaveForm={saveForm}
        />
        
        {/* JSON Output Panel */}
        <JsonOutput 
          formConfiguration={{
            name: formName,
            description: formDescription,
            model: formModelName,
            className: formClassName,
            fields: formFields
          }} 
          outputMode={jsonOutputMode}
          onOutputModeChange={setJsonOutputMode}
        />
      </div>
    </div>
  );
}
