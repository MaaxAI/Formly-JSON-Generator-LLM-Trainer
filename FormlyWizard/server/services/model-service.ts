import { storage } from "../storage";
import { openaiService } from "./openai-service";

/**
 * Service for model training and querying
 */
class ModelService {
  /**
   * Train a model with the given ID
   */
  async trainModel(modelId: number): Promise<boolean> {
    try {
      // Get model information
      const model = await storage.getTrainingModel(modelId);
      if (!model) {
        throw new Error(`Model with ID ${modelId} not found`);
      }

      // Update status to training
      await storage.updateTrainingModelStatus(modelId, "training");

      // Get training data
      const trainingData = await storage.getAllTrainingData();
      if (trainingData.length === 0) {
        throw new Error("No training data available");
      }

      // In a real implementation, this would perform the actual training
      // For this prototype, we'll simulate training by waiting
      // and then updating the status to complete
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Update status to complete
      await storage.updateTrainingModelStatus(modelId, "complete");
      
      return true;
    } catch (error) {
      console.error("Error training model:", error);
      
      // Update status to failed
      await storage.updateTrainingModelStatus(modelId, "failed");
      
      return false;
    }
  }

  /**
   * Query the model with a user question
   */
  async queryModel(question: string): Promise<string> {
    try {
      // First try to use OpenAI for more sophisticated responses
      try {
        const openAiResponse = await openaiService.queryModel(question);
        if (openAiResponse) {
          return openAiResponse;
        }
      } catch (e) {
        console.log("OpenAI query failed, falling back to local responses");
      }
      
      // Fallback to local responses
      return this.generateLocalResponse(question);
    } catch (error) {
      console.error("Error querying model:", error);
      return "Sorry, I encountered an error while processing your question.";
    }
  }

  /**
   * Generate a local response based on keywords in the question
   */
  private generateLocalResponse(question: string): string {
    const lowerQuestion = question.toLowerCase();
    
    // Basic pattern matching
    if (lowerQuestion.includes("validation")) {
      return "To add validation to a Formly field, you can use the 'validation' property. For example:\n\n```javascript\n{\n  key: 'email',\n  type: 'input',\n  props: {\n    label: 'Email',\n    required: true\n  },\n  validation: {\n    messages: {\n      required: 'Email is required',\n      email: 'Invalid email format'\n    }\n  }\n}\n```\n\nYou can also use the validators API from @angular/forms.";
    } 
    
    if (lowerQuestion.includes("wrappers")) {
      return "Wrappers in Formly allow you to wrap your fields with additional elements. You can use them to add consistent styling, behavior, or functionality across multiple fields. To define a wrapper:\n\n```typescript\nexport const FIELD_WRAPPER = 'field-wrapper';\n\n@Component({\n  selector: 'formly-wrapper-field',\n  template: `\n    <div class=\"form-group\">\n      <label *ngIf=\"props.label\" [for]=\"id\">\n        {{ props.label }}\n        <span *ngIf=\"props.required\" class=\"required-star\">*</span>\n      </label>\n      <ng-template #fieldComponent></ng-template>\n      <div *ngIf=\"showError\" class=\"invalid-feedback\">\n        <formly-validation-message [field]=\"field\"></formly-validation-message>\n      </div>\n    </div>\n  `\n})\nexport class FieldWrapperComponent extends FieldWrapper {}\n\n// In your module\nFormlyModule.forRoot({\n  wrappers: [\n    { name: FIELD_WRAPPER, component: FieldWrapperComponent },\n  ],\n})\n```";
    }
    
    if (lowerQuestion.includes("custom field")) {
      return "To create a custom field type in Formly, you need to create a component and register it as a field type. Here's how:\n\n1. Create your custom component:\n```typescript\n@Component({\n  selector: 'formly-field-custom',\n  template: `\n    <input [type]=\"props.type\" [formControl]=\"formControl\" [formlyAttributes]=\"field\">\n  `\n})\nexport class CustomFieldComponent extends FieldType {}\n```\n\n2. Register it in your module:\n```typescript\nFormlyModule.forRoot({\n  types: [\n    { name: 'custom', component: CustomFieldComponent },\n  ],\n})\n```\n\n3. Use it in your form configuration:\n```typescript\nfields: FormlyFieldConfig[] = [\n  {\n    key: 'custom',\n    type: 'custom',\n    props: {\n      label: 'Custom Field',\n      // add custom props here\n    }\n  }\n];\n```";
    }
    
    if (lowerQuestion.includes("conditional")) {
      return "To create conditional fields in Formly, you can use the 'expressions' property. This allows you to show, hide, or otherwise modify fields based on values in your form model.\n\nExample:\n```javascript\n{\n  key: 'hasSubscription',\n  type: 'checkbox',\n  props: {\n    label: 'Do you have a subscription?',\n  }\n},\n{\n  key: 'subscriptionType',\n  type: 'select',\n  props: {\n    label: 'Subscription Type',\n    options: [\n      { value: 'basic', label: 'Basic' },\n      { value: 'premium', label: 'Premium' },\n    ]\n  },\n  expressions: {\n    hide: '!model.hasSubscription'\n  }\n}\n```\n\nThe 'hide' expression will hide the subscriptionType field when hasSubscription is false.";
    }
    
    if (lowerQuestion.includes("nested fields") || lowerQuestion.includes("fieldgroup")) {
      return "Yes, you can nest fields in Formly using the 'fieldGroup' property. This allows you to create complex forms with hierarchical data.\n\nExample:\n```javascript\n{\n  key: 'address',\n  wrappers: ['panel'],\n  props: { label: 'Address' },\n  fieldGroup: [\n    {\n      key: 'street',\n      type: 'input',\n      props: {\n        label: 'Street',\n      }\n    },\n    {\n      key: 'city',\n      type: 'input',\n      props: {\n        label: 'City',\n      }\n    },\n    {\n      key: 'state',\n      type: 'select',\n      props: {\n        label: 'State',\n        options: [\n          // state options\n        ]\n      }\n    }\n  ]\n}\n```\n\nThis will create a nested structure in your model: `{ address: { street: '', city: '', state: '' } }`";
    }
    
    if (lowerQuestion.includes("formly")) {
      return "Formly is a dynamic form library for Angular that helps you create forms from JSON configurations. It provides an easy way to render form fields, handle validation, and manage form state.\n\nKey features:\n- Dynamic field creation based on JSON schema\n- Built-in validation support\n- Custom field types and wrappers\n- Conditional fields\n- Nested form structures\n- Integration with Angular Reactive Forms\n\nTo get started, install the packages:\n```bash\nnpm install @ngx-formly/core @ngx-formly/bootstrap\n```\n\nThen import the modules:\n```typescript\nimport { ReactiveFormsModule } from '@angular/forms';\nimport { FormlyModule } from '@ngx-formly/core';\nimport { FormlyBootstrapModule } from '@ngx-formly/bootstrap';\n\n@NgModule({\n  imports: [\n    ReactiveFormsModule,\n    FormlyModule.forRoot(),\n    FormlyBootstrapModule\n  ]\n})\nexport class AppModule { }\n```";
    }
    
    // Default response
    return "I'm your Formly Assistant. I can help with creating Formly configurations, understanding concepts, and troubleshooting your forms. Could you please provide more details about what you'd like to know about Formly?";
  }
}

export const modelService = new ModelService();
