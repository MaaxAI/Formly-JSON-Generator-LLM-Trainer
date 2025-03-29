// Types for Formly field configuration

export interface FormlyFieldProps {
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  readonly?: boolean;
  type?: string;
  options?: Array<{ value: string; label: string }>;
  [key: string]: any;
}

export interface FormlyFieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternType?: string;
  [key: string]: any;
}

export interface FormlyField {
  key: string;
  type: string;
  props: FormlyFieldProps;
  validation?: FormlyFieldValidation;
  expressions?: Record<string, string>;
  icon?: string;
  label?: string;
  description?: string;
}

export interface FormlyConfiguration {
  id?: number;
  name: string;
  description?: string;
  model: string;
  className?: string;
  fields: FormlyField[];
  createdAt?: string;
  updatedAt?: string;
}

// Types for field selection
export interface FieldDefinition {
  type: string;
  props: FormlyFieldProps;
  label: string;
  icon: string;
  description: string;
  key: string;
}

// Types for output formats
export enum OutputFormat {
  FORMLY_JSON = 'formly',
  TYPESCRIPT = 'typescript',
  ANGULAR_COMPONENT = 'angular'
}

// Training model types
export interface TrainingModel {
  id?: number;
  name: string;
  baseModel: string;
  epochs: number;
  learningRate: string;
  includeDocs: boolean;
  includeExamples: boolean;
  status: 'training' | 'complete' | 'failed';
  createdAt?: string;
  updatedAt?: string;
}

// Training data types
export interface TrainingData {
  id?: number;
  source: 'form' | 'documentation' | 'example';
  content: string;
  type?: string;
  createdAt?: string;
}

// Chat message types
export interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
}
