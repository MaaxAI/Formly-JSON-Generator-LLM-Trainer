import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import AssistantChatPanel from "@/components/assistant-chat-panel";
import AssistantHelpPanel from "@/components/assistant-help-panel";
import { ChatMessage } from "@/lib/formly-types";
import { ModelUtils } from "@/lib/model-utils";

export default function Assistant() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '👋 Hello! I\'m your Formly Assistant. I can help you with:\n\n- Creating Formly configurations\n- Understanding Formly concepts\n- Troubleshooting your forms\n- Providing best practices\n\nWhat would you like help with today?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  
  // Send a question to the model
  const sendQuestion = async () => {
    if (!inputValue.trim() || isQuerying) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsQuerying(true);
    
    try {
      // Get response from model
      const response = await ModelUtils.queryModel(userMessage.content);
      
      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response from the assistant",
        variant: "destructive",
      });
      
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your question. Please try again later."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsQuerying(false);
    }
  };
  
  // Handle quick help selection
  const handleQuickHelp = (question: string) => {
    setInputValue(question);
  };
  
  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  };
  
  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
        {/* Chat Panel */}
        <AssistantChatPanel 
          messages={messages}
          inputValue={inputValue}
          isQuerying={isQuerying}
          onInputChange={setInputValue}
          onSendMessage={sendQuestion}
          onKeyPress={handleKeyPress}
        />
        
        {/* Help Panel */}
        <AssistantHelpPanel 
          onSelectQuestion={handleQuickHelp}
        />
      </div>
    </div>
  );
}
