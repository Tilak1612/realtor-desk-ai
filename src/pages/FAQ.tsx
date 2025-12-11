import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileOptimizedFAQ from "@/components/MobileOptimizedFAQ";
import { Button } from "@/components/ui/button";
const FAQ = () => {
  const {
    t
  } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // SEO: Update document title and meta for FAQ page
  if (typeof document !== 'undefined') {
    document.title = "FAQ | Best CRM for Real Estate Agents Questions | RealtorDesk AI";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Frequently asked questions about the best CRM for real estate agents. Learn about AI lead generation software, virtual tour integration, pricing, and how to switch from BoldTrail or Lofty.');
    }
  }

  return <div className="min-h-screen">
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