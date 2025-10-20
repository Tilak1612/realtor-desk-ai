import { useState, useEffect } from "react";
import { X, CheckCircle, Clock } from "lucide-react";
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
import { z } from "zod";

const betaFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").optional(),
  province: z.string().min(1, "Please select a province"),
});

const ExitIntentPopup = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
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
    
    try {
      // Validate form data
      const formData = betaFormSchema.parse({
        name,
        email,
        phone: phone || undefined,
        province,
      });

      setIsSubmitting(true);

      const { error } = await supabase.from("email_captures").insert([
        {
          email: formData.email,
          source: `beta_exit_intent_${formData.province}`,
          metadata: {
            name: formData.name,
            phone: formData.phone,
            province: formData.province,
          }
        },
      ]);

      if (error) throw error;

      toast({
        title: "Welcome to Beta! 🎉",
        description: "Your 20% lifetime discount is locked in! Check your email for next steps.",
      });
      
      setIsOpen(false);
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setProvince("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "There was an error. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-background shadow-2xl">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Wait! Before You Go...
            </h2>
            <p className="text-lg text-muted-foreground">
              Join our beta program and lock in 20% lifetime discount
            </p>
          </div>

          {/* Offer Highlights */}
          <div className="mb-6 space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-sm">30-day free trial—no credit card required</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-sm">Personalized setup call included</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-sm">Lifetime 20% discount for beta users</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-sm">Cancel anytime—no commitments</span>
            </div>
          </div>

          {/* Urgency Element */}
          <div className="mb-6 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <p className="text-sm font-semibold text-center flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Only 15 beta spots remaining this month
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-left block mb-2">
                Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-left block mb-2">
                Email *
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
              <Label htmlFor="phone" className="text-left block mb-2">
                Phone (optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="province" className="text-left block mb-2">
                I'm a realtor in *
              </Label>
              <Select value={province} onValueChange={setProvince} required>
                <SelectTrigger id="province" className="w-full bg-background">
                  <SelectValue placeholder="Select your province" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="ON">Ontario</SelectItem>
                  <SelectItem value="BC">British Columbia</SelectItem>
                  <SelectItem value="AB">Alberta</SelectItem>
                  <SelectItem value="QC">Quebec</SelectItem>
                  <SelectItem value="MB">Manitoba</SelectItem>
                  <SelectItem value="SK">Saskatchewan</SelectItem>
                  <SelectItem value="NS">Nova Scotia</SelectItem>
                  <SelectItem value="NB">New Brunswick</SelectItem>
                  <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                  <SelectItem value="PE">Prince Edward Island</SelectItem>
                  <SelectItem value="NT">Northwest Territories</SelectItem>
                  <SelectItem value="YT">Yukon</SelectItem>
                  <SelectItem value="NU">Nunavut</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base py-6" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Claim My Beta Discount"}
            </Button>
          </form>

          <button
            onClick={handleDecline}
            className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
          >
            No thanks, I'll pay full price later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
