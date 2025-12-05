import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileOptimizedFAQ from "@/components/MobileOptimizedFAQ";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
const FAQ = () => {
  const {
    t
  } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  return <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom">
          {/* Breadcrumb Navigation */}
          <div className="mb-6 sm:mb-8">
            <Breadcrumb>
              
            </Breadcrumb>
          </div>

          {/* Page Header */}
          
        </div>
      </section>

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