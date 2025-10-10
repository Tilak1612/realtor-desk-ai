import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ExitIntentPopup = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
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
          source: 'exit_intent',
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success! ✅",
        description: "Thanks! We'll send you the free guide shortly.",
      });
      
      setIsOpen(false);
      setEmail("");
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
        
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold mb-4 gradient-text">
            Wait! Before You Go...
          </h2>
          <p className="text-muted-foreground mb-6">
            Get our free guide: "10 Ways AI Can Triple Your Real Estate Closings"
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <Button type="submit" className="w-full btn-gradient" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Send Me The Free Guide"}
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
