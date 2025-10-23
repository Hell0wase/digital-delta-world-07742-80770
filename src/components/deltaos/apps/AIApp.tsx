import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const GEMINI_API_KEY = 'AIzaSyBWDqMK9AupuOSaFOouiLnSOiCJFLT95us';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIApp = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: input }]
            }]
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        toast.error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received from AI';
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error: any) {
      console.error('AI Error:', error);
      toast.error(`Failed to get AI response: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20">
      <div className="p-4 border-b border-border/50 bg-background/50 backdrop-blur-xl">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
        <p className="text-xs text-muted-foreground">Powered by Google Gemini</p>
      </div>
      
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="text-6xl">🤖</div>
              <h3 className="text-xl font-semibold">AI Assistant Ready</h3>
              <p className="text-muted-foreground">Ask me anything to get started!</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white flex-shrink-0">
                  AI
                </div>
              )}
              <div
                className={`p-4 rounded-2xl max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 backdrop-blur-xl'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                  U
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white flex-shrink-0">
                AI
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-xl">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 bg-background/50"
          />
          <Button onClick={sendMessage} disabled={isLoading || !input.trim()} size="lg">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
