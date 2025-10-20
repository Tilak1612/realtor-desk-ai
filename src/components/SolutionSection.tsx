import { Card } from "@/components/ui/card";
import { MessageSquare, Phone, Mail, CheckCircle } from "lucide-react";

const SolutionSection = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="mb-4">Meet Your 24/7 AI Real Estate Team</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Three powerful AI agents working together in one unified dashboard
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* AI Chatbot Card */}
          <Card className="p-6 sm:p-8 card-hover">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4 sm:mb-6">
              <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">AI Chatbot</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              Intelligent lead capture that never sleeps
            </p>
            <ul className="space-y-2 sm:space-y-3">
              {[
                "Answers property questions instantly",
                "Qualifies buyers/sellers automatically",
                "Captures contact info & preferences",
                "Bilingual (English/French)",
                "Works on website & social media"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* AI Voice Agent Card */}
          <Card className="p-6 sm:p-8 card-hover">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4 sm:mb-6">
              <Phone className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">AI Voice Agent</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              Smart call handling with natural conversation
            </p>
            <ul className="space-y-2 sm:space-y-3">
              {[
                "Takes calls when you're busy",
                "Schedules showings automatically",
                "Natural-sounding Canadian voice",
                "Routes hot leads to your phone",
                "Records & transcribes every call"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Email Automation Card */}
          <Card className="p-6 sm:p-8 card-hover sm:col-span-2 md:col-span-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4 sm:mb-6">
              <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Email Automation</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              Follow-up that never stops nurturing leads
            </p>
            <ul className="space-y-2 sm:space-y-3">
              {[
                "Responds to inquiries instantly",
                "Sends personalized property matches",
                "Nurtures leads over 90+ days",
                "Integrates with your email",
                "CASL-compliant unsubscribe"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
