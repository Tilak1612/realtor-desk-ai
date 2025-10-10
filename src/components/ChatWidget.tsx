import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Here you would integrate with your chat service
    // For now, we'll just open email
    window.location.href = `mailto:support@realtordesk.ai?subject=Chat Inquiry&body=${encodeURIComponent(message)}`;
    setMessage("");
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 shadow-2xl animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">Chat with us</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 rounded-full p-1"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-background">
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p className="text-sm">
                👋 Hi! Have questions about Realtor Desk AI? Send us a message and we'll get back to you right away.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full"
              />
              <Button type="submit" className="w-full btn-gradient">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              Or email us at: support@realtordesk.ai
            </p>
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatWidget;
