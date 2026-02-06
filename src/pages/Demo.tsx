import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Form validation schema
const demoFormSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name (at least 2 characters)").max(100, "Name cannot exceed 100 characters"),
  email: z.string().trim().email("Please enter a valid email address (e.g., you@example.com)").max(255, "Email cannot exceed 255 characters"),
  phone: z.string().trim().regex(/^[0-9\s()+-]{10,20}$/, "Please enter a valid phone number (e.g., (555) 123-4567)"),
  brokerage: z.string().trim().max(100, "Brokerage name cannot exceed 100 characters").optional().or(z.literal("")),
  province: z.string().min(1, "Please select your province"),
  currentCrm: z.string().optional(),
  teamSize: z.string().optional(),
  biggestChallenge: z.string().optional(),
  comments: z.string().trim().max(1000, "Comments cannot exceed 1000 characters").optional().or(z.literal("")),
});

type DemoFormValues = z.infer<typeof demoFormSchema>;

const Demo = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DemoFormValues>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      brokerage: "",
      province: "",
      currentCrm: "",
      teamSize: "",
      biggestChallenge: "",
      comments: "",
    },
  });

  const onSubmit = async (values: DemoFormValues) => {
    setIsSubmitting(true);

    try {
      // Save to database
      const { error } = await supabase.from("demo_requests").insert([
        {
          full_name: values.fullName,
          email: values.email,
          phone: values.phone,
          brokerage: values.brokerage || null,
          province: values.province,
          current_crm: values.currentCrm || null,
          team_size: values.teamSize || null,
          biggest_challenge: values.biggestChallenge || null,
          comments: values.comments || null,
        },
      ]);

      if (error) throw error;

      // Sync to HubSpot in background (don't block on this)
      supabase.functions
        .invoke("hubspot-sync", {
          body: {
            email: values.email,
            fullName: values.fullName,
            phone: values.phone,
            brokerage: values.brokerage,
            province: values.province,
            currentCrm: values.currentCrm,
            teamSize: values.teamSize,
            biggestChallenge: values.biggestChallenge,
            comments: values.comments,
          },
        })
        .catch(() => {
          // HubSpot sync failed silently - not critical for user experience
        });

      toast({
        title: "Demo Request Received! ✅",
        description: "Success! We'll contact you within 24 hours to schedule your personalized demo session.",
        duration: 6000,
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Unable to Submit Request",
        description: "There was an error processing your demo request. Please try again or call us at 1-800-REALTOR-AI",
        variant: "destructive",
        duration: 6000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Book a Free Demo | RealtorDesk AI"
        description="Book a free demo of RealtorDesk AI. See AI lead generation, virtual tour integration, and real estate marketing tools in action."
        keywords="real estate crm demo, ai crm demo, realtor software demo, real estate lead generation software demo"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <h1 className="mb-6 animate-fade-in-up">
            {t('demo.hero.title')} <span className="gradient-text">{t('demo.hero.titleGradient')}</span> {t('demo.hero.titleEnd')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            {t('demo.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Demo Form Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Column - Form */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Request a Personalized Demo</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brokerage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brokerage/Company</FormLabel>
                          <FormControl>
                            <Input placeholder="ABC Realty" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select province" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ON">Ontario</SelectItem>
                              <SelectItem value="QC">Quebec</SelectItem>
                              <SelectItem value="BC">British Columbia</SelectItem>
                              <SelectItem value="AB">Alberta</SelectItem>
                              <SelectItem value="MB">Manitoba</SelectItem>
                              <SelectItem value="SK">Saskatchewan</SelectItem>
                              <SelectItem value="NS">Nova Scotia</SelectItem>
                              <SelectItem value="NB">New Brunswick</SelectItem>
                              <SelectItem value="PE">Prince Edward Island</SelectItem>
                              <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currentCrm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current CRM (if any)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select CRM" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="boldtrail">BoldTrail</SelectItem>
                              <SelectItem value="lofty">Lofty</SelectItem>
                              <SelectItem value="followupboss">Follow Up Boss</SelectItem>
                              <SelectItem value="liondesk">LionDesk</SelectItem>
                              <SelectItem value="wiseagent">Wise Agent</SelectItem>
                              <SelectItem value="ixact">IXACT Contact</SelectItem>
                              <SelectItem value="kvcore">kvCORE</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="teamSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Team Members</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select team size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="solo">Solo</SelectItem>
                              <SelectItem value="2-5">2-5</SelectItem>
                              <SelectItem value="6-10">6-10</SelectItem>
                              <SelectItem value="11-25">11-25</SelectItem>
                              <SelectItem value="26+">26+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="biggestChallenge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Biggest Challenge</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select challenge" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="lead-gen">Lead generation</SelectItem>
                              <SelectItem value="conversion">Lead conversion</SelectItem>
                              <SelectItem value="transaction">Transaction management</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="time">Time management</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comments/Questions</FormLabel>
                        <FormControl>
                          <Textarea rows={4} placeholder="Tell us more about your needs..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="btn-gradient w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Request Demo"}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    Or{" "}
                    <Link to="/signup" className="text-primary font-semibold hover:underline">
                      sign up now
                    </Link>{" "}
                    to get started immediately
                  </p>
                </form>
              </Form>
            </Card>

            {/* Right Column - Benefits */}
            <div className="space-y-8">
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                <h3 className="text-xl font-bold mb-4">What to Expect</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <MessageSquare className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Discovery Call (15 min)</h4>
                      <p className="text-sm text-muted-foreground">
                        We learn about your business, challenges, and goals
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Live Demo (30 min)</h4>
                      <p className="text-sm text-muted-foreground">
                        See Realtor Desk AI in action with examples specific to your market
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Custom Onboarding</h4>
                      <p className="text-sm text-muted-foreground">
                        Get started with personalized onboarding and support
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <a href="mailto:support@realtordesk.ai" className="font-semibold text-primary hover:underline">
                      support@realtordesk.ai
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <a href="tel:1-800-732-5867" className="font-semibold text-primary hover:underline">
                      1-800-REALTOR-AI
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Address</p>
                    <p className="font-semibold">Edmonton, Alberta, Canada</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-primary to-secondary text-white">
                <h3 className="text-xl font-bold mb-2">Prefer to explore on your own?</h3>
                <p className="mb-4 text-white/90">Start your 14-day free trial - no demo required</p>
                <Link to="/signup">
                  <Button variant="secondary" className="w-full" size="lg">
                    Start 14-Day Free Trial
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Demo;
