import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle } from "lucide-react";

const MobileOptimizedFAQ = () => {
  const faqs = [
    {
      q: "Does the AI sound robotic?",
      a: "Our AI uses advanced natural language processing and sounds remarkably human. For voice calls, we use Canadian-accented voices that clients find warm and professional. You can listen to samples before going live."
    },
    {
      q: "How long does setup take?",
      a: "Most agents are fully operational within 20 minutes. Our setup wizard guides you through connecting your tools, training the AI on your listings, and customizing responses."
    },
    {
      q: "What if the AI can't answer?",
      a: "The AI seamlessly escalates complex questions to you via SMS or phone. It provides full conversation context so you can pick up exactly where it left off."
    },
    {
      q: "Is this CASL compliant?",
      a: "Absolutely. RealtorDesk.ai is built specifically for Canadian regulations. All emails include proper sender identification, consent tracking, and easy unsubscribe options."
    },
    {
      q: "Which CRMs do you integrate with?",
      a: "We currently integrate with Follow Up Boss, Brivity, LionDesk, and RealtyJuggler - the most popular CRMs among Canadian agents. Additional integrations are added monthly."
    },
    {
      q: "Can I customize the AI's responses?",
      a: "Yes! You control the AI's personality, response templates, and which questions it handles vs. escalates to you. It learns your style over time."
    },
    {
      q: "What about data privacy?",
      a: "All data is encrypted and stored on Canadian servers. We're PIPEDA certified and never sell or share your client information. You maintain full ownership of your data."
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes, there are no long-term contracts. Cancel anytime with 30 days notice. We'll even help you export your data if you leave."
    }
  ];

  return (
    <section className="section-padding bg-muted">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
          <h2 className="mb-3 sm:mb-4">Frequently Asked Questions</h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Everything you need to know about Realtor Desk AI
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => (
            <AccordionItem 
              key={idx} 
              value={`item-${idx}`}
              className="bg-background rounded-lg px-4 sm:px-6 border shadow-sm"
            >
              <AccordionTrigger className="text-left py-4 sm:py-5 hover:no-underline">
                <div className="flex items-start gap-2 sm:gap-3 pr-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 mt-0.5 sm:mt-1" />
                  <span className="font-semibold text-sm sm:text-base">{faq.q}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4 sm:pb-5 pl-7 sm:pl-8">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default MobileOptimizedFAQ;
