import { Rocket, ClipboardCheck, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import heroDashboard from "@/assets/hero-dashboard.jpg";
import demoShowcase from "@/assets/demo-showcase.jpg";
import agentSuccess from "@/assets/agent-success.jpg";

const HowItWorksSection = () => {
  const { t, i18n } = useTranslation();
  const isFrench = i18n.language === 'fr';
  
  const steps = [
    {
      number: 1,
      icon: Rocket,
      title: isFrench ? "Configuration Rapide" : "Quick Setup",
      time: isFrench ? "15 Minutes" : "15 Minutes",
      visual: heroDashboard,
      details: isFrench ? [
        "Créez votre compte",
        "Personnalisez les réponses IA",
        "Connectez vos outils existants (CRM, calendrier, courriel)",
        "Regardez notre tutoriel de 5 minutes"
      ] : [
        "Create your account",
        "Customize AI responses",
        "Connect your existing tools (CRM, calendar, email)",
        "Watch our 5-minute tutorial"
      ],
      buttonText: isFrench ? "Voir le Guide" : "See Setup Guide",
      buttonLink: "/demo"
    },
    {
      number: 2,
      icon: ClipboardCheck,
      title: isFrench ? "Tester et Entraîner" : "Test & Train",
      time: isFrench ? "Première Semaine" : "First Week",
      visual: demoShowcase,
      details: isFrench ? [
        "Votre IA commence à capturer des prospects 24/7",
        "Examinez et affinez les réponses IA",
        "Nous vous accompagnons pendant la première semaine",
        "Appel de coaching personnalisé inclus"
      ] : [
        "Your AI starts capturing leads 24/7",
        "Review and refine AI responses",
        "We monitor with you during first week",
        "Personalized coaching call included"
      ],
      buttonText: isFrench ? "Réserver un Appel" : "Book Onboarding Call",
      buttonLink: "/demo"
    },
    {
      number: 3,
      icon: TrendingUp,
      title: isFrench ? "Développer et Croître" : "Scale & Grow",
      time: isFrench ? "En Continu" : "Ongoing",
      visual: agentSuccess,
      details: isFrench ? [
        "L'IA gère automatiquement les demandes courantes",
        "Concentrez-vous sur les activités à haute valeur",
        "Suivez le ROI avec les analyses intégrées",
        "Améliorations continues ajoutées"
      ] : [
        "AI handles routine inquiries automatically",
        "Focus on high-value activities",
        "Track ROI with built-in analytics",
        "Continuous improvements added"
      ],
      buttonText: isFrench ? "Voir les Succès" : "See Success Stories",
      buttonLink: "/resources"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container-custom">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <h2 className="mb-3 sm:mb-4">
            {isFrench 
              ? "De l'Inscription au Succès en 3 Étapes" 
              : "From Sign-Up to Success in 3 Steps"}
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative max-w-7xl mx-auto">
          {/* Connecting Line - Hidden on mobile */}
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-secondary"></div>
          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <Card 
                key={step.number} 
                className="relative p-6 animate-fade-in-up hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Step Number Badge */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center text-xl font-bold shadow-lg">
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4 mt-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>

                {/* Title & Time */}
                <h3 className="text-xl font-bold text-center mb-1">{step.title}</h3>
                <p className="text-sm text-accent font-semibold text-center mb-4">⏱️ {step.time}</p>

                {/* Visual Screenshot */}
                <div className="rounded-lg overflow-hidden mb-4 shadow-md bg-muted">
                  <img 
                    src={step.visual} 
                    alt={`RealtorDesk AI ${step.title} - ${step.details[0]} for Canadian realtors`}
                    className="w-full h-auto object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Details List */}
                <ul className="space-y-2 mb-6">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-accent mt-0.5">✓</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link to={step.buttonLink}>
                  <Button variant="outline" className="w-full">
                    {step.buttonText}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Below Timeline */}
        <div className="mt-12 sm:mt-16 grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto text-center">
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="text-3xl font-bold text-primary mb-2">2.5 {isFrench ? "heures" : "hours"}</div>
            <p className="text-sm text-muted-foreground">
              {isFrench 
                ? "Temps moyen pour le premier prospect capturé par l'IA" 
                : "Average time to first AI-captured lead"}
            </p>
          </Card>
          <Card className="p-6 bg-accent/5 border-accent/20">
            <div className="text-3xl font-bold text-accent mb-2">15+ {isFrench ? "heures" : "hours"}</div>
            <p className="text-sm text-muted-foreground">
              {isFrench 
                ? "Temps économisé en moyenne par semaine" 
                : "Average time saved per week"}
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;