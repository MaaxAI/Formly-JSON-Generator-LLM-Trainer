import { useRef, useEffect } from "react";
import { ChatMessage } from "@/lib/formly-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface AssistantChatPanelProps {
  messages: ChatMessage[];
  inputValue: string;
  isQuerying: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export default function AssistantChatPanel({
  messages,
  inputValue,
  isQuerying,
  onInputChange,
  onSendMessage,
  onKeyPress
}: AssistantChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Format message content (handle code blocks, line breaks, etc.)
  const formatMessageContent = (content: string) => {
    // First handle code blocks (```...```)
    let formattedContent = content.replace(
      /```([\s\S]*?)```/g, 
      '<pre class="mt-2 bg-gray-50 p-2 rounded-md text-xs font-mono overflow-x-auto">$1</pre>'
    );
    
    // Then handle inline code (`...`)
    formattedContent = formattedContent.replace(
      /`([^`]+)`/g, 
      '<code class="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">$1</code>'
    );
    
    // Handle lists
    formattedContent = formattedContent.replace(
      /^\s*-\s+(.*)/gm,
      '<li class="ml-5">$1</li>'
    ).replace(/<li.*?<\/li>/g, match => {
      return match.includes('<li') && !match.includes('<ul') 
        ? `<ul class="mt-2 space-y-1">${match}</ul>` 
        : match;
    });
    
    // Handle line breaks
    formattedContent = formattedContent.replace(/\n/g, '<br>');
    
    return formattedContent;
  };

  return (
    <div className="md:col-span-8 bg-white rounded-lg shadow-md p-0 flex flex-col h-[calc(100vh-200px)] overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800 flex items-center">
          <span className="material-icons mr-2">chat</span>
          Formly Assistant
        </h2>
        <button 
          onClick={() => window.location.reload()}
          className="p-1 rounded-full hover:bg-gray-50 transition-colors text-gray-500" 
          title="New Conversation"
        >
          <span className="material-icons">add_circle_outline</span>
        </button>
      </div>
      
      <ScrollArea className="flex-1 p-4 bg-gray-50 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex items-start ${message.role === 'user' ? 'justify-end' : ''}`}
          >
            {message.role === 'assistant' && (
              <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center text-white mr-3 flex-shrink-0">
                <span className="material-icons text-sm">smart_toy</span>
              </div>
            )}
            
            <div 
              className={`p-3 rounded-lg shadow-sm max-w-[80%] ${
                message.role === 'user' 
                  ? 'bg-primary/90 text-white' 
                  : 'bg-white'
              }`}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }} 
                className="message-content"
              />
            </div>
            
            {message.role === 'user' && (
              <div className="rounded-full bg-gray-700 w-8 h-8 flex items-center justify-center text-white ml-3 flex-shrink-0">
                <span className="material-icons text-sm">person</span>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
      
      <div className="p-3 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            placeholder="Ask about Formly..."
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyPress}
            disabled={isQuerying}
            className="flex-1"
          />
          <Button 
            onClick={onSendMessage}
            disabled={!inputValue.trim() || isQuerying}
            className="px-4 py-2 bg-primary text-white rounded-md flex items-center justify-center"
          >
            {isQuerying ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <span className="material-icons">send</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
