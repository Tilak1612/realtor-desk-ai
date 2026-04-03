import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Unsubscribe page — required for CASL compliance.
 * The send-lead-magnet-email edge function links here.
 * Actual opt-out is handled by replying to support@realtordesk.ai
 * or through Resend's built-in unsubscribe header.
 */
const Unsubscribe = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Unsubscribe</h1>
            <p className="text-muted-foreground">
              To be removed from our email list, reply to any email you received
              from us with the word <strong>unsubscribe</strong> in the subject
              line, or email us directly at{" "}
              <a
                href="mailto:support@realtordesk.ai?subject=Unsubscribe"
                className="text-primary underline hover:no-underline"
              >
                support@realtordesk.ai
              </a>
              .
            </p>
            <p className="text-sm text-muted-foreground">
              We process all opt-out requests within 10 business days as
              required by CASL.
            </p>
          </div>
          <Link
            to="/"
            className="inline-block text-sm text-primary hover:underline"
          >
            ← Back to RealtorDesk AI
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Unsubscribe;
