import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { label: "Analyze my pipeline", prompt: "Can you analyze my current pipeline and provide insights?" },
    { label: "Draft follow-up email", prompt: "Help me draft a follow-up email for my top contact" },
    { label: "Create task", prompt: "Help me create a task for today" },
    { label: "Market research", prompt: "What are the current real estate market trends I should know about?" }
  ];

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke('claude-chat', {
        body: {
          messages: [...messages, userMessage],
          conversationId
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Bot className="w-8 h-8 text-primary" />
                  Realtor AI Assistant
                </h1>
                <p className="text-muted-foreground">
                  Your intelligent real estate CRM assistant
                </p>
              </div>
              {messages.length > 0 && (
                <Button variant="outline" onClick={clearChat} size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Chat
                </Button>
              )}
            </div>

            {/* Quick Actions */}
            {messages.length === 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleQuickAction(action.prompt)}
                      className="h-auto py-3 text-left justify-start"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <Card className="flex-1 mb-4 p-4 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Welcome to Realtor AI Assistant</h3>
                    <p className="text-muted-foreground max-w-md">
                      I can help you manage contacts, analyze deals, create tasks, 
                      and provide real estate insights. Try one of the quick actions above!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'assistant' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        {message.role === 'assistant' ? (
                          <Bot className="w-5 h-5" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div className={`flex-1 rounded-lg p-3 ${
                        message.role === 'assistant'
                          ? 'bg-muted'
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        {message.role === 'assistant' ? (
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                        ) : (
                          <p className="text-sm">{message.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </Card>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your CRM, contacts, deals..."
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIAssistant;