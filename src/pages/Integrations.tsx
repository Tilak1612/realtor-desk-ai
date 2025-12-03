import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Globe,
  CheckCircle,
  Building2,
  BarChart3,
  Code,
  Database,
  Cloud,
  Video,
  Users,
  Phone,
  FileText,
  Calendar,
  Chrome,
  Contact,
  TrendingUp,
  Mail,
  GraduationCap,
  Home,
  Search,
  Briefcase,
  MessageSquare,
  DollarSign,
  FileSignature,
  Repeat,
  Megaphone,
  Image,
  Headphones,
  PenTool,
  Target,
  Bot,
  LineChart,
  Award,
  Send,
  Settings,
  Share2,
  Play,
  Zap,
  ShoppingCart,
  List,
  type LucideIcon
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Partner {
  name: string;
  icon: LucideIcon;
}

const Integrations = () => {
  const { t } = useTranslation();
  
  const partners: Partner[] = [
    { name: "AgentFire", icon: Target },
    { name: "Altos Research", icon: BarChart3 },
    { name: "API Nation", icon: Code },
    { name: "ARMLS", icon: Database },
    { name: "AWS", icon: Cloud },
    { name: "Behind Your Curtain", icon: Video },
    { name: "Benutech", icon: Settings },
    { name: "Bold Leads", icon: TrendingUp },
    { name: "BombBomb", icon: Video },
    { name: "Brokermint", icon: Briefcase },
    { name: "Call Action", icon: Phone },
    { name: "Callingly", icon: Phone },
    { name: "Canopy MLS", icon: Database },
    { name: "Cloud CMA", icon: BarChart3 },
    { name: "Cloud Streams", icon: Cloud },
    { name: "Club Wealth", icon: Award },
    { name: "Cole Realty Resource", icon: Search },
    { name: "Constant Contact", icon: Mail },
    { name: "Contra Costa Association of REALTORS®", icon: Building2 },
    { name: "Craig Proctor Success", icon: GraduationCap },
    { name: "CRM Rehab", icon: Settings },
    { name: "CRMLS", icon: Database },
    { name: "Docusign", icon: FileSignature },
    { name: "Dot Loop", icon: Repeat },
    { name: "Dubb", icon: Video },
    { name: "Easy Agent Pro", icon: Globe },
    { name: "Express Copy", icon: FileText },
    { name: "Facebook", icon: Share2 },
    { name: "Fast Forward Stories", icon: Video },
    { name: "Florida Realtors®", icon: Building2 },
    { name: "Floyd Wickman Team", icon: GraduationCap },
    { name: "FMLS", icon: Database },
    { name: "Form Simplicity", icon: FileText },
    { name: "GAMLS", icon: Database },
    { name: "Georgia REALTORS®", icon: Building2 },
    { name: "Global MLS, Inc.", icon: Database },
    { name: "Gmail Conversations", icon: Mail },
    { name: "GoDaddy", icon: Globe },
    { name: "Google Ads", icon: Megaphone },
    { name: "Google Calendar", icon: Calendar },
    { name: "Google Chrome Extension", icon: Chrome },
    { name: "Google Contacts", icon: Contact },
    { name: "GrizzlyLeads", icon: TrendingUp },
    { name: "Happy Grasshopper", icon: MessageSquare },
    { name: "Home Junction", icon: Home },
    { name: "Homes.com", icon: Home },
    { name: "HomeStack", icon: Home },
    { name: "Houston Association of Realtors®", icon: Building2 },
    { name: "IDX Broker", icon: Globe },
    { name: "iFoundagent", icon: Search },
    { name: "iList", icon: List },
    { name: "Immoviewer", icon: Image },
    { name: "Jared James", icon: GraduationCap },
    { name: "JMan Seminars", icon: GraduationCap },
    { name: "Karen Coffey", icon: GraduationCap },
    { name: "Keeping Current Matters", icon: BarChart3 },
    { name: "Lake Martin Area Association of Realtors®", icon: Building2 },
    { name: "LandVoice", icon: Phone },
    { name: "Lending Tree", icon: DollarSign },
    { name: "Listings 2 Leads", icon: TrendingUp },
    { name: "Lone Wolf", icon: Briefcase },
    { name: "Lubbock Association of Realtors®", icon: Building2 },
    { name: "Mailchimp", icon: Send },
    { name: "McKissock", icon: GraduationCap },
    { name: "Midwest Real Estate Data", icon: Database },
    { name: "Mojo", icon: Phone },
    { name: "My Computer Works", icon: Headphones },
    { name: "National Association of Real Estate Brokers", icon: Building2 },
    { name: "NC REALTORS®", icon: Building2 },
    { name: "New York State Association of REALTORS®", icon: Building2 },
    { name: "NorthstarMLS", icon: Database },
    { name: "Oakley Signs & Graphics", icon: PenTool },
    { name: "Ohio REALTORS®", icon: Building2 },
    { name: "OneTap Connect", icon: Users },
    { name: "Open House Wizard", icon: Home },
    { name: "Open Houses Direct", icon: Home },
    { name: "PhoneBurner", icon: Phone },
    { name: "Popl", icon: Contact },
    { name: "Postamo", icon: Share2 },
    { name: "Prime Seller Leads", icon: TrendingUp },
    { name: "Productive AI", icon: Bot },
    { name: "Real Geeks", icon: Globe },
    { name: "REDX Vortex®", icon: Phone },
    { name: "Relitix", icon: LineChart },
    { name: "ReMarkiTable", icon: PenTool },
    { name: "REMBA", icon: Building2 },
    { name: "RentSpree", icon: FileText },
    { name: "Reti", icon: Bot },
    { name: "Revaluate", icon: BarChart3 },
    { name: "Rhode Island Association of REALTORS®", icon: Building2 },
    { name: "Roomvu", icon: Video },
    { name: "SalesTalk", icon: MessageSquare },
    { name: "Score Approve", icon: CheckCircle },
    { name: "SEO Real Estate Experts", icon: Search },
    { name: "SkySlope Forms", icon: FileText },
    { name: "Spacio", icon: Home },
    { name: "Summit VA Solutions", icon: Headphones },
    { name: "The CE Shop", icon: GraduationCap },
    { name: "The Share Group", icon: Users },
    { name: "theRRD", icon: BarChart3 },
    { name: "UtahRealEstate.com", icon: Home },
    { name: "Virtuance", icon: Image },
    { name: "Walled Garden", icon: Target },
    { name: "WAVV", icon: Phone },
    { name: "West Alabama MLS", icon: Database },
    { name: "Wichita Falls Association of Realtors®", icon: Building2 },
    { name: "Xpressdocs", icon: FileText },
    { name: "Ylopo", icon: Megaphone },
    { name: "Your Coaching Matters", icon: GraduationCap },
    { name: "YourMLSSearch", icon: Search },
    { name: "YouTube", icon: Play },
    { name: "Zapier", icon: Zap },
    { name: "zBuyer", icon: ShoppingCart },
    { name: "Zenlist", icon: List },
    { name: "Zillow", icon: Home },
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
            {partners.map((partner, index) => {
              const IconComponent = partner.icon;
              return (
                <Card key={index} className="p-4 card-hover text-center flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm leading-tight">{partner.name}</h3>
                </Card>
              );
            })}
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