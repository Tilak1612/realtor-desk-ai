import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        features: "Features",
        pricing: "Pricing",
        integrations: "Integrations",
        canadianMarket: "Canadian Market",
        resources: "Resources",
        faq: "FAQ",
        bookDemo: "Book your free demo",
        startClosing: "Start Closing More Deals",
        getStarted: "Get Started",
        giveFeedback: "Give Feedback",
        signedOut: "Signed out successfully",
        searchPlaceholder: "Search contacts, properties, deals...",
        add: "Add",
        addContact: "Contact",
        addProperty: "Property",
        addDeal: "Deal",
        addTask: "Task",
        notifications: "Notifications",
        viewAllNotifications: "View all notifications",
        profile: "Profile",
        settings: "Settings",
        community: "Community",
        signOut: "Sign out",
        uploadPhoto: "Upload photo",
        changePhoto: "Change photo",
        removePhoto: "Remove photo",
        uploadingPhoto: "Uploading..."
      },
      hero: {
        title: "Close More Deals with AI Built for Canadian Realtors",
        subtitle: "24/7 AI-powered lead capture, call handling, and email automation—designed for the Canadian market with full bilingual support. CREA DDF® integration on the roadmap for Q3 2026.",
        getStarted: "Start Your 14-Day Free Trial",
        watchDemo: "Book your free demo",
        trustLine: "14 Days Free Trial • No credit card required • Cancel anytime",
        badge1: "PIPEDA-Aware Design",
        badge2: "Bilingual EN/FR",
        badge3: "50+ Beta Users",
        conversionBadge: "Conservative 30% Conversion Lift",
        badge: "14-Day Free Trial",
        bullet1: "AI responds to leads instantly, 24/7",
        bullet2: "Built for Canadian agents — PIPEDA, CASL, bilingual EN/FR",
        bullet3: "Bilingual EN/FR",
        testimonial: "\"Captured 3 leads in my first 48 hours I would have lost\"",
        joinAgents: "Join 50+ Canadian agents",
        activeAgents: "Active Agents",
        leads: "Leads",
        aiActive: "AI Active"
      },
      roi: {
        badge: "Calculate Your ROI",
        title: "See Your Potential Savings",
        subtitle: "Discover how much time and money you could save with AI automation"
      },
      home: {
        faq: {
          title: "Frequently Asked Questions",
          subtitle: "Get answers to common questions about RealtorDesk AI",
          moreQuestions: "Have more questions? We're here to help!",
          viewAll: "View All FAQs",
          contactSupport: "Contact Support"
        },
        security: {
          archTitle: "Security-First Architecture",
          archDesc: "Enterprise-grade encryption and security practices protecting your client data",
          pipedaTitle: "PIPEDA-Aware Design",
          pipedaDesc: "Built with Canadian privacy principles — consent management, right to erasure, breach notifications",
          mlsTitle: "Canadian MLS Integration",
          mlsDesc: "Import and sync Canadian property data directly into your CRM",
          bilingualTitle: "Bilingual Support",
          bilingualDesc: "Seamless English & French communication",
          infraTitle: "Canadian-Optimized Infrastructure",
          infraDesc: "Hosted on infrastructure designed to keep your data within Canadian borders",
          aiTitle: "AI Lead Scoring",
          aiDesc: "Prioritize hot leads automatically"
        },
        audience: {
          agentTitle: "For Agents",
          agentDesc: "To automate your marketing programs, capture and convert more leads into transactions.",
          teamTitle: "For Teams",
          teamDesc: "To streamline your sales process, maximize collaboration, and close more team deals.",
          brokerTitle: "For Brokers",
          brokerDesc: "To accelerate profitable growth by boosting agent productivity and lowering operational costs.",
          learnMore: "Learn More"
        },
        socialProof: {
          agents: "agents",
          usingNow: "using now",
          demos: "demos",
          bookedThisWeek: "booked this week",
          joinAgents: "Join agents closing meaningfully more deals"
        },
        credibility: {
          title: "Trusted & Secure"
        },
        demo: {
          title: "See Realtor Desk in Action",
          description: "Watch how AI can transform your real estate business in just 2 minutes",
          watchDemo: "Watch 2-Minute Product Demo",
          bookDemo: "Book a live demo",
          exploreFeatures: "Explore All Features"
        }
      },
      features: {
        hero: {
          title: "Every Feature Your Real Estate Business Needs,",
          titleGradient: "Powered by AI",
          subtitle: "From first contact to closed deal - intelligent automation at every step"
        },
        tabs: {
          crm: "Predictive CRM",
          chatbot: "AI Chatbot",
          market: "Market Intelligence",
          transaction: "Transaction Management",
          marketing: "Marketing Automation"
        },
        tab1: "Predictive CRM",
        tab2: "AI Chatbot",
        tab3: "Market Intelligence",
        tab4: "Transaction Management",
        tab5: "Marketing Automation",
        crm: { h1: "Multi-Dimensional Lead Scoring", p1: "AI analyzes engagement signals including property searches, email opens, social activity, mortgage indicators, and life events to rank your leads", sub1: "Focus on your hottest leads and close more deals", h2: "Conversational Intelligence", p2: "Real-time sentiment analysis across email, text, and chat with urgency detection and automated response suggestions", sub2: "45% more relevant responses, 60% fewer deals falling through", h3: "Automated Data Enrichment", p3: "Autonomous contact profile building from public records, social media, and behavior tracking", sub3: "Dramatically reduce manual data entry with automated profile building" },
        chatbot: { h1: "24/7 Multilingual Engagement", p1: "Intelligent conversations in English and French, handles property inquiries, qualifies leads, schedules showings", sub1: "Maximize after-hours lead capture with AI that never sleeps", h2: "Smart Qualification System", p2: "AI conducts natural conversations to assess buyer readiness, budget, timeline, and preferences", sub2: "Only qualified leads reach your calendar", h3: "Seamless Human Handoff", p3: "AI knows when to transfer to human agent with complete conversation context", sub3: "Never lose a hot lead to automation" },
        market: { h1: "AI-Powered Property Insights (Coming Soon)", p1: "AI-assisted property analysis using local market trends, comparable sales, and neighbourhood data to support your CMA process", sub1: "Faster, data-backed CMAs for your clients", h2: "Off-Market Opportunity Detection", p2: "AI predicts which homeowners are likely to sell 3-6 months before listing", sub2: "Get exclusive listings before competitors", h3: "Real-Time Market Reports", p3: "Automated comparative market analysis with absorption rates, days-on-market trends, price-per-sqft evolution", sub3: "Position yourself as the local market expert" },
        transaction: { h1: "Intelligent Timeline Prediction", p1: "AI forecasts closing dates based on transaction type, parties involved, and historical performance", sub1: "Designed to accelerate your closing timeline with fewer missed steps", h2: "Automated Vendor Coordination", p2: "Smart scheduling of inspectors, appraisers, lawyers with availability optimization", sub2: "75% fewer missed deadlines", h3: "Risk Detection Engine", p3: "Predictive alerts for financing issues, inspection problems, and buyer/seller cold feet", sub3: "Deal fall-through reduced from 12% to 4%" },
        marketing: { h1: "AI Content Generation", p1: "Automated creation of property descriptions, social posts, email campaigns, and neighborhood guides", sub1: "85% less time on marketing content", h2: "Intelligent Distribution", p2: "AI determines optimal posting times, channels, and audience segments for each piece of content", sub2: "150% increase in engagement rates", h3: "Performance Analytics", p3: "ROI tracking by content type, platform, and campaign with improvement recommendations", sub3: "45% reduction in cost per lead" },
        mobile: {
          title: "Work From Anywhere with Our Mobile App",
          subtitle: "Manage your entire real estate business from your phone. Respond to leads, schedule showings, and close deals on the go.",
          appStores: "Available on iOS & Android",
          f1title: "Full CRM Access", f1desc: "View and manage all contacts, leads, and deals from your phone",
          f2title: "Push Notifications", f2desc: "Get instant alerts for new leads, messages, and deal updates",
          f3title: "Offline Mode", f3desc: "Access your data even without internet connection",
          f4title: "Voice Commands", f4desc: "Add notes and create tasks hands-free while driving",
          download: "Download from App Store or Google Play"
        },
        comparison: {
          title: "How We Compare to Leading CRMs",
          disclaimer: "* Pricing and features as of October 2025. Contact competitors directly for current information.",
          feature: "Feature",
          leadScoring: "Predictive Lead Scoring", advancedAI: "✓ Advanced AI", basic: "Basic", manual: "Manual", limited: "Limited",
          chatbot: "24/7 AI Chatbot", bilingual: "✓ Bilingual", addon: "Add-on",
          ddf: "CREA DDF® Integration", comingQ3: "Coming Q3 2026", thirdParty: "Third-party",
          transactionAI: "Transaction AI", fullAutomation: "✓ Full automation",
          compliance: "Canadian Compliance", builtIn: "✓ Built-in",
          marketingAuto: "Marketing Automation", aiGenerated: "✓ AI-generated", templates: "Templates",
          mobileApp: "Mobile App", fullFeatured: "✓ Full-featured",
          startingPrice: "Starting Price", setupFee: "Setup Fee",
          contract: "Contract", monthToMonth: "Month-to-month", annual: "Annual"
        }
      },
      pricing: {
        taxDisclaimer: "Prices are in Canadian dollars (CAD). GST/HST is applied at checkout based on your billing province. Every amount on this page matches what you will see on Stripe's secure checkout.",
        compare: {
          boldtrailCost: "$5,988/year + $999 setup fee",
          loftyCost: "$1,788 – $3,588/year per user",
          ourCost: "$999/year (Founding Member), $0 setup",
          saveCallout: "Save up to 85% compared to BoldTrail, 45% vs Lofty"
        },
        banner: {
          trial: "🎉 14 Days Free Trial - Start Today!",
          launch: "🎉 Launch Pricing — Save $498/year vs. Monthly!"
        },
        hero: {
          badge: "🇨🇦 Proud Canadian Company",
          title: "Simple, Transparent Pricing for",
          titleGradient: "Canadian Real Estate Professionals",
          subtitle: "No setup fees. No hidden costs. No surprises. Just powerful AI to grow your business.",
          monthly: "Monthly",
          yearly: "Yearly",
          saveYearly: "Save up to $500/year"
        },
        plans: {
          agent: {
            name: "AGENT",
            badge: "14 Days Free Trial",
            description: "Perfect for individual agents ready to scale",
            savings: "Save $789/year with annual billing",
            yearlySavingsDetail: "Save $789 vs monthly ($498 vs regular yearly)",
            period: "/month",
            ctaMonthly: "Start 14-Day Free Trial",
            ctaYearly: "Start 14-Day Free Trial",
            feature1: "Unlimited contacts & leads",
            feature2: "AI-powered predictive CRM",
            feature3: "24/7 AI chatbot (website, SMS, email)",
            feature4: "ROI tracking & analytics",
            feature5: "Email & SMS automation",
            feature6: "Canadian market intelligence",
            feature7: "Bilingual support (EN/FR)",
            feature8: "Mobile app included",
            feature9: "Free migration assistance",
            feature10: "No setup fees",
            feature11: "Priority support"
          },
          team: {
            name: "TEAM",
            badge: "Most Popular",
            description: "For growing teams of 2-5 agents",
            period: "/month",
            cta: "Start 14-Day Free Trial",
            feature1: "Everything in Agent tier, plus:",
            feature2: "Team collaboration tools",
            feature3: "Lead distribution & routing",
            feature4: "Team performance dashboard",
            feature5: "Shared pipeline management",
            feature6: "Advanced reporting & analytics",
            feature7: "Priority support",
            feature8: "Dedicated account manager",
            feature9: "Custom training sessions",
            feature10: "API access available",
            feature11: "White-label options"
          },
          brokerage: {
            name: "BROKERAGE",
            badge: "14 Days Free Trial",
            price: "Custom",
            description: "For brokerages with 6+ agents",
            cta: "Start 14-Day Free Trial",
            feature1: "Everything in Team tier, plus:",
            feature2: "Unlimited agents",
            feature3: "Custom branding & white-label",
            feature4: "Advanced admin controls",
            feature5: "Multi-office management",
            feature6: "Brokerage compliance tools",
            feature7: "Dedicated success manager",
            feature8: "Custom AI model training",
            feature9: "Volume pricing discounts",
            feature10: "Premium 24/7 support"
          }
        },
        compareTable: {
          heading: "Compare with Competitors",
          sub: "See how much you save with Realtor Desk AI",
          firstYear: "First year",
          perYear: "Per year",
          saveThousands: "Save thousands!"
        },
        table: {
          heading: "Feature Comparison: Why Agents Switch to Realtor Desk AI",
          featureCol: "Feature",
          annualPrice: "Annual Price (Agent)",
          setupFee: "Setup Fee",
          aiScoring: "AI Predictive Lead Scoring",
          chatbot: "24/7 Bilingual AI Chatbot",
          migration: "Free Migration",
          compliance: "Canadian Compliance (RECO, BCFSA)",
          mobileApp: "Mobile App",
          totalCost: "Total First Year Cost",
          comingQ3: "(Coming Q3 2026)",
          comingSoon: "Coming Soon",
          extraCost: "Extra Cost",
          partial: "Partial",
          basic: "Basic",
          limited: "Limited",
          varies: "Varies",
          boldtrailSwitch: "💰 Switching from BoldTrail?",
          boldtrailSave: "You'll save $5,988 in year one alone!"
        },
        social: {
          heading: "Real Results from Real Agents",
          stat1: "Additional GCI in first year",
          stat2: "Closed from AI chatbot leads",
          stat3: "Time saved on admin tasks",
          stat3Headline: "15 hrs/wk",
          quote1: "\"Switched from BoldTrail and never looked back. The AI lead scoring is incredible.\"",
          quote2: "\"The 24/7 bilingual chatbot captures leads while I sleep. Game changer.\"",
          quote3: "\"Automation handles follow-ups. I focus on closing deals, not data entry.\""
        },
        annual: {
          heading: "Why Choose Annual Billing?",
          monthly: "Monthly Plan",
          mo: "/mo",
          bestValue: "Best Value",
          annualPlan: "Annual Plan (Founding Member)",
          disclaimer: "Annual billing locks in your Founding Member rate forever. Monthly plans may increase to $149/month after promotion ends.",
          yr: "/yr",
          save: "Save $789/year!",
          foundingBonus: "Founding Member Bonus"
        },
        addons: {
          heading: "Enhance Your Plan with Add-Ons",
          staging: "Virtual Staging AI",
          stagingDesc: "Unlimited virtual staging for all your listings",
          reports: "Advanced Market Reports",
          reportsDesc: "Branded reports with your logo and branding",
          leads: "Lead Generation Module",
          leadsDesc: "Targeted seller/buyer lead identification"
        },
        guarantees: {
          heading: "Our Guarantees to You",
          moneyBack: "30-Day Money-Back Guarantee",
          moneyBackDesc: "Close at least one additional deal in your first 30 days or get a full refund. No questions asked.",
          noContracts: "No Contracts, Cancel Anytime",
          noContractsDesc: "All plans are month-to-month. Cancel anytime with one click. No penalties, no hassles.",
          freeSetup: "Free Setup & Migration",
          freeSetupDesc: "We'll migrate your contacts and data from any CRM for free. Plus complimentary onboarding and training.",
          badge1: "No contracts",
          badge2: "No setup fees",
          badge3: "Cancel anytime"
        },
        faq: {
          heading: "Frequently Asked Questions",
          q1: "Do I need to sign a long-term contract?",
          q2: "Is CREA DDF® integration included?",
          q3: "Can I try before I buy?",
          q4: "What if I exceed my contact limit?",
          q5: "Do you offer training?"
        }
      },
        demo: {
          hero: {
            title: "See",
            titleGradient: "Realtor Desk",
            titleEnd: "in Action",
            subtitle: "Schedule a personalized demo and see how we can help your business"
        },
        form: {
          heading: "Request a Personalized Demo",
          title: "Request a Personalized Demo",
          fullName: "Full Name *",
          fullNamePlaceholder: "John Smith",
          email: "Email Address *",
          emailPlaceholder: "john@example.com",
          phone: "Phone Number *",
          brokerage: "Brokerage/Company",
          brokeragePlaceholder: "ABC Realty",
          province: "Province *",
          provincePlaceholder: "Select province",
          crm: "Current CRM (if any)",
          crmPlaceholder: "Select CRM",
          teamSize: "Number of Team Members",
          teamSizePlaceholder: "Select team size",
          challenge: "Biggest Challenge",
          challengePlaceholder: "Select challenge",
          comments: "Comments/Questions",
          commentsPlaceholder: "Tell us more about your needs…",
          submit: "Request Demo",
          submitting: "Submitting...",
          orStart: "Or",
          getStarted: "get started",
          rightAway: "right away"
        },
          expect: {
            title: "What to Expect",
            discovery: "Discovery Call (15 min)",
            discoveryDesc: "We learn about your business, challenges, and goals",
            liveDemo: "Live Demo (30 min)",
            liveDemoDesc: "See Realtor Desk in action with examples specific to your market",
            onboarding: "Custom Onboarding",
          onboardingDesc: "Get started with personalized onboarding and support"
        },
        contact: {
          heading: "Contact Information",
          title: "Contact Information",
          email: "Email",
          phone: "Phone",
          address: "Address"
        },
        selfServe: {
          heading: "Prefer to explore on your own?",
          sub: "Start your 14-day free trial - no demo required",
          cta: "Start 14-Day Free Trial"
        },
        explore: {
          title: "Prefer to explore on your own?",
          subtitle: "Get started today - no demo required",
          cta: "Get Started"
        }
      },
      contact: {
        hero: {
          title: "Get in",
          titleGradient: "Touch",
          subtitle: "Have questions? We're here to help you transform your real estate business with AI"
        },
        info: {
          emailUs: "Email Us",
          callUs: "Call Us",
          visitUs: "Our HQ",
          noWalkIn: "Mailing address only — no walk-in office.",
          support: "Support",
          responseTime: "We respond within 24 hours",
          hours: "Business Hours",
          hoursDetails: "Monday - Friday: 9:00 AM - 6:00 PM MT\nSaturday: 10:00 AM - 4:00 PM MT\nSunday: Closed"
        },
        form: {
          title: "Send Us a Message",
          name: "Full Name *",
          email: "Email *",
          phone: "Phone",
          message: "Message *",
          submit: "Send Message",
          submitting: "Sending...",
          success: "Message Sent! ✅",
          successDesc: "Thanks for reaching out! We'll get back to you within 24 hours."
        },
        map: {
          placeholder: "Map integration placeholder"
        },
        consent: "I consent to my information being collected and used as described in the",
        privacyPolicyLink: "Privacy Policy",
        pipedaNote: "Required under PIPEDA - Your data will only be used to respond to your inquiry"
      },
      canadianMarket: {
        hero: {
          title: "The Only AI Platform Built Specifically for",
          titleGradient: "Canadian Real Estate",
          subtitle: "CREA DDF®, bilingual AI, and provincial compliance - not an afterthought, but the foundation"
        }
      },
      resources: {
        hero: {
          title: "Real Estate",
          titleGradient: "Intelligence Hub",
          subtitle: "Guides, tips, and insights for Canadian real estate professionals"
        }
      },
      // Landing-page i18n scaffold (R-18a Path A, authorized 2026-04-21).
      // EN values are canonical. FR values below are first-draft from the
      // initial scaffold commit — product will deliver approved FR copy
      // to drop in place. Every `landing.*` key used in a component MUST
      // exist in both locales (enforced by the shape parity test at
      // src/i18n/__tests__/shape.test.ts).
      landing: {
        hero: {
          badge: "Now in public beta · 14-day free trial",
          headline1: "Close more deals.",
          headline2: "Calmly.",
          subtitle: "Realtor Desk answers every lead the instant they land — in French or English, on-brand, PIPEDA-aware. You show up to a shortlist, not a fire drill.",
          ctaPrimary: "Start 14-day free trial",
          ctaSecondary: "Book a 15-min demo",
          trustNoCard: "No credit card",
          trustSetup: "5-min setup",
          trustDdf: "CREA DDF ready"
        },
        heroProduct: {
          deskLive: "Desk AI · Live",
          answering: "answering now",
          leadCaptured: "LEAD CAPTURED",
          hotBadge: "Hot · 92",
          kListing: "LISTING",
          kTimeline: "TIMELINE",
          kLang: "LANG",
          kBudget: "BUDGET FIT",
          vLangDetected: "French (detected)",
          vBudgetPreApproved: "✓ pre-approved",
          vTimelineTomorrow: "Tomorrow 7pm",
          leadMsg: "Bonsoir — est-ce que le condo sur rue St-Laurent est encore disponible ? Je peux visiter demain soir.",
          aiReply: "Oui, Émilie ! Il est disponible. J'ai un créneau demain à 19h ou 19h30 — lequel vous convient ? Je vous envoie l'adresse par texto.",
          avgResponseLabel: "AVG RESPONSE TIME"
        },
        trustStrip: {
          label: "Built with · integrated for"
        },
        featureGrid: {
          eyebrow: "Why Realtor Desk",
          heading: "An AI teammate who speaks Canadian real estate.",
          intro: "Five capabilities, one clean console. No plugins, no duct-tape integrations, no midnight follow-ups.",
          meetDeskAi: "Meet Desk AI",
          chatbotTitle: "24/7 AI chatbot",
          chatbotDesc: "Answers MLS questions, qualifies budget, books showings into your calendar — in the tone you train it on.",
          bilingualTitle: "Bilingual EN · FR",
          bilingualDesc: "Detects the lead's language from the first message. Provincially-ready (OACIQ · RECO · RECA · RECBC) out of the box.",
          pipedaTitle: "PIPEDA-native",
          pipedaDesc: "Canadian-hosted data. Consent timestamps on every lead. CASL-compliant email footers.",
          pipelineTitle: "Pipeline that moves",
          pipelineDesc: "Drag-drop kanban, AI-suggested next step, deal-value rollup — nothing sits stale for 14 days.",
          scoringTitle: "Lead scoring",
          scoringDesc: "Intent, urgency, budget, timeline. A live 0–100 score with the \"why\" in plain English.",
          automationsTitle: "Email automations",
          automationsDesc: "Drip templates written for Canadian markets — Toronto pre-construction, Calgary first-time buyers, Montreal relocs."
        },
        pipelinePreview: {
          eyebrow: "The morning read",
          heading: "You show up to a prioritized pipeline. Not an inbox.",
          body: "Every overnight lead triaged. Hot prospects surface at the top with a timestamped transcript of what AI already said — so your first call is informed, not a cold intro.",
          ctaPrimary: "Try the pipeline",
          ctaSecondary: "Watch 2-min tour",
          colNewLeads: "New leads",
          colContacted: "Contacted",
          colShowingBooked: "Showing booked",
          tagHot: "Hot",
          tagWarm: "Warm"
        },
        compareStrip: {
          eyebrow: "The BoldTrail alternative",
          heading: "US-first tools, retrofit for Canada. Or us — where Canada is the brief.",
          hCapability: "Capability",
          hThem: "BoldTrail",
          hUs: "Realtor Desk",
          rowHosting: "Canadian hosting (PIPEDA)",
          rowBilingual: "Bilingual EN/FR out of the box",
          rowCasl: "CASL-compliant email",
          rowDdf: "CREA DDF® native integration",
          rowCad: "CAD pricing",
          rowTtfr: "Time to first AI response",
          valAddon: "Add-on",
          valManual: "Manual",
          valThirdParty: "3rd-party",
          valUsdPremium: "USD, +20%",
          valDays: "2–3 days",
          valMinutes: "5 minutes",
          valIncluded: "Included",
          seeFull: "See the full comparison"
        },
        testimonial: {
          quote: "Customer story coming soon.",
          author: "",
          role: ""
        },
        closingCta: {
          title: "Start your 14-day trial.",
          body: "No credit card. Full access. Import one lead, send one bilingual reply — then decide.",
          cta: "Claim your desk"
        }
      },
      compareBoldtrail: {
        seoTitle: "Realtor Desk vs BoldTrail — the Canadian-first alternative",
        seoDesc: "BoldTrail is a great platform — for KW agents in Dallas. If you're selling pre-construction in Mississauga or condos in Le Plateau, here's how we compare.",
        eyebrow: "Realtor Desk vs BoldTrail",
        headline1: "One's built for the US.",
        headline2: "One's built for you",
        subtitle: "BoldTrail is a great platform — for Keller Williams agents in Dallas. If you're selling pre-construction in Mississauga or condos in Le Plateau, a few things change.",
        heroCardThemTag: "The US market leader",
        heroCardUsTag: "The Canadian-first alternative",
        statFounded: "Founded",
        statParent: "Parent co.",
        statPricing: "Pricing",
        statLaunched: "Launched",
        statHq: "HQ",
        secCanadianFit: "Canadian fit",
        secAiSpeed: "AI & speed",
        secCost: "Cost",
        fCanadianHosted: "Canadian-hosted data (PIPEDA)",
        vThemUsOnly: "✕ US-only",
        vUsCanadianCenters: "✓ Canadian data centers",
        fBilingual: "Bilingual EN · FR",
        vThemAddonCost: "Add-on, $$",
        vUsBuiltIn: "✓ Built in",
        fCaslFooters: "CASL email auto-footers",
        vThemManualTemplate: "Manual template",
        vUsAutomatic: "✓ Automatic",
        fDdfIntegration: "CREA DDF® integration",
        vThemThirdParty: "3rd-party plugin",
        vUsNative: "✓ Native",
        fCadPricing: "CAD pricing",
        vThemUsdPremium: "USD + ~20% premium",
        vUsPureCad: "✓ Pure CAD",
        fAiResponseTime: "AI lead response time",
        vThemMinutes: "2–3 min",
        vUsFast: "< 45s",
        fBilingualAiOob: "Bilingual AI out of the box",
        vNo: "✕",
        vYes: "✓",
        fVoiceAi2026: "Voice AI coming 2026",
        vThemUnknown: "Unknown",
        vUsQ3Beta: "Q3 2026, in beta now",
        fStartingPrice: "Starting price",
        vThemPriceSetup: "USD $499 setup + $99/mo",
        vUsPriceNoSetup: "CAD $149/mo, no setup",
        fAnnualSingle: "Annual plan (single agent)",
        vThemAnnual: "USD $1,188/yr",
        vUsAnnualSave: "CAD $999/yr — save $789",
        fPerUserAfter5: "Per-user cost after 5",
        vThemPerUser: "USD $49",
        vUsPerUser: "CAD $15",
        fOnboardingFee: "Onboarding fee",
        vThemOnboardingFee: "USD $499",
        vUsIncluded: "Included",
        closingHeadline: "Ready to trade USD for a product that speaks your market?",
        closingBody: "Import your BoldTrail leads in one click. 14-day trial. We'll match your remaining annual contract.",
        closingCtaPrimary: "Start your switch",
        closingCtaSecondary: "Talk to a Canadian"
      },
      marketingHeader: {
        navFeatures: "Features",
        navHowItWorks: "How it works",
        navPricing: "Pricing",
        navCompare: "Compare",
        navResources: "Resources",
        navPartners: "Partners",
        ctaSignIn: "Sign in",
        ctaStartFreeTrial: "Start free trial",
        langAriaLabel: "Language",
        openMenu: "Open menu",
        closeMenu: "Close menu",
        drawerNavLabel: "Main navigation menu",
        drawerTitle: "Realtor Desk navigation"
      },
      pricingRd: {
        seoTitle: "Pricing — Realtor Desk",
        seoDesc: "One price. Every feature. Bilingual, PIPEDA-native, CREA DDF-ready. CAD pricing, 14-day trial, no credit card.",
        eyebrow: "Pricing in CAD",
        heading1: "One price.",
        heading2: "Every",
        heading3: "feature.",
        subtitle: "No AI quotas on Team or Brokerage. No \"growth\" tier that hides the integrations. 14-day trial, no credit card.",
        toggleMonthly: "Monthly",
        toggleAnnual: "Annual · save up to $789/yr",
        taxNote: "Prices shown in CAD. GST/HST applied at checkout based on your billing province. The amount on this page matches what you will see on Stripe's secure checkout.",
        compareHeading: "Compare every feature",
        planSoloName: "Solo",
        planSoloTag: "For the single agent",
        planSoloDesc: "Everything you need to stop losing leads at 2 a.m.",
        planSoloSavings: "Save $789 vs monthly",
        planTeamName: "Team",
        planTeamTag: "For 2–10 agents",
        planTeamDesc: "Shared pipeline, round-robin routing, team reports.",
        planTeamSavings: "Save $591 vs monthly",
        planBrokerageName: "Brokerage",
        planBrokerageTag: "For 10+ agents",
        planBrokerageDesc: "Multi-tenant, SSO, dedicated CSM, FINTRAC tooling.",
        featuredTag: "Most agents pick this",
        ctaStart: "Start free trial",
        ctaTalkSales: "Talk to sales",
        unitMo: "/mo",
        unitYr: "/yr",
        billedMonthly: "CAD · billed monthly",
        billedYearly: "CAD · billed yearly",
        customLabel: "Custom",
        customAnnualLabel: "Annual · CAD",
        perMoEffective: "CAD · ${{amount}}/mo effective",
        featEveryIn: "Everything in {{plan}}, plus —",
        featSoloDesk: "Desk AI chatbot, 500 msgs/mo",
        featSoloBilingual: "Bilingual EN · FR",
        featSoloDdf1: "CREA DDF® feed (1 board)",
        featSoloScoring: "Lead scoring + pipeline",
        featSoloCasl: "CASL-compliant email drip",
        featSoloUser: "1 user",
        featTeamAiUnl: "Unlimited AI messages",
        featTeamDdfUnl: "CREA DDF® feed (unlimited)",
        featTeamRouting: "Round-robin lead routing",
        featTeamReports: "Team reports & leaderboard",
        featTeamSeats: "5 users, $15 each after",
        featBrokerageSso: "SAML SSO + Azure AD",
        featBrokerageCompliance: "FINTRAC & provincial regulator workflows",
        featBrokerageDdfCustom: "Custom DDF mappings",
        featBrokerageCsm: "Dedicated Canadian CSM",
        featBrokerageSla: "99.95% uptime SLA",
        matrixSecAi: "AI & automation",
        matrixSecIntegrations: "Integrations",
        matrixSecCompliance: "Compliance · Canada",
        matrixRowDeskMsgs: "Desk AI chatbot (msgs/mo)",
        matrixRowBilingual: "Bilingual EN · FR",
        matrixRowVoice: "Custom voice training",
        matrixRowScoring: "AI lead scoring",
        matrixRowDdfBoards: "CREA DDF® boards",
        matrixRowStack: "Stripe / Twilio / Resend",
        matrixRowSso: "SAML SSO",
        matrixRowPipeda: "PIPEDA hosting (Canada)",
        matrixRowCasl: "CASL email auto-footer",
        matrixRowFintrac: "FINTRAC workflows",
        matrixValUnl: "Unlimited",
        matrixValUnlCustom: "Unlimited + custom",
        colSolo: "Solo",
        colTeam: "Team",
        colBrokerage: "Brokerage"
      },
      marketingFooter: {
        tagline: "The CRM built for Canadian real estate. Hosted in Canada, bilingual, PIPEDA-native.",
        madeInCanada: "Made in Canada",
        colProduct: "Product",
        colCompare: "Compare",
        colCanada: "Canada",
        colCompany: "Company",
        itemFeatures: "Features",
        itemPricing: "Pricing",
        itemHowItWorks: "How it works",
        itemIntegrations: "Integrations",
        itemRoadmap: "Roadmap",
        itemVsBoldtrail: "vs BoldTrail",
        itemVsFub: "vs Follow Up Boss",
        itemVsLofty: "vs Lofty",
        itemVsIxact: "vs IXACT",
        itemVsWiseAgent: "vs Wise Agent",
        itemPipeda: "PIPEDA",
        itemCasl: "CASL",
        itemFintrac: "FINTRAC",
        itemCreaDdf: "CREA DDF",
        itemBlog: "Blog",
        itemCommunity: "Community",
        itemCareers: "Careers",
        itemContact: "Contact",
        itemPrivacy: "Privacy",
        itemTerms: "Terms",
        itemUnsubscribe: "Unsubscribe",
        copyright: "© {{year}} Realtor Desk · Brainfy AI Inc. · Edmonton, AB"
      },
      featuresRd: {
        seoTitle: "Features — Realtor Desk",
        seoDesc: "24/7 bilingual AI chatbot, priority pipeline, PIPEDA-native data, CASL-compliant email automations, CREA DDF sync. The feature set Canadian realtors actually use.",
        badge: "What Desk does",
        heroH1Pre: "One desk that handles the",
        heroH1Italic1: "overnight",
        heroH1Mid: ", so you can handle the",
        heroH1Italic2: "close",
        heroSubtitle: "Desk is your 24/7 bilingual AI colleague. It replies, qualifies, and books — then hands you the conversation when it matters.",
        pillar1Cat: "AI that closes",
        pillar1Title: "24/7 bilingual reply engine",
        pillar1Body: "Desk detects language from the first word and replies in French or English — instantly, day or night. Answers MLS questions, qualifies budget, and books showings straight into your calendar.",
        pillar1Tag1: "EN ↔ FR auto-detect",
        pillar1Tag2: "38s average reply",
        pillar1Tag3: "Books into Google/Outlook",
        pillar2Cat: "Lead intelligence",
        pillar2Title: "Priority pipeline, not an inbox",
        pillar2Body: "Every overnight lead gets triaged. Intent, urgency, budget fit, and timeline scored on one line — so your first call each morning is informed, not cold.",
        pillar2Tag1: "Intent + urgency scoring",
        pillar2Tag2: "Next-best-action queue",
        pillar2Tag3: "CRM since 2020",
        pillar3Cat: "Built for Canada",
        pillar3Title: "PIPEDA-native. CASL-aware. Provincially-ready.",
        pillar3Body: "Canadian data stays in Canadian data centres. Consent is captured at first touch, logged, and revocable. Quebec disclosures and FINTRAC verifications tracked per deal.",
        pillar3Tag1: "AWS ca-central-1",
        pillar3Tag2: "PIPEDA consent log",
        pillar3Tag3: "Quebec bilingual disclosures",
        capsEyebrow: "Everything else",
        capsHeading1: "The plumbing,",
        capsHeadingItalic: "done right",
        capsIntro: "The unsexy stuff most real-estate SaaS forgets. We don't. Each of these is the default, not a premium add-on.",
        capDdfTitle: "CREA DDF sync",
        capDdfBody: "Live MLS listings, 15-minute refresh, pulled straight from your board.",
        capChatTitle: "Website chat widget",
        capChatBody: "Drop-in script. Matches your brokerage colours. Routes overflow to Desk.",
        capEmailTitle: "Email sequences (CASL)",
        capEmailBody: "Drip campaigns with consent gating. Auto-pauses on unsubscribe.",
        capCalendarTitle: "Showing calendar",
        capCalendarBody: "Desk books time slots from your real availability, in the buyer's timezone.",
        capRoutingTitle: "Team routing",
        capRoutingBody: "Round-robin by geography, language, or listing type — whatever fits your team.",
        capRolesTitle: "Roles & permissions",
        capRolesBody: "Team lead, agent, assistant, brokerage admin. Granular access per lead.",
        capAuditTitle: "Activity & audit log",
        capAuditBody: "Every AI action, every agent touch. Immutable. Exportable for compliance.",
        capReportingTitle: "Reporting",
        capReportingBody: "Response time, source ROI, stage conversion, agent leaderboard. CAD throughout.",
        ctaH1Pre: "Free for 14 days.",
        ctaH1Italic: "No card.",
        ctaBody: "Connect your DDF feed, answer a few questions about your brokerage, and Desk is answering leads within 15 minutes.",
        ctaPrimary: "Start free trial",
        ctaSecondary: "Book a demo"
      },
      pageSeo: {
        howItWorksTitle: "How Realtor Desk Works | Setup in 20 Minutes",
        howItWorksDesc: "Get started with Realtor Desk in about 20 minutes. Simple CRM setup, AI tools for Realtors, lead generation configuration, and virtual tour integration.",
        resourcesTitle: "Resources | Guides for Canadian Real Estate Agents",
        resourcesDesc: "Expert guides on AI tools, lead generation, compliance, and marketing for Canadian real estate agents using Realtor Desk.",
        loginTitle: "Sign in — Realtor Desk",
        loginDesc: "Sign in to your Realtor Desk workspace. Canadian-hosted, PIPEDA-aware, bilingual EN/FR.",
        signupTitle: "Start your 14-day free trial — Realtor Desk",
        signupDesc: "Start your 14-day free trial of Realtor Desk. AI lead response, 24/7 chatbot, CREA DDF-ready, CAD pricing. No credit card required.",
        integrationsTitle: "Integrations — Realtor Desk",
        integrationsDesc: "Integrate Realtor Desk via Zapier, Make, and n8n (5,000+ apps). Native connectors on the roadmap. CREA DDF® coming Q3 2026.",
        roadmapTitle: "Product Roadmap — Realtor Desk",
        roadmapDesc: "See what's shipping next. Voice AI, CREA DDF, Centris sync, and more on the Realtor Desk roadmap for 2026.",
        contactTitle: "Contact — Realtor Desk",
        contactDesc: "Get in touch with the Realtor Desk team. Canadian support, bilingual EN/FR, average reply in under 24 hours.",
        faqTitle: "FAQ — Realtor Desk",
        faqDesc: "Answers to common questions about Realtor Desk: pricing in CAD, PIPEDA/CASL compliance, CREA DDF, bilingual support, cancellation.",
        unsubscribeTitle: "Unsubscribe — Realtor Desk",
        unsubscribeDesc: "Manage your Realtor Desk email preferences or unsubscribe. CASL-compliant one-click opt-out.",
        careersTitle: "Careers — Realtor Desk",
        careersDesc: "Build the future of Canadian real estate with Realtor Desk. Remote-friendly roles across engineering, customer success, and growth.",
        privacyTitle: "Privacy Policy — Realtor Desk",
        privacyDesc: "Realtor Desk's privacy policy. Canadian-hosted data, PIPEDA-native, explicit consent tracking, revocable at any time.",
        termsTitle: "Terms of Service — Realtor Desk",
        termsDesc: "Realtor Desk's terms of service, including billing, cancellation, acceptable use, and Canadian jurisdiction.",
        partnersTitle: "Partner Program — Realtor Desk",
        partnersDesc: "Earn recurring commissions by referring Canadian real estate teams to Realtor Desk. 25% starting rate, tiers up to 40%, 90-day last-click attribution, monthly CAD payouts.",
        partnersApplyTitle: "Apply to the Partner Program — Realtor Desk",
        partnersApplyDesc: "Apply to become a Realtor Desk partner. We review every application within 5 business days.",
        partnersTermsTitle: "Partner Program Terms — Realtor Desk",
        partnersTermsDesc: "Realtor Desk Partner Program terms: commission structure, attribution, clawback, prohibited traffic, termination, governing law."
      },
      partnersPage: {
        heroEyebrow: "Partner Program",
        heroHeadline1: "Earn recurring commissions on every Canadian realtor you refer.",
        heroHeadlineItalic: "every",
        heroSubtitle: "Refer coaches, brokerages, and team leads to Realtor Desk. We pay 25% recurring to start, with tiers up to 40% at scale. Canadian-first, CAD payouts, 90-day last-click attribution.",
        heroCtaPrimary: "Apply to become a partner",
        heroCtaSecondary: "Read the program terms",
        heroTrustAttribution: "90-day last-click",
        heroTrustPayout: "Monthly CAD payouts",
        heroTrustReview: "Applications reviewed in 5 business days",
        commissionsEyebrow: "How you earn",
        commissionsHeading: "Starting rate is 25%. Tiers climb with your active referrals.",
        commissionsBody: "Every paying customer you refer counts toward your tier. The commission rate snapshots at the moment each invoice is paid — later promotions don't retro-rate earlier commissions.",
        tierStarterName: "Starter",
        tierStarterRate: "25%",
        tierStarterRule: "0–10 active referrals",
        tierStarterBody: "Recurring commission on every paid invoice, first 12 months of each customer's subscription.",
        tierGrowthName: "Growth",
        tierGrowthRate: "30%",
        tierGrowthRule: "11–25 active referrals",
        tierGrowthBody: "Rate lifts automatically once 11 of your referrals are actively paying.",
        tierEliteName: "Elite",
        tierEliteRate: "40%",
        tierEliteRule: "26+ active referrals",
        tierEliteBody: "Top tier. Reserved for partners who bring consistent, qualified Canadian real-estate volume.",
        tierAmbassadorName: "Ambassador",
        tierAmbassadorRate: "20%",
        tierAmbassadorRule: "Invitation-only track",
        tierAmbassadorBody: "Partnered coaches, educators, and brand ambassadors who get co-marketing support at a fixed rate.",
        howItWorksEyebrow: "How it works",
        howItWorksHeading: "Three steps, no contracts to sign to get started.",
        step1Number: "01",
        step1Title: "Apply",
        step1Body: "Fill out the partner application. We review every submission within 5 business days and approve partners whose audience is a fit for the Canadian realtor market.",
        step2Number: "02",
        step2Title: "Share your link",
        step2Body: "Once approved, you get a referral link and a set of co-branded marketing assets. Post it on your site, email list, YouTube channel, or newsletter — last-click attribution works across channels.",
        step3Number: "03",
        step3Title: "Get paid",
        step3Body: "Every paid invoice triggers a commission snapshot on your dashboard. We pay monthly once you clear CAD $50. Interac e-Transfer for Canadian partners; Wise or PayPal for international.",
        whoEyebrow: "Who's a fit",
        whoHeading: "Most partners fall into one of four archetypes.",
        whoCreatorTitle: "Real estate coaches and content creators",
        whoCreatorBody: "YouTube educators, LinkedIn voices, newsletter authors. Canadian agents trust voices that sound like them — not US-first ad channels.",
        whoBrokerageTitle: "Brokerage leaders and team builders",
        whoBrokerageBody: "If you run a team of 10+ agents, referring your brokerage gets you the Elite tier rate on every seat.",
        whoConsultantTitle: "PropTech consultants and integrators",
        whoConsultantBody: "You already sell CRM setup, automation audits, or tech-stack migrations. Add Realtor Desk as the Canadian-first recommendation.",
        whoAgencyTitle: "Marketing agencies serving realtors",
        whoAgencyBody: "White-label-friendly. We'll train your team on the product so you can onboard clients without escalating to us every time.",
        faqEyebrow: "FAQ",
        faqHeading: "The details partners always ask about.",
        faqAttributionQ: "How does attribution work?",
        faqAttributionA: "Last-click, 90-day cookie. If a lead clicks your link and signs up within 90 days, you get the commission — even if they clicked another partner's link later, the most recent one wins. Clearing the cookie resets the window.",
        faqClawbackQ: "What happens if a customer refunds?",
        faqClawbackA: "We claw back commissions on refunds within a 60-day window. If the commission hasn't been paid out yet, we cancel it. If it's already been paid, we deduct the equivalent from your next payout — never charge back money that's already hit your account.",
        faqPayoutQ: "When do I get paid?",
        faqPayoutA: "Monthly, on the 15th, for all commissions that cleared the 60-day clawback window in the prior month. Minimum payout is CAD $50; balances under that roll forward.",
        faqCurrencyQ: "What currency?",
        faqCurrencyA: "Payouts default to CAD. International partners can choose USD in their settings. Commissions are always recorded in the invoice's original currency plus a CAD-equivalent snapshot so your dashboard totals don't drift when exchange rates move.",
        faqDisallowedQ: "What traffic isn't allowed?",
        faqDisallowedA: "No self-referrals, no incentivized traffic (cashback / loyalty sites), no bidding on Realtor Desk branded keywords, no misleading reviews. Full rules in the program terms.",
        faqStatusQ: "Is the program live right now?",
        faqStatusA: "The program is open for applications. The self-serve partner dashboard ships once our platform migration completes — until then we process approvals and send payout reports manually every month. You'll never miss a commission; attribution is tracked from day one.",
        ctaFinalHeading: "Ready to start earning?",
        ctaFinalBody: "Applications take about 5 minutes. We respond within 5 business days.",
        ctaFinalPrimary: "Apply to become a partner",
        ctaFinalSecondary: "Read the program terms"
      },
      partnersApply: {
        pageHeading: "Apply to the Realtor Desk Partner Program",
        pageSubtitle: "Tell us who you are, how you'll promote Realtor Desk, and who your audience is. We review every application within 5 business days.",
        sectionAbout: "About you",
        sectionAudience: "Your audience",
        sectionConsent: "Consent",
        fieldFullName: "Full name *",
        fieldFullNamePh: "First and last name",
        fieldEmail: "Email *",
        fieldEmailPh: "We'll use this to reach you",
        fieldCompany: "Company or brand (optional)",
        fieldCompanyPh: "Your agency, brokerage, or personal brand",
        fieldCountry: "Country *",
        fieldCountryPh: "e.g. Canada",
        fieldWebsite: "Primary website or social URL *",
        fieldWebsitePh: "LinkedIn, YouTube, Substack, personal site — wherever your audience lives",
        fieldAudienceSize: "Audience size",
        fieldAudienceSizePh: "Select a range",
        audienceTier1: "Under 1,000",
        audienceTier2: "1,000 – 10,000",
        audienceTier3: "10,000 – 50,000",
        audienceTier4: "50,000 – 250,000",
        audienceTier5: "250,000+",
        fieldPromoteHow: "How will you promote Realtor Desk? *",
        fieldPromoteHowPh: "Newsletter, YouTube channel, brokerage email list, consulting engagements — be specific. (150 words max.)",
        fieldAudienceWhy: "Why is Realtor Desk a fit for your audience? *",
        fieldAudienceWhyPh: "What do they struggle with that Realtor Desk solves? (150 words max.)",
        fieldPipedaConsent: "I consent to Brainfy AI Inc. storing my application data under PIPEDA for partner-program review. *",
        fieldPipedaConsentHelp: "We use this only to review your application. You can request deletion at any time by emailing partners@realtordesk.ai.",
        fieldTermsConsent: "I have read and accept the Partner Program Terms. *",
        submitBtn: "Submit application",
        submittingBtn: "Submitting…",
        successHeading: "Application received",
        successBody: "Thanks for applying. We review every submission within 5 business days and will email you at the address above either way.",
        successCta: "Back to the partner program",
        errorHeading: "We couldn't submit your application",
        errorBody: "Please try again in a moment. If the issue persists, email partners@realtordesk.ai directly.",
        errFullNameReq: "Full name is required",
        errEmail: "Please enter a valid email address",
        errCountryReq: "Country is required",
        errWebsiteReq: "Please share at least one public URL so we can review your audience",
        errWebsiteInvalid: "That doesn't look like a valid URL",
        errPromoteMin: "Tell us a bit about how you'll promote Realtor Desk",
        errPromoteMax: "Please keep this answer to 150 words or less",
        errAudienceMin: "Tell us a bit about why Realtor Desk fits your audience",
        errAudienceMax: "Please keep this answer to 150 words or less",
        errPipedaConsent: "We can't process your application without PIPEDA consent",
        errTermsConsent: "Please read and accept the Partner Program Terms"
      },
      partnersTerms: {
        pageHeading: "Realtor Desk Partner Program Terms",
        effective: "Effective {{date}} · subject to revision · contact partners@realtordesk.ai for the current version",
        draftNotice: "These terms are the baseline program agreement. They do not override separately negotiated contracts with named partners.",
        sect1Title: "1. Who can join",
        sect1Body: "The Partner Program is open to individuals and businesses who can lawfully promote Realtor Desk in their jurisdiction and whose audience or client base aligns with Canadian real estate professionals. Applications are reviewed within 5 business days. We reserve the right to accept, reject, or suspend any applicant at our sole discretion.",
        sect2Title: "2. Commission structure",
        sect2Body: "Standard partners earn 25% recurring commission on every paid invoice from referred customers, moving to 30% at 11 active referrals and 40% at 26 active referrals. Ambassador-track partners earn a fixed 20% under separately agreed terms. The commission rate is snapshotted at the moment each invoice is paid; subsequent tier changes do not retroactively re-rate earlier commissions.",
        sect3Title: "3. Attribution",
        sect3Body: "Attribution is last-click with a 90-day cookie window. When a prospect clicks your referral link, a cookie records the attribution. The most recent partner referral within that 90-day window receives credit when the prospect subscribes. Clearing browser cookies ends the attribution window.",
        sect4Title: "4. Payouts",
        sect4Body: "Commissions are approved after a 60-day clawback window expires and are paid out monthly on the 15th for all commissions that cleared the prior month. Minimum payout is CAD $50; lower balances roll forward. Canadian partners are paid by Interac e-Transfer; international partners by Wise or PayPal. Partners are responsible for their own tax reporting; we issue T4A slips to Canadian partners who earn over the CRA reporting threshold in a calendar year.",
        sect5Title: "5. Clawbacks",
        sect5Body: "If a referred customer refunds, disputes, or is detected as fraudulent within 60 days of their paid invoice, the associated commission is reversed. If the commission has not yet been paid out, it is cancelled. If it has been paid out, the equivalent is deducted from your next payout. We never retroactively debit funds that have already cleared to your account.",
        sect6Title: "6. Prohibited conduct",
        sect6Body: "Self-referrals, incentivized traffic (cashback/loyalty programs unless separately approved), bidding on Realtor Desk branded keywords in paid search, misleading reviews, trademark violations, impersonation of Realtor Desk staff, spam as defined by CASL (Canada's Anti-Spam Legislation), and promoting Realtor Desk via channels that violate PIPEDA are all prohibited. Violations terminate participation and forfeit any unpaid commissions.",
        sect7Title: "7. Marketing assets",
        sect7Body: "Approved partners may use the Realtor Desk wordmark and official marketing assets solely to promote Realtor Desk. You may not modify the wordmark, create derivative logos, or imply affiliation beyond being an independent partner. Realtor Desk is not affiliated with or endorsed by the Canadian Real Estate Association (CREA); REALTOR® is a registered trademark of CREA.",
        sect8Title: "8. Termination",
        sect8Body: "Either party may terminate participation at any time with written notice to partners@realtordesk.ai. Upon termination, any approved-but-unpaid commissions are paid in the next regular payout cycle. Pending commissions inside the 60-day clawback window may still be clawed back if the underlying transaction is refunded.",
        sect9Title: "9. Data and privacy",
        sect9Body: "Application data and partner account data are stored by Brainfy AI Inc. in Canadian data centres under PIPEDA. Quebec applicants' data is handled in accordance with Quebec's Law 25. You can request access, correction, or deletion of your data by emailing partners@realtordesk.ai.",
        sect10Title: "10. Limitation of liability",
        sect10Body: "Realtor Desk's aggregate liability under this program is limited to commissions earned in the preceding 12 months. We provide the program and marketing assets on an \"as-is\" basis and make no warranty of conversion rates, uptime, or earnings.",
        sect11Title: "11. Governing law",
        sect11Body: "This agreement is governed by the laws of Alberta, Canada. Disputes will be resolved in the courts of Alberta unless both parties agree in writing to arbitration.",
        sect12Title: "12. Changes",
        sect12Body: "We may update these terms with 30 days' notice by email to registered partners and by updating this page. Continued participation after the notice period constitutes acceptance.",
        contactHeading: "Questions?",
        contactBody: "Email partners@realtordesk.ai. We respond within 2 business days."
      },
      careersPage: {
        heroH1Pre: "Build the future of",
        heroH1Gradient: "Canadian real estate",
        heroH1Post: "with us",
        heroSubtitle: "Realtor Desk helps agents close more deals with less manual work. Join a lean, high-ownership team shipping AI products built for the Canadian market.",
        valueRemoteTitle: "Remote-first",
        valueRemoteBody: "Work from anywhere in Canada or North America with async-friendly collaboration.",
        valueActionTitle: "Bias to action",
        valueActionBody: "Own outcomes, move quickly, and make practical decisions with imperfect information.",
        valueCanadaTitle: "Canada-focused",
        valueCanadaBody: "Solve real workflows for Canadian agents with local compliance and market context.",
        valueImpactTitle: "Real impact",
        valueImpactBody: "Your work ships fast and directly affects retention, revenue, and customer success.",
        prioritySectionTitle: "Hiring now — priority roles",
        prioritySectionBody: "These 4 roles are critical hires that directly unblock product velocity, retention, and growth.",
        priorityBadge: "Hiring Now",
        priorityApplyCta: "Apply now",
        priorityOptionalFifth: "Optional 5th hire:",
        priorityOptionalBody: "If the founder is stretched thin on product decisions, a part-time Product Manager / Founding PM who can own roadmap execution and cross-functional coordination would be a high-leverage addition.",
        allRolesTitle: "All roles",
        catEngineering: "Product & Engineering",
        catCustomerGrowth: "Customer & Growth",
        catOperations: "Operations & Strategy",
        accordionResponsibilities: "Responsibilities",
        accordionQualifications: "Qualifications",
        applicationSectionTitle: "Application form",
        applicationSectionBody: "Submit one application for any role. Role-specific fields appear automatically based on your selection.",
        sectionCoreInfo: "Core information",
        sectionProfessionalBackground: "Professional background",
        sectionRoleSpecific: "Role-specific links (optional)",
        sectionFitQuestions: "Fit questions (required, 150 words max each)",
        sectionFinalDetails: "Final details",
        fieldFullName: "Full name *",
        fieldFullNamePh: "Your full name as it appears professionally",
        fieldEmail: "Email address *",
        fieldEmailPh: "We'll use this to reach you",
        fieldPhone: "Phone number *",
        fieldPhonePh: "Including area code (Canada/US preferred)",
        fieldLocation: "Location (City, Province) *",
        fieldLocationPh: "e.g., Toronto, ON",
        fieldRole: "Role applying for *",
        fieldRolePh: "Select the role that best matches your background",
        fieldAvailability: "Availability to start *",
        fieldAvailabilityPh: "Select one",
        availImmediately: "Immediately",
        avail2Weeks: "2 weeks",
        avail1Month: "1 month",
        avail2PlusMonths: "2+ months",
        fieldWorkAuth: "Work authorization *",
        fieldWorkAuthPh: "Select one",
        authCitizen: "Canadian Citizen",
        authPR: "Permanent Resident",
        authWorkPermit: "Valid Work Permit",
        authUsBased: "US-based (open to consideration)",
        fieldResume: "Resume / CV upload *",
        fieldResumeHelp: "Max 5 MB. PDF preferred.",
        fieldLinkedIn: "LinkedIn profile URL *",
        fieldLinkedInPh: "Your up-to-date LinkedIn profile",
        fieldExperience: "Years of relevant experience *",
        fieldExperiencePh: "Select experience range",
        expUnder1: "Under 1 yr",
        exp1to2: "1–2 yrs",
        exp3to5: "3–5 yrs",
        exp5to10: "5–10 yrs",
        exp10plus: "10+ yrs",
        fieldGithub: "GitHub profile URL",
        fieldGithubPh: "Link to your GitHub or GitLab",
        fieldPortfolio: "Portfolio / personal site",
        fieldPortfolioPh: "Personal site, portfolio, or work samples",
        fieldWriting: "Writing samples URL",
        fieldWritingPh: "Published articles, posts, or portfolio",
        fieldCrmTools: "CRM / sales tools used",
        fieldCrmToolsPh: "e.g., HubSpot, Salesforce, Follow Up Boss",
        fieldWhyNow: "Why Realtor Desk — and why now?",
        fieldWhyNowPh: "Tell us what drew you to this role and why an early-stage, Canadian real estate SaaS company excites you now.",
        fieldLimitedGuidance: "Tell us about a time you had to figure something out with limited guidance or resources.",
        fieldLimitedGuidancePh: "Walk us through the situation, what you did, and what happened.",
        fieldCanadaView: "What do you know about the Canadian real estate market, and what do you think agents struggle with most?",
        fieldCanadaViewPh: "Share your perspective on Canadian market dynamics and agent pain points.",
        fieldReferredBy: "Referred by",
        fieldReferredByPh: "Were you referred by someone in our network?",
        fieldAdditional: "Anything else you'd like us to know?",
        fieldAdditionalPh: "Add context your resume doesn't capture — side projects, non-linear paths, motivations, and more.",
        fieldPipedaConsent: "I consent to store my application data in accordance with PIPEDA. *",
        fieldPipedaConsentHelp: "We store your application information securely and use it only for hiring purposes.",
        submitBtn: "Submit application",
        submittingBtn: "Submitting application…",
        dontSeeRoleTitle: "Don't see your role?",
        dontSeeRoleBody: "Send us a short note and tell us how you can help us build Realtor Desk.",
        errFullNameReq: "Full name is required",
        errFullNameMax: "Name is too long",
        errEmail: "Please enter a valid email address",
        errPhone: "Please enter a valid phone number",
        errLocationReq: "Location is required",
        errLocationMax: "Location is too long",
        errRoleReq: "Please select a role",
        errAvailabilityReq: "Please select your availability",
        errWorkAuthReq: "Please select your work authorization",
        errResumeReq: "Resume/CV is required",
        errResumeSize: "Max file size is 5 MB",
        errResumeType: "Please upload a PDF or DOCX file",
        errLinkedInReq: "Please enter a valid LinkedIn URL",
        errExperienceReq: "Please select experience level",
        errUrlInvalid: "Please enter a valid URL",
        errCrmMax: "Please keep this under 250 characters",
        errAnswerMin: "Please provide at least a short answer",
        errAnswerWords: "Please keep this answer to 150 words or less",
        errReferredByMax: "Please keep this under 120 characters",
        errAdditionalMax: "Please keep this under 2000 characters",
        errConsentReq: "Consent is required to submit your application"
      },
      resourcesDisclosure: {
        frOnlyBody: "Some guides are currently English-only while we translate them. {{hidden}} additional articles are available in the English catalogue.",
        viewEnCta: "View the full English catalogue"
      },
      a11y: {
        notifications: "Notifications",
        accountMenu: "Account menu",
        changeLanguage: "Change language",
        rowActions: "Actions for {{name}}",
        closeDialog: "Close",
        dialogDescription: {
          addContact: "Add a new contact to your CRM",
          editContact: "Update contact details",
          logActivity: "Log a call, meeting, email, or note for this contact",
          importContacts: "Import multiple contacts from a CSV file",
          addDeal: "Create a new deal in your pipeline",
          editDeal: "Update deal details",
          winLoss: "Mark this deal as won or lost and capture outcome details",
          addTask: "Create a new task or reminder",
          editTask: "Update task details",
          addProperty: "Add a new property listing",
          propertyDetail: "View and edit property details"
        }
      },
      communityBanner: {
        heading: "We just launched the Realtor Desk Community",
        body: "Chat with other Canadian agents, share tips, and shape what we build next.",
        cta: "Join community",
        dismiss: "Dismiss community banner"
      },
      communityLaunch: {
        seoTitle: "Introducing the Realtor Desk Community — Realtor Desk",
        seoDesc: "We just launched a community space where Canadian real estate agents using Realtor Desk can share tips, ask questions, and shape the product.",
        backToResources: "Back to Resources",
        tag: "Product update",
        publishDate: "April 24, 2026",
        readTime: "3 min read",
        h1: "Introducing the Realtor Desk Community",
        lede: "A space for Canadian agents using Realtor Desk to share tips, ask questions, and shape what we build next.",
        sec1Heading: "Why we're doing this",
        sec1P1: "Realtor Desk users keep messaging us about the same problems — figuring out which CRM stages map to RECO's lead-handling rules, what \"reasonable\" response time means in practice, how other agents are wiring AI follow-ups without sounding like a bot. The answers are usually short. The path to those answers is currently \"email support and wait,\" which doesn't scale and isn't where you want to live.",
        sec1P2: "A community fixes both problems. You get a faster answer from people who've already been through it. We hear what's actually breaking in the field. And the conversations stick around for the next agent who hits the same wall.",
        sec2Heading: "What's inside",
        sec2Intro: "We've set up a Discord server (free to join, mobile-native, no second password to remember) with a small set of channels:",
        sec2Item1: "Tips & Tricks — power-user knowledge sharing. Drip-campaign templates that actually work, FINTRAC document checklists, what \"best contact time\" field people are populating with.",
        sec2Item2: "Feature Requests — what should we build next? React-vote on threads, we read every one.",
        sec2Item3: "Canadian Market Talk — RECO/OACIQ/RECA/RECBC chatter, provincial regulation updates, the open-house circuit by city.",
        sec2Item4: "AI & Automation — how realtors are actually using the AI features. What works, what falls flat, prompts that surprise you.",
        sec2Item5: "Bugs & Support — for discussion of issues. (Actual support tickets still go through in-app — that's how we track and respond.)",
        sec3Heading: "Ground rules",
        sec3P1: "Four things, kept short:",
        sec3Item1: "Be respectful. No harassment, no slurs.",
        sec3Item2: "No selling, no recruiting, no MLM links.",
        sec3Item3: "No client PII. If you're discussing a real situation, anonymize it.",
        sec3Item4: "English or French — both welcome, neither required to translate.",
        sec4Heading: "How to join",
        sec4P1: "Free to join, no Realtor Desk subscription required. Click the button below or find the link in your account menu inside the app.",
        sec4P2: "We're staffing the channels actively for the first 30 days — staff replies within 12 hours, no question is too small. After that we expect the regulars to do most of the answering, with us nudging conversations and dropping product updates in the announcements channel.",
        ctaHeading: "Ready to join?",
        ctaBody: "Free to join. Bring your curiosity and one tip from your last deal.",
        ctaButton: "Join the community"
      },
      integrations: {
        hero: {
          title: "Connect Your Entire",
          titleGradient: "Real Estate Tech Stack",
          subtitle: "Realtor Desk AI integrates seamlessly with all your favorite tools and platforms"
        }
      },
      comparison: {
        badge: "Comparison Guide",
        savings: "Save",
        firstYear: "first year!",
        complaints: "Common Complaints We Hear",
        schedule: "Schedule Free Migration Call"
      },
      problem: {
        badge: "The Bottleneck",
        title: "Struggling with slow,",
        titleHighlight: "expensive lead management?",
        subtitle: "Stop relying on fragmented tools and manual follow-ups. 48% of leads are lost to slow response times.",
        leadsLost: "of leads lost",
        toolsUsed: "tools used daily",
        monthlyWaste: "wasted monthly",
        lostOpportunities: {
          title: "Lost Opportunities",
          text: "67% of leads contact agents outside business hours. Are you there to respond?"
        },
        toolOverload: {
          title: "Tool Overload",
          text: "Juggling 5+ platforms for chat, email, calls, and CRM. There's a better way."
        },
        wastedSpend: {
          title: "Wasted Ad Spend",
          text: "You pay for leads, but slow response times mean competitors close them first."
        }
      },
      solution: {
        badge: "The Solution",
        title: "AI-Powered Tools",
        titleHighlight: "Built for Canadian Realtors",
        subtitle: "24/7 automation that speaks English and French, with PIPEDA compliance and CREA DDF® integration coming soon.",
        chatbot: {
          title: "24/7 AI Chatbot",
          description: "Capture and qualify leads around the clock with a bilingual AI chatbot that answers property questions, books showings, and never misses a lead.",
          benefit1: "Responds to leads in under 2 minutes",
          benefit2: "Bilingual English & French conversations",
          benefit3: "Automatically qualifies and scores leads",
          feature1: "Answers property questions instantly",
          feature2: "Qualifies buyers/sellers automatically",
          feature3: "Captures contact info & preferences",
          feature4: "Bilingual (English/French)",
          feature5: "Works on your website & social media"
        },
        voice: {
          title: "Smart Follow-Up Engine",
          description: "Never miss a callback. AI prioritizes your daily call list based on lead scores, engagement signals, and optimal contact times.",
          benefit1: "AI-prioritized daily call lists",
          benefit2: "Automated follow-up reminders",
          benefit3: "Call summaries generated by AI",
          feature1: "Takes calls when you're busy",
          feature2: "Schedules showings automatically",
          feature3: "Natural-sounding Canadian voice",
          feature4: "Routes hot leads to your phone",
          feature5: "Records & transcribes every call"
        },
        email: {
          title: "Automated Email Campaigns",
          description: "Nurture leads on autopilot with personalized drip campaigns, property alerts, and market updates — all CASL-compliant.",
          benefit1: "Pre-built drip campaign templates",
          benefit2: "Personalized property alert emails",
          benefit3: "CASL-compliant with one-click unsubscribe",
          feature1: "Responds to inquiries instantly",
          feature2: "Sends personalized property matches",
          feature3: "Nurtures leads over 90+ days",
          feature4: "Integrates with your email",
          feature5: "CASL-compliant unsubscribe"
        }
      },
      dashboard: {
        title: "Everything in One Place",
        subtitle: "Manage all your conversations, leads, and insights from a single powerful dashboard",
        feature1: "All conversations (chat, voice, email) in one view",
        feature2: "AI-powered lead scoring highlights hot prospects",
        feature3: "Real-time notifications for urgent inquiries",
        feature4: "One-click response templates",
        feature5: "Performance analytics & ROI tracking",
        loadFailed: "Failed to load profile"
      },
      ai: {
        title: "Realtor AI Assistant",
        subtitle: "Your intelligent real estate CRM assistant",
        clearChat: "Clear Chat",
        quickActions: "Quick Actions",
        welcomeTitle: "Welcome to Realtor AI Assistant",
        welcomeDesc: "I can help you manage contacts, analyze deals, create tasks, and provide real estate insights. Try one of the quick actions above!",
        placeholder: "Ask me anything about your CRM, contacts, deals...",
        actions: {
          analyzePipeline: "Analyze my pipeline",
          draftEmail: "Draft follow-up email",
          createTask: "Create task",
          marketResearch: "Market research"
        }
      },
      canadian: {
        title: "Built for the Canadian Market",
        bilingual: "Bilingual Support (EN/FR)",
        mls: "Integrates with Canadian MLS Systems",
        compliant: "PIPEDA & CASL Compliant",
        timezones: "All 6 Canadian Time Zones Covered",
        crea: "CREA Code of Ethics Aligned",
        pricing: "Pricing in CAD"
      },
      faq: {
        title: "Frequently Asked",
        titleGradient: "Questions",
        subtitle: "Find answers to common questions about Realtor Desk AI",
        q1: {
          question: "Is Realtor Desk ready for production use?",
          answer: "We're currently in public beta with 50+ active realtors across Canada. The platform is fully functional and stable, but we're actively gathering feedback and adding features. Beta users help shape our roadmap and receive lifetime discounts."
        },
        q2: {
          question: "What does 'beta' mean for me?",
          answer: "You get full access to all features at a discounted rate. We may add/modify features based on feedback. You'll receive priority support and direct access to our team. Your pricing is locked in for life—you'll never pay more than your beta rate."
        },
        q3: {
          question: "Can I trust the platform with my client data?",
          answer: "Absolutely. We use bank-level encryption (AES-256), host data on Canadian-optimized infrastructure, and are designed with PIPEDA principles — including right-to-erasure and breach notification protocols."
        },
        q4: {
          question: "What if the platform doesn't work as described?",
          answer: "We offer a 30-day money-back guarantee. If you're not satisfied for any reason, we'll refund you in full. During beta, we also offer unlimited support to ensure your success."
        },
        q5: {
          question: "Are the '300% conversion increase' claims real?",
          answer: "This metric comes from our pilot program participants who saw an average 300% improvement in lead response time, which correlated with increased conversions. Individual results vary based on market, lead quality, and how you use the platform. We're tracking metrics as we scale."
        },
        q6: {
          question: "What certifications do you actually have?",
          answer: "We are built on enterprise-grade infrastructure with strong security practices, designed with PIPEDA principles, and use Canadian MLS data integration. As we grow, we plan to pursue formal third-party security certifications and display them proudly."
        },
        q7: {
          question: "Does the AI sound robotic?",
          answer: "Our AI uses advanced natural language processing and sounds remarkably human. For voice calls, we use Canadian-accented voices that clients find warm and professional."
        },
        q8: {
          question: "How long does setup take?",
          answer: "Most agents are fully operational within 20 minutes. Our setup wizard guides you through connecting your tools, training the AI on your listings, and customizing responses."
        },
        q9: {
          question: "What if the AI can't answer a question?",
          answer: "The AI seamlessly escalates complex questions to you via SMS or phone. It provides full conversation context so you can pick up exactly where it left off."
        },
        q10: {
          question: "Is this CASL compliant?",
          answer: "Absolutely. RealtorDesk.ai is built specifically for Canadian regulations. All emails include proper sender identification, consent tracking, and easy unsubscribe options."
        },
        q11: {
          question: "Which CRMs do you integrate with?",
          answer: "Today: native Zapier, Make, and n8n — which cover 5,000+ apps including Follow Up Boss, Brivity, HubSpot, and Salesforce via Zapier. Direct connectors for Salesforce, Zoho CRM, Pipedrive, Freshsales, and Microsoft Dynamics are on the roadmap. You can also bulk-import any CRM via CSV."
        },
        q12: {
          question: "Can I customize the AI's responses?",
          answer: "Yes! You control the AI's personality, response templates, and which questions it handles vs. escalates to you. It learns your style over time."
        },
        q13: {
          question: "How does RealtorDesk AI compare to Follow Up Boss?",
          answer: "RealtorDesk AI offers AI-powered instant lead response (under 3 seconds) and bilingual support starting at $149/mo CAD, with CREA DDF® integration on the Q3 2026 roadmap. Follow Up Boss requires manual follow-up, lacks AI features, and costs $49-$99 USD/user/month without Canadian-specific features."
        },
        q14: {
          question: "Does RealtorDesk AI work with CREA DDF®?",
          answer: "CREA DDF® integration is on the Q3 2026 roadmap for RealtorDesk AI. When it launches, you'll be able to sync MLS listings automatically, match buyers to properties in real-time, and manage listing data directly within the CRM. In the meantime, you can import listings from Realtor.ca via the built-in importer."
        },
        q15: {
          question: "What's the average ROI for agents using RealtorDesk AI?",
          answer: "Based on our beta user data, agents see a meaningful lift in lead conversion due to sub-3-second response times. With an average agent closing 12-18 deals per year, adding just 2-3 extra deals from better follow-up pays for the CRM many times over."
        },
        q16: {
          question: "Can RealtorDesk AI handle phone calls?",
          answer: "Yes! Our AI Voice Agent can handle inbound phone calls 24/7, answer questions about listings, qualify leads, and book appointments directly into your calendar—all with a natural Canadian accent in English or French."
        },
        q17: {
          question: "Is RealtorDesk AI suitable for real estate teams?",
          answer: "Absolutely. Our Teams plan supports unlimited users with shared inbox, team performance analytics, round-robin lead distribution, and custom AI training. Perfect for brokerages and teams of 2-50+ agents."
        },
        q18: {
          question: "How long does it take to see results with RealtorDesk AI?",
          answer: "Most agents see immediate improvements in response time (instant instead of hours/days). Within the first 30 days, agents typically see 25-40% more qualified appointments booked. Measurable deal increases usually show within 60-90 days."
        },
        q19: {
          question: "Does RealtorDesk AI integrate with my existing website?",
          answer: "Yes! Our AI chatbot widget installs on any website with a simple code snippet (works with WordPress, Wix, Squarespace, custom sites). It takes less than 5 minutes to set up and starts capturing leads immediately."
        },
        q20: {
          question: "What makes RealtorDesk AI different from traditional CRMs?",
          answer: "Traditional CRMs organize contacts but require YOU to do all the follow-up. RealtorDesk AI actively engages leads 24/7 via chat, email, SMS, and voice—qualifying them and booking appointments while you focus on closings. It's the difference between a filing cabinet and an AI assistant."
        },
        cta: {
          title: "Still Have Questions?",
          subtitle: "We're here to help! Get in touch with our team or start your free trial today.",
          contactSupport: "Contact Support",
          startTrial: "Start Your 14-Day Free Trial",
          noCreditCard: "No credit card required • Cancel anytime"
        }
      },
        cta: {
        title: "Ready to Never Miss a Lead Again?",
        subtitle: "Join our growing Canadian beta community using AI to close more deals",
        button: "Start Your 14-Day Free Trial",
        note: "14 Days Free • No credit card required • Cancel anytime"
      },
      mobileCTA: {
        title: "Start Your 14-Day Free Trial",
        subtitle: "Join Our Canadian Beta Community"
      },
      trustTransparency: {
        badge: "Trust & Transparency",
        title: "Built on Honesty",
        subtitle: "We believe in transparent communication about our beta program",
        beta: {
          title: "Beta Program",
          desc: "Early access with special pricing",
          description: "We're currently in beta with select Canadian realtors. Join our pilot program and help shape the future of AI in real estate.",
          badge: "Limited Spots Available"
        },
        results: {
          title: "Real Results",
          desc: "Verified testimonials from beta users",
          description: "Performance metrics based on our pilot program with 50+ active users. Individual results may vary based on market conditions and usage.",
          disclaimer: "*Results from pilot participants"
        },
        security: {
          title: "Security First",
          desc: "Enterprise-grade data protection",
          description: "Security-first architecture, PIPEDA-aware data handling, and enterprise-grade encryption from day one."
        },
        canadian: {
          title: "Canadian Built",
          desc: "Made for Canadian realtors",
          description: "Designed specifically for Canadian realtors with data residency in Toronto/Vancouver and full bilingual support."
        },
        disclaimer: "Realtor Desk is currently in beta. All performance metrics are based on pilot program results. Individual outcomes may vary."
      },
      betaCommunity: {
        title: "Join Our Growing Beta Community",
        participants: "50+ Beta Participants",
        limitedSpots: "Limited Beta Spots Available",
        resultsTitle: "Real Results from Our Beta Community",
        resultsSubtitle: "Canadian realtors are already seeing measurable results. Here's what early adopters are experiencing:",
        testimonialDisclaimer: "*Testimonials represent individual experiences from our pilot program. Results vary and are not guaranteed. Average results may differ.",
        ctaTitle: "Ready to Join Our Beta Program?",
        ctaSubtitle: "Limited spots available. Be part of shaping the future of real estate AI in Canada.",
        ctaButton: "Apply for Beta Access",
        ctaNote: "Beta participants get lifetime discounts and priority feature access",
        testimonials: {
          sarah: {
            quote: "I was skeptical about AI, but after the first week, I had 3 showings booked while I was sleeping. The voice agent sounds natural and captures all the details I need.",
            brokerage: "Independent Agent",
            stats: {
              leads: "leads captured in first month",
              showings: "showings booked automatically",
              deals: "deals closed"
            },
            badge: "Beta Participant Since Nov 2024"
          },
          marc: {
            quote: "The seamless English/French switching is perfect for Montreal. My AI handles both languages naturally, which has opened up my market significantly.",
            brokerage: "Century 21",
            stats: {
              increase: "increase in francophone leads",
              response: "of inquiries answered <2 minutes",
              saved: "hours/week saved"
            },
            badge: "Beta Participant Since Dec 2024"
          },
          jennifer: {
            quote: "Our team of 5 agents now operates like a team of 15. The unified dashboard means no lead falls through the cracks, even when we're all busy.",
            brokerage: "RE/MAX Team Lead",
            stats: {
              responseTime: "avg AI response time",
              leadIncrease: "increase in qualified leads",
              additionalDeals: "additional deals in Q1"
            },
            badge: "Beta Participant Since Jan 2025"
          }
        }
      },
      aiActive: "AI ACTIVE",
      roiCalculator: {
        title: "Calculate Your Potential ROI",
        subtitle: "See your projected returns with conservative estimates",
        monthlyLeads: "Current Monthly Leads",
        leadsPerMonth: "leads/month",
        conversionRate: "Current Conversion Rate",
        avgCommission: "Average Commission per Deal",
        planSelection: "Plan Selection",
        solo: "Solo",
        team: "Team",
        withoutAI: "Without RealtorDesk AI",
        withAI: "With RealtorDesk AI",
        dealsPerMonth: "Deals per month:",
        monthlyRevenue: "Monthly revenue:",
        annualRevenue: "Annual revenue:",
        improvedConversion: "Improved conversion:",
        platformCost: "Platform cost:",
        netGain: "Net Gain:",
        roi: "ROI:",
        disclaimer1: "Conservative estimate based on improved response time and 24/7 availability.",
        disclaimer2: "*Assumes 30% conversion improvement, lower than pilot program average.",
        ctaButton: "See this ROI for yourself—Start Free Trial"
      },
      demoBooking: {
        title: "See RealtorDesk AI in Action",
        demoTitle: "15-Minute Personalized Demo",
        liveDemo: "Live, not recorded",
        whatYouSee: "What you'll see:",
        benefit1: "Live walkthrough of AI chatbot, voice agent, and email automation",
        benefit2: "How to set up in under 15 minutes",
        benefit3: "Custom configuration for your market and needs",
        benefit4: "Q&A with our team",
        benefit5: "Exclusive beta pricing offer",
        testimonial: "\"The demo sold me instantly. Seeing the AI handle real estate questions in real-time was impressive.\"",
        testimonialAuthor: "- Beta Participant",
        flexibleScheduling: "Flexible Scheduling",
        flexibleSchedulingDesc: "Available across all Canadian time zones. We'll accommodate your schedule.",
        bookYourDemo: "Book Your Demo",
        nameLabel: "Name *",
        namePlaceholder: "Your full name",
        emailLabel: "Email *",
        emailPlaceholder: "your.email@example.com",
        phoneLabel: "Phone *",
        phonePlaceholder: "(555) 123-4567",
        brokerageLabel: "Brokerage *",
        brokeragePlaceholder: "Your brokerage name",
        interestsLabel: "What interests you most? *",
        interestChatbot: "AI Chatbot",
        interestVoice: "Voice Agent",
        interestEmail: "Email Automation",
        interestAll: "All Features",
        detectedTimezone: "Detected timezone:",
        submitButton: "Request Demo",
        submitting: "Submitting...",
        cantFindTime: "Can't find a time? Email",
        andAccommodate: "and we'll accommodate you.",
        successTitle: "Demo Request Received! 🎉",
        successDescription: "We'll contact you within 24 hours to schedule your personalized demo.",
        validationError: "Validation Error",
        errorTitle: "Error",
        errorDescription: "There was an error submitting your request. Please try again.",
        nameRequired: "Name is required",
        emailInvalid: "Invalid email address",
        phoneRequired: "Phone is required",
        brokerageRequired: "Brokerage is required",
        interestsRequired: "Select at least one interest"
      },
      indexPage: {
        socialProof: {
          banner: "Join Our Growing Beta Community",
          betaParticipants: "Beta Participants",
          limitedSpots: "Limited Beta Spots Available"
        },
        credibility: {
          soc2Title: "Security-First Architecture",
          soc2Desc: "Enterprise-grade encryption and data protection",
          pipedaTitle: "PIPEDA-Aware Design",
          pipedaDesc: "Built around Canadian privacy principles",
          creaTitle: "CREA DDF® Integration",
          creaDesc: "Official CREA DDF® integration partner"
        },
        problemStatement: {
          title: "The Hidden Costs of Outdated Real Estate Technology",
          subtitle: "Traditional CRMs are holding Canadian realtors back from their full potential",
          stat1: "of agents use AI capabilities despite 72% using CRMs",
          stat2: "of buyer inquiries receive NO response",
          stat3: "hours weekly spent on tasks that could be automated",
          stat4: "lead conversion rate with traditional methods"
        },
        solutionOverview: {
          title: "Meet Your AI-Powered Real Estate Operating System",
          subtitle: "Transform how you work with intelligent automation designed specifically for Canadian realtors",
          feature1Title: "Predictive Lead Scoring",
          feature1Desc: "AI analyzes 40+ signals to identify hot leads 3-6 months early. Converts 18% vs industry 5%. Built on 500,000+ Canadian transactions",
          feature2Title: "24/7 Bilingual AI Chatbot",
          feature2Desc: "Captures leads in EN/FR, qualifies buyers, schedules showings, answers 200+ property questions. Never miss a 2 AM inquiry again",
          feature3Title: "Smart Transaction Coordinator",
          feature3Desc: "Automate status updates, document requests, deadline tracking. Cut closing time from 60 to 35 days with 99% accuracy"
        },
        roiDisclaimer: "*ROI calculations are projections based on industry averages and pilot program data. Actual results depend on market conditions, lead quality, individual effort, and other factors. Past performance does not guarantee future results.",
        security: {
          title: "Enterprise-Grade Security & Developer Tools",
          subtitle: "Built for scale, secured for compliance, ready for integration",
          securityTitle: "Security & Compliance",
          sec1: "Security-First Architecture:",
          sec1Desc: "Enterprise-grade encryption, regular security reviews, high-availability infrastructure",
          sec2: "PIPEDA-Aware Design:",
          sec2Desc: "Right to access, delete, data portability. Breach notification <72hrs",
          sec3: "CASL-Aware:",
          sec3Desc: "Express consent tracking, auto-unsubscribe, 24-month proof retention",
          sec4: "Canadian-Optimized Infrastructure:",
          sec4Desc: "Hosted on infrastructure optimized for Canadian data residency requirements",
          sec5: "Encryption:",
          sec5Desc: "TLS 1.3 in transit, AES-256 at rest, end-to-end for sensitive docs",
          sec6: "Access Control:",
          sec6Desc: "Role-based permissions, 2FA, SSO (Enterprise), audit logs",
          apiTitle: "API & Integration Capabilities",
          api1: "REST API:",
          api1Desc: "Full CRUD access to contacts, deals, tasks. Rate limit: 1000 req/min",
          api2: "Webhooks:",
          api2Desc: "Real-time events (new lead, deal closed, task overdue)",
          api3: "CRM Sync:",
          api3Desc: "Native Zapier, Make, and n8n. Direct connectors for Salesforce, Zoho, Pipedrive on the roadmap.",
          api4: "Calendar Integration:",
          api4Desc: "2-way sync with Google/Outlook. Auto-create Zoom links",
          api5: "Email Platforms:",
          api5Desc: "Gmail, Outlook, MailChimp, SendGrid. SMTP/IMAP support",
          api6: "Documentation:",
          api6Desc: "Interactive API docs, SDK (JavaScript/Python), Postman collection",
          viewIntegrations: "View Integration Library",
          performanceTitle: "Platform Performance",
          perf1: "Uptime SLA",
          perf2: "AI Response Time",
          perf3: "Concurrent Users",
          perf4: "Support (Enterprise)"
        },
        finalCTA: {
          title: "Join 50+ Canadian Agents Growing Their Business with AI",
          subtitle: "Start closing more deals with AI-powered automation today",
          startTrial: "Start Your 14-Day Free Trial",
          bookDemo: "Book your free demo",
          note: "⚡ 14 Days Free Trial • No credit card required • Cancel anytime"
        },
        betaNotice: {
          title: "Beta Program Notice",
          description: "RealtorDesk AI is currently in public beta. We're continuously improving based on user feedback. All features, pricing, and metrics are subject to change. Early adopters receive special lifetime pricing."
        }
      },
      // Dashboard & App Translations
      app: {
        sidebar: {
          today: "Today",
          automations: "Automations",
          advanced: "Advanced",
          dashboard: "Dashboard",
          contacts: "Contacts",
          properties: "Properties",
          deals: "Deals",
          tasks: "Tasks",
          aiAssistant: "AI Assistant",
          campaigns: "Campaigns",
          calendar: "Calendar",
          reports: "Reports",
          market: "Market Intelligence",
          integrations: "Integrations",
          billing: "Billing",
          settings: "Settings",
          trialActive: "Trial active",
          daysLeft: "days left in your trial",
          upgradeNow: "Upgrade"
        },
        navbar: {
          search: "Search contacts, deals, tasks...",
          notifications: "Notifications",
          profile: "Profile",
          signOut: "Sign Out",
          help: "Help"
        },
        dashboard: {
          welcomeBack: "Welcome back",
          tasksDueToday: "tasks due today",
          hotLeadsToFollow: "hot leads to follow up",
          newLeadsThisMonth: "New Leads (This Month)",
          activeDeals: "Active Deals",
          tasksDue: "Tasks Due Today",
          revenueYTD: "Revenue YTD",
          pipeline: "pipeline",
          overdue: "overdue",
          ofAnnualGoal: "of annual goal",
          trialDaysLeft: "days left in your free trial",
          upgradeNowContinue: "Upgrade now to continue after your trial ends",
          loading: "Loading..."
        },
        contacts: {
          title: "Contacts",
          addContact: "Add Contact",
          importContacts: "Import",
          exportContacts: "Export",
          searchPlaceholder: "Search contacts...",
          allContacts: "All Contacts",
          leads: "Leads",
          clients: "Clients",
          pastClients: "Past Clients",
          noContacts: "No contacts found",
          addFirst: "Add your first contact to get started",
          firstName: "First Name",
          lastName: "Last Name",
          email: "Email",
          phone: "Phone",
          source: "Source",
          status: "Status",
          tags: "Tags",
          leadScore: "Lead Score",
          lastContact: "Last Contact",
          actions: "Actions",
          edit: "Edit",
          delete: "Delete",
          view: "View Details",
          bulkActions: "Bulk Actions",
          selected: "selected",
          deleteSelected: "Delete Selected",
          addTags: "Add Tags",
          sendEmail: "Send Email",
          startCallSession: "Start Call Session",
          viewTable: "Table",
          viewCards: "Cards",
          filters: {
            searchPlaceholder: "Search by name, email, or phone...",
            leadScore: "Lead Score",
            coldRange: "Cold (0-49)",
            warmRange: "Warm (50-79)",
            hotRange: "Hot (80+)",
            hotLeads: "Hot leads",
            warmLeads: "Warm leads",
            coldLeads: "Cold leads",
            clearAll: "Clear All Filters",
            searchChip: "Search",
            scoreChip: "Score"
          },
          empty: {
            title: "No contacts yet",
            importCta: "Import contacts",
            refresh: "Refresh"
          }
        },
        deals: {
          title: "Deals",
          addDeal: "Add Deal",
          searchPlaceholder: "Search deals...",
          allDeals: "All Deals",
          active: "Active",
          won: "Won",
          lost: "Lost",
          noDeals: "No deals found",
          addFirst: "Add your first deal to get started",
          dealName: "Deal Name",
          client: "Client",
          property: "Property",
          value: "Value",
          stage: "Stage",
          probability: "Probability",
          expectedClose: "Expected Close",
          stages: {
            lead: "Lead",
            viewing: "Viewing",
            offer: "Offer",
            negotiation: "Negotiation",
            closing: "Closing",
            won: "Won",
            lost: "Lost"
          },
          pipeline: "Pipeline",
          totalValue: "Total Value",
          avgDealSize: "Avg Deal Size",
          winRate: "Win Rate"
        },
        tasks: {
          title: "Tasks",
          addTask: "Add Task",
          searchPlaceholder: "Search tasks...",
          allTasks: "All Tasks",
          today: "Today",
          upcoming: "Upcoming",
          overdue: "Overdue",
          completed: "Completed",
          noTasks: "No tasks found",
          addFirst: "Add your first task to get started",
          taskName: "Task Name",
          dueDate: "Due Date",
          dueTime: "Due Time",
          priority: "Priority",
          priorities: {
            low: "Low",
            medium: "Medium",
            high: "High",
            urgent: "Urgent"
          },
          status: "Status",
          statuses: {
            pending: "Pending",
            inProgress: "In Progress",
            completed: "Completed",
            cancelled: "Cancelled"
          },
          relatedTo: "Related To",
          description: "Description",
          markComplete: "Mark Complete",
          markIncomplete: "Mark Incomplete"
        },
        properties: {
          title: "Properties",
          addProperty: "Add Property",
          searchPlaceholder: "Search properties...",
          allProperties: "All Properties",
          active: "Active",
          pending: "Pending",
          sold: "Sold",
          noProperties: "No properties found",
          addFirst: "Add your first property to get started",
          propertyTitle: "Title",
          address: "Address",
          city: "City",
          province: "Province",
          postalCode: "Postal Code",
          price: "Price",
          type: "Type",
          bedrooms: "Bedrooms",
          bathrooms: "Bathrooms",
          squareFeet: "Square Feet",
          yearBuilt: "Year Built",
          mlsNumber: "MLS Number",
          listingType: "Listing Type",
          types: {
            house: "House",
            condo: "Condo",
            townhouse: "Townhouse",
            land: "Land",
            commercial: "Commercial"
          }
        },
        settings: {
          title: "Settings",
          profile: "Profile",
          profileDesc: "Update your name, brokerage, and contact details",
          accountDesc: "Manage your session and account access",
          avatarHint: "Click the avatar to upload a new photo",
          phone: "Phone",
          selectProvince: "Select province",
          selectCity: "Select city",
          endsOn: "Ends on",
          language: {
            english: "English",
            french: "French",
            both: "Bilingual"
          },
          account: "Account",
          notifications: {
            label: "Notifications",
            desc: "Manage your email and push notification preferences",
            email: "Email notifications",
            emailDesc: "Receive email alerts for new leads and deal updates",
            sms: "SMS notifications",
            smsDesc: "Get text alerts for urgent follow-ups",
            comingSoon: "Coming Soon"
          },
          integrations: "Integrations",
          billing: "Billing",
          security: "Security",
          language: "Language",
          timezone: "Timezone",
          fullName: "Full Name",
          emailAddress: "Email Address",
          phoneNumber: "Phone Number",
          company: "Company/Brokerage",
          licenseNumber: "License Number",
          province: "Province",
          city: "City",
          save: "Save Changes",
          cancel: "Cancel",
          twoFactor: {
            title: "Two-Factor Authentication (2FA)",
            subtitle: "Protect your account with two-factor authentication",
            helper: "Add an extra layer of security with an authenticator app.",
            enable: "Enable 2FA",
            disable: "Disable 2FA",
            verify: "Verify",
            activeBody: "Your account is protected with TOTP-based 2FA.",
            inactiveBody: "Add an extra layer of security with an authenticator app.",
            setupHeading: "Set up Two-Factor Authentication",
            setupHelp: "Scan this QR code with your authenticator app (Google Authenticator, Authy, or 1Password), then enter the 6-digit code below.",
            qrAlt: "TOTP QR Code",
            disableConfirmTitle: "Disable Two-Factor Authentication?",
            disableConfirmBody: "This will make your account less secure. You can re-enable it at any time.",
            enabledToastTitle: "2FA Enabled",
            enabledToastDesc: "Two-factor authentication is now active on your account.",
            disabledToastTitle: "2FA Disabled",
            disabledToastDesc: "Two-factor authentication has been removed.",
            enrollFailed: "Failed to start MFA enrollment",
            verifyFailed: "Verification failed",
            invalidCode: "Invalid TOTP code. Try again.",
            disableFailed: "Failed to disable 2FA",
            noFactor: "No 2FA factor found"
          },
          profileMenu: {
            changePhoto: "Change photo",
            removePhoto: "Remove photo"
          },
          dataRights: {
            exportTitle: "Export my data",
            exportDesc: "Download everything we store about you as a JSON file (PIPEDA access right).",
            deleteTitle: "Delete my account",
            deleteDesc: "Erase your profile and all associated data (PIPEDA right to erasure). Processed within 30 days.",
            confirmTitle: "Delete your account?",
            confirmBody: "This is a PIPEDA right-to-erasure request. We'll confirm by email and fully erase your data within 30 days. Undo is not available once processed."
          }
        },
        common: {
          loading: "Loading...",
          save: "Save",
          cancel: "Cancel",
          delete: "Delete",
          edit: "Edit",
          add: "Add",
          search: "Search",
          filter: "Filter",
          sort: "Sort",
          export: "Export",
          import: "Import",
          refresh: "Refresh",
          back: "Back",
          next: "Next",
          previous: "Previous",
          close: "Close",
          confirm: "Confirm",
          yes: "Yes",
          no: "No",
          all: "All",
          none: "None",
          selectAll: "Select All",
          deselectAll: "Deselect All",
          noResults: "No results found",
          error: "Error",
          success: "Success",
          warning: "Warning",
          info: "Info",
          required: "Required",
          optional: "Optional",
          saving: "Saving...",
          continue: "Continue",
          skip: "Skip for now"
        },
        auth: {
          signIn: "Sign In",
          signUp: "Sign Up",
          signOut: "Sign Out",
          email: "Email",
          password: "Password",
          confirmPassword: "Confirm Password",
          forgotPassword: "Forgot Password?",
          resetPassword: "Reset Password",
          createAccount: "Create Account",
          alreadyHaveAccount: "Already have an account?",
          dontHaveAccount: "Don't have an account?",
          verifyEmail: "Verify Email",
          checkYourEmail: "Check your email for a verification link",
          invalidCredentials: "Invalid email or password",
          emailRequired: "Email is required",
          passwordRequired: "Password is required",
          passwordMinLength: "Password must be at least 8 characters",
          passwordsDoNotMatch: "Passwords do not match",
          passwordRequirements: {
            minLength: "At least 8 characters",
            uppercase: "At least 1 uppercase letter (A-Z)",
            lowercase: "At least 1 lowercase letter (a-z)",
            number: "At least 1 number (0-9)",
            special: "At least 1 special character (!@#$%^&*)",
            notMet: "Password does not meet all requirements"
          }
        },
        validation: {
          required: "This field is required",
          email: "Please enter a valid email address",
          phone: "Please enter a valid phone number",
          minLength: "Must be at least {{min}} characters",
          maxLength: "Must be no more than {{max}} characters",
          number: "Please enter a valid number",
          date: "Please enter a valid date",
          url: "Please enter a valid URL"
        },
        notifications: {
          contactCreated: "Contact created successfully",
          contactUpdated: "Contact updated successfully",
          contactDeleted: "Contact deleted successfully",
          dealCreated: "Deal created successfully",
          dealUpdated: "Deal updated successfully",
          dealDeleted: "Deal deleted successfully",
          taskCreated: "Task created successfully",
          taskUpdated: "Task updated successfully",
          taskDeleted: "Task deleted successfully",
          taskCompleted: "Task marked as complete",
          propertyCreated: "Property created successfully",
          propertyUpdated: "Property updated successfully",
          propertyDeleted: "Property deleted successfully",
          settingsSaved: "Settings saved successfully",
          errorOccurred: "An error occurred. Please try again."
        },
        modals: {
          addContact: {
            title: "Add New Contact",
            firstName: "First Name",
            lastName: "Last Name",
            email: "Email",
            phone: "Phone",
            source: "Source",
            selectSource: "Select source",
            tags: "Tags",
            tagsPlaceholder: "First-time buyer, Pre-approved, Urgent (comma separated)",
            notes: "Notes",
            notesPlaceholder: "Add any additional information about this contact...",
            caslTitle: "🇨🇦 Canadian Compliance (CASL)",
            preferredLanguage: "Preferred Language",
            selectLanguage: "Select language",
            english: "English",
            french: "French",
            consentLabel: "Contact has given consent for communication (CASL)",
            consentDescription: "Required under Canada's Anti-Spam Legislation for sending commercial electronic messages",
            cancel: "Cancel",
            addContact: "Add Contact",
            adding: "Adding...",
            notAuthenticated: "Not authenticated",
            pleaseLogin: "Please log in to add contacts",
            success: "Contact added successfully",
            contactAdded: "has been added to your contacts",
            errorAdding: "Error adding contact",
            validation: {
              firstNameRequired: "First name is required",
              lastNameRequired: "Last name is required",
              invalidEmail: "Please enter a valid email address"
            },
            sources: {
              website: "Website",
              referral: "Referral",
              openHouse: "Open House",
              zillow: "Zillow",
              realtorCom: "Realtor.com",
              socialMedia: "Social Media",
              import: "Import",
              other: "Other"
            }
          },
          addDeal: {
            title: "Add New Transaction",
            contact: "Contact",
            selectContact: "Select a contact",
            transactionTitle: "Transaction Title",
            titlePlaceholder: "e.g., Downtown Condo Purchase",
            clientType: "Client Type",
            selectType: "Select type",
            buyer: "Buyer",
            seller: "Seller",
            both: "Both",
            propertyType: "Property Type",
            propertyAddress: "Property Address",
            addressPlaceholder: "123 Main St, Toronto, ON M1A 1A1",
            mlsNumber: "MLS Number",
            listingPrice: "Listing Price (CAD)",
            commission: "Commission %",
            stage: "Stage",
            stages: {
              newLead: "New Lead",
              contacted: "Contacted",
              showingScheduled: "Showing Scheduled",
              offerMade: "Offer Made",
              underContract: "Under Contract",
              closing: "Closing"
            },
            dealProbability: "Deal Probability",
            expectedClosingDate: "Expected Closing Date",
            pickDate: "Pick a date",
            notes: "Notes",
            notesPlaceholder: "Additional details about this transaction...",
            cancel: "Cancel",
            createTransaction: "Create Transaction",
            creating: "Creating...",
            fillRequired: "Please fill in contact and title",
            failedCreate: "Failed to create transaction",
            successCreate: "Transaction created successfully",
            propertyTypes: {
              condo: "Condo",
              house: "House",
              townhouse: "Townhouse",
              commercial: "Commercial",
              land: "Land",
              other: "Other"
            }
          },
          addTask: {
            title: "Add New Task",
            taskTitle: "Task Title",
            titlePlaceholder: "e.g., Call client about property viewing",
            description: "Description",
            descriptionPlaceholder: "Additional details...",
            dueDate: "Due Date",
            pickDate: "Pick a date",
            dueTime: "Due Time",
            priority: "Priority",
            priorities: {
              low: "Low",
              medium: "Normal",
              high: "High",
              urgent: "Urgent"
            },
            taskType: "Task Type",
            taskTypes: {
              call: "Call",
              email: "Email",
              meeting: "Meeting",
              viewing: "Viewing",
              followup: "Follow-up",
              other: "Other"
            },
            associatedContact: "Associated Contact",
            selectContactOptional: "Select a contact (optional)",
            associatedDeal: "Associated Deal",
            selectDealOptional: "Select a deal (optional)",
            reminder: "Reminder",
            reminders: {
              none: "None",
              fifteenMin: "15 minutes before",
              oneHour: "1 hour before",
              oneDay: "1 day before"
            },
            cancel: "Cancel",
            addAnother: "Add & Add Another",
            addTask: "Add Task",
            creating: "Creating...",
            fillRequired: "Please fill in required fields",
            failedCreate: "Failed to create task",
            successCreate: "Task created successfully"
          },
          addProperty: {
            title: "Add New Property",
            quickAdd: "🚀 Quick Add from MLS Listing URL",
            pasteUrl: "Paste Listing URL (Coming Soon: Auto-fill from CREA DDF)",
            urlPlaceholder: "https://realtor.ca/listing/...",
            urlNote: "Phase 1: We'll scrape basic info. Phase 2: CREA DDF integration is planned for Q3 2026.",
            propertyTitle: "Property Title",
            titlePlaceholder: "Beautiful 3BR Family Home",
            address: "Address",
            addressPlaceholder: "123 Main Street",
            city: "City",
            cityPlaceholder: "Toronto",
            province: "Province",
            provincePlaceholder: "ON",
            propertyType: "Property Type",
            types: {
              house: "House",
              condo: "Condo",
              townhouse: "Townhouse",
              land: "Land",
              commercial: "Commercial"
            },
            status: "Status",
            statuses: {
              active: "Active",
              pending: "Pending",
              sold: "Sold",
              comingSoon: "Coming Soon",
              offMarket: "Off Market"
            },
            price: "Price (CAD)",
            bedrooms: "Bedrooms",
            bathrooms: "Bathrooms",
            squareFeet: "Square Feet",
            mlsNumber: "MLS Number",
            imageUrl: "Image URL",
            description: "Description",
            descriptionPlaceholder: "Describe the property features, amenities, location benefits...",
            cancel: "Cancel",
            addProperty: "Add Property",
            adding: "Adding...",
            success: "Property added successfully",
            errorAdding: "Error adding property"
          },
          importContacts: {
            title: "Import Contacts",
            uploadDescription: "Upload a CSV file with your contacts",
            chooseFile: "Choose File",
            selected: "Selected:",
            formatGuide: "CSV Format Guide",
            formatDescription: "Your CSV should include these columns:",
            importing: "Importing contacts...",
            cancel: "Cancel",
            import: "Import",
            importingBtn: "Importing...",
            imported: "Imported",
            errors: "Errors",
            done: "Done",
            importComplete: "Import complete",
            importSuccess: "contacts imported successfully.",
            importFailed: "Import failed",
            invalidFileType: "Invalid file type",
            pleaseSelectCSV: "Please select a CSV file",
            notAuthenticated: "Not authenticated",
            pleaseLogin: "Please log in to import contacts"
          }
        },
        tasks: {
          title: "Tasks",
          addTask: "Add task",
          allTasks: "All",
          today: "Today",
          upcoming: "This week",
          overdue: "Overdue",
          empty: {
            title: "No tasks yet.",
            body: "Create your first task to get started."
          },
          stats: {
            dueToday: "Due today",
            overdue: "Overdue",
            completedToday: "Completed today",
            thisWeek: "This week"
          }
        },
        campaigns: {
          title: "Email campaigns",
          subtitle: "Manage and track your email marketing campaigns",
          newCampaign: "New campaign",
          recent: "Recent campaigns",
          comingSoon: "Email campaigns are coming soon — we'll let you know the moment they're live.",
          stats: {
            total: "Total campaigns",
            sent: "Emails sent",
            openRate: "Avg. open rate",
            clickRate: "Click rate",
            startSending: "Start sending to see metrics",
            requiresSent: "Requires sent campaigns"
          },
          empty: {
            title: "No campaigns yet",
            body: "Create your first email campaign to stay in touch with leads and clients.",
            cta: "Create your first campaign"
          }
        },
        automations: {
          title: "Email automations",
          subtitle: "Create automated email sequences to nurture leads and engage contacts",
          create: "Create automation",
          comingSoon: "Email automations are coming soon — the trigger engine is still in development. We'll notify you the moment it's live.",
          stats: {
            total: "Total automations",
            active: "Active",
            enrolled: "Contacts enrolled"
          },
          empty: {
            title: "No automations yet",
            body: "Create your first automation to start engaging contacts automatically",
            cta: "Create your first automation"
          }
        },
        properties: {
          title: "Properties",
          addProperty: "Add property",
          active: "active",
          pending: "pending",
          sold: "sold",
          view: {
            grid: "Grid",
            list: "List"
          },
          searchPlaceholder: "Search by address, MLS#, city…",
          priceOnRequest: "Price on request",
          beds: {
            label: "Bedrooms",
            any: "Any beds",
            plus: "{{n}}+ beds"
          },
          filters: {
            status: "Status",
            propertyType: "Property type",
            priceRange: "Price range"
          },
          status: {
            active: "Active",
            pending: "Pending",
            sold: "Sold",
            comingSoon: "Coming soon",
            offMarket: "Off market"
          },
          types: {
            house: "House",
            condo: "Condo",
            townhouse: "Townhouse",
            land: "Land",
            commercial: "Commercial"
          },
          empty: {
            title: "No properties yet",
            body: "Add your first property to start tracking listings, managing showings, and closing deals faster.",
            importMls: "Import from MLS",
            addManual: "Add property manually",
            tip: "💡 Tip: You can also import properties from Realtor.ca search URLs"
          }
        }
      },
      howItWorks: {
        hero: {
          title: "Get Up and Running in",
          titleGradient: "20 Minutes",
          subtitle: "From signup to capturing leads in less time than it takes to drive to a showing. No technical skills required."
        },
        steps: {
          signUp: {
            title: "Sign Up",
            time: "2 minutes",
            description: "Create your account and choose your plan. No credit card required for 14-day trial.",
            details: [
              "Enter your name, email, and brokerage info",
              "Choose your subscription tier",
              "Verify your email address",
              "Access your dashboard immediately"
            ]
          },
          connectTools: {
            title: "Connect Your Tools",
            time: "5 minutes",
            description: "Link your CRM, email, website, and phone system with simple one-click integrations.",
            details: [
              "Connect existing CRM via Zapier/Make or CSV import",
              "Link Gmail or Outlook email",
              "Add website widget code snippet",
              "Import existing contacts (CSV or direct sync)"
            ]
          },
          trainAI: {
            title: "Train Your AI",
            time: "10 minutes",
            description: "Teach the AI about your properties, style, and preferences. Our wizard makes it easy.",
            details: [
              "Upload current listings and property info",
              "Add frequently asked questions",
              "Define your communication style",
              "Set qualification criteria for leads",
              "Configure notification preferences"
            ]
          },
          customize: {
            title: "Customize",
            time: "5 minutes",
            description: "Fine-tune greetings, response templates, and escalation rules to match your workflow.",
            details: [
              "Customize chatbot greeting messages",
              "Set business hours and after-hours behavior",
              "Create response templates",
              "Define when to escalate to human",
              "Configure lead routing rules"
            ]
          },
          goLive: {
            title: "Go Live",
            time: "Instant",
            description: "Flip the switch and watch your AI team start capturing and qualifying leads 24/7.",
            details: [
              "Enable chatbot on your website",
              "Activate email automation",
              "Turn on voice agent",
              "Start receiving lead notifications",
              "Monitor dashboard for real-time activity"
            ]
          },
          optimize: {
            title: "Optimize & Scale",
            time: "Ongoing",
            description: "Review analytics, improve responses, and watch your conversion rates soar.",
            details: [
              "Review weekly performance reports",
              "Refine AI responses based on data",
              "A/B test different approaches",
              "Scale up as you grow",
              "Access ongoing support & training"
            ]
          }
        },
        dashboard: {
          title: "Your Command Center Awaits",
          subtitle: "Everything you need to manage leads, conversations, and deals in one beautiful interface",
          unifiedInbox: "Unified Inbox",
          unifiedInboxDesc: "All conversations in one place",
          aiInsights: "AI Insights",
          aiInsightsDesc: "Smart lead scoring & recommendations",
          analytics: "Real-time Analytics",
          analyticsDesc: "Track performance & ROI",
          cta: "Start Your 14-Day Free Trial"
        },
        support: {
          title: "We're Here to Help Every Step",
          subtitle: "Our Canadian-based support team ensures you never feel stuck",
          videoTutorials: "📚 Video Tutorials",
          videoTutorialsDesc: "Step-by-step guides for every feature",
          liveChat: "💬 Live Chat",
          liveChatDesc: "Instant answers during business hours",
          freeOnboarding: "🎓 Free Onboarding",
          freeOnboardingDesc: "Personalized setup assistance",
          avgSetupTime: "Average setup time: 22 minutes",
          basedOn: "(based on our beta onboarding sessions)"
        }
      },
      integrationsPage: {
        stats: {
          nativeIntegrations: "Native Integrations",
          viaZapier: "Via Zapier Connection",
          realTimeSync: "Real-Time Sync"
        },
        badges: {
          nativeIntegration: "Native integration",
          comingSoon: "Coming Soon",
          viaZapierMake: "Via Zapier/Make"
        },
        partners: {
          title: "Our Integration Partners",
          subtitle: "Connect with {{count}}+ industry-leading tools and platforms"
        },
        categories: {
          crmPlatforms: "CRM Platforms",
          automationTools: "Automation & Workflow Tools",
          communicationTools: "Communication Tools",
          calendarTools: "Calendar Tools",
          contactLeadTools: "Contact & Lead Tools"
        },
        api: {
          title: "Need a Custom Integration?",
          subtitle: "Our REST API and Zapier integration give you unlimited flexibility to connect any tool in your workflow.",
          restApi: "Full REST API Access",
          restApiDesc: "Enterprise plan includes complete API documentation",
          zapier: "Zapier Integration",
          zapierDesc: "Connect to 5,000+ apps without coding",
          webhooks: "Webhook Support",
          webhooksDesc: "Real-time data sync with your custom tools",
          devSupport: "Developer Support",
          devSupportDesc: "Dedicated technical team for custom integrations",
          enterpriseApi: "Enterprise API Access",
          enterpriseApiDesc: "Build custom integrations with our comprehensive API. Available on Enterprise plans."
        },
        cta: {
          title: "Ready to Connect Your Tech Stack?",
          subtitle: "Start integrating your tools today and experience seamless workflow automation",
          button: "Start Closing More Deals",
          pricing: "View Pricing"
        },
        buttons: {
          bookDemo: "Book your free demo",
          viewFeatures: "View All Features"
        }
      },
      resourcesPage: {
        categories: {
          all: "All articles",
          aiTech: "AI & Technology",
          canadianMarket: "Canadian Market",
          marketing: "Marketing",
          compliance: "Compliance",
          sales: "Sales & Leads",
          successStories: "Success Stories",
          comparison: "CRM Comparisons"
        },
        allArticlesHeading: "All articles",
        articles: {
          communityLaunch: {
            title: "Introducing the Realtor Desk Community",
            excerpt: "We just launched a community space where Canadian agents using Realtor Desk can share tips, ask questions, and shape what we build next."
          },
          aiTransformation: {
            title: "How AI Is Transforming Canadian Real Estate in 2025",
            excerpt: "Discover the latest AI innovations revolutionizing how Canadian realtors work, from predictive analytics to automated transaction management."
          },
          creaDdf: {
            title: "The Complete Guide to CREA DDF® Integration",
            excerpt: "Everything you need to know about accessing national MLS data and integrating CREA DDF® into your real estate workflow."
          },
          compliance: {
            title: "Provincial Compliance Checklist: ON, BC, AB, QC",
            excerpt: "Stay compliant with regulations across Canada. A comprehensive guide to RECO, BCFSA, RECA, and AMF requirements."
          },
          leadConversion: {
            title: "10 Ways to Increase Lead Conversion with Predictive Analytics",
            excerpt: "Learn how AI-powered lead scoring and predictive analytics can increase your conversion rate from 5% to 18%."
          },
          bilingual: {
            title: "Bilingual Real Estate Marketing: Beyond Translation",
            excerpt: "Master the art of true bilingual marketing for Canadian markets. It's not just about translation - it's about cultural communication."
          },
          successStory: {
            title: "How Sarah Chen Closed 14 Extra Deals in Q1 with AI",
            excerpt: "A Toronto agent's journey from traditional CRM to AI-powered success. Real numbers, real results, real transformation."
          }
        },
        readTime: "min read",
        readMore: "Read More",
        newsletter: {
          title: "Get weekly insights delivered to your inbox",
          subtitle: "Actionable AI and real estate tips for Canadian agents, delivered weekly",
          placeholder: "Enter your email",
          subscribe: "Subscribe",
          noSpam: "No spam. Unsubscribe anytime. Privacy policy.",
          consent: "I agree to receive marketing emails from RealtorDesk AI (you can unsubscribe at any time)."
        }
      },
      footer: {
        tagline: "AI-Powered Real Estate Success",
        product: "Product",
        features: "Features",
        pricing: "Pricing",
        howItWorks: "How It Works",
        integrations: "Integrations",
        roadmap: "Roadmap",
        status: "Status Page",
        blogs: "Articles",
        blog: "Articles",
        helpCenter: "Help Center",
        apiDocs: "API Docs",
        videoTutorials: "Video Tutorials",
        caseStudies: "Case Studies",
        webinars: "Webinars",
        company: "Company",
        about: "About Us",
        contact: "Contact",
        careers: "Careers",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        casl: "CASL Compliance",
        copyright: "© 2026 Realtor Desk · Brainfy AI Inc. · Edmonton, AB",
        madeInCanada: "Made in Canada 🇨🇦 for Canadian Realtors",
        poweredBy: "Powered by Brainfy AI Inc",
        cookieSettings: "Cookie Settings",
        resourcesHeading: "Resources"
      },
      notFound: {
        heading: "Oops! Page not found",
        body: "The page you're looking for doesn't exist or has been moved.",
        goDashboard: "Go to dashboard",
        goHome: "Return to home",
        seoTitle: "Page not found — Realtor Desk",
        seoDesc: "The page you're looking for doesn't exist or has been moved.",
        tryInstead: "Try one of these instead:"
      },
      trial: {
        daysRemaining: "{{count}} days remaining in your free trial",
        oneDay: "1 day remaining in your free trial",
        expirestoday: "Your trial expires today!",
        upgradeMessage: "Upgrade now to keep all your data and unlock premium features",
        upgradeNow: "Upgrade Now",
        expired: {
          title: "Your Free Trial Has Ended",
          description: "Subscribe now to continue using Realtor Desk and keep all your data"
        },
        monthly: "Monthly",
        yearly: "Yearly",
        savePercent: "Save 44%",
        billedYearly: "Billed annually at ${{price}}",
        subscribeMonthly: "Subscribe Monthly",
        subscribeYearly: "Subscribe Yearly",
        includesFeatures: "All plans include:",
        guarantee: "30-day money-back guarantee • Cancel anytime",
        feature: {
          unlimitedContacts: "Unlimited contacts & leads",
          aiLeadScoring: "AI-powered lead scoring",
          emailAutomation: "Email automation",
          dealPipeline: "Deal pipeline management",
          marketInsights: "Market insights & analytics",
          prioritySupport: "Priority support"
        },
        status: {
          title: "Subscription status",
          trialActive: "Trial active",
          trialExpired: "Trial expired",
          subscribed: "Active subscription",
          daysLeft: "{{count}} days left in trial",
          endsOn: "Ends on {{date}}",
          tier: "Current plan: {{tier}}"
        }
      },
      today: {
        loading: "Loading your day...",
        goodMorning: "Good morning",
        goodAfternoon: "Good afternoon",
        goodEvening: "Good evening",
        there: "there",
        weeklyActivity: "This Week's Activity",
        callsLogged: "Calls Logged",
        followUps: "Follow-ups Scheduled",
        dealsMoved: "Deals Moved Forward",
        makeCalls: "Make Today's Calls",
        contact: "contact",
        contacts: "contacts",
        readyToCall: "ready to call",
        whoToTalk: "Who to Talk to Today",
        whoToTalkDesc: "Your top priority contacts for today, sorted by urgency",
        allCaughtUp: "All caught up!",
        noUrgent: "No urgent follow-ups scheduled for today. Check back tomorrow or review your contact list.",
        noCalls: "No contacts to call today. Great job staying on top of things!",
        quickActions: "Quick Actions",
        viewContacts: "View All Contacts",
        checkDeals: "Check Deals",
        noContactsYet: "Add contacts to start making calls",
        importContacts: "Import Contacts",
        unnamedContact: "Unnamed Contact",
        loadFailed: "Failed to load data",
        reasons: {
          checkIn: "Regular check-in",
          firstContact: "First contact - new lead",
          overdue: "Overdue follow-up",
          scheduledToday: "Scheduled follow-up today",
          hotLead: "Hot lead - needs attention",
          activeDeal: "Active deal - check status",
          activeProspect: "Active prospect - nurture relationship",
          longOverdue: "Long overdue - reconnect"
        }
      },
      stages: {
        newLead: "New Lead",
        coldLead: "Cold Lead",
        warmLead: "Warm Lead",
        hotLead: "Hot Lead",
        viewing: "Viewing",
        offer: "Offer",
        negotiation: "Negotiation",
        underContract: "Under Contract",
        closed: "Closed",
        lost: "Lost",
        pastClient: "Past Client",
        sphere: "Sphere"
      },
      billing: {
        title: "Billing & subscription",
        subtitle: "Manage your subscription and billing details",
        activated: "Subscription activated successfully!",
        trialAccount: "Trial account",
        trialBadge: "Trial",
        daysLeft: "days left in your free trial",
        upgradeNow: "Upgrade now to unlock unlimited access and continue growing your business with AI-powered CRM.",
        agentPlan: "Solo plan",
        teamPlan: "Team plan",
        brokeragePlan: "Brokerage plan",
        subscribed: "Subscribed",
        subscriptionActive: "Your subscription is active",
        nextBilling: "Next billing date",
        opening: "Opening...",
        manageBilling: "Manage billing",
        selectPeriod: "Select billing period",
        monthly: "Monthly",
        yearly: "Yearly",
        year: "year",
        month: "month",
        saveYearly: "Save up to $789/year",
        availablePlans: "Available plans",
        choosePlan: "Choose your plan",
        current: "Current",
        mostPopular: "Most popular",
        agentDesc: "For the single agent",
        teamDesc: "For 2–10 agents",
        brokerageDesc: "For 10+ agents",
        customPrice: "Custom",
        contactSales: "Contact sales",
        brokerageBlurb: "SSO, dedicated CSM, custom FINTRAC tooling, and SLA.",
        switchAgent: "Switch to Solo plan",
        upgradeAgent: "Upgrade to Solo plan",
        upgradeTeam: "Upgrade to Team plan",
        features: {
          unlimitedContacts: "Unlimited contacts & leads",
          aiCrm: "AI-powered predictive CRM",
          chatbot: "24/7 AI chatbot",
          emailSms: "Email & SMS automation",
          mobileApp: "Mobile app included",
          everythingAgent: "Everything in Solo, plus:",
          teamCollab: "Team collaboration tools",
          leadRouting: "Lead distribution & routing",
          advReporting: "Advanced reporting",
          accountManager: "Dedicated account manager"
        }
      },
      
      onboarding: {
        profile: {
          title: "Let's Set Up Your Profile",
          subtitle: "Tell us about yourself to personalize your experience",
          fullName: "Full Name",
          companyName: "Company/Brokerage Name",
          licenseNumber: "Real Estate License Number",
          province: "Province",
          city: "City",
          primaryLanguage: "Primary Language",
          avatarUploaded: "Avatar uploaded!",
          avatarFailed: "Failed to upload avatar",
          saveFailed: "Failed to save profile"
        },
        goals: {
          title: "Your Business Goals",
          subtitle: "Help us tailor Realtor Desk AI to your objectives",
          role: "Your Role",
          soloAgent: "Solo Agent",
          teamLeader: "Team Leader",
          brokerManager: "Broker/Manager",
          saveFailed: "Failed to save business goals"
        },
        chatbot: {
          title: "AI Chatbot Setup",
          subtitle: "Customize your AI assistant to qualify leads 24/7",
          botName: "Chatbot Name",
          greeting: "Greeting Message",
          configured: "Chatbot configured!",
          saveFailed: "Failed to save chatbot settings"
        },
        calendar: {
          title: "Calendar Integration",
          subtitle: "Connect your calendar and set your availability",
          saved: "Calendar settings saved!",
          saveFailed: "Failed to save calendar settings",
          finish: "Finish Setup"
        },
        import: {
          title: "Import Your Contacts",
          subtitle: "Choose how you'd like to add your contacts",
          skipContacts: "Skip - I'll add contacts later"
        },
        complete: {
          title: "You're All Set!",
          welcome: "Welcome to Realtor Desk AI",
          whatWeSetUp: "What We Set Up",
          whatsNext: "What's Next?",
          goDashboard: "Go to Dashboard",
          watchTutorial: "Watch Tutorial",
          skipTutorial: "Skip Tutorial",
          needHelp: "Need help getting started?",
          contactSupport: "Contact our support team"
        },
        saveFailed: "Failed to save progress. Please try again.",
        welcome: "Welcome to Realtor Desk AI!",
        completeFailed: "Failed to complete setup. Please try again.",
        heading: "Getting started — 60 minutes, guided",
        subheading: "Five steps to go from empty dashboard to first follow-up call.",
        ack: "Got it",
        step: {
          profile: {
            title: "Complete your profile",
            desc: "Add your brokerage, license, and contact info."
          },
          contact: {
            title: "Add your first contact",
            desc: "Import a CSV or add a lead manually."
          },
          property: {
            title: "Add your first property",
            desc: "Paste a realtor.ca URL or enter details."
          },
          widget: {
            title: "Set up your website widget",
            desc: "Launches Q3 2026 — see roadmap."
          },
          calendar: {
            title: "Connect Google or Outlook Calendar",
            desc: "Sync appointments into your dashboard."
          }
        }
      },
      auth: {
        backToWebsite: "Back to realtordesk.ai",
        protectedSession: "Protected Session",
        pipedaCompliant: "PIPEDA Compliant",
        ssl: "256-bit SSL",
        canadianData: "Canadian Data",
        login: {
          subtitle: "Sign in to your workspace",
          orEmail: "Or continue with email",
          emailAddress: "Email address",
          password: "Password",
          forgotPassword: "Forgot password?",
          signInSecurely: "Sign in securely",
          sslNotice: "Your connection is secured with 256-bit SSL encryption",
          noAccount: "Don't have an account?",
          startTrial: "Start your free trial"
        },
        signup: {
          subtitle: "Start your 14-day free trial",
          orEmail: "Or register with email",
          agreeToThe: "I agree to the",
          privacyPolicy: "Privacy Policy",
          termsOfService: "Terms of Service",
          marketingConsent: "Send me tips & product updates (optional)",
          sslNote: "Your data is stored securely on Canadian servers with 256-bit SSL encryption"
        },
        forgot: {
          title: "Reset password",
          subtitle: "Enter your email and we'll send you a reset link",
          enterEmail: "Please enter your email address",
          emailSent: "Password reset email sent!",
          sendFailed: "Failed to send reset email",
          sending: "Sending...",
          sendLink: "Send reset link",
          backToLogin: "Back to sign in",
          checkEmail: "Check your email",
          sentTo: "We've sent a password reset link to",
          linkExpiry: "Click the link in the email to reset your password. The link will expire in 1 hour.",
          checkSpam: "If you don't see the email, check your spam folder."
        },
        reset: {
          title: "Set new password",
          subtitle: "Enter your new password below",
          newPassword: "New Password",
          confirmPassword: "Confirm Password",
          success: "Password reset successful!",
          fillAll: "Please fill in all fields",
          noMatch: "Passwords do not match",
          requirements: "Password does not meet all requirements",
          updated: "Password updated successfully!",
          failed: "Failed to reset password",
          resetting: "Resetting...",
          resetButton: "Reset Password"
        }
      },
      cookie: {
        title: "🍪 Cookie Preferences",
        description: "We use cookies to enhance your browsing experience and analyze site traffic. You can customize your cookie preferences or accept all.",
        privacyLink: "Privacy Policy",
        acceptAll: "Accept All Cookies",
        necessaryOnly: "Necessary Only",
        customize: "Customize",
        necessary: "Necessary Cookies",
        necessaryDesc: "Required for basic site functionality. Cannot be disabled.",
        analytics: "Analytics Cookies",
        analyticsDesc: "Help us understand how visitors interact with our website.",
        marketing: "Marketing Cookies",
        marketingDesc: "Used to deliver personalized advertisements relevant to you.",
        functional: "Functional Cookies",
        functionalDesc: "Enable enhanced functionality like chat widgets and preferences.",
        savePreferences: "Save Preferences",
        back: "Back"
      },
      boldtrail: {
        compare: {
          heading: "Four rows. Not forty.",
          sub: "We do not compare on feature breadth. BoldTrail has 400,000+ agents on their platform; we have fewer than a hundred. These are the four axes where we can defend the claim, each sourced from BoldTrail's own help center, pricing signals, or public reviews."
        },
        betterWhen: {
          heading: "When BoldTrail is the better choice",
          body: "If you run a large brokerage in the United States, need BackOffice commission splits, or require deep integration with US-specific MLS systems that our CREA DDF work does not yet cover, BoldTrail is the more mature choice today. We are built for the independent Canadian agent or boutique team \u2014 we are smaller, more focused, and will remain so for the foreseeable future. Pick the tool that fits, not the longer feature list."
        }
      },
      leadScore: {
        title: "Why this lead scored",
        openExplainer: "Why this lead scored",
        emailActivity: "Email activity (last 30 days)",
        propertyViews: "Property views",
        daysSinceContact: "Days since last contact",
        loading: "Loading signals\u2026",
        noSignals: "No behavioural signals yet. Log calls, emails, and property views to see this panel populate.",
        manualNotice: "Your score is currently derived from a fixed formula. AI-derived scoring trained on your own conversion history ships Q2 2026."
      },
      onboardingChecklist: {
        heading: "Getting started — 60 minutes, guided",
        subheading: "Five steps to go from empty dashboard to first follow-up call.",
        ack: "Got it",
        step: {
          profile: {
            title: "Complete your profile",
            desc: "Add your brokerage, license, and contact info."
          },
          contact: {
            title: "Add your first contact",
            desc: "Import a CSV or add a lead manually."
          },
          property: {
            title: "Add your first property",
            desc: "Paste a realtor.ca URL or enter details."
          },
          widget: {
            title: "Set up your website widget",
            desc: "Launches Q3 2026 — see roadmap."
          },
          calendar: {
            title: "Connect Google or Outlook Calendar",
            desc: "Sync appointments into your dashboard."
          }
        }
      },
      roadmap: {
        badge: "Public roadmap",
        title: "What we are shipping — and what we are not.",
        subtitle: "Honesty is a feature. This page lists dated commitments for the capabilities our customers and competitors ask about most. If a date slips, we move it — we don't silently drop it.",
        lastUpdated: "Last updated: 2026-04-20",
        status: {
          shipping: "Shipping",
          shipped: "Shipped",
          building: "Building",
          designing: "Designing",
          roadmapped: "Roadmapped",
          considering: "Considering"
        },
        quarter: {
          apr_2026: "Apr 2026",
          q2_2026: "Q2 2026",
          q3_2026: "Q3 2026",
          q1_2027: "Q1 2027",
          tbd: "—"
        },
        section: {
          now: { heading: "Shipping This Sprint (April 2026)" },
          q2: { heading: "Q2 2026" },
          q3: { heading: "Q3 2026" },
          q1_2027: { heading: "Q1 2027 — Teams tier" },
          not_on: { heading: "Not on the 2026 Roadmap" }
        },
        item: {
          casl_footer: {
            title: "CASL-compliant email footer + functional unsubscribe",
            desc: "Every system email we send carries sender ID, physical address, consent basis, and a one-click unsubscribe that actually writes to an opt-out list."
          },
          pricing_parity: {
            title: "Pricing page = Stripe checkout parity",
            desc: "Every amount on /pricing is derived from the same constant that create-checkout forwards to Stripe, with a CAD label and GST/HST disclaimer."
          },
          lead_score_explainer: {
            title: "Lead score explainer",
            desc: "Contact detail page surfaces the 3 behavioural signals behind the score instead of showing a number-only."
          },
          onboarding_checklist: {
            title: "Onboarding checklist on /today",
            desc: "New accounts see a 5-step guided setup (profile, contact, property, website widget link, calendar connect). Persisted to the database, not localStorage."
          },
          ai_scoring: {
            title: "AI-derived lead scoring",
            desc: "Replace the current manual/formula-based score with a model trained on per-agent conversion history. Web push when a lead heats up (no native app required)."
          },
          trigger_campaigns: {
            title: "Trigger-based email sequences",
            desc: "Wire /campaigns and /automations to a real sequence runner. New-lead, went-cold, birthday, listing-anniversary triggers. Pause-on-reply detection. All templates ship bilingual with the CASL footer."
          },
          idx_sites: {
            title: "Public agent websites + behavioural lead capture (CREA DDF)",
            desc: "realtordesk.ai-hosted agent sites backed by the CREA DDF feed. Behavioural widgets feed lead scores in real time. Free with all paid tiers."
          },
          teams_tier: {
            title: "Teams tier launch",
            desc: "Multi-agent accountability dashboard, manager views, and daily-vitals rollups. Until this ships, RealtorDesk AI is built for solo agents and boutique teams (≤5)."
          },
          social_promotion: {
            title: "One-click social promotion",
            desc: "Reconsidered for Q1 2027 at the earliest. Today, you can share the public listing page to socials manually."
          },
          native_mobile: {
            title: "Native mobile app",
            desc: "We support mobile via web push + a Capacitor-wrapped PWA. A native iOS/Android app is not planned for 2026."
          },
          commissions: {
            title: "Commissions / BackOffice module",
            desc: "Out of scope. This would be a separate product surface, not an add-on to the CRM."
          },
          recruiting: {
            title: "Agent recruitment tooling",
            desc: "Out of scope. We are building for working agents, not brokerages recruiting agents."
          }
        },
        footer: {
          title: "See something missing or want to vote on priority?",
          body: "Email product@realtordesk.ai or open an item in the in-app feedback panel. Items with customer signal get prioritized before internal asks.",
          viewPricing: "View pricing",
          viewFeatures: "What ships today"
        }
      },
      unsubscribe: {
        title: "Unsubscribe from Realtor Desk emails",
        working: "Processing your request\u2026",
        success: "You've been unsubscribed. We will not send further emails to",
        thisAddress: "this address",
        effectiveImmediate: "Your opt-out is effective immediately per CASL \u00a711.",
        errorExpired: "This unsubscribe link has expired. Request a fresh one below.",
        errorInvalid: "This unsubscribe link is invalid. Request a fresh one below.",
        linkSent: "If this address is on our list, we just sent you a confirmation link. Click it to finish opting out.",
        linkSentNote: "Links expire in 30 days. Check your spam folder if you don't see it in a minute.",
        manualPrompt: "Enter the email address you want removed from our list. We will send you a one-click confirmation link.",
        ctaSendLink: "Send me an unsubscribe link",
        casl: "Operated under CASL by Brainfy AI Inc. (Realtor Desk).",
        back: "Back to Realtor Desk"
      },
      rd: {
        sidebar: {
          workspaceTier: "Team plan",
          collapse: "Collapse sidebar",
          nav: {
            dashboard: "Dashboard",
            leads: "Leads",
            conversations: "Conversations",
            pipeline: "Pipeline",
            automation: "Automation",
            reports: "Reports",
            settings: "Settings"
          },
          desk: {
            title: "Desk AI · on duty",
            summary: "Answered {{count}} leads this week. Avg response {{response}}."
          }
        },
        topnav: {
          search: "Search leads, listings, conversations…",
          live: "Live",
          notifications: "Notifications",
          language: "Language"
        },
        pages: {
          dashboard: {
            title: "Dashboard",
            saluteMorning: "Good morning",
            saluteAfternoon: "Good afternoon",
            saluteEvening: "Good evening",
            subhead: "Desk worked overnight."
          },
          leads: { title: "Leads" },
          inbox: { title: "Conversations" },
          pipeline: { title: "Pipeline" },
          automation: { title: "Automation" },
          reports: { title: "Reports" }
        },
        stages: {
          new: "New",
          contacted: "Contacted",
          qualified: "Qualified",
          showing: "Showing",
          offer: "Offer",
          won: "Won",
          lost: "Lost"
        },
        bands: { hot: "Hot", warm: "Warm", cold: "Cold" },
        actions: {
          addLead: "Add lead",
          filter: "Filter",
          import: "Import",
          sort: "Sort",
          scoreHighToLow: "Score · high to low",
          allAgents: "All agents",
          newSequence: "New sequence",
          templates: "Templates",
          editFlow: "Edit flow",
          preview: "Preview",
          call: "Call",
          bookShowing: "Book showing",
          takeOver: "Take over",
          draftWithAi: "Draft with AI",
          attachListing: "Attach listing",
          send: "Send",
          sending: "Sending…",
          use: "Use",
          exportCsv: "Export CSV",
          share: "Share",
          backToLeads: "Back to leads",
          openActivityLog: "Open activity log",
          openPipeline: "Open pipeline"
        },
        tabs: {
          leads: {
            all: "All",
            hot: "Hot",
            warm: "Warm",
            cold: "Cold",
            aiHandled: "AI-handled",
            needsReply: "Needs reply"
          },
          automation: { all: "All", active: "Active", draft: "Draft" },
          inbox: { all: "All", unread: "Unread", ai: "AI", flagged: "Flagged", mine: "Mine" }
        },
        common: {
          sampleData: "sample data",
          sampleLeads: "sample leads",
          sampleLead: "sample lead",
          loading: "loading…",
          live: "Live",
          selectAll: "Select all",
          active: "Active",
          draft: "Draft",
          noResultsMatch: "No results match this filter.",
          noConversationsMatch: "No conversations match.",
          noSequencesMatch: "No sequences match this filter.",
          noMessagesYet: "No messages yet.",
          unreadCount: "{{count}} unread"
        },
        columns: {
          leads: {
            lead: "Lead",
            listing: "Listing",
            source: "Source",
            aiScore: "AI score",
            stage: "Stage",
            lastActivity: "Last activity"
          },
          reports: {
            source: "Source",
            spend: "Spend",
            leads: "Leads",
            closed: "Closed",
            roi: "ROI"
          }
        },
        kpi: {
          activeLeads: "Active leads",
          showingsBooked: "Showings booked",
          pipelineValue: "Pipeline value",
          avgResponseTime: "Avg response time",
          dealsClosed: "Deals closed",
          leadToShowing: "Lead → Showing",
          revenueAttributed: "Revenue attributed"
        },
        sections: {
          today: "Today",
          pipelineSnapshot: "Pipeline snapshot",
          leadSources30d: "Lead sources · 30d",
          compliance: "Compliance",
          deskAiActivity: "Desk AI activity",
          responseTimeTrend: "Response time trend",
          aiVsAgent21d: "AI vs. Agent · last 21 days",
          pipelineConversion: "Pipeline conversion",
          stageFunnel: "Stage funnel",
          sourceRoi: "Source ROI",
          revenuePerLeadSource: "Revenue per lead source",
          agentLeaderboard: "Agent leaderboard",
          thisMonth: "This month",
          buyingProfile: "Buying profile",
          viewedListings: "Viewed listings",
          timeline: "Timeline",
          contact: "Contact",
          aiLeadScore: "AI lead score"
        },
        inbox: {
          searchConversations: "Search conversations…",
          selectConversation: "Select a conversation from the left.",
          emptyThread: "No messages yet. When a lead replies to a drip or sends a chat, it appears here.",
          suggestedReply: "Suggested reply:",
          composerPlaceholder: "Type a message to the lead…",
          deskAiReplying: "Desk AI replying",
          manualHandling: "Manual handling"
        },
        pipelinePage: {
          totalPipeline: "Total pipeline · {{value}} · {{count}} leads",
          listViewLives: "List view lives at /app/leads — this toggle exists for parity with the design; it links rather than duplicating the table.",
          forecastShips: "Forecast view ships in the Reports phase.",
          viewKanban: "Kanban",
          viewList: "List",
          viewForecast: "Forecast"
        },
        reportsPage: {
          aiAvg: "AI · {{label}} avg",
          agentManual: "Agent · manual timing (not yet tracked)",
          noSourcesYet: "No sources yet"
        },
        funnel: {
          leadsCaptured: "Leads captured",
          showingBooked: "Showing booked",
          closedWon: "Closed won"
        },
        onboarding: {
          loading: "Loading your onboarding…",
          stepOfFive: "Step {{n}} of 5",
          stepLabels: {
            welcome: "Welcome",
            profile: "Profile",
            connectDdf: "Connect DDF",
            aiVoice: "AI voice",
            goLive: "Go live"
          },
          status: { complete: "Complete", inProgress: "In progress" },
          rail: {
            setupTime: "Typical setup takes 5 minutes. Your data is hosted in Canada from the second you sign up.",
            saving: "Saving your progress…"
          },
          welcome: {
            titleLead: "Welcome to",
            titleBrand: "RealtorDesk",
            subtitle: "Let's get your AI deskmate on duty. In about five minutes, she'll be answering leads in French and English.",
            helperCanadaTitle: "Hosted in Canada",
            helperCanadaBody: "Your leads, messages, and MLS data stay on Canadian soil. PIPEDA-compliant from minute one.",
            helperMarketTitle: "Built for our market",
            helperMarketBody: "Designed with brokers from Toronto, Montreal, Vancouver, Calgary — not retrofit from a US tool.",
            helperLiveTitle: "Five minutes, live",
            helperLiveBody: "Most agents answer their first lead before the setup email even arrives.",
            workEmail: "Work email",
            password: "Create a password",
            consent: "I consent to RealtorDesk AI storing my data in Canada per PIPEDA, and I'll only use the product to contact people who've consented (CASL).",
            continueBtn: "Continue",
            signInInstead: "Sign in instead",
            orContinueWith: "or continue with",
            google: "Google",
            microsoft: "Microsoft 365"
          },
          profile: {
            title: "Tell us about your desk.",
            subtitle: "We use this to tailor templates, pick a default language, and make sure the AI sounds like you.",
            helperLanguageTitle: "Language detection",
            helperLanguageBody: "Desk AI detects each lead's language automatically. You pick the default it reverts to if the message is short.",
            helperTemplatesTitle: "Brokerage templates",
            helperTemplatesBody: "We pre-load RECO/OACIQ-safe disclaimers based on your province.",
            firstName: "First name",
            lastName: "Last name",
            brokerage: "Brokerage",
            province: "Province",
            defaultLanguage: "Default language",
            frDetectedBadge: "+ FR detected",
            regNumber: "RECO / OACIQ registration #",
            back: "Back",
            continueBtn: "Continue"
          },
          ddf: {
            title: "Connect your CREA DDF® feed.",
            subtitle: "Desk AI listens to your board's DDF so new inquiries, price changes, and status flips show up instantly.",
            helperReadOnlyTitle: "Read-only & scoped",
            helperReadOnlyBody: "We only read listings assigned to your RECO/OACIQ #. No shared brokerage data leaves your seat.",
            helperSyncTitle: "Sync in < 60 seconds",
            helperSyncBody: "We reindex every minute. Your new listing is live in the AI's knowledge before your sign goes in the ground.",
            boardName: "Toronto Regional Real Estate Board",
            boardMeta: "Matched from your RECO # · 247 active listings",
            connectedBadge: "Connected",
            statListings: "Listings",
            statNewLast30d: "New last 30d",
            statSyncCadence: "Sync cadence",
            addBoard: "Add another board",
            addBoardDesc: "REBGV, OACIQ, CREB — connect as many as you service.",
            addBtn: "Add",
            back: "Back",
            continueBtn: "Continue",
            skip: "Skip for now"
          },
          voice: {
            title: "Give Desk AI your voice.",
            subtitle: "Pick a tone. Paste a sample of how you actually write. Desk AI will answer leads in your voice — not a generic chatbot.",
            helperBetterTitle: "It gets better daily",
            helperBetterBody: "Every time you edit an AI draft, Desk learns. After week one, 90% of agents approve drafts without changes.",
            helperBilingualTitle: "Bilingual by design",
            helperBilingualBody: "Train once — Desk adapts your tone across French and English automatically.",
            toneLabel: "Tone",
            toneWarmLabel: "Warm & conversational",
            toneWarmDesc: "Friendly, uses first names. Default.",
            tonePolishedLabel: "Polished & formal",
            tonePolishedDesc: "Good for luxury, QC OACIQ.",
            toneDirectLabel: "Direct & brief",
            toneDirectDesc: "For investors, commercial.",
            pasteLabel: "Paste a recent email or DM (optional, 50+ words)",
            previewLabel: "Desk AI preview —",
            previewText: "Hi Priya — quick one, a new listing in Oakville dropped this morning that fits your list. Want to swing by tomorrow before offers come in?",
            back: "Back",
            continueBtn: "Continue"
          },
          live: {
            titleLead: "Desk is",
            titleAccent: "on duty",
            subtitle: "You're live. The next lead that comes in — night or day, English or French — gets an instant reply in your voice.",
            helperPingsTitle: "How you'll be pinged",
            helperPingsBody: "Push notifications on mobile. Email digest at 9 AM. SMS only for Hot leads (score ≥ 80).",
            helperCustomizeTitle: "Customize anytime",
            helperCustomizeBody: "Workspace → Desk AI settings. Pause AI per lead, per listing, or per time of day.",
            deskLabel: "Desk AI",
            liveBadge: "Live",
            listeningNote: "Listening on TRREB · EN + FR · Warm tone",
            kpiListings: "Listings synced",
            kpiLanguages: "Languages",
            kpiSla: "Response SLA",
            kpiAlwaysOn: "Always on",
            nextLeadsTitle: "Import your leads",
            nextLeadsDesc: "CSV, BoldTrail, Follow Up Boss, kvCORE.",
            nextInboxTitle: "Forward your inbox",
            nextInboxDesc: "Set up lead@yourdomain.ca to forward here.",
            nextWidgetTitle: "Add your website widget",
            nextWidgetDesc: "One script tag. Bilingual chat bubble.",
            nextTeamTitle: "Invite your team",
            nextTeamDesc: "5 seats on Team plan. $15 each after.",
            takeToDashboard: "Take me to the dashboard",
            tour: "Watch the 2-min tour"
          }
        },
        automationPage: {
          allSequences: "All sequences",
          stepFlow: "{{count}}-step flow",
          sent: "{{count}} sent",
          replied: "{{count}} replied",
          rate: "{{pct}}% rate",
          caslRequired: "CASL consent required",
          notYetRun: "Not yet run",
          selectSequence: "Select a sequence to preview.",
          pauseSequence: "Pause sequence",
          activateSequence: "Activate sequence",
          triggers: {
            newLead: "New lead",
            wentCold: "Went cold",
            showing: "Showing",
            consent: "Consent"
          }
        }
      }
    }
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    },
    detection: {
      // Order matters — querystring first so `/?lang=fr` wins over any
      // stale localStorage or browser-locale choice on first paint. This
      // is what fixes the R-18a `?lang=fr` first-paint regression: before
      // this config, the URL param was only read by a React useEffect
      // that fired after Hero's first render, so Hero latched EN.
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      // Honor the public spec — ?lang= not the library default ?lng=.
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
    }
  });

// Keep <html lang> in sync with the active locale so screen readers
// pronounce text correctly, Lighthouse a11y passes, and Google reads
// hreflang signals right. Runs on init and on every language change.
function syncHtmlLang(lng: string | undefined) {
  if (typeof document === "undefined") return;
  const normalized = (lng || "en").toLowerCase().startsWith("fr") ? "fr-CA" : "en-CA";
  document.documentElement.lang = normalized;
}
syncHtmlLang(i18n.language);
i18n.on("languageChanged", syncHtmlLang);


// FR translations are lazy-loaded to keep them out of the initial bundle for
// the EN-default majority. Trade-off: a FR-detected first paint briefly shows
// EN fallback until the chunk loads (re-introduces the R-18a ?lang=fr nuance).
// Gated behind owner approval — see PR. EN remains inline for instant paint.
async function loadFrench() {
  if (i18n.hasResourceBundle("fr", "translation")) return;
  const mod = await import("./fr");
  i18n.addResourceBundle("fr", "translation", mod.fr.translation, true, true);
}
if ((i18n.language || "").toLowerCase().startsWith("fr")) {
  loadFrench().then(() => i18n.changeLanguage(i18n.language));
}
i18n.on("languageChanged", (lng) => {
  if ((lng || "").toLowerCase().startsWith("fr")) loadFrench();
});

export default i18n;
