import { Card } from "@/components/ui/card";
import { MessageSquare, Phone, Mail, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const SolutionSection = () => {
  const { t } = useTranslation();
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="mb-4">{t('solution.title')}</h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* AI Chatbot Card */}
          <Card className="p-6 sm:p-8 card-hover">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4 sm:mb-6">
              <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{t('solution.chatbot.title')}</h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                t('solution.chatbot.feature1'),
                t('solution.chatbot.feature2'),
                t('solution.chatbot.feature3'),
                t('solution.chatbot.feature4'),
                t('solution.chatbot.feature5')
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
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{t('solution.voice.title')}</h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                t('solution.voice.feature1'),
                t('solution.voice.feature2'),
                t('solution.voice.feature3'),
                t('solution.voice.feature4'),
                t('solution.voice.feature5')
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
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{t('solution.email.title')}</h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                t('solution.email.feature1'),
                t('solution.email.feature2'),
                t('solution.email.feature3'),
                t('solution.email.feature4'),
                t('solution.email.feature5')
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
