import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ExitIntentPopup = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [currentCRM, setCurrentCRM] = useState("");
  const [hasShown, setHasShown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from the top of the page and hasn't been shown
      if (e.clientY <= 0 && !hasShown && !sessionStorage.getItem('exitIntentShown')) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("email_captures").insert([
        {
          email: email.trim(),
          source: `exit_intent_${currentCRM || 'unknown'}`,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success! 📊",
        description: "Check your email for your personalized comparison report!",
      });
      
      setIsOpen(false);
      setEmail("");
      setCurrentCRM("");
    } catch (error) {
      console.error("Error capturing email:", error);
      toast({
        title: "Error",
        description: "There was an error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="py-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-3 gradient-text">
              ⚠️ Wait! Before You Go...
            </h2>
            <p className="text-lg font-semibold mb-2">
              See How Realtor Desk AI Compares to What You're Using
            </p>
            <p className="text-sm text-muted-foreground">
              Get a FREE personalized comparison report showing exactly what you're missing + your potential ROI
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-left block mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <Label htmlFor="crm" className="text-left block mb-2">
                Current CRM (or "None")
              </Label>
              <Select value={currentCRM} onValueChange={setCurrentCRM}>
                <SelectTrigger id="crm" className="w-full">
                  <SelectValue placeholder="Select your current CRM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boldtrail">BoldTrail/kvCORE</SelectItem>
                  <SelectItem value="lofty">Lofty</SelectItem>
                  <SelectItem value="ixact">IXACT Contact</SelectItem>
                  <SelectItem value="wise-agent">Wise Agent</SelectItem>
                  <SelectItem value="follow-up-boss">Follow Up Boss</SelectItem>
                  <SelectItem value="none">No CRM yet</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full btn-gradient" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Me the Comparison Report"}
            </Button>
          </form>
          
          <div className="mt-4 p-3 bg-accent/10 rounded-lg">
            <p className="text-xs text-center italic">
              "Helped me realize I was overpaying by $4,000/year"<br/>
              <span className="text-muted-foreground">- David M., Calgary</span>
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors underline"
          >
            No thanks, I'll figure it out myself
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
