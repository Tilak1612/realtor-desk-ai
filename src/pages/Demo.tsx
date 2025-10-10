import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
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
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email is too long"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 characters").max(20, "Phone number is too long"),
  brokerage: z.string().trim().max(100, "Brokerage name is too long").optional(),
  province: z.string().min(1, "Please select a province"),
  currentCrm: z.string().optional(),
  teamSize: z.string().optional(),
  biggestChallenge: z.string().optional(),
  comments: z.string().trim().max(1000, "Comments are too long").optional(),
});

type DemoFormValues = z.infer<typeof demoFormSchema>;

const Demo = () => {
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
        .then((response) => {
          if (response.error) {
            console.error("HubSpot sync error:", response.error);
          } else {
            console.log("Successfully synced to HubSpot");
          }
        })
        .catch((err) => console.error("HubSpot sync failed:", err));

      toast({
        title: "Demo Request Submitted! ✅",
        description: "We'll contact you within 24 hours to schedule your personalized demo.",
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting demo request:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <h1 className="mb-6 animate-fade-in-up">
            See <span className="gradient-text">Realtor Desk AI</span> in Action
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Schedule a personalized demo and see how we can help your business
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
                              <SelectItem value="followupboss">Follow Up Boss</SelectItem>
                              <SelectItem value="liondesk">LionDesk</SelectItem>
                              <SelectItem value="wiseagent">Wise Agent</SelectItem>
                              <SelectItem value="ixact">IXACT Contact</SelectItem>
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
                    <a href="#trial" className="text-primary font-semibold hover:underline">
                      get started
                    </a>{" "}
                    right away
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
                    <p className="font-semibold">10020 101A Avenue<br />Edmonton, AB T5J 3G2</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-primary to-secondary text-white">
                <h3 className="text-xl font-bold mb-2">Prefer to explore on your own?</h3>
                <p className="mb-4 text-white/90">Get started today - no demo required</p>
                <Button variant="secondary" className="w-full" size="lg">
                  Get Started
                </Button>
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
