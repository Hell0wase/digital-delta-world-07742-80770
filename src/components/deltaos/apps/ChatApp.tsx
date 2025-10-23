import { useState, useEffect } from 'react';
import { OSData, ChatMessage } from '@/types/deltaos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { saveUserData } from '@/utils/storage';

interface ChatAppProps {
  userData: OSData;
}

export const ChatApp = ({ userData }: ChatAppProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(userData.chatHistory || []);
  const [input, setInput] = useState('');

  useEffect(() => {
    const updatedData = {
      ...userData,
      chatHistory: messages,
    };
    saveUserData(updatedData);
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user: userData.user.name,
      message: input,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Chat Room</h2>
        <p className="text-xs text-muted-foreground">
          Messages are stored locally on your device
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{msg.user}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="p-3 bg-muted rounded-lg">{msg.message}</div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
};
