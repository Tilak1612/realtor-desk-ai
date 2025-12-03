import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Globe,
  CheckCircle,
  Building2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";

interface Partner {
  name: string;
  domain: string;
}

const PartnerLogo = ({ partner }: { partner: Partner }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const logoUrl = `https://logo.clearbit.com/${partner.domain}`;

  return (
    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden relative">
      {isLoading && !hasError && (
        <Skeleton className="absolute inset-0 w-full h-full animate-pulse" />
      )}
      {hasError ? (
        <Building2 className="w-6 h-6 text-muted-foreground" />
      ) : (
        <img
          src={logoUrl}
          alt={`${partner.name} logo`}
          className={`w-10 h-10 object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </div>
  );
};

const Integrations = () => {
  const { t } = useTranslation();
  
  const partners: Partner[] = [
    { name: "AgentFire", domain: "agentfire.com" },
    { name: "Altos Research", domain: "altosresearch.com" },
    { name: "API Nation", domain: "apination.com" },
    { name: "ARMLS", domain: "armls.com" },
    { name: "AWS", domain: "aws.amazon.com" },
    { name: "Behind Your Curtain", domain: "behindyourcurtain.com" },
    { name: "Benutech", domain: "benutech.com" },
    { name: "Bold Leads", domain: "boldleads.com" },
    { name: "BombBomb", domain: "bombbomb.com" },
    { name: "Brokermint", domain: "brokermint.com" },
    { name: "Call Action", domain: "callaction.co" },
    { name: "Callingly", domain: "callingly.com" },
    { name: "Canopy MLS", domain: "canopymls.com" },
    { name: "Cloud CMA", domain: "cloudcma.com" },
    { name: "Cloud Streams", domain: "cloudstreams.net" },
    { name: "Club Wealth", domain: "clubwealth.com" },
    { name: "Cole Realty Resource", domain: "coleinformation.com" },
    { name: "Constant Contact", domain: "constantcontact.com" },
    { name: "Contra Costa Association of REALTORS®", domain: "ccar.net" },
    { name: "Craig Proctor Success", domain: "craigproctor.com" },
    { name: "CRM Rehab", domain: "crmrehab.com" },
    { name: "CRMLS", domain: "crmls.org" },
    { name: "Docusign", domain: "docusign.com" },
    { name: "Dot Loop", domain: "dotloop.com" },
    { name: "Dubb", domain: "dubb.com" },
    { name: "Easy Agent Pro", domain: "easyagentpro.com" },
    { name: "Express Copy", domain: "expresscopy.com" },
    { name: "Facebook", domain: "facebook.com" },
    { name: "Fast Forward Stories", domain: "fastforwardstories.com" },
    { name: "Florida Realtors®", domain: "floridarealtors.org" },
    { name: "Floyd Wickman Team", domain: "floydwickman.com" },
    { name: "FMLS", domain: "fmls.com" },
    { name: "Form Simplicity", domain: "formsimplicity.com" },
    { name: "GAMLS", domain: "gamls.com" },
    { name: "Georgia REALTORS®", domain: "garealtor.com" },
    { name: "Global MLS, Inc.", domain: "globalmlx.com" },
    { name: "Gmail Conversations", domain: "gmail.com" },
    { name: "GoDaddy", domain: "godaddy.com" },
    { name: "Google Ads", domain: "ads.google.com" },
    { name: "Google Calendar", domain: "calendar.google.com" },
    { name: "Google Chrome Extension", domain: "chrome.google.com" },
    { name: "Google Contacts", domain: "contacts.google.com" },
    { name: "GrizzlyLeads", domain: "grizzlyleads.com" },
    { name: "Happy Grasshopper", domain: "happygrasshopper.com" },
    { name: "Home Junction", domain: "homejunction.com" },
    { name: "Homes.com", domain: "homes.com" },
    { name: "HomeStack", domain: "homestack.com" },
    { name: "Houston Association of Realtors®", domain: "har.com" },
    { name: "IDX Broker", domain: "idxbroker.com" },
    { name: "iFoundagent", domain: "ifoundagent.com" },
    { name: "iList", domain: "ilistdata.com" },
    { name: "Immoviewer", domain: "immoviewer.com" },
    { name: "Jared James", domain: "jaredjamestoday.com" },
    { name: "JMan Seminars", domain: "jmanseminars.com" },
    { name: "Karen Coffey", domain: "karencoffey.com" },
    { name: "Keeping Current Matters", domain: "keepingcurrentmatters.com" },
    { name: "Lake Martin Area Association of Realtors®", domain: "lakemartinrealtors.com" },
    { name: "LandVoice", domain: "landvoice.com" },
    { name: "Lending Tree", domain: "lendingtree.com" },
    { name: "Listings 2 Leads", domain: "listings2leads.com" },
    { name: "Lone Wolf", domain: "lwolf.com" },
    { name: "Lubbock Association of Realtors®", domain: "lubbockrealtors.com" },
    { name: "Mailchimp", domain: "mailchimp.com" },
    { name: "McKissock", domain: "mckissock.com" },
    { name: "Midwest Real Estate Data", domain: "mredllc.com" },
    { name: "Mojo", domain: "mojosells.com" },
    { name: "My Computer Works", domain: "mycomputerworks.com" },
    { name: "National Association of Real Estate Brokers", domain: "nareb.com" },
    { name: "NC REALTORS®", domain: "ncrealtors.org" },
    { name: "New York State Association of REALTORS®", domain: "nysar.com" },
    { name: "NorthstarMLS", domain: "northstarmls.com" },
    { name: "Oakley Signs & Graphics", domain: "oakleysign.com" },
    { name: "Ohio REALTORS®", domain: "ohiorealtors.org" },
    { name: "OneTap Connect", domain: "onetapconnect.com" },
    { name: "Open House Wizard", domain: "openhousewizard.com" },
    { name: "Open Houses Direct", domain: "openhousesdirect.com" },
    { name: "PhoneBurner", domain: "phoneburner.com" },
    { name: "Popl", domain: "popl.co" },
    { name: "Postamo", domain: "postamo.com" },
    { name: "Prime Seller Leads", domain: "primesellerleads.com" },
    { name: "Productive AI", domain: "productiveai.com" },
    { name: "Real Geeks", domain: "realgeeks.com" },
    { name: "REDX Vortex®", domain: "theredx.com" },
    { name: "Relitix", domain: "relitix.com" },
    { name: "ReMarkiTable", domain: "remarkitable.com" },
    { name: "REMBA", domain: "remba.com" },
    { name: "RentSpree", domain: "rentspree.com" },
    { name: "Reti", domain: "reti.us" },
    { name: "Revaluate", domain: "revaluate.com" },
    { name: "Rhode Island Association of REALTORS®", domain: "rirealtors.org" },
    { name: "Roomvu", domain: "roomvu.com" },
    { name: "SalesTalk", domain: "salestalk.ai" },
    { name: "Score Approve", domain: "scoreapprove.com" },
    { name: "SEO Real Estate Experts", domain: "seorealestateexperts.com" },
    { name: "SkySlope Forms", domain: "skyslope.com" },
    { name: "Spacio", domain: "spacio.com" },
    { name: "Summit VA Solutions", domain: "summitvasolutions.com" },
    { name: "The CE Shop", domain: "theceshop.com" },
    { name: "The Share Group", domain: "thesharegroup.com" },
    { name: "theRRD", domain: "therrd.com" },
    { name: "UtahRealEstate.com", domain: "utahrealestate.com" },
    { name: "Virtuance", domain: "virtuance.com" },
    { name: "Walled Garden", domain: "walledgarden.com" },
    { name: "WAVV", domain: "wavv.com" },
    { name: "West Alabama MLS", domain: "wamls.com" },
    { name: "Wichita Falls Association of Realtors®", domain: "wfar.org" },
    { name: "Xpressdocs", domain: "xpressdocs.com" },
    { name: "Ylopo", domain: "ylopo.com" },
    { name: "Your Coaching Matters", domain: "yourcoachingmatters.com" },
    { name: "YourMLSSearch", domain: "yourmlssearch.com" },
    { name: "YouTube", domain: "youtube.com" },
    { name: "Zapier", domain: "zapier.com" },
    { name: "zBuyer", domain: "zbuyer.com" },
    { name: "Zenlist", domain: "zenlist.com" },
    { name: "Zillow", domain: "zillow.com" },
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
              <Card key={index} className="p-4 card-hover text-center flex flex-col items-center gap-3">
                <PartnerLogo partner={partner} />
                <h3 className="font-medium text-sm leading-tight">{partner.name}</h3>
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