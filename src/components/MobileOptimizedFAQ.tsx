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
    <section className="section-padding bg-muted">
      <div className="container-custom max-w-4xl">
        {!searchQuery && (
          <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
            <h2 className="mb-3 sm:mb-4">{t('faq.title')}</h2>
          </div>
        )}
        
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No FAQs found matching your search. Try different keywords.
            </p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
            {filteredFaqs.map((faq, idx) => (
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
        )}
      </div>
    </section>
  );
};

export default MobileOptimizedFAQ;
