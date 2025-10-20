import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Bot } from "lucide-react";

const QUALIFICATION_QUESTIONS = [
  "Budget and pre-approval status",
  "Desired property location",
  "Property type and features",
  "Timeline to buy/sell",
  "Current housing situation",
];

interface ChatbotSetupProps {
  profileData: any;
  userId: string | null;
  onNext: () => void;
  onBack: () => void;
}

const ChatbotSetup = ({ profileData, userId, onNext, onBack }: ChatbotSetupProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bot_name: `${profileData.full_name?.split(' ')[0] || 'My'}Bot`,
    greeting_message: `Hi! I'm ${profileData.full_name?.split(' ')[0] || 'your real estate assistant'}. I'm here to help you find your dream home. How can I assist you today?`,
    qualification_questions: [] as string[],
    handoff_rules: "qualified_lead",
  });

  const handleQuestionToggle = (question: string) => {
    const current = formData.qualification_questions;
    const updated = current.includes(question)
      ? current.filter(q => q !== question)
      : [...current, question];
    setFormData({ ...formData, qualification_questions: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("chatbot_settings").upsert({
        user_id: userId,
        ...formData,
      });

      if (error) throw error;
      toast.success("Chatbot configured!");
      onNext();
    } catch (error: any) {
      toast.error("Failed to save chatbot settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">AI Chatbot Setup</h2>
        <p className="text-muted-foreground">Customize your AI assistant to qualify leads 24/7</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot_name">Chatbot Name</Label>
            <Input
              id="bot_name"
              value={formData.bot_name}
              onChange={(e) => setFormData({ ...formData, bot_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="greeting_message">Greeting Message</Label>
            <Textarea
              id="greeting_message"
              value={formData.greeting_message}
              onChange={(e) => setFormData({ ...formData, greeting_message: e.target.value.slice(0, 300) })}
              maxLength={300}
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              {formData.greeting_message.length}/300 characters
            </p>
          </div>

          <div className="space-y-3">
            <Label>Qualification Questions</Label>
            <div className="space-y-2">
              {QUALIFICATION_QUESTIONS.map((question) => (
                <div key={question} className="flex items-center space-x-2">
                  <Checkbox
                    id={question}
                    checked={formData.qualification_questions.includes(question)}
                    onCheckedChange={() => handleQuestionToggle(question)}
                  />
                  <Label htmlFor={question} className="cursor-pointer text-sm">
                    {question}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>When to Notify You</Label>
            <RadioGroup
              value={formData.handoff_rules}
              onValueChange={(value) => setFormData({ ...formData, handoff_rules: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any_conversation" id="any_conversation" />
                <Label htmlFor="any_conversation" className="cursor-pointer">Any conversation starts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="qualified_lead" id="qualified_lead" />
                <Label htmlFor="qualified_lead" className="cursor-pointer">Lead is qualified</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="appointment_request" id="appointment_request" />
                <Label htmlFor="appointment_request" className="cursor-pointer">Appointment requested</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Chatbot Preview */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold">{formData.bot_name}</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-background p-3 rounded-lg shadow-sm">
                <p className="text-sm">{formData.greeting_message}</p>
              </div>

              <div className="bg-primary/10 p-3 rounded-lg ml-8">
                <p className="text-sm">Hi! I'm looking to buy a home in Toronto.</p>
              </div>

              <div className="bg-background p-3 rounded-lg shadow-sm">
                <p className="text-sm">
                  Great! I'd love to help you. To get started, could you tell me a bit about your budget?
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Preview of how your chatbot will interact with leads
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </form>
  );
};

export default ChatbotSetup;
