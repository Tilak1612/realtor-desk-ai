import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Privacy Policy | RealtorDesk AI"
        description="Read RealtorDesk AI's privacy policy covering data collection, storage, security, and your rights under Canadian law."
        keywords="privacy policy, PIPEDA, Canadian data privacy, RealtorDesk AI"
        canonicalUrl="https://www.realtordesk.ai/privacy-policy"
      />
      <Navbar />

      <section className="pt-32 md:pt-40 pb-16">
        <div className="container-custom max-w-4xl">
          <h1 className="mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Personal Information:</strong> Name, email address, phone number, business name, license number</li>
                <li><strong>Account Information:</strong> Username, password (encrypted), profile photo, preferences</li>
                <li><strong>Business Information:</strong> Brokerage details, province of operation, primary language</li>
                <li><strong>Client Data:</strong> Contact information you enter into the CRM system</li>
                <li><strong>Usage Data:</strong> How you interact with our platform, features used, login times</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, cookies</li>
                <li><strong>Communication Data:</strong> Records of support requests, demo bookings, feedback</li>
              </ul>
              <p>
                We collect this information when you register for our services, request a demo, use our platform, 
                or communicate with our support team. All data collection is limited to what is necessary for 
                providing our services and complying with legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Send marketing communications with your consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Data Storage and Security</h2>
              <p className="mb-4">
                Your data is stored exclusively in secure Canadian data centers (Toronto and Vancouver regions) 
                to ensure compliance with Canadian privacy laws and data sovereignty requirements.
              </p>
              <p className="mb-4"><strong>Security Measures:</strong></p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Encryption:</strong> AES-256 encryption at rest, TLS 1.3 in transit</li>
                <li><strong>Access Controls:</strong> Role-based access control (RBAC), multi-factor authentication</li>
                <li><strong>Monitoring:</strong> 24/7 security monitoring and automated threat detection</li>
                <li><strong>Audits:</strong> Regular security audits and penetration testing</li>
                <li><strong>Backups:</strong> Daily encrypted backups with 30-day retention</li>
                <li><strong>Compliance:</strong> Security-first architecture with enterprise-grade encryption, designed with PIPEDA principles</li>
              </ul>
              <p className="mb-4">
                <strong>Data Retention:</strong> We retain your personal information only as long as necessary 
                to provide our services or as required by law. When you close your account, we will delete or 
                anonymize your personal data within 90 days, except where we are legally required to retain it 
                (e.g., for tax or legal purposes).
              </p>
              <p>
                <strong>Breach Notification:</strong> In the unlikely event of a data breach affecting your 
                personal information, we will notify you and the Privacy Commissioner of Canada within 72 hours 
                as required by PIPEDA, and provide details about the breach and steps we are taking to address it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your 
                information only with service providers who assist us in operating our platform, conducting 
                our business, or serving our users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Your Rights</h2>
              <p>Under Canadian privacy law (PIPEDA), you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Withdraw consent for marketing communications</li>
                <li>File a complaint with the Privacy Commissioner of Canada</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Cookies and Tracking</h2>
              <p className="mb-4">
                We use cookies and similar tracking technologies to enhance your experience and understand how 
                you use our platform. You have full control over cookie preferences through our cookie consent banner.
              </p>
              <p className="mb-4"><strong>Types of Cookies We Use:</strong></p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Necessary Cookies:</strong> Essential for site functionality (authentication, security). These cannot be disabled.</li>
                <li><strong>Analytics Cookies:</strong> Help us understand visitor behavior and improve our platform (Google Analytics)</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track campaign effectiveness</li>
                <li><strong>Functional Cookies:</strong> Enable enhanced features like chat widgets and saved preferences</li>
              </ul>
              <p className="mb-4">
                <strong>Your Cookie Choices:</strong> You can manage your cookie preferences at any time through 
                the cookie settings link in our footer or by clearing your browser cookies. Note that disabling 
                certain cookies may limit your ability to use some features of our platform.
              </p>
              <p>
                <strong>Consent Retention:</strong> We store records of your cookie consent choices for 24 months 
                as required by Canadian privacy regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">7. Changes to This Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">8. PIPEDA Accountability</h2>
              <p className="mb-4">
                As required by the Personal Information Protection and Electronic Documents Act (PIPEDA), 
                Brainfy AI Inc. is accountable for all personal information under our control.
              </p>
              <p className="mb-4"><strong>Our Accountability Officer:</strong></p>
              <ul className="list-none space-y-2 mb-4">
                <li><strong>Name:</strong> Privacy Officer</li>
                <li><strong>Email:</strong> privacy@realtordesk.ai</li>
                <li><strong>Mailing Address:</strong> Edmonton, Alberta, Canada</li>
              </ul>
              <p className="mb-4">
                Our Privacy Officer is responsible for ensuring compliance with PIPEDA and addressing all 
                privacy-related inquiries and complaints. We have implemented policies and procedures to protect 
                personal information and provide training to all employees who handle personal data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">9. International Data Transfers</h2>
              <p>
                Your personal information is stored and processed exclusively in Canada. We do not transfer 
                personal information outside of Canada, ensuring full compliance with Canadian data residency 
                requirements and PIPEDA regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">10. Children's Privacy</h2>
              <p>
                Our services are intended for real estate professionals aged 18 and older. We do not knowingly 
                collect personal information from individuals under 18. If we become aware that we have collected 
                data from someone under 18, we will delete it immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">11. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy or wish to exercise your privacy rights, 
                please contact us:
              </p>
              <ul className="list-none space-y-2 mb-4">
                <li><strong>General Inquiries:</strong> support@realtordesk.ai</li>
                <li><strong>Privacy Matters:</strong> privacy@realtordesk.ai</li>
                <li><strong>Mailing Address:</strong> Brainfy AI Inc., Edmonton, Alberta, Canada</li>
              </ul>
              <p>
                <strong>Filing a Complaint:</strong> If you believe we have not addressed your privacy concerns 
                adequately, you have the right to file a complaint with the Office of the Privacy Commissioner of Canada:
              </p>
              <ul className="list-none space-y-2 mt-2">
                <li>Website: <a href="https://www.priv.gc.ca" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.priv.gc.ca</a></li>
                <li>Toll-free: 1-800-282-1376</li>
              </ul>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
