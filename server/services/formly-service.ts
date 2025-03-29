import { FormConfiguration } from "@shared/schema";

/**
 * Service for Formly-related operations
 */
class FormlyService {
  /**
   * Generates sample form configurations for training data
   */
  generateSampleForms(): FormConfiguration[] {
    return [
      {
        name: "Contact Form",
        description: "A simple contact form with name, email, and message fields",
        model: "contact",
        className: "ContactForm",
        fields: [
          {
            key: "name",
            type: "input",
            props: {
              label: "Name",
              placeholder: "Enter your name",
              required: true
            },
            validation: {
              required: true
            }
          },
          {
            key: "email",
            type: "input",
            props: {
              label: "Email",
              placeholder: "Enter your email",
              type: "email",
              required: true
            },
            validation: {
              required: true
            }
          },
          {
            key: "message",
            type: "textarea",
            props: {
              label: "Message",
              placeholder: "Enter your message",
              rows: 5,
              required: true
            },
            validation: {
              required: true
            }
          }
        ]
      },
      {
        name: "Registration Form",
        description: "User registration form with validation",
        model: "registration",
        className: "RegistrationForm",
        fields: [
          {
            key: "username",
            type: "input",
            props: {
              label: "Username",
              placeholder: "Choose a username",
              required: true
            },
            validation: {
              required: true,
              minLength: 3
            }
          },
          {
            key: "email",
            type: "input",
            props: {
              label: "Email",
              placeholder: "Enter your email",
              type: "email",
              required: true
            },
            validation: {
              required: true
            }
          },
          {
            key: "password",
            type: "input",
            props: {
              label: "Password",
              placeholder: "Create a password",
              type: "password",
              required: true
            },
            validation: {
              required: true,
              minLength: 8
            }
          },
          {
            key: "confirmPassword",
            type: "input",
            props: {
              label: "Confirm Password",
              placeholder: "Confirm your password",
              type: "password",
              required: true
            },
            validation: {
              required: true
            }
          },
          {
            key: "acceptTerms",
            type: "checkbox",
            props: {
              label: "I accept the terms and conditions",
              required: true
            },
            validation: {
              required: true
            }
          }
        ]
      },
      {
        name: "Product Order Form",
        description: "Form for ordering products with conditional fields",
        model: "order",
        className: "ProductOrderForm",
        fields: [
          {
            key: "product",
            type: "select",
            props: {
              label: "Product",
              placeholder: "Select a product",
              required: true,
              options: [
                { value: "product1", label: "Product 1" },
                { value: "product2", label: "Product 2" },
                { value: "product3", label: "Product 3" }
              ]
            },
            validation: {
              required: true
            }
          },
          {
            key: "quantity",
            type: "input",
            props: {
              label: "Quantity",
              placeholder: "Enter quantity",
              type: "number",
              min: 1,
              required: true
            },
            validation: {
              required: true,
              min: 1
            }
          },
          {
            key: "shipping",
            type: "radio",
            props: {
              label: "Shipping Method",
              required: true,
              options: [
                { value: "standard", label: "Standard Shipping" },
                { value: "express", label: "Express Shipping" },
                { value: "overnight", label: "Overnight Shipping" }
              ]
            },
            validation: {
              required: true
            }
          },
          {
            key: "giftWrapping",
            type: "checkbox",
            props: {
              label: "Add Gift Wrapping"
            }
          },
          {
            key: "giftMessage",
            type: "textarea",
            props: {
              label: "Gift Message",
              placeholder: "Enter gift message",
              rows: 3
            },
            expressions: {
              hide: "!model.giftWrapping"
            }
          }
        ]
      },
      {
        name: "Survey Form",
        description: "Dynamic survey form with conditional questions",
        model: "survey",
        className: "SurveyForm",
        fields: [
          {
            key: "name",
            type: "input",
            props: {
              label: "Name",
              placeholder: "Enter your name"
            }
          },
          {
            key: "age",
            type: "input",
            props: {
              label: "Age",
              placeholder: "Enter your age",
              type: "number"
            }
          },
          {
            key: "category",
            type: "select",
            props: {
              label: "What category are you most interested in?",
              options: [
                { value: "technology", label: "Technology" },
                { value: "health", label: "Health & Wellness" },
                { value: "entertainment", label: "Entertainment" },
                { value: "other", label: "Other" }
              ]
            }
          },
          {
            key: "otherCategory",
            type: "input",
            props: {
              label: "Please specify category",
              placeholder: "Enter category"
            },
            expressions: {
              hide: "model.category !== 'other'"
            }
          },
          {
            key: "satisfaction",
            type: "radio",
            props: {
              label: "How satisfied are you with our service?",
              options: [
                { value: "5", label: "Very Satisfied" },
                { value: "4", label: "Satisfied" },
                { value: "3", label: "Neutral" },
                { value: "2", label: "Dissatisfied" },
                { value: "1", label: "Very Dissatisfied" }
              ]
            }
          },
          {
            key: "feedback",
            type: "textarea",
            props: {
              label: "Please provide additional feedback",
              placeholder: "Enter your feedback",
              rows: 4
            },
            expressions: {
              hide: "model.satisfaction >= 4"
            }
          },
          {
            key: "contactPermission",
            type: "checkbox",
            props: {
              label: "May we contact you for more information?"
            }
          },
          {
            key: "contactEmail",
            type: "input",
            props: {
              label: "Contact Email",
              placeholder: "Enter your email",
              type: "email"
            },
            expressions: {
              hide: "!model.contactPermission"
            }
          }
        ]
      }
    ];
  }

  /**
   * Converts a form configuration to Angular Formly JSON format
   */
  toFormlyJson(formConfig: FormConfiguration): string {
    return JSON.stringify({
      model: formConfig.model,
      fields: formConfig.fields
    }, null, 2);
  }

  /**
   * Converts a form configuration to TypeScript definition
   */
  toTypeScriptDefinition(formConfig: FormConfiguration): string {
    const className = formConfig.className || 'FormlyForm';
    const modelName = formConfig.model || 'formData';
    
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
  fields: FormlyFieldConfig[] = ${JSON.stringify(formConfig.fields, null, 2)};

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
   * Converts a form configuration to Angular component
   */
  toAngularComponent(formConfig: FormConfiguration): string {
    const className = formConfig.className || 'FormlyForm';
    const modelName = formConfig.model || 'formData';
    
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
  fields: FormlyFieldConfig[] = ${JSON.stringify(formConfig.fields, null, 2)};

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

  // Helper methods
  private toTitleCase(str: string): string {
    return str.replace(/([A-Z])/g, ' $1')
      .replace(/^./, function(str){ return str.toUpperCase(); })
      .replace(/([a-z])(\d)/g, '$1 $2')
      .trim();
  }
  
  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }
}

export const formlyService = new FormlyService();
