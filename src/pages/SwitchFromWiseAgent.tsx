import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Globe, Brain, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const SwitchFromWiseAgent = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <div className="text-4xl mb-4">🇨🇦</div>
          <h1 className="mb-6">Wise Agent Is Fine for US. <span className="gradient-text">Canadian Agents Need Canadian Solutions.</span></h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">Get bilingual support, CREA integration, and Toronto/Vancouver/Calgary market intelligence Wise Agent can't provide.</p>
          <Link to="/signup"><Button size="lg" className="btn-gradient">Start 14-Day Free Trial</Button></Link>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 className="text-center mb-12">Why Canadian Agents Need Canadian CRM</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center"><Globe className="w-12 h-12 text-accent mx-auto mb-3" /><h3 className="font-bold mb-2">Canadian Markets</h3><p className="text-sm text-muted-foreground">Toronto, Vancouver, Calgary intelligence</p></Card>
            <Card className="p-6 text-center"><div className="text-4xl mb-3">🇫🇷</div><h3 className="font-bold mb-2">Bilingual</h3><p className="text-sm text-muted-foreground">Full French/English support</p></Card>
            <Card className="p-6 text-center"><Brain className="w-12 h-12 text-accent mx-auto mb-3" /><h3 className="font-bold mb-2">AI-Powered</h3><p className="text-sm text-muted-foreground">Predictive intelligence</p></Card>
          </div>
        </div>
      </section>
      <section className="section-padding bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="container-custom max-w-4xl text-center">
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="mb-6">Switch to Canadian CRM Today</h2>
          <p className="text-lg text-muted-foreground mb-8">14 Days Free Trial • Free migration • Canadian support team</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup"><Button size="lg" className="btn-gradient">Start 14-Day Free Trial</Button></Link>
            <Link to="/vs/wise-agent"><Button size="lg" variant="outline">See Comparison</Button></Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SwitchFromWiseAgent;