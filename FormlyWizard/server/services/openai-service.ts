import OpenAI from "openai";

/**
 * Service for OpenAI API interactions
 */
class OpenAIService {
  private openai: OpenAI | null = null;
  
  constructor() {
    // Initialize OpenAI client if API key is available
    const apiKey = process.env.OPENAI_API_KEY || "";
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }
  
  /**
   * Query the OpenAI model with Formly context
   */
  async queryModel(question: string): Promise<string | null> {
    if (!this.openai) {
      return null; // OpenAI not configured
    }
    
    try {
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant specializing in Angular Formly library. 
            You help users create form configurations, understand Formly concepts, and solve 
            problems related to dynamic form generation. Always provide code examples when 
            appropriate, particularly showing Formly JSON configurations.
            
            Key Formly concepts you know well:
            - Field configurations and types
            - Validation (sync and async)
            - Custom field types and wrappers
            - Form expressions and conditional fields
            - Nested forms with fieldGroups
            - Integration with Angular Reactive Forms
            
            When asked about code, respond with properly formatted TypeScript/Angular code examples.`
          },
          {
            role: "user",
            content: question
          }
        ],
        max_tokens: 1000,
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error querying OpenAI:", error);
      return null;
    }
  }
}

export const openaiService = new OpenAIService();
