import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MobileOptimizedFAQProps {
  searchQuery?: string;
}

const MobileOptimizedFAQ = ({ searchQuery = "" }: MobileOptimizedFAQProps) => {
  const { t } = useTranslation();
  
  const faqs = [
    {
      q: t('faq.q1.question'),
      a: t('faq.q1.answer')
    },
    {
      q: t('faq.q2.question'),
      a: t('faq.q2.answer')
    },
    {
      q: t('faq.q3.question'),
      a: t('faq.q3.answer')
    },
    {
      q: t('faq.q4.question'),
      a: t('faq.q4.answer')
    },
    {
      q: t('faq.q5.question'),
      a: t('faq.q5.answer')
    },
    {
      q: t('faq.q6.question'),
      a: t('faq.q6.answer')
    },
    {
      q: t('faq.q7.question'),
      a: t('faq.q7.answer')
    },
    {
      q: t('faq.q8.question'),
      a: t('faq.q8.answer')
    },
    {
      q: t('faq.q9.question'),
      a: t('faq.q9.answer')
    },
    {
      q: t('faq.q10.question'),
      a: t('faq.q10.answer')
    },
    {
      q: t('faq.q11.question'),
      a: t('faq.q11.answer')
    },
    {
      q: t('faq.q12.question'),
      a: t('faq.q12.answer')
    },
    {
      q: t('faq.q13.question'),
      a: t('faq.q13.answer')
    },
    {
      q: t('faq.q14.question'),
      a: t('faq.q14.answer')
    },
    {
      q: t('faq.q15.question'),
      a: t('faq.q15.answer')
    },
    {
      q: t('faq.q16.question'),
      a: t('faq.q16.answer')
    },
    {
      q: t('faq.q17.question'),
      a: t('faq.q17.answer')
    },
    {
      q: t('faq.q18.question'),
      a: t('faq.q18.answer')
    },
    {
      q: t('faq.q19.question'),
      a: t('faq.q19.answer')
    },
    {
      q: t('faq.q20.question'),
      a: t('faq.q20.answer')
    }
  ];

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <section className="pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20 bg-muted">
      <div className="container-custom px-4 sm:px-6 lg:px-8 max-w-4xl">
        {!searchQuery && (
          <div className="text-center mb-6 sm:mb-8 md:mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('faq.title')} <span className="gradient-text">{t('faq.titleGradient')}</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about Realtor Desk AI
            </p>
          </div>
        )}
        
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-base text-muted-foreground">
              No FAQs found matching your search. Try different keywords.
            </p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-2 sm:space-y-3 md:space-y-4">
            {filteredFaqs.map((faq, idx) => (
            <AccordionItem 
              key={idx} 
              value={`item-${idx}`}
              className="bg-background rounded-lg px-3 sm:px-4 md:px-6 border shadow-sm"
            >
              <AccordionTrigger className="text-left py-3 sm:py-4 md:py-5 hover:no-underline">
                <div className="flex items-start gap-2 sm:gap-3 pr-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="font-semibold text-sm sm:text-base md:text-lg leading-snug">{faq.q}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed pb-3 sm:pb-4 md:pb-5 pl-6 sm:pl-7 md:pl-8">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
};

export default MobileOptimizedFAQ;
