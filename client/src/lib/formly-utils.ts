import { FormlyConfiguration, FormlyField, OutputFormat } from './formly-types';

/**
 * Utility functions for working with Formly configurations
 */
export class FormlyUtils {
  /**
   * Format a field key to be valid
   */
  static formatKey(key: string): string {
    return key
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  /**
   * Generate a Formly JSON configuration
   */
  static generateFormlyJson(config: FormlyConfiguration): string {
    // Create a properly formatted Formly JSON
    const formlyConfig = {
      model: config.model,
      fields: config.fields.map(field => {
        // Create a clean copy without unnecessary properties for the JSON
        const cleanField: any = {
          key: field.key,
          type: field.type,
          props: { ...field.props }
        };
        
        // Add validation if any is set
        if (field.validation && Object.values(field.validation).some(v => v !== false && v !== undefined && v !== '')) {
          cleanField.validation = { ...field.validation };
        }
        
        // Add expressions if any
        if (field.expressions && Object.keys(field.expressions).length > 0) {
          cleanField.expressions = { ...field.expressions };
        }
        
        return cleanField;
      })
    };
    
    return JSON.stringify(formlyConfig, null, 2);
  }

  /**
   * Generate TypeScript definition for a form
   */
  static generateTypeScriptDefinition(config: FormlyConfiguration): string {
    const className = config.className || 'FormlyForm';
    const modelName = config.model || 'formData';
    const fields = config.fields.map(field => {
      const cleanField: any = {
        key: field.key,
        type: field.type,
        props: { ...field.props }
      };
      
      if (field.validation && Object.values(field.validation).some(v => v !== false && v !== undefined && v !== '')) {
        cleanField.validation = { ...field.validation };
      }
      
      if (field.expressions && Object.keys(field.expressions).length > 0) {
        cleanField.expressions = { ...field.expressions };
      }
      
      return cleanField;
    });
    
    return `import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-${this.toKebabCase(className)}',
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  \`
})
export class ${className} implements OnInit {
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = ${JSON.stringify(fields, null, 2)};

  constructor() {}

  ngOnInit() {}

  onSubmit() {
    if (this.form.valid) {
      console.log(this.model);
    }
  }
}`;
  }

  /**
   * Generate Angular component for a form
   */
  static generateAngularComponent(config: FormlyConfiguration): string {
    const className = config.className || 'FormlyForm';
    const modelName = config.model || 'formData';
    const fields = config.fields.map(field => {
      const cleanField: any = {
        key: field.key,
        type: field.type,
        props: { ...field.props }
      };
      
      if (field.validation && Object.values(field.validation).some(v => v !== false && v !== undefined && v !== '')) {
        cleanField.validation = { ...field.validation };
      }
      
      if (field.expressions && Object.keys(field.expressions).length > 0) {
        cleanField.expressions = { ...field.expressions };
      }
      
      return cleanField;
    });
    
    return `import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'app-${this.toKebabCase(className)}',
  template: \`
    <div class="card">
      <div class="card-header">
        <h3>${this.toTitleCase(className)}</h3>
      </div>
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <formly-form 
            [form]="form" 
            [fields]="fields" 
            [model]="model"
            [options]="options">
          </formly-form>
          <div class="mt-3">
            <button type="submit" class="btn btn-primary" [disabled]="!form.valid">Submit</button>
            <button type="button" class="btn btn-secondary ml-2" (click)="resetForm()">Reset</button>
          </div>
        </form>
      </div>
    </div>
  \`,
})
export class ${className} implements OnInit {
  form = new FormGroup({});
  model = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = ${JSON.stringify(fields, null, 2)};

  constructor() {}

  ngOnInit() {
    // Initialize form
  }

  onSubmit() {
    if (this.form.valid) {
      alert(JSON.stringify(this.model, null, 2));
      // Process form data
    }
  }

  resetForm() {
    this.form.reset();
    this.options.resetModel();
  }
}`;
  }

  /**
   * Generate code based on the chosen output format
   */
  static generateOutput(config: FormlyConfiguration, format: OutputFormat): string {
    switch (format) {
      case OutputFormat.TYPESCRIPT:
        return this.generateTypeScriptDefinition(config);
      case OutputFormat.ANGULAR_COMPONENT:
        return this.generateAngularComponent(config);
      case OutputFormat.FORMLY_JSON:
      default:
        return this.generateFormlyJson(config);
    }
  }

  /**
   * Get field type options based on field type
   */
  static getFieldTypeOptions(fieldType: string): Array<{ value: string; label: string }> {
    switch (fieldType) {
      case 'input':
        return [
          { value: 'text', label: 'Text' },
          { value: 'number', label: 'Number' },
          { value: 'email', label: 'Email' },
          { value: 'password', label: 'Password' },
          { value: 'tel', label: 'Telephone' },
          { value: 'url', label: 'URL' },
          { value: 'date', label: 'Date' }
        ];
      default:
        return [{ value: fieldType, label: this.toTitleCase(fieldType) }];
    }
  }

  // Helper methods
  static toTitleCase(str: string): string {
    return str.replace(/([A-Z])/g, ' $1')
      .replace(/^./, function(str){ return str.toUpperCase(); })
      .replace(/([a-z])(\d)/g, '$1 $2')
      .trim();
  }
  
  static toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  static formatJsonString(json: string): string {
    // Replace with syntax highlighting classes
    return json
      .replace(/"(\w+)":/g, '<span class="text-orange-500">"$1":</span>')
      .replace(/"([^"]+)"(?!:)/g, '<span class="text-green-500">"$1"</span>')
      .replace(/\b(true|false)\b/g, '<span class="text-yellow-500">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-blue-500">$1</span>')
      .replace(/\bnull\b/g, '<span class="text-gray-500">null</span>');
  }
}
