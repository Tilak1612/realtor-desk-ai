import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Globe,
  CheckCircle
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Integrations = () => {
  const { t } = useTranslation();
  
  const partners = [
    "AgentFire",
    "Altos Research",
    "API Nation",
    "ARMLS",
    "AWS",
    "Behind Your Curtain",
    "Benutech",
    "Bold Leads",
    "BombBomb",
    "Brokermint",
    "Call Action",
    "Callingly",
    "Canopy MLS",
    "Cloud CMA",
    "Cloud Streams",
    "Club Wealth",
    "Cole Realty Resource",
    "Constant Contact",
    "Contra Costa Association of REALTORS®",
    "Craig Proctor Success",
    "CRM Rehab",
    "CRMLS",
    "Docusign",
    "Dot Loop",
    "Dubb",
    "Easy Agent Pro",
    "Express Copy",
    "Facebook",
    "Fast Forward Stories",
    "Florida Realtors®",
    "Floyd Wickman Team",
    "FMLS",
    "Form Simplicity",
    "GAMLS",
    "Georgia REALTORS®",
    "Global MLS, Inc.",
    "Gmail Conversations",
    "GoDaddy",
    "Google Ads",
    "Google Calendar",
    "Google Chrome Extension",
    "Google Contacts",
    "GrizzlyLeads",
    "Happy Grasshopper",
    "Home Junction",
    "Homes.com",
    "HomeStack",
    "Houston Association of Realtors®",
    "IDX Broker",
    "iFoundagent",
    "iList",
    "Immoviewer",
    "Jared James",
    "JMan Seminars",
    "Karen Coffey",
    "Keeping Current Matters",
    "Lake Martin Area Association of Realtors®",
    "LandVoice",
    "Lending Tree",
    "Listings 2 Leads",
    "Lone Wolf",
    "Lubbock Association of Realtors®",
    "Mailchimp",
    "McKissock",
    "Midwest Real Estate Data",
    "Mojo",
    "My Computer Works",
    "National Association of Real Estate Brokers",
    "NC REALTORS®",
    "New York State Association of REALTORS®",
    "NorthstarMLS",
    "Oakley Signs & Graphics",
    "Ohio REALTORS®",
    "OneTap Connect",
    "Open House Wizard",
    "Open Houses Direct",
    "PhoneBurner",
    "Popl",
    "Postamo",
    "Prime Seller Leads",
    "Productive AI",
    "Real Geeks",
    "REDX Vortex®",
    "Relitix",
    "ReMarkiTable",
    "REMBA",
    "RentSpree",
    "Reti",
    "Revaluate",
    "Rhode Island Association of REALTORS®",
    "Roomvu",
    "SalesTalk",
    "Score Approve",
    "SEO Real Estate Experts",
    "SkySlope Forms",
    "Spacio",
    "Summit VA Solutions",
    "The CE Shop",
    "The Share Group",
    "theRRD",
    "UtahRealEstate.com",
    "Virtuance",
    "Walled Garden",
    "WAVV",
    "West Alabama MLS",
    "Wichita Falls Association of Realtors®",
    "Xpressdocs",
    "Ylopo",
    "Your Coaching Matters",
    "YourMLSSearch",
    "YouTube",
    "Zapier",
    "zBuyer",
    "Zenlist",
    "Zillow",
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <h1 className="mb-6 animate-fade-in-up">
            {t('integrations.hero.title')} <span className="gradient-text">{t('integrations.hero.titleGradient')}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            {t('integrations.hero.subtitle')}
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
              <div className="text-5xl font-bold gradient-text mb-2">111+</div>
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

      {/* Partners Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Integration Partners</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with {partners.length}+ industry-leading tools and platforms
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {partners.map((partner, index) => (
              <Card key={index} className="p-4 card-hover text-center">
                <h3 className="font-medium text-sm">{partner}</h3>
              </Card>
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
