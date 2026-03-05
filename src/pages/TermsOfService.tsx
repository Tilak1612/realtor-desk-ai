import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

const TermsOfService = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Terms of Service | RealtorDesk AI"
        description="Review the Terms of Service for using RealtorDesk AI, including subscriptions, data ownership, and compliance obligations."
        keywords="terms of service, RealtorDesk AI terms, Canadian real estate CRM terms"
        canonicalUrl="https://www.realtordesk.ai/terms-of-service"
      />
      <Navbar />

      <section className="pt-32 md:pt-40 pb-16">
        <div className="container-custom max-w-4xl">
          <h1 className="mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Realtor Desk AI, you accept and agree to be bound by the terms and 
                provision of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Description of Service</h2>
              <p>
                Realtor Desk AI provides an AI-powered real estate CRM platform specifically designed for 
                Canadian real estate professionals, including predictive lead intelligence, automated 
                communication, and transaction management tools.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. User Obligations</h2>
              <p>You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Comply with all applicable Canadian real estate regulations</li>
                <li>Use the service only for lawful business purposes</li>
                <li>Not attempt to interfere with or disrupt the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Subscription and Billing</h2>
              <p>
                All subscriptions are billed monthly or annually based on your selected plan. You may cancel 
                your subscription at any time. Cancellations take effect at the end of the current billing period. 
                We offer a 30-day money-back guarantee for new subscribers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Intellectual Property</h2>
              <p>
                All content, features, and functionality of Realtor Desk AI, including but not limited to text, 
                graphics, logos, and software, are owned by us and are protected by Canadian and international 
                copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Data Ownership</h2>
              <p>
                You retain all rights to the data you input into Realtor Desk AI. We do not claim ownership 
                of your client data, listings, or business information. You may export your data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">7. Limitation of Liability</h2>
              <p>
                Realtor Desk AI is provided "as is" without warranties of any kind. We shall not be liable for 
                any indirect, incidental, special, consequential, or punitive damages resulting from your use 
                of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">8. Compliance with Real Estate Regulations</h2>
              <p>
                While we provide compliance features for RECO, BCFSA, RECA, and other provincial regulations, 
                you are ultimately responsible for ensuring your use of the platform complies with all applicable 
                real estate laws and regulations in your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">9. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the service immediately, without prior 
                notice, if you breach these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any material 
                changes via email. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">11. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the Province of 
                Alberta and the federal laws of Canada applicable therein.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">12. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us at:
              </p>
              <ul className="list-none space-y-2">
                <li>Email: support@realtordesk.ai</li>
                <li>Phone: 1-800-REALTOR-AI</li>
                <li>Address: Edmonton, Alberta, Canada</li>
              </ul>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;
