import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Database,
  Share2,
  Smartphone,
  Globe,
  CheckCircle,
  Zap
} from "lucide-react";

const Integrations = () => {
  const integrationCategories = [
    {
      title: "MLS & Real Estate Platforms",
      icon: FileText,
      integrations: [
        { name: "CREA DDF®", description: "Native integration with Canadian MLS data", status: "Native" },
        { name: "Realtor.ca", description: "Sync listings and lead capture", status: "Native" },
        { name: "IDX Broker", description: "Website listing syndication", status: "Available" },
        { name: "MLS®", description: "Provincial MLS board connections", status: "Available" },
      ]
    },
    {
      title: "Communication Tools",
      icon: MessageSquare,
      integrations: [
        { name: "Gmail", description: "Email sync and automation", status: "Native" },
        { name: "Outlook", description: "Microsoft email integration", status: "Native" },
        { name: "Twilio SMS", description: "Text message automation", status: "Available" },
        { name: "WhatsApp Business", description: "WhatsApp messaging", status: "Available" },
        { name: "Slack", description: "Team notifications", status: "Available" },
      ]
    },
    {
      title: "Calendar & Scheduling",
      icon: Calendar,
      integrations: [
        { name: "Google Calendar", description: "Sync showings and appointments", status: "Native" },
        { name: "Microsoft Outlook Calendar", description: "Calendar synchronization", status: "Native" },
        { name: "Calendly", description: "Automated scheduling", status: "Available" },
        { name: "Acuity Scheduling", description: "Client booking system", status: "Available" },
      ]
    },
    {
      title: "Marketing & Social Media",
      icon: Share2,
      integrations: [
        { name: "Facebook", description: "Lead ads and posting automation", status: "Native" },
        { name: "Instagram", description: "Story and post scheduling", status: "Native" },
        { name: "LinkedIn", description: "Professional networking posts", status: "Available" },
        { name: "Mailchimp", description: "Email marketing campaigns", status: "Available" },
        { name: "Canva", description: "Design templates and graphics", status: "Available" },
      ]
    },
    {
      title: "Transaction Management",
      icon: Database,
      integrations: [
        { name: "DocuSign", description: "Electronic signatures", status: "Native" },
        { name: "Dotloop", description: "Transaction coordination", status: "Available" },
        { name: "SkySlope", description: "Compliance and forms", status: "Available" },
        { name: "TransactionDesk", description: "Deal management", status: "Available" },
      ]
    },
    {
      title: "Productivity & Tools",
      icon: Zap,
      integrations: [
        { name: "Zapier", description: "Connect 5,000+ apps", status: "Native" },
        { name: "Google Drive", description: "Cloud storage and docs", status: "Native" },
        { name: "Dropbox", description: "File sharing and storage", status: "Available" },
        { name: "Zoom", description: "Virtual showings and meetings", status: "Available" },
      ]
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <h1 className="mb-6 animate-fade-in-up">
            Connect Your Entire <span className="gradient-text">Real Estate Tech Stack</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Realtor Desk AI integrates seamlessly with all your favorite tools and platforms
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in-up animation-delay-300">
            <Link to="/demo">
              <Button size="lg" className="text-lg">
                Book Your Free Demo
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline" className="text-lg">
                View All Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Integration Stats */}
      <section className="section-padding border-b">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">50+</div>
              <p className="text-muted-foreground">Native Integrations</p>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">5,000+</div>
              <p className="text-muted-foreground">Via Zapier Connection</p>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">24/7</div>
              <p className="text-muted-foreground">Real-Time Sync</p>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="space-y-16">
            {integrationCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center gap-3 mb-6">
                  <category.icon className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.integrations.map((integration, index) => (
                    <Card key={index} className="p-6 card-hover">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-lg">{integration.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          integration.status === 'Native' 
                            ? 'bg-accent/10 text-accent font-semibold' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {integration.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Access Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6">Need a Custom Integration?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our REST API and Zapier integration give you unlimited flexibility to connect any tool in your workflow.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Full REST API Access</div>
                    <div className="text-sm text-muted-foreground">Enterprise plan includes complete API documentation</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Zapier Integration</div>
                    <div className="text-sm text-muted-foreground">Connect to 5,000+ apps without coding</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Webhook Support</div>
                    <div className="text-sm text-muted-foreground">Real-time data sync with your custom tools</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Developer Support</div>
                    <div className="text-sm text-muted-foreground">Dedicated technical team for custom integrations</div>
                  </div>
                </li>
              </ul>
              <Link to="/demo">
                <Button size="lg">
                  Book Your Free Demo
                </Button>
              </Link>
            </div>
            <Card className="p-12 bg-gradient-to-br from-primary/10 to-secondary/10">
              <Globe className="w-24 h-24 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-center mb-4">Enterprise API Access</h3>
              <p className="text-center text-muted-foreground">
                Build custom integrations with our comprehensive API. Available on Enterprise plans.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container-custom text-center">
          <h2 className="mb-6 text-white">Ready to Connect Your Tech Stack?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Start integrating your tools today and experience seamless workflow automation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo">
              <Button size="lg" variant="secondary" className="text-lg">
                Start Closing More Deals
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="text-lg bg-white/10 border-white text-white hover:bg-white hover:text-primary">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Integrations;
