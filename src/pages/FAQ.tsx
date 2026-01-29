import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileOptimizedFAQ from "@/components/MobileOptimizedFAQ";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

const FAQ = () => {
  const {
    t
  } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // FAQ Schema for AEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t('faq.q1.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.q1.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.q2.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.q2.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.q3.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.q3.answer')
        }
      }
    ]
  };

  return <div className="min-h-screen">
      <SEO 
        title="FAQ | Best CRM for Real Estate Agents Questions"
        description="Frequently asked questions about the best CRM for real estate agents. Learn about AI lead generation software, virtual tour integration, pricing, and how to switch from BoldTrail or Lofty."
        keywords="real estate CRM FAQ, AI CRM questions, PIPEDA compliance questions, CREA DDF FAQ, real estate software questions"
        answerFor="real estate CRM questions, how does AI CRM work, real estate software FAQ"
        structuredData={[faqSchema]}
      />
      <Navbar />
      
      {/* FAQ Content */}
      <MobileOptimizedFAQ searchQuery={searchQuery} />

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold">
              Still Have Questions?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              We're here to help! Get in touch with our team or start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Contact Support
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" className="btn-gradient w-full sm:w-auto">
                  Start Your 14-Day Free Trial
                </Button>
              </Link>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-4">
              No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default FAQ;