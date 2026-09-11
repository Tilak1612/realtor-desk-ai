import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Brain, TrendingUp, DollarSign, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";

const SwitchFromIxact = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <SEO
        title="Switch from IXACT | Upgrade to AI CRM"
        description="Moving from IXACT to Realtor Desk: free migration, bilingual EN/FR, CASL-aware email and engagement-based lead ranking. Solo plan $149/mo CAD."
        keywords="switch from IXACT, IXACT migration, IXACT alternative, AI CRM for Canadian realtors"
        canonicalUrl="https://www.realtordesk.ai/switch-from-ixact"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Switch from IXACT",
            "description": "Upgrade from IXACT to RealtorDesk AI with free migration and AI-powered lead conversion."
          }
        ]}
      />
      <Navbar />
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <Badge variant="secondary" className="mb-4">Upgrade to AI</Badge>
          <h1 className="mb-6">Love IXACT's Price? <span className="gradient-text">You'll Love AI Even More.</span></h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Realtor Desk is $149/mo CAD against IXACT's $46.75/mo billed annually. For the
            difference you get bilingual EN/FR replies, CASL-aware email and engagement-based
            lead ranking. 14-day free trial.
          </p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="mb-8">The $20/Month Upgrade That Pays for Itself</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-2xl font-bold gradient-text mb-2">$149/mo</div><p className="text-sm text-muted-foreground">Solo plan, CAD, billed monthly</p>
            <Card className="p-8"><TrendingUp className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" /><div className="text-2xl font-bold gradient-text mb-2">6-8 deals</div><p className="text-sm text-muted-foreground">Extra closes per year</p></Card>
            <Card className="p-8"><Brain className="w-12 h-12 text-rd-terra-800 mx-auto mb-3" /><div className="text-2xl font-bold gradient-text mb-2">$60K+</div><p className="text-sm text-muted-foreground">Additional revenue</p></Card>
          </div>
        </div>
      </section>
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <CheckCircle className="w-16 h-16 text-rd-terra-800 mx-auto mb-6" />
          <h2 className="mb-6">14 Days Free Trial + Free Migration</h2>
          <p className="text-lg text-muted-foreground mb-8">Try free for 14 days. We move your IXACT data for free. A 30-day money-back guarantee applies after that.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup"><Button size="lg" className="btn-gradient">Start 14-Day Free Trial</Button></Link>
            <Link to="/vs/ixact"><Button size="lg" variant="outline">See Comparison</Button></Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SwitchFromIxact;