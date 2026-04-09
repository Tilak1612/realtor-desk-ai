import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import agentProfileFemale from "@/assets/agent-profile-female.jpg";
import agentProfileTeam from "@/assets/agent-profile-team.jpg";
import agentProfileBroker from "@/assets/agent-profile-broker.jpg";

interface SegmentCardProps {
  image: string;
  title: string;
  description: string;
  link: string;
}

const SegmentCard = ({ image, title, description, link }: SegmentCardProps) => {
  const { t } = useTranslation();
  return (
  <div className="flex flex-col items-center text-center group">
    {/* Circular Profile Image */}
    <div className="relative mb-6">
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-colors shadow-xl">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      {/* Decorative ring */}
      <div className="absolute inset-0 -m-2 rounded-full border-2 border-dashed border-primary/10 group-hover:border-primary/20 transition-colors"></div>
    </div>
    
    {/* Title */}
    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{title}</h3>
    
    {/* Description */}
    <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-[280px] leading-relaxed">
      {description}
    </p>
    
    {/* Learn More Link */}
    <Link 
      to={link}
      className="text-primary hover:text-primary/80 font-medium text-sm inline-flex items-center gap-1 group/link transition-colors"
    >
      {t('home.audience.learnMore', 'Learn More')}
      <svg 
        className="w-4 h-4 transition-transform group-hover/link:translate-x-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  </div>
);

const AudienceSegments = () => {
  const { t } = useTranslation();

  const segments = [
    {
      image: agentProfileFemale,
      title: t('home.audience.agentTitle', 'For Agents'),
      description: t('home.audience.agentDesc', 'To automate your marketing programs, capture and convert more leads into transactions.'),
      link: "/features"
    },
    {
      image: agentProfileTeam,
      title: t('home.audience.teamTitle', 'For Teams'),
      description: t('home.audience.teamDesc', 'To streamline your sales process, maximize collaboration, and close more team deals.'),
      link: "/features"
    },
    {
      image: agentProfileBroker,
      title: t('home.audience.brokerTitle', 'For Brokers'),
      description: t('home.audience.brokerDesc', 'To accelerate profitable growth by boosting agent productivity and lowering operational costs.'),
      link: "/features"
    }
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-6">
        <div className="bg-card rounded-[40px] py-16 px-6 sm:px-12 border border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-5xl mx-auto">
            {segments.map((segment, index) => (
              <SegmentCard key={index} {...segment} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AudienceSegments;
