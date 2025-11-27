import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Calendar, Clock, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useTranslation } from "react-i18next";

const DemoBookingSection = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const demoFormSchema = z.object({
    name: z.string().trim().min(1, t('demoBooking.nameRequired')).max(100),
    email: z.string().trim().email(t('demoBooking.emailInvalid')).max(255),
    phone: z.string().trim().min(1, t('demoBooking.phoneRequired')).max(20),
    brokerage: z.string().trim().min(1, t('demoBooking.brokerageRequired')).max(100),
    interests: z.array(z.string()).min(1, t('demoBooking.interestsRequired')),
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [brokerage, setBrokerage] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleInterestToggle = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = demoFormSchema.parse({
        name,
        email,
        phone,
        brokerage,
        interests,
      });

      setIsSubmitting(true);

      const { error } = await supabase.from("email_captures").insert([
        {
          email: formData.email,
          source: "demo_booking",
          metadata: {
            name: formData.name,
            phone: formData.phone,
            brokerage: formData.brokerage,
            interests: formData.interests,
            timezone: userTimezone,
          }
        },
      ]);

      if (error) throw error;

      toast({
        title: t('demoBooking.successTitle'),
        description: t('demoBooking.successDescription'),
      });

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setBrokerage("");
      setInterests([]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: t('demoBooking.validationError'),
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: t('demoBooking.errorTitle'),
          description: t('demoBooking.errorDescription'),
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container-custom">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold">{t('demoBooking.title')}</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* LEFT COLUMN: Benefits */}
          <div className="space-y-6">
            <Card className="p-6 bg-background">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('demoBooking.demoTitle')}</h3>
                  <p className="text-sm text-muted-foreground">{t('demoBooking.liveDemo')}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <p className="font-semibold mb-3">{t('demoBooking.whatYouSee')}</p>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{t('demoBooking.benefit1')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{t('demoBooking.benefit2')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{t('demoBooking.benefit3')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{t('demoBooking.benefit4')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{t('demoBooking.benefit5')}</span>
                </div>
              </div>

              {/* Testimonial */}
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-sm italic mb-2">
                  {t('demoBooking.testimonial')}
                </p>
                <p className="text-xs text-muted-foreground">{t('demoBooking.testimonialAuthor')}</p>
              </div>
            </Card>

            {/* Additional info */}
            <div className="flex items-start gap-3 p-4 bg-background rounded-lg border">
              <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm mb-1">{t('demoBooking.flexibleScheduling')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('demoBooking.flexibleSchedulingDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Booking Form */}
          <Card className="p-6 bg-background">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">{t('demoBooking.bookYourDemo')}</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="demo-name" className="mb-2 block">{t('demoBooking.nameLabel')}</Label>
                <Input
                  id="demo-name"
                  type="text"
                  placeholder={t('demoBooking.namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="demo-email" className="mb-2 block">{t('demoBooking.emailLabel')}</Label>
                <Input
                  id="demo-email"
                  type="email"
                  placeholder={t('demoBooking.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="demo-phone" className="mb-2 block">{t('demoBooking.phoneLabel')}</Label>
                <Input
                  id="demo-phone"
                  type="tel"
                  placeholder={t('demoBooking.phonePlaceholder')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="demo-brokerage" className="mb-2 block">{t('demoBooking.brokerageLabel')}</Label>
                <Input
                  id="demo-brokerage"
                  type="text"
                  placeholder={t('demoBooking.brokeragePlaceholder')}
                  value={brokerage}
                  onChange={(e) => setBrokerage(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="mb-3 block">{t('demoBooking.interestsLabel')}</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="interest-chatbot"
                      checked={interests.includes("Chatbot")}
                      onCheckedChange={() => handleInterestToggle("Chatbot")}
                    />
                    <Label htmlFor="interest-chatbot" className="cursor-pointer font-normal">
                      {t('demoBooking.interestChatbot')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="interest-voice"
                      checked={interests.includes("Voice")}
                      onCheckedChange={() => handleInterestToggle("Voice")}
                    />
                    <Label htmlFor="interest-voice" className="cursor-pointer font-normal">
                      {t('demoBooking.interestVoice')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="interest-email"
                      checked={interests.includes("Email")}
                      onCheckedChange={() => handleInterestToggle("Email")}
                    />
                    <Label htmlFor="interest-email" className="cursor-pointer font-normal">
                      {t('demoBooking.interestEmail')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="interest-all"
                      checked={interests.includes("All")}
                      onCheckedChange={() => handleInterestToggle("All")}
                    />
                    <Label htmlFor="interest-all" className="cursor-pointer font-normal">
                      {t('demoBooking.interestAll')}
                    </Label>
                  </div>
                </div>
              </div>

              {/* Timezone Display */}
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>{t('demoBooking.detectedTimezone')}</strong> {userTimezone}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full btn-gradient text-base py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('demoBooking.submitting') : t('demoBooking.submitButton')}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-center text-muted-foreground">
                {t('demoBooking.cantFindTime')}{" "}
                <a href="mailto:info@realtordesk.ai" className="text-primary hover:underline font-semibold">
                  info@realtordesk.ai
                </a>
                {" "}{t('demoBooking.andAccommodate')}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DemoBookingSection;
