import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Link as RouterLink } from "react-router-dom";
import { SEO } from "@/components/SEO";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name (at least 2 characters)").max(100, "Name cannot exceed 100 characters"),
  email: z.string().trim().email("Please enter a valid email address (e.g., you@example.com)").max(255, "Email cannot exceed 255 characters"),
  phone: z.string().trim().regex(/^[0-9\s()+-]{10,20}$/, "Please enter a valid phone number (e.g., (416) 555-0123)").optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please provide more details (at least 10 characters)").max(2000, "Message cannot exceed 2000 characters"),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "Please accept the Privacy Policy to continue",
  }),
});

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    privacyConsent: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate input
      const validatedData = contactSchema.parse(formData);

      const { error } = await supabase.from("contact_submissions").insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          message: validatedData.message,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Message Sent Successfully! ✅",
        description: "Thank you for contacting us! We'll respond to your inquiry within 24 hours.",
        duration: 6000,
      });
      
      setFormData({ name: "", email: "", phone: "", message: "", privacyConsent: false });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Please Check Your Information",
          description: error.errors[0].message,
          variant: "destructive",
          duration: 6000,
        });
      } else {
        toast({
          title: "Unable to Send Message",
          description: "There was an error submitting your message. Please try again or email us at support@realtordesk.ai",
          variant: "destructive",
          duration: 6000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Contact RealtorDesk AI | Canadian Support"
        description="Contact RealtorDesk AI for CRM support, AI lead generation questions, and Canadian real estate compliance help."
        keywords="real estate crm support, realtor desk contact, crm help for realtors"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <h1 className="mb-6 animate-fade-in-up">
            {t('contact.hero.title')} <span className="gradient-text">{t('contact.hero.titleGradient')}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            {t('contact.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6">
                <Mail className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">{t('contact.info.emailUs')}</h3>
                <p className="text-muted-foreground">support@realtordesk.ai</p>
              </Card>

              <Card className="p-6">
                <Mail className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">{t('contact.info.support', 'Support')}</h3>
                <p className="text-muted-foreground">support@realtordesk.ai</p>
                <p className="text-muted-foreground">{t('contact.info.responseTime', 'We respond within 24 hours')}</p>
              </Card>

              <Card className="p-6">
                <MapPin className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">{t('contact.info.visitUs')}</h3>
                <p className="text-muted-foreground">
                  Edmonton, Alberta, Canada
                </p>
              </Card>

              <Card className="p-6">
                <Clock className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">{t('contact.info.hours')}</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {t('contact.info.hoursDetails')}
                </p>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-3xl font-bold mb-6">{t('contact.form.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('contact.form.name')}</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('contact.form.email')}</label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.form.phone')}</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(416) 555-0123"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.form.message')}</label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                    />
                  </div>

                  {/* PIPEDA Compliance - Privacy Consent */}
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="privacyConsent"
                      checked={formData.privacyConsent}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, privacyConsent: checked as boolean })
                      }
                    />
                    <div className="space-y-1 leading-none">
                      <label
                        htmlFor="privacyConsent"
                        className="text-sm font-medium leading-relaxed cursor-pointer"
                      >
                        {t('contact.consent', 'I consent to my information being collected and used as described in the')}{" "}
                        <RouterLink to="/privacy-policy" className="text-primary underline">
                          {t("contact.privacyPolicyLink", "Privacy Policy")}
                        </RouterLink>
                        {" "}*
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {t('contact.pipedaNote', 'Required under PIPEDA - Your data will only be used to respond to your inquiry')}
                      </p>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full btn-gradient" disabled={isSubmitting}>
                    {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Map integration placeholder</p>
              <p className="text-sm text-muted-foreground">Edmonton, Alberta, Canada</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
