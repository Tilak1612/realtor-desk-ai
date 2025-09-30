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

const Demo = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Demo Request Submitted!",
        description: "We'll contact you within 24 hours to schedule your personalized demo.",
      });
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <h1 className="mb-6 animate-fade-in-up">
            See <span className="gradient-text">Brainfy AI</span> in Action
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Schedule a personalized demo or start your free trial today
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
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" required placeholder="John Smith" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" required placeholder="john@example.com" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" required placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <Label htmlFor="brokerage">Brokerage/Company</Label>
                    <Input id="brokerage" placeholder="ABC Realty" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="province">Province *</Label>
                    <Select required>
                      <SelectTrigger id="province">
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
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
                  </div>
                  <div>
                    <Label htmlFor="crm">Current CRM (if any)</Label>
                    <Select>
                      <SelectTrigger id="crm">
                        <SelectValue placeholder="Select CRM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="followupboss">Follow Up Boss</SelectItem>
                        <SelectItem value="liondesk">LionDesk</SelectItem>
                        <SelectItem value="wiseagent">Wise Agent</SelectItem>
                        <SelectItem value="ixact">IXACT Contact</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="teamSize">Number of Team Members</Label>
                    <Select>
                      <SelectTrigger id="teamSize">
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solo">Solo</SelectItem>
                        <SelectItem value="2-5">2-5</SelectItem>
                        <SelectItem value="6-10">6-10</SelectItem>
                        <SelectItem value="11-25">11-25</SelectItem>
                        <SelectItem value="26+">26+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="challenge">Biggest Challenge</Label>
                    <Select>
                      <SelectTrigger id="challenge">
                        <SelectValue placeholder="Select challenge" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead-gen">Lead generation</SelectItem>
                        <SelectItem value="conversion">Lead conversion</SelectItem>
                        <SelectItem value="transaction">Transaction management</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="time">Time management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="comments">Comments/Questions</Label>
                  <Textarea id="comments" rows={4} placeholder="Tell us more about your needs..." />
                </div>

                <Button type="submit" className="btn-gradient w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Request Demo"}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  Or{" "}
                  <a href="#trial" className="text-primary font-semibold hover:underline">
                    start your free trial
                  </a>{" "}
                  without a demo
                </p>
              </form>
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
                        See Brainfy AI in action with examples specific to your market
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Custom Trial (14 days)</h4>
                      <p className="text-sm text-muted-foreground">
                        Start your free trial with personalized onboarding
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
                    <a href="mailto:support@brainfyai.com" className="font-semibold text-primary hover:underline">
                      support@brainfyai.com
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone</p>
                    <a href="tel:1-888-272-4639" className="font-semibold text-primary hover:underline">
                      1-888-BRAINFY (1-888-272-4639)
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Address</p>
                    <p className="font-semibold">Toronto, ON, Canada</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-primary to-secondary text-white">
                <h3 className="text-xl font-bold mb-2">Prefer to explore on your own?</h3>
                <p className="mb-4 text-white/90">Start your 14-day free trial - no demo required</p>
                <Button variant="secondary" className="w-full" size="lg">
                  Start Free Trial
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
