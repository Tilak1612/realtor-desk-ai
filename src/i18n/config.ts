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
        bookDemo: "Book Your Free Demo",
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
        signOut: "Sign out"
      },
      hero: {
        title: "Close More Deals with AI Built for Canadian Realtors",
        subtitle: "24/7 AI-powered lead capture, call handling, and email automation—designed for the Canadian market with full bilingual support. CREA DDF® integration on the roadmap for Q3 2026.",
        getStarted: "Start Your 14-Day Free Trial",
        watchDemo: "Book Your Free Demo",
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
          bookDemo: "Book Live Demo",
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
          visitUs: "Visit Us",
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
          bookDemo: "Book Your Free Demo",
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
          billing: "Billing",
          settings: "Settings",
          trialActive: "Trial Active",
          daysLeft: "days left in your trial",
          upgradeNow: "Upgrade Now"
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
          sendEmail: "Send Email"
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
          account: "Account",
          notifications: "Notifications",
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
          cancel: "Cancel"
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
        partners: {
          title: "Our Integration Partners",
          subtitle: "Connect with {count}+ industry-leading tools and platforms"
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
          bookDemo: "Book Your Free Demo",
          viewFeatures: "View All Features"
        }
      },
      resourcesPage: {
        categories: {
          all: "All Articles",
          aiTech: "AI & Technology",
          canadianMarket: "Canadian Market",
          marketing: "Marketing",
          compliance: "Compliance",
          sales: "Sales & Leads",
          successStories: "Success Stories",
          comparison: "CRM Comparisons"
        },
        articles: {
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
          title: "Get Weekly Insights Delivered to Your Inbox",
          subtitle: "Actionable AI and real estate tips for Canadian agents, delivered weekly",
          placeholder: "Enter your email",
          subscribe: "Subscribe",
          noSpam: "No spam. Unsubscribe anytime. Privacy policy."
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
        blogs: "Blogs",
        blog: "Blog",
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
        copyright: "© 2025 RealtorDesk.ai. All rights reserved.",
        madeInCanada: "Made in Canada 🇨🇦 for Canadian Realtors",
        poweredBy: "Powered by Brainfy AI Inc",
        cookieSettings: "Cookie Settings"
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
          title: "Subscription Status",
          trialActive: "Trial Active",
          trialExpired: "Trial Expired",
          subscribed: "Active Subscription",
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
        title: "Billing & Subscription",
        subtitle: "Manage your subscription and billing details",
        activated: "Subscription activated successfully!",
        trialAccount: "Trial Account",
        daysLeft: "days left in your free trial",
        upgradeNow: "Upgrade now to unlock unlimited access and continue growing your business with AI-powered CRM.",
        agentPlan: "Agent Plan",
        teamPlan: "Team Plan",
        subscriptionActive: "Your subscription is active",
        nextBilling: "Next billing date",
        opening: "Opening...",
        manageBilling: "Manage Billing",
        selectPeriod: "Select Billing Period",
        monthly: "Monthly",
        yearly: "Yearly",
        year: "year",
        month: "month",
        saveYearly: "Save up to $789/year",
        availablePlans: "Available Plans",
        choosePlan: "Choose Your Plan",
        current: "Current",
        mostPopular: "Most Popular",
        agentDesc: "Perfect for individual agents",
        teamDesc: "For growing teams of 2-5 agents",
        switchAgent: "Switch to Agent",
        upgradeAgent: "Upgrade to Agent",
        upgradeTeam: "Upgrade to Team",
        features: {
          unlimitedContacts: "Unlimited contacts & leads",
          aiCrm: "AI-powered predictive CRM",
          chatbot: "24/7 AI chatbot",
          emailSms: "Email & SMS automation",
          mobileApp: "Mobile app included",
          everythingAgent: "Everything in Agent, plus:",
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
        completeFailed: "Failed to complete setup. Please try again."
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
            desc: "Sync appointments into /today."
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
        title: "Unsubscribe from RealtorDesk AI emails",
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
        casl: "Operated under CASL by Brainfy AI Inc. (RealtorDesk AI).",
        back: "Back to RealtorDesk AI"
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
        }
      }
    }
  },
  fr: {
    translation: {
      nav: {
        features: "Fonctionnalités",
        pricing: "Tarification",
        integrations: "Intégrations",
        canadianMarket: "Marché Canadien",
        resources: "Ressources",
        faq: "FAQ",
        bookDemo: "Réserver Votre Démo Gratuite",
        startClosing: "Commencer à Conclure Plus",
        getStarted: "Commencer",
        giveFeedback: "Donner un avis",
        signedOut: "Déconnexion réussie",
        searchPlaceholder: "Rechercher contacts, propriétés, transactions...",
        add: "Ajouter",
        addContact: "Contact",
        addProperty: "Propriété",
        addDeal: "Transaction",
        addTask: "Tâche",
        notifications: "Notifications",
        viewAllNotifications: "Voir toutes les notifications",
        profile: "Profil",
        settings: "Paramètres",
        signOut: "Se déconnecter"
      },
      hero: {
        title: "Concluez Plus de Transactions avec une IA Conçue pour les Courtiers Canadiens",
        subtitle: "Capture de prospects 24/7, gestion d'appels et automation par courriel—conçue pour le marché canadien avec support bilingue complet. Intégration CREA DDF® prévue pour Q3 2026.",
        getStarted: "Commencez Votre Essai Gratuit de 14 Jours",
        watchDemo: "Réserver Votre Démo Gratuite",
        trustLine: "14 Jours Gratuits • Aucune carte de crédit • Annulez à tout moment",
        badge1: "Conforme PIPEDA par Conception",
        badge2: "Bilingue EN/FR",
        badge3: "50+ Utilisateurs Bêta",
        conversionBadge: "Hausse de Conversion de 30% (Conservatrice)",
        badge: "Essai Gratuit de 14 Jours",
        bullet1: "L'IA répond aux prospects instantanément, 24/7",
        bullet2: "Conçu pour les courtiers canadiens — LPRPDE, LCAP, bilingue EN/FR",
        bullet3: "Bilingue EN/FR",
        testimonial: "\"3 prospects capturés en 48h que j'aurais perdus\"",
        joinAgents: "Rejoignez 50+ courtiers canadiens",
        activeAgents: "Courtiers actifs",
        leads: "Prospects",
        aiActive: "IA Active"
      },
      roi: {
        badge: "Calculez Votre ROI",
        title: "Voyez Vos Économies Potentielles",
        subtitle: "Découvrez combien de temps et d'argent vous pourriez économiser avec l'automatisation IA"
      },
      home: {
        faq: {
          title: "Questions Fréquemment Posées",
          subtitle: "Obtenez des réponses aux questions courantes sur RealtorDesk AI",
          moreQuestions: "Vous avez d'autres questions? Nous sommes là pour vous aider!",
          viewAll: "Voir Toutes les FAQ",
          contactSupport: "Contacter le Support"
        },
        security: {
          archTitle: "Architecture Axée sur la Sécurité",
          archDesc: "Chiffrement de niveau entreprise et pratiques de sécurité protégeant vos données clients",
          pipedaTitle: "Conception Axée sur la LPRPDE",
          pipedaDesc: "Construit avec les principes canadiens de confidentialité — gestion du consentement, droit à l'effacement, notifications de violation",
          mlsTitle: "Intégration MLS Canadienne",
          mlsDesc: "Importez et synchronisez les données de propriétés canadiennes directement dans votre CRM",
          bilingualTitle: "Support Bilingue",
          bilingualDesc: "Communication transparente en anglais et en français",
          infraTitle: "Infrastructure Optimisée pour le Canada",
          infraDesc: "Hébergé sur une infrastructure conçue pour maintenir vos données au Canada",
          aiTitle: "Score IA des Prospects",
          aiDesc: "Priorisez les prospects chauds automatiquement"
        },
        audience: {
          agentTitle: "Pour les Agents",
          agentDesc: "Pour automatiser vos programmes marketing, capturer et convertir plus de prospects en transactions.",
          teamTitle: "Pour les Équipes",
          teamDesc: "Pour optimiser votre processus de vente, maximiser la collaboration et conclure plus de transactions d'équipe.",
          brokerTitle: "Pour les Courtages",
          brokerDesc: "Pour accélérer la croissance rentable en augmentant la productivité des courtiers et en réduisant les coûts opérationnels.",
          learnMore: "En Savoir Plus"
        },
        socialProof: {
          agents: "agents",
          usingNow: "l'utilisent maintenant",
          demos: "démos",
          bookedThisWeek: "réservées cette semaine",
          joinAgents: "Rejoignez les agents qui concluent significativement plus de transactions"
        },
        credibility: {
          title: "Approuvé et Sécurisé"
        },
        demo: {
          title: "Voyez Realtor Desk AI en Action",
          description: "Découvrez comment l'IA peut transformer votre entreprise immobilière en seulement 2 minutes",
          watchDemo: "Regarder la Démo Produit de 2 Minutes",
          bookDemo: "Réserver une Démo en Direct",
          exploreFeatures: "Explorer Toutes les Fonctionnalités"
        }
      },
      features: {
        hero: {
          title: "Toutes les Fonctionnalités Dont Votre Entreprise Immobilière A Besoin,",
          titleGradient: "Propulsées par l'IA",
          subtitle: "Du premier contact à la vente conclue - automation intelligente à chaque étape"
        },
        tabs: {
          crm: "CRM Prédictif",
          chatbot: "Chatbot IA",
          market: "Intelligence de Marché",
          transaction: "Gestion des Transactions",
          marketing: "Automation Marketing"
        },
        tab1: "CRM Prédictif",
        tab2: "Chatbot IA",
        tab3: "Intelligence du Marché",
        tab4: "Gestion des Transactions",
        tab5: "Automatisation Marketing",
        crm: { h1: "Score Multi-Dimensionnel de Prospects", p1: "L'IA analyse les signaux d'engagement — recherches de propriétés, ouvertures de courriels, activité sociale, indicateurs hypothécaires — pour classer vos prospects", sub1: "Concentrez-vous sur vos meilleurs prospects et concluez plus de transactions", h2: "Intelligence Conversationnelle", p2: "Analyse de sentiment en temps réel par courriel, SMS et chat, avec détection d'urgence et suggestions de réponses automatisées", sub2: "45% de réponses plus pertinentes, 60% moins de transactions perdues", h3: "Enrichissement Automatisé des Données", p3: "Construction autonome de profils de contacts à partir des registres publics, des réseaux sociaux et du suivi comportemental", sub3: "Réduisez radicalement la saisie manuelle avec la création automatique de profils" },
        chatbot: { h1: "Engagement Multilingue 24/7", p1: "Conversations intelligentes en anglais et français, gère les demandes immobilières, qualifie les prospects, planifie les visites", sub1: "Maximisez la capture de prospects hors heures avec une IA qui ne dort jamais", h2: "Système de Qualification Intelligent", p2: "L'IA mène des conversations naturelles pour évaluer la préparation, le budget, le calendrier et les préférences de l'acheteur", sub2: "Seuls les prospects qualifiés atteignent votre agenda", h3: "Transfert Transparent vers un Humain", p3: "L'IA sait quand transférer vers un agent humain avec le contexte complet de la conversation", sub3: "Ne perdez jamais un prospect chaud à l'automatisation" },
        market: { h1: "Analyses de Propriétés Propulsées par l'IA (Bientôt)", p1: "Analyse de propriétés assistée par IA utilisant les tendances du marché local, les ventes comparables et les données de quartier", sub1: "Des ACM plus rapides, basées sur les données, pour vos clients", h2: "Détection d'Opportunités Hors-Marché", p2: "L'IA prédit quels propriétaires sont susceptibles de vendre 3 à 6 mois avant la mise en vente", sub2: "Obtenez des inscriptions exclusives avant vos concurrents", h3: "Rapports de Marché en Temps Réel", p3: "Analyse comparative de marché automatisée avec taux d'absorption, tendances des jours sur le marché, évolution du prix au pied carré", sub3: "Positionnez-vous comme l'expert du marché local" },
        transaction: { h1: "Prédiction Intelligente des Délais", p1: "L'IA prévoit les dates de clôture selon le type de transaction, les parties impliquées et les performances historiques", sub1: "Conçu pour accélérer vos délais de clôture avec moins d'étapes manquées", h2: "Coordination Automatisée des Fournisseurs", p2: "Planification intelligente des inspecteurs, évaluateurs et avocats avec optimisation des disponibilités", sub2: "75% moins de délais manqués", h3: "Moteur de Détection des Risques", p3: "Alertes prédictives pour problèmes de financement, d'inspection et hésitations acheteur/vendeur", sub3: "Taux d'échec des transactions réduit de 12% à 4%" },
        marketing: { h1: "Génération de Contenu par IA", p1: "Création automatisée de descriptions de propriétés, publications sociales, campagnes courriel et guides de quartier", sub1: "85% moins de temps sur le contenu marketing", h2: "Distribution Intelligente", p2: "L'IA détermine les horaires de publication optimaux, les canaux et segments d'audience pour chaque contenu", sub2: "150% d'augmentation des taux d'engagement", h3: "Analyses de Performance", p3: "Suivi du ROI par type de contenu, plateforme et campagne avec recommandations d'amélioration", sub3: "45% de réduction du coût par prospect" },
        mobile: {
          title: "Travaillez de N'importe Où avec Notre Application Mobile",
          subtitle: "Gérez toute votre entreprise immobilière depuis votre téléphone. Répondez aux prospects, planifiez des visites et concluez des ventes en déplacement.",
          appStores: "Disponible sur iOS et Android",
          f1title: "Accès CRM Complet", f1desc: "Consultez et gérez tous vos contacts, prospects et transactions depuis votre téléphone",
          f2title: "Notifications Push", f2desc: "Recevez des alertes instantanées pour les nouveaux prospects, messages et mises à jour",
          f3title: "Mode Hors Ligne", f3desc: "Accédez à vos données même sans connexion internet",
          f4title: "Commandes Vocales", f4desc: "Ajoutez des notes et créez des tâches en mains libres en conduisant",
          download: "Téléchargez depuis l'App Store ou Google Play"
        },
        comparison: {
          title: "Comment Nous Comparons aux Principaux CRM",
          disclaimer: "* Prix et fonctionnalités à partir d'octobre 2025. Contactez les concurrents directement pour les informations actuelles.",
          feature: "Fonctionnalité",
          leadScoring: "Score Prédictif de Prospects", advancedAI: "✓ IA Avancée", basic: "Basique", manual: "Manuel", limited: "Limité",
          chatbot: "Chatbot IA 24/7", bilingual: "✓ Bilingue", addon: "Module complémentaire",
          ddf: "Intégration CREA DDF®", comingQ3: "Disponible T3 2026", thirdParty: "Tiers",
          transactionAI: "IA de Transactions", fullAutomation: "✓ Automatisation complète",
          compliance: "Conformité Canadienne", builtIn: "✓ Intégré",
          marketingAuto: "Automatisation Marketing", aiGenerated: "✓ Généré par IA", templates: "Modèles",
          mobileApp: "Application Mobile", fullFeatured: "✓ Complète",
          startingPrice: "Prix de Départ", setupFee: "Frais d'Installation",
          contract: "Contrat", monthToMonth: "Mois par mois", annual: "Annuel"
        }
      },
      pricing: {
        taxDisclaimer: "Les prix sont en dollars canadiens (CAD). La TPS/TVH est appliquée au paiement selon votre province de facturation. Chaque montant affiché ici correspond exactement à ce que vous verrez sur la page de paiement sécurisée Stripe.",
        compare: {
          boldtrailCost: "5\u00a0988\u00a0$/an + frais d'installation de 999\u00a0$",
          loftyCost: "1\u00a0788\u00a0$ à 3\u00a0588\u00a0$/an par utilisateur",
          ourCost: "999\u00a0$/an (Membre Fondateur), 0\u00a0$ d'installation",
          saveCallout: "Économisez jusqu'à 85\u00a0% par rapport à BoldTrail, 45\u00a0% vs Lofty"
        },
        banner: {
          trial: "🎉 Essai Gratuit de 14 Jours - Commencez Aujourd'hui!",
          launch: "🎉 Prix de Lancement — Économisez 498 $/an vs. Mensuel!"
        },
        hero: {
          badge: "🇨🇦 Fière Entreprise Canadienne",
          title: "Tarification Simple et Transparente pour les",
          titleGradient: "Professionnels de l'Immobilier Canadiens",
          subtitle: "Aucuns frais d'installation. Aucuns coûts cachés. Aucune surprise. Juste une IA puissante pour développer votre entreprise.",
          monthly: "Mensuel",
          yearly: "Annuel",
          saveYearly: "Économisez jusqu'à 500 $ /an"
        },
        plans: {
          agent: {
            name: "AGENT",
            badge: "14 Jours d'Essai Gratuit",
            description: "Idéal pour les courtiers individuels prêts à se développer",
            savings: "Économisez 789 $/an avec la facturation annuelle",
            yearlySavingsDetail: "Économisez 789\u00a0$ vs mensuel (498\u00a0$ vs annuel standard)",
            period: "/mois",
            ctaMonthly: "Commencer l'Essai Gratuit de 14 Jours",
            ctaYearly: "Commencer l'Essai Gratuit de 14 Jours",
            feature1: "Contacts et prospects illimités",
            feature2: "CRM prédictif propulsé par l'IA",
            feature3: "Chatbot IA 24/7 (site web, SMS, courriel)",
            feature4: "Suivi du ROI et analyses",
            feature5: "Automatisation courriel et SMS",
            feature6: "Intelligence du marché canadien",
            feature7: "Support bilingue (EN/FR)",
            feature8: "Application mobile incluse",
            feature9: "Assistance à la migration gratuite",
            feature10: "Aucuns frais d'installation",
            feature11: "Support prioritaire"
          },
          team: {
            name: "ÉQUIPE",
            badge: "Le Plus Populaire",
            description: "Pour les équipes en croissance de 2 à 5 courtiers",
            period: "/mois",
            cta: "Commencer l'Essai Gratuit de 14 Jours",
            feature1: "Tout du plan Agent, plus :",
            feature2: "Outils de collaboration d'équipe",
            feature3: "Distribution et routage des prospects",
            feature4: "Tableau de bord de performance d'équipe",
            feature5: "Gestion de pipeline partagée",
            feature6: "Rapports et analyses avancés",
            feature7: "Support prioritaire",
            feature8: "Gestionnaire de compte dédié",
            feature9: "Sessions de formation personnalisées",
            feature10: "Accès API disponible",
            feature11: "Options en marque blanche"
          },
          brokerage: {
            name: "COURTAGE",
            badge: "14 Jours d'Essai Gratuit",
            price: "Sur devis",
            description: "Pour les courtages avec 6 courtiers et plus",
            cta: "Commencer l'Essai Gratuit de 14 Jours",
            feature1: "Tout du plan Équipe, plus :",
            feature2: "Courtiers illimités",
            feature3: "Image de marque personnalisée et marque blanche",
            feature4: "Contrôles administratifs avancés",
            feature5: "Gestion multi-bureau",
            feature6: "Outils de conformité pour courtage",
            feature7: "Gestionnaire de succès dédié",
            feature8: "Formation de modèle IA personnalisée",
            feature9: "Remises sur volume",
            feature10: "Support premium 24/7"
          }
        },
        compareTable: {
          heading: "Comparer avec les Concurrents",
          sub: "Voyez combien vous économisez avec Realtor Desk AI",
          firstYear: "Première année",
          perYear: "Par année",
          saveThousands: "Économisez des milliers !"
        },
        table: {
          heading: "Comparaison des Fonctionnalités : Pourquoi les Courtiers Passent à Realtor Desk AI",
          featureCol: "Fonctionnalité",
          annualPrice: "Prix Annuel (Agent)",
          setupFee: "Frais d'Installation",
          aiScoring: "Score Prédictif de Prospects par IA",
          chatbot: "Chatbot IA Bilingue 24/7",
          migration: "Migration Gratuite",
          compliance: "Conformité Canadienne (RECO, BCFSA)",
          mobileApp: "Application Mobile",
          totalCost: "Coût Total Première Année",
          comingQ3: "(Disponible T3 2026)",
          comingSoon: "Bientôt disponible",
          extraCost: "Coût supplémentaire",
          partial: "Partielle",
          basic: "De base",
          limited: "Limité",
          varies: "Variable",
          boldtrailSwitch: "💰 Vous venez de BoldTrail ?",
          boldtrailSave: "Vous économiserez 5 988 $ dès la première année !"
        },
        social: {
          heading: "Résultats Réels de Courtiers Réels",
          stat1: "GCI supplémentaire la première année",
          stat2: "Transactions conclues via le chatbot IA",
          stat3: "Temps économisé sur les tâches administratives",
          stat3Headline: "15\u00a0h/sem",
          quote1: "\"Passé de BoldTrail et je n'ai jamais regardé en arrière. La notation des prospects par IA est incroyable.\"",
          quote2: "\"Le chatbot bilingue 24/7 capture des prospects pendant que je dors. Un vrai changement.\"",
          quote3: "\"L'automatisation gère les suivis. Je me concentre sur la conclusion, pas la saisie.\""
        },
        annual: {
          heading: "Pourquoi Choisir la Facturation Annuelle ?",
          monthly: "Plan Mensuel",
          mo: "/mois",
          bestValue: "Meilleur Rapport Qualité-Prix",
          annualPlan: "Plan Annuel (Membre Fondateur)",
          yr: "/an",
          save: "Économisez 789 $/an !",
          foundingBonus: "Bonus Membre Fondateur",
          disclaimer: "La facturation annuelle bloque votre tarif de Membre Fondateur pour toujours. Les plans mensuels peuvent augmenter à 149 $/mois après la fin de la promotion."
        },
        addons: {
          heading: "Améliorez Votre Plan avec des Modules Complémentaires",
          staging: "Mise en Scène Virtuelle IA",
          stagingDesc: "Mise en scène virtuelle illimitée pour toutes vos inscriptions",
          reports: "Rapports de Marché Avancés",
          reportsDesc: "Rapports personnalisés avec votre logo et votre image de marque",
          leads: "Module de Génération de Prospects",
          leadsDesc: "Identification ciblée de prospects vendeurs/acheteurs"
        },
        guarantees: {
          heading: "Nos Garanties pour Vous",
          moneyBack: "Garantie de Remboursement de 30 Jours",
          moneyBackDesc: "Concluez au moins une transaction supplémentaire dans vos 30 premiers jours ou obtenez un remboursement complet. Sans questions.",
          noContracts: "Sans Contrat, Annulez à Tout Moment",
          noContractsDesc: "Tous les plans sont mensuels. Annulez à tout moment en un clic. Sans pénalités, sans tracas.",
          freeSetup: "Installation et Migration Gratuites",
          freeSetupDesc: "Nous migrerons vos contacts et données depuis n'importe quel CRM gratuitement. Plus une intégration et une formation offertes.",
          badge1: "Sans contrat",
          badge2: "Aucuns frais d'installation",
          badge3: "Annulez à tout moment"
        },
        faq: {
          heading: "Questions Fréquemment Posées",
          q1: "Dois-je signer un contrat à long terme ?",
          q2: "L'intégration CREA DDF® est-elle incluse ?",
          q3: "Puis-je essayer avant d'acheter ?",
          q4: "Que se passe-t-il si je dépasse ma limite de contacts ?",
          q5: "Offrez-vous de la formation ?"
        }
      },
      demo: {
        hero: {
          title: "Voyez",
          titleGradient: "Realtor Desk AI",
          titleEnd: "en Action",
          subtitle: "Planifiez une démo personnalisée et voyez comment nous pouvons aider votre entreprise"
        },
        form: {
          heading: "Demander une Démo Personnalisée",
          title: "Demander une Démo Personnalisée",
          fullName: "Nom Complet *",
          fullNamePlaceholder: "Jean Dupont",
          email: "Adresse Courriel *",
          emailPlaceholder: "jean@exemple.com",
          phone: "Numéro de Téléphone *",
          brokerage: "Courtage/Entreprise",
          brokeragePlaceholder: "ABC Immobilier",
          province: "Province *",
          provincePlaceholder: "Sélectionner la province",
          crm: "CRM Actuel (le cas échéant)",
          crmPlaceholder: "Sélectionner le CRM",
          teamSize: "Nombre de Membres d'Équipe",
          teamSizePlaceholder: "Sélectionner la taille d'équipe",
          challenge: "Principal Défi",
          challengePlaceholder: "Sélectionner le défi",
          comments: "Commentaires/Questions",
          commentsPlaceholder: "Parlez-nous de vos besoins…",
          submit: "Demander une Démo",
          submitting: "Envoi en cours...",
          orStart: "Ou",
          getStarted: "commencez",
          rightAway: "tout de suite"
        },
        expect: {
          title: "À Quoi S'Attendre",
          discovery: "Appel Découverte (15 min)",
          discoveryDesc: "Nous en apprenons sur votre entreprise, vos défis et vos objectifs",
          liveDemo: "Démo en Direct (30 min)",
          liveDemoDesc: "Voyez Realtor Desk AI en action avec des exemples spécifiques à votre marché",
          onboarding: "Intégration Personnalisée",
          onboardingDesc: "Démarrez avec une intégration et un support personnalisés"
        },
        contact: {
          heading: "Coordonnées",
          title: "Informations de Contact",
          email: "Courriel",
          phone: "Téléphone",
          address: "Adresse"
        },
        selfServe: {
          heading: "Vous préférez explorer par vous-même?",
          sub: "Commencez votre essai gratuit de 14 jours — sans démo requise",
          cta: "Commencer l'Essai Gratuit de 14 Jours"
        },
        explore: {
          title: "Préférez explorer par vous-même?",
          subtitle: "Commencez aujourd'hui - aucune démo requise",
          cta: "Commencer"
        }
      },
      contact: {
        hero: {
          title: "Entrer en",
          titleGradient: "Contact",
          subtitle: "Vous avez des questions? Nous sommes là pour vous aider à transformer votre entreprise immobilière avec l'IA"
        },
        info: {
          emailUs: "Nous Écrire",
          callUs: "Nous Appeler",
          visitUs: "Nous Rendre Visite",
          support: "Support",
          responseTime: "Nous répondons dans les 24 heures",
          hours: "Heures d'Ouverture",
          hoursDetails: "Lundi - Vendredi: 9h00 - 18h00 HR\nSamedi: 10h00 - 16h00 HR\nDimanche: Fermé"
        },
        form: {
          title: "Envoyez-Nous un Message",
          name: "Nom Complet *",
          email: "E-mail *",
          phone: "Téléphone",
          message: "Message *",
          submit: "Envoyer le Message",
          submitting: "Envoi...",
          success: "Message Envoyé! ✅",
          successDesc: "Merci de nous avoir contactés! Nous vous répondrons dans les 24 heures."
        },
        map: {
          placeholder: "Placeholder de carte"
        },
        consent: "Je consens à ce que mes informations soient collectées et utilisées comme décrit dans la",
        privacyPolicyLink: "Politique de Confidentialité",
        pipedaNote: "Requis en vertu de la LPRPDE — Vos données ne seront utilisées que pour répondre à votre demande"
      },
      canadianMarket: {
        hero: {
          title: "La Seule Plateforme IA Construite Spécifiquement pour l'",
          titleGradient: "Immobilier Canadien",
          subtitle: "CREA DDF®, IA bilingue et conformité provinciale - pas une réflexion après coup, mais la fondation"
        }
      },
      resources: {
        hero: {
          title: "Centre d'",
          titleGradient: "Intelligence Immobilière",
          subtitle: "Guides, conseils et perspectives pour les professionnels de l'immobilier canadiens"
        }
      },
      integrations: {
        hero: {
          title: "Connectez Toute Votre",
          titleGradient: "Suite Technologique Immobilière",
          subtitle: "Realtor Desk AI s'intègre parfaitement avec tous vos outils et plateformes préférés"
        }
      },
      comparison: {
        badge: "Guide de Comparaison",
        savings: "Économisez",
        firstYear: "la première année!",
        complaints: "Plaintes Courantes Que Nous Entendons",
        schedule: "Planifier un Appel de Migration Gratuit"
      },
      problem: {
        badge: "Le Goulot d'Étranglement",
        title: "Fatigué de la gestion",
        titleHighlight: "lente et coûteuse des prospects?",
        subtitle: "Arrêtez de dépendre d'outils fragmentés et de suivis manuels. 48% des prospects sont perdus à cause des temps de réponse lents.",
        leadsLost: "de prospects perdus",
        toolsUsed: "outils utilisés quotidiennement",
        monthlyWaste: "gaspillés chaque mois",
        lostOpportunities: {
          title: "Opportunités Perdues",
          text: "67% des prospects contactent les agents en dehors des heures d'ouverture. Êtes-vous là pour répondre?"
        },
        toolOverload: {
          title: "Surcharge d'Outils",
          text: "Jongler avec 5+ plateformes pour chat, email, appels et CRM. Il y a une meilleure façon."
        },
        wastedSpend: {
          title: "Dépenses Publicitaires Gaspillées",
          text: "Vous payez pour des prospects, mais les temps de réponse lents signifient que les concurrents les concluent en premier."
        }
      },
      solution: {
        badge: "La Solution",
        title: "Outils Propulsés par l'IA",
        titleHighlight: "Conçus pour les Courtiers Canadiens",
        subtitle: "Automatisation 24/7 qui parle anglais et français, avec conformité LPRPDE et intégration CREA DDF® bientôt disponible.",
        chatbot: {
          title: "Chatbot IA 24/7",
          description: "Capturez et qualifiez des prospects en continu avec un chatbot IA bilingue qui répond aux questions, réserve des visites et ne rate jamais un prospect.",
          benefit1: "Répond aux prospects en moins de 2 minutes",
          benefit2: "Conversations bilingues anglais et français",
          benefit3: "Qualifie et évalue automatiquement les prospects",
          feature1: "Répond aux questions sur les propriétés instantanément",
          feature2: "Qualifie les acheteurs/vendeurs automatiquement",
          feature3: "Capture les coordonnées et préférences",
          feature4: "Bilingue (Anglais/Français)",
          feature5: "Fonctionne sur votre site Web et réseaux sociaux"
        },
        voice: {
          title: "Moteur de Suivi Intelligent",
          description: "Ne manquez plus aucun rappel. L'IA priorise votre liste d'appels quotidiens selon les scores, les signaux d'engagement et les moments optimaux.",
          benefit1: "Listes d'appels quotidiens priorisées par l'IA",
          benefit2: "Rappels de suivi automatisés",
          benefit3: "Résumés d'appels générés par l'IA",
          feature1: "Prend les appels quand vous êtes occupé",
          feature2: "Planifie les visites automatiquement",
          feature3: "Voix canadienne au son naturel",
          feature4: "Achemine les prospects chauds vers votre téléphone",
          feature5: "Enregistre et transcrit chaque appel"
        },
        email: {
          title: "Campagnes Courriel Automatisées",
          description: "Entretenez les prospects en pilote automatique avec des campagnes personnalisées, des alertes de propriétés et des mises à jour du marché — le tout conforme à la LCAP.",
          benefit1: "Modèles de campagnes goutte-à-goutte prêts à l'emploi",
          benefit2: "Courriels d'alertes de propriétés personnalisés",
          benefit3: "Conforme à la LCAP avec désinscription en un clic",
          feature1: "Répond aux demandes instantanément",
          feature2: "Envoie des correspondances de propriétés personnalisées",
          feature3: "Nourrit les prospects pendant plus de 90 jours",
          feature4: "S'intègre avec votre email",
          feature5: "Désinscription conforme à la LCAP"
        }
      },
      dashboard: {
        title: "Tout en Un Seul Endroit",
        subtitle: "Gérez toutes vos conversations, prospects et perspectives depuis un tableau de bord puissant et unique",
        feature1: "Toutes les conversations (chat, voix, email) en une vue",
        feature2: "Le scoring de prospects propulsé par l'IA met en évidence les prospects chauds",
        feature3: "Notifications en temps réel pour les demandes urgentes",
        feature4: "Modèles de réponse en un clic",
        feature5: "Analyses de performance et suivi du ROI",
        loadFailed: "Échec du chargement du profil"
      },
      ai: {
        title: "Assistant IA Immobilier",
        subtitle: "Votre assistant CRM immobilier intelligent",
        clearChat: "Effacer la conversation",
        quickActions: "Actions rapides",
        welcomeTitle: "Bienvenue sur l'assistant IA Immobilier",
        welcomeDesc: "Je peux vous aider à gérer vos contacts, analyser vos transactions, créer des tâches et fournir des perspectives immobilières. Essayez une des actions rapides ci-dessus!",
        placeholder: "Posez-moi une question sur votre CRM, contacts, transactions...",
        actions: {
          analyzePipeline: "Analyser mon pipeline",
          draftEmail: "Rédiger un courriel de suivi",
          createTask: "Créer une tâche",
          marketResearch: "Recherche de marché"
        }
      },
      canadian: {
        title: "Conçu pour le Marché Canadien",
        bilingual: "Support Bilingue (EN/FR)",
        mls: "S'intègre avec les Systèmes MLS Canadiens",
        compliant: "Conforme PIPEDA et LCAP",
        timezones: "Couvre les 6 Fuseaux Horaires Canadiens",
        crea: "Aligné avec le Code d'Éthique CREA",
        pricing: "Tarification en CAD"
      },
      faq: {
        title: "Questions",
        titleGradient: "Fréquentes",
        subtitle: "Trouvez des réponses aux questions courantes sur Realtor Desk AI",
        q1: {
          question: "RealtorDesk AI est-il prêt pour une utilisation en production?",
          answer: "Nous sommes actuellement en bêta publique avec plus de 50 agents immobiliers actifs à travers le Canada. La plateforme est entièrement fonctionnelle et stable, mais nous recueillons activement des commentaires et ajoutons des fonctionnalités. Les utilisateurs bêta aident à façonner notre feuille de route et reçoivent des réductions à vie."
        },
        q2: {
          question: "Que signifie 'bêta' pour moi?",
          answer: "Vous obtenez un accès complet à toutes les fonctionnalités à un tarif réduit. Nous pouvons ajouter/modifier des fonctionnalités en fonction des commentaires. Vous recevrez un support prioritaire et un accès direct à notre équipe. Vos tarifs sont verrouillés à vie—vous ne paierez jamais plus que votre tarif bêta."
        },
        q3: {
          question: "Puis-je faire confiance à la plateforme avec les données de mes clients?",
          answer: "Absolument. Nous utilisons un chiffrement de niveau bancaire (AES-256), hébergeons les données sur une infrastructure optimisée pour le Canada, et sommes conçus selon les principes de la LPRPDE — y compris le droit à l'effacement et les protocoles de notification de violation."
        },
        q4: {
          question: "Que se passe-t-il si la plateforme ne fonctionne pas comme décrit?",
          answer: "Nous offrons une garantie de remboursement de 30 jours. Si vous n'êtes pas satisfait pour quelque raison que ce soit, nous vous rembourserons intégralement. Pendant la bêta, nous offrons également un support illimité pour assurer votre succès."
        },
        q5: {
          question: "Les affirmations d'augmentation de conversion de 300% sont-elles réelles?",
          answer: "Cette métrique provient de nos participants au programme pilote qui ont constaté une amélioration moyenne de 300% du temps de réponse aux prospects, ce qui est corrélé avec une augmentation des conversions. Les résultats individuels varient en fonction du marché, de la qualité des prospects et de la façon dont vous utilisez la plateforme. Nous suivons les métriques à mesure que nous nous développons."
        },
        q6: {
          question: "Quelles certifications avez-vous réellement?",
          answer: "RealtorDesk AI est conçu autour des principes de la LPRPDE et des meilleures pratiques de sécurité. Nous sommes honnêtes : nous n'avons pas encore de certification SOC 2 formelle ni de badge CREA DDF® — ces étapes sont prévues à mesure que nous sortons de la bêta. Ce qui est actif aujourd'hui : chiffrement, suivi du consentement et exportation des données. Nous publierons les certifications dès qu'elles seront obtenues."
        },
        q7: {
          question: "L'IA sonne-t-elle robotique?",
          answer: "Notre IA utilise un traitement du langage naturel avancé et sonne remarquablement humaine. Pour les appels vocaux, nous utilisons des voix à accent canadien que les clients trouvent chaleureuses et professionnelles."
        },
        q8: {
          question: "Combien de temps prend la configuration?",
          answer: "La plupart des agents sont pleinement opérationnels en 20 minutes. Notre assistant de configuration vous guide dans la connexion de vos outils, la formation de l'IA sur vos annonces et la personnalisation des réponses."
        },
        q9: {
          question: "Que se passe-t-il si l'IA ne peut pas répondre à une question?",
          answer: "L'IA transmet de manière transparente les questions complexes vers vous par SMS ou téléphone. Elle fournit le contexte complet de la conversation afin que vous puissiez reprendre exactement là où elle s'est arrêtée."
        },
        q10: {
          question: "Est-ce conforme à la LCAP?",
          answer: "Absolument. RealtorDesk.ai est construit spécifiquement pour les réglementations canadiennes. Tous les emails incluent une identification appropriée de l'expéditeur, un suivi du consentement et des options de désinscription faciles."
        },
        q11: {
          question: "Avec quels CRM vous intégrez-vous?",
          answer: "Aujourd'hui : Zapier, Make et n8n natifs — qui couvrent plus de 5 000 applications dont Follow Up Boss, Brivity, HubSpot et Salesforce via Zapier. Les connecteurs directs Salesforce, Zoho CRM, Pipedrive, Freshsales et Microsoft Dynamics sont prévus. Vous pouvez aussi importer en masse depuis n'importe quel CRM par CSV."
        },
        q12: {
          question: "Puis-je personnaliser les réponses de l'IA?",
          answer: "Oui! Vous contrôlez la personnalité de l'IA, les modèles de réponse et les questions qu'elle gère par rapport à celles qu'elle vous transmet. Elle apprend votre style au fil du temps."
        },
        q13: {
          question: "Comment RealtorDesk AI se compare-t-il à Follow Up Boss?",
          answer: "RealtorDesk AI offre une réponse instantanée aux prospects par IA (moins de 3 secondes) et un support bilingue à partir de 149$/mois CAD, avec l'intégration CREA DDF® prévue pour le 3e trimestre 2026. Follow Up Boss nécessite un suivi manuel, manque de fonctionnalités IA et coûte 49-99$ USD/utilisateur/mois sans fonctionnalités spécifiques au Canada."
        },
        q14: {
          question: "RealtorDesk AI fonctionne-t-il avec CREA DDF®?",
          answer: "L'intégration CREA DDF® est prévue pour le 3e trimestre 2026 pour RealtorDesk AI. Lors du lancement, vous pourrez synchroniser les inscriptions MLS automatiquement, jumeler les acheteurs aux propriétés en temps réel et gérer les données d'inscription directement dans le CRM. En attendant, vous pouvez importer les inscriptions de Realtor.ca via l'outil d'importation intégré."
        },
        q15: {
          question: "Quel est le ROI moyen pour les agents utilisant RealtorDesk AI?",
          answer: "Selon les données de nos utilisateurs bêta, les agents voient une augmentation significative de la conversion des prospects grâce à des temps de réponse inférieurs à 3 secondes. Avec un agent moyen concluant 12-18 transactions par an, ajouter seulement 2-3 transactions supplémentaires grâce à un meilleur suivi paie le CRM plusieurs fois."
        },
        q16: {
          question: "RealtorDesk AI peut-il gérer les appels téléphoniques?",
          answer: "Oui! Notre Agent Vocal IA peut gérer les appels téléphoniques entrants 24/7, répondre aux questions sur les inscriptions, qualifier les prospects et réserver des rendez-vous directement dans votre calendrier—le tout avec un accent canadien naturel en anglais ou en français."
        },
        q17: {
          question: "RealtorDesk AI convient-il aux équipes immobilières?",
          answer: "Absolument. Notre plan Teams prend en charge un nombre illimité d'utilisateurs avec boîte de réception partagée, analyses de performance d'équipe, distribution de prospects en rotation et formation IA personnalisée. Parfait pour les courtages et équipes de 2 à 50+ agents."
        },
        q18: {
          question: "Combien de temps faut-il pour voir des résultats avec RealtorDesk AI?",
          answer: "La plupart des agents voient des améliorations immédiates du temps de réponse (instantané au lieu d'heures/jours). Dans les 30 premiers jours, les agents voient généralement 25-40% plus de rendez-vous qualifiés réservés. Les augmentations mesurables de transactions apparaissent généralement dans les 60-90 jours."
        },
        q19: {
          question: "RealtorDesk AI s'intègre-t-il avec mon site web existant?",
          answer: "Oui! Notre widget de chatbot IA s'installe sur n'importe quel site web avec un simple extrait de code (fonctionne avec WordPress, Wix, Squarespace, sites personnalisés). La configuration prend moins de 5 minutes et commence à capturer des prospects immédiatement."
        },
        q20: {
          question: "Qu'est-ce qui rend RealtorDesk AI différent des CRM traditionnels?",
          answer: "Les CRM traditionnels organisent les contacts mais nécessitent que VOUS fassiez tout le suivi. RealtorDesk AI engage activement les prospects 24/7 via chat, courriel, SMS et voix—les qualifiant et réservant des rendez-vous pendant que vous vous concentrez sur les clôtures. C'est la différence entre un classeur et un assistant IA."
        },
        cta: {
          title: "Vous Avez Encore des Questions?",
          subtitle: "Nous sommes là pour vous aider! Contactez notre équipe ou commencez votre essai gratuit aujourd'hui.",
          contactSupport: "Contacter le Support",
          startTrial: "Commencer Votre Essai Gratuit de 14 Jours",
          noCreditCard: "Aucune carte de crédit requise • Annulez à tout moment"
        }
      },
      cta: {
        title: "Prêt à Ne Plus Jamais Manquer un Prospect?",
        subtitle: "Rejoignez notre communauté bêta canadienne utilisant l'IA pour conclure plus de ventes",
        button: "Commencez Votre Essai Gratuit de 14 Jours",
        note: "Aucune carte de crédit requise • Configuration en 20 minutes • Annulez à tout moment"
      },
      mobileCTA: {
        title: "Commencez Votre Essai Gratuit de 14 Jours",
        subtitle: "Rejoignez Notre Communauté Bêta Canadienne"
      },
      trustTransparency: {
        badge: "Confiance et Transparence",
        title: "Bâti sur l'Honnêteté",
        subtitle: "Nous croyons en une communication transparente sur notre programme bêta",
        beta: {
          title: "Programme Bêta",
          desc: "Accès anticipé avec tarification spéciale",
          description: "Nous sommes actuellement en version bêta avec des agents immobiliers canadiens sélectionnés. Rejoignez notre programme pilote et aidez à façonner l'avenir de l'IA dans l'immobilier.",
          badge: "Places Limitées Disponibles"
        },
        results: {
          title: "Résultats Réels",
          desc: "Témoignages vérifiés d'utilisateurs bêta",
          description: "Métriques de performance basées sur notre programme pilote avec plus de 50 utilisateurs actifs. Les résultats individuels peuvent varier selon les conditions du marché et l'utilisation.",
          disclaimer: "*Résultats des participants au programme pilote"
        },
        security: {
          title: "La Sécurité d'Abord",
          desc: "Protection des données de niveau entreprise",
          description: "Architecture axée sur la sécurité, traitement des données conforme à la LPRPDE et chiffrement de niveau entreprise dès le premier jour."
        },
        canadian: {
          title: "Conçu au Canada",
          desc: "Conçu pour les courtiers immobiliers canadiens",
          description: "Conçu spécifiquement pour les courtiers immobiliers canadiens avec résidence des données à Toronto/Vancouver et support bilingue complet."
        },
        disclaimer: "RealtorDesk AI est actuellement en version bêta. Toutes les métriques de performance sont basées sur les résultats du programme pilote. Les résultats individuels peuvent varier."
      },
      betaCommunity: {
        title: "Rejoignez Notre Communauté Bêta en Croissance",
        participants: "50+ Participants Bêta",
        limitedSpots: "Places Bêta Limitées",
        resultsTitle: "Résultats Réels de Notre Communauté Bêta",
        resultsSubtitle: "Les agents immobiliers canadiens constatent déjà des résultats mesurables. Voici ce que vivent les premiers adopteurs :",
        testimonialDisclaimer: "*Les témoignages représentent des expériences individuelles de notre programme pilote. Les résultats varient et ne sont pas garantis. Les résultats moyens peuvent différer.",
        ctaTitle: "Prêt à Rejoindre Notre Programme Bêta?",
        ctaSubtitle: "Places limitées disponibles. Participez à façonner l'avenir de l'IA immobilière au Canada.",
        ctaButton: "Postuler pour l'Accès Bêta",
        ctaNote: "Les participants bêta bénéficient de réductions à vie et d'un accès prioritaire aux fonctionnalités",
        testimonials: {
          sarah: {
            quote: "J'étais sceptique à propos de l'IA, mais après la première semaine, j'avais 3 visites réservées pendant que je dormais. L'agent vocal semble naturel et capture tous les détails dont j'ai besoin.",
            brokerage: "Agent Indépendant",
            stats: {
              leads: "prospects capturés le premier mois",
              showings: "visites réservées automatiquement",
              deals: "transactions conclues"
            },
            badge: "Participant Bêta Depuis Nov 2024"
          },
          marc: {
            quote: "Le basculement transparent entre l'anglais et le français est parfait pour Montréal. Mon IA gère les deux langues naturellement, ce qui a considérablement élargi mon marché.",
            brokerage: "Century 21",
            stats: {
              increase: "d'augmentation des prospects francophones",
              response: "des demandes répondues en <2 minutes",
              saved: "heures/semaine économisées"
            },
            badge: "Participant Bêta Depuis Déc 2024"
          },
          jennifer: {
            quote: "Notre équipe de 5 agents fonctionne maintenant comme une équipe de 15. Le tableau de bord unifié signifie qu'aucun prospect ne passe entre les mailles du filet, même lorsque nous sommes tous occupés.",
            brokerage: "Chef d'Équipe RE/MAX",
            stats: {
              responseTime: "temps de réponse moyen de l'IA",
              leadIncrease: "d'augmentation des prospects qualifiés",
              additionalDeals: "transactions supplémentaires au T1"
            },
            badge: "Participant Bêta Depuis Jan 2025"
          }
        }
      },
      aiActive: "IA ACTIVE",
      roiCalculator: {
        title: "Calculez Votre ROI Potentiel",
        subtitle: "Voyez vos rendements projetés avec des estimations conservatrices",
        monthlyLeads: "Prospects Mensuels Actuels",
        leadsPerMonth: "prospects/mois",
        conversionRate: "Taux de Conversion Actuel",
        avgCommission: "Commission Moyenne par Transaction",
        planSelection: "Sélection du Plan",
        solo: "Solo",
        team: "Équipe",
        withoutAI: "Sans RealtorDesk AI",
        withAI: "Avec RealtorDesk AI",
        dealsPerMonth: "Transactions par mois:",
        monthlyRevenue: "Revenu mensuel:",
        annualRevenue: "Revenu annuel:",
        improvedConversion: "Conversion améliorée:",
        platformCost: "Coût de la plateforme:",
        netGain: "Gain Net:",
        roi: "ROI:",
        disclaimer1: "Estimation conservatrice basée sur l'amélioration du temps de réponse et la disponibilité 24/7.",
        disclaimer2: "*Suppose une amélioration de conversion de 30%, inférieure à la moyenne du programme pilote.",
        ctaButton: "Voyez ce ROI par vous-même—Commencer l'Essai Gratuit"
      },
      demoBooking: {
        title: "Voyez RealtorDesk AI en Action",
        demoTitle: "Démo Personnalisée de 15 Minutes",
        liveDemo: "En direct, pas enregistré",
        whatYouSee: "Ce que vous verrez:",
        benefit1: "Présentation en direct du chatbot IA, de l'agent vocal et de l'automation des emails",
        benefit2: "Comment configurer en moins de 15 minutes",
        benefit3: "Configuration personnalisée pour votre marché et vos besoins",
        benefit4: "Questions-réponses avec notre équipe",
        benefit5: "Offre de tarification bêta exclusive",
        testimonial: "\"La démo m'a convaincu instantanément. Voir l'IA gérer des questions immobilières en temps réel était impressionnant.\"",
        testimonialAuthor: "- Participant Bêta",
        flexibleScheduling: "Planification Flexible",
        flexibleSchedulingDesc: "Disponible dans tous les fuseaux horaires canadiens. Nous nous adapterons à votre horaire.",
        bookYourDemo: "Réservez Votre Démo",
        nameLabel: "Nom *",
        namePlaceholder: "Votre nom complet",
        emailLabel: "E-mail *",
        emailPlaceholder: "votre.email@exemple.com",
        phoneLabel: "Téléphone *",
        phonePlaceholder: "(555) 123-4567",
        brokerageLabel: "Courtage *",
        brokeragePlaceholder: "Nom de votre courtage",
        interestsLabel: "Qu'est-ce qui vous intéresse le plus? *",
        interestChatbot: "Chatbot IA",
        interestVoice: "Agent Vocal",
        interestEmail: "Automation des E-mails",
        interestAll: "Toutes les Fonctionnalités",
        detectedTimezone: "Fuseau horaire détecté:",
        submitButton: "Demander une Démo",
        submitting: "Envoi...",
        cantFindTime: "Vous ne trouvez pas de créneau? Écrivez à",
        andAccommodate: "et nous vous accommoderons.",
        successTitle: "Demande de Démo Reçue! 🎉",
        successDescription: "Nous vous contacterons dans les 24 heures pour planifier votre démo personnalisée.",
        validationError: "Erreur de Validation",
        errorTitle: "Erreur",
        errorDescription: "Une erreur s'est produite lors de l'envoi de votre demande. Veuillez réessayer.",
        nameRequired: "Le nom est requis",
        emailInvalid: "Adresse e-mail invalide",
        phoneRequired: "Le téléphone est requis",
        brokerageRequired: "Le courtage est requis",
        interestsRequired: "Sélectionnez au moins un intérêt"
      },
      indexPage: {
        socialProof: {
          banner: "Rejoignez Notre Communauté Bêta en Croissance",
          betaParticipants: "Participants Bêta",
          limitedSpots: "Places Bêta Limitées"
        },
        credibility: {
          soc2Title: "Architecture Axée Sécurité",
          soc2Desc: "Chiffrement et protection des données de niveau entreprise",
          pipedaTitle: "Conforme PIPEDA par Conception",
          pipedaDesc: "Construit autour des principes canadiens de confidentialité",
          creaTitle: "Intégration CREA DDF®",
          creaDesc: "Intégration CREA DDF® prévue pour Q3 2026"
        },
        problemStatement: {
          title: "Les Coûts Cachés de la Technologie Immobilière Désuète",
          subtitle: "Les CRM traditionnels freinent les agents immobiliers canadiens",
          stat1: "des agents utilisent les capacités IA malgré 72% utilisant des CRM",
          stat2: "des demandes d'acheteurs ne reçoivent AUCUNE réponse",
          stat3: "heures hebdomadaires consacrées à des tâches automatisables",
          stat4: "taux de conversion avec les méthodes traditionnelles"
        },
        solutionOverview: {
          title: "Rencontrez Votre Système d'Exploitation Immobilier Propulsé par l'IA",
          subtitle: "Transformez votre façon de travailler avec l'automation intelligente conçue spécifiquement pour les agents immobiliers canadiens",
          feature1Title: "Score de Prospects Prédictif",
          feature1Desc: "L'IA analyse plus de 40 signaux pour identifier les prospects chauds 3 à 6 mois à l'avance. Convertit 18% vs 5% de l'industrie. Basé sur 500 000+ transactions canadiennes",
          feature2Title: "Chatbot IA Bilingue 24/7",
          feature2Desc: "Capture les prospects en EN/FR, qualifie les acheteurs, planifie les visites, répond à plus de 200 questions sur les propriétés. Ne manquez plus jamais une demande à 2h du matin",
          feature3Title: "Coordinateur de Transactions Intelligent",
          feature3Desc: "Automatisez les mises à jour de statut, les demandes de documents, le suivi des échéances. Réduisez le temps de clôture de 60 à 35 jours avec 99% de précision"
        },
        roiDisclaimer: "*Les calculs de ROI sont des projections basées sur les moyennes de l'industrie et les données du programme pilote. Les résultats réels dépendent des conditions du marché, de la qualité des prospects, des efforts individuels et d'autres facteurs. Les performances passées ne garantissent pas les résultats futurs.",
        security: {
          title: "Sécurité de Niveau Entreprise et Outils pour Développeurs",
          subtitle: "Construit pour l'échelle, sécurisé pour la conformité, prêt pour l'intégration",
          securityTitle: "Sécurité et Conformité",
          sec1: "Architecture Axée sur la Sécurité:",
          sec1Desc: "Chiffrement de niveau entreprise, révisions de sécurité régulières, infrastructure haute disponibilité",
          sec2: "Conception LPRPDE-Consciente:",
          sec2Desc: "Droit d'accès, de suppression, portabilité des données. Notification de violation <72h",
          sec3: "Conscient de la LCAP:",
          sec3Desc: "Suivi du consentement exprès, désinscription automatique, preuve conservée 24 mois",
          sec4: "Infrastructure Optimisée pour le Canada:",
          sec4Desc: "Hébergé sur une infrastructure optimisée pour les exigences canadiennes de résidence des données",
          sec5: "Chiffrement:",
          sec5Desc: "TLS 1.3 en transit, AES-256 au repos, de bout en bout pour les documents sensibles",
          sec6: "Contrôle d'Accès:",
          sec6Desc: "Permissions basées sur les rôles, 2FA, SSO (Entreprise), journaux d'audit",
          apiTitle: "Capacités API et Intégration",
          api1: "API REST:",
          api1Desc: "Accès CRUD complet aux contacts, offres, tâches. Limite: 1000 req/min",
          api2: "Webhooks:",
          api2Desc: "Événements en temps réel (nouveau prospect, offre conclue, tâche en retard)",
          api3: "Synchronisation CRM:",
          api3Desc: "Zapier, Make et n8n natifs. Connecteurs directs Salesforce, Zoho, Pipedrive prévus.",
          api4: "Intégration Calendrier:",
          api4Desc: "Synchronisation bidirectionnelle avec Google/Outlook. Création auto de liens Zoom",
          api5: "Plateformes Email:",
          api5Desc: "Gmail, Outlook, MailChimp, SendGrid. Support SMTP/IMAP",
          api6: "Documentation:",
          api6Desc: "Documentation API interactive, SDK (JavaScript/Python), collection Postman",
          viewIntegrations: "Voir la Bibliothèque d'Intégration",
          performanceTitle: "Performance de la Plateforme",
          perf1: "SLA de Disponibilité",
          perf2: "Temps de Réponse IA",
          perf3: "Utilisateurs Simultanés",
          perf4: "Support (Entreprise)"
        },
        finalCTA: {
          title: "Rejoignez 50+ Agents Canadiens Qui Développent Leur Entreprise avec l'IA",
          subtitle: "Commencez à conclure plus de ventes avec l'automation propulsée par l'IA aujourd'hui",
          startTrial: "Commencez Votre Essai Gratuit de 14 Jours",
          bookDemo: "Réservez Votre Démo Gratuite",
          note: "⚡ 14 Jours Gratuits • Aucune carte de crédit • Annulez à tout moment"
        },
        betaNotice: {
          title: "Avis sur le Programme Bêta",
          description: "RealtorDesk AI est actuellement en version bêta publique. Nous nous améliorons continuellement en fonction des commentaires des utilisateurs. Toutes les fonctionnalités, tarifs et métriques sont sujets à changement. Les premiers adopteurs bénéficient de tarifs à vie spéciaux."
        }
      },
      // Dashboard & App Translations (French)
      app: {
        sidebar: {
          today: "Aujourd'hui",
          automations: "Automatisations",
          advanced: "Avancé",
          dashboard: "Tableau de Bord",
          contacts: "Contacts",
          properties: "Propriétés",
          deals: "Transactions",
          tasks: "Tâches",
          aiAssistant: "Assistant IA",
          campaigns: "Campagnes",
          calendar: "Calendrier",
          reports: "Rapports",
          market: "Intelligence de Marché",
          billing: "Facturation",
          settings: "Paramètres",
          trialActive: "Essai Actif",
          daysLeft: "jours restants dans votre essai",
          upgradeNow: "Mettre à Niveau"
        },
        navbar: {
          search: "Rechercher contacts, transactions, tâches...",
          notifications: "Notifications",
          profile: "Profil",
          signOut: "Se Déconnecter",
          help: "Aide"
        },
        dashboard: {
          welcomeBack: "Bienvenue",
          tasksDueToday: "tâches dues aujourd'hui",
          hotLeadsToFollow: "prospects chauds à suivre",
          newLeadsThisMonth: "Nouveaux Prospects (Ce Mois)",
          activeDeals: "Transactions Actives",
          tasksDue: "Tâches Dues Aujourd'hui",
          revenueYTD: "Revenus Année",
          pipeline: "pipeline",
          overdue: "en retard",
          ofAnnualGoal: "de l'objectif annuel",
          trialDaysLeft: "jours restants dans votre essai gratuit",
          upgradeNowContinue: "Mettez à niveau pour continuer après votre essai",
          loading: "Chargement..."
        },
        contacts: {
          title: "Contacts",
          addContact: "Ajouter un Contact",
          importContacts: "Importer",
          exportContacts: "Exporter",
          searchPlaceholder: "Rechercher des contacts...",
          allContacts: "Tous les Contacts",
          leads: "Prospects",
          clients: "Clients",
          pastClients: "Anciens Clients",
          noContacts: "Aucun contact trouvé",
          addFirst: "Ajoutez votre premier contact pour commencer",
          firstName: "Prénom",
          lastName: "Nom de Famille",
          email: "Courriel",
          phone: "Téléphone",
          source: "Source",
          status: "Statut",
          tags: "Étiquettes",
          leadScore: "Score Prospect",
          lastContact: "Dernier Contact",
          actions: "Actions",
          edit: "Modifier",
          delete: "Supprimer",
          view: "Voir les Détails",
          bulkActions: "Actions Groupées",
          selected: "sélectionné(s)",
          deleteSelected: "Supprimer la Sélection",
          addTags: "Ajouter des Étiquettes",
          sendEmail: "Envoyer un Courriel"
        },
        deals: {
          title: "Transactions",
          addDeal: "Ajouter une Transaction",
          searchPlaceholder: "Rechercher des transactions...",
          allDeals: "Toutes les Transactions",
          active: "Actives",
          won: "Gagnées",
          lost: "Perdues",
          noDeals: "Aucune transaction trouvée",
          addFirst: "Ajoutez votre première transaction pour commencer",
          dealName: "Nom de la Transaction",
          client: "Client",
          property: "Propriété",
          value: "Valeur",
          stage: "Étape",
          probability: "Probabilité",
          expectedClose: "Clôture Prévue",
          stages: {
            lead: "Prospect",
            viewing: "Visite",
            offer: "Offre",
            negotiation: "Négociation",
            closing: "Clôture",
            won: "Gagnée",
            lost: "Perdue"
          },
          pipeline: "Pipeline",
          totalValue: "Valeur Totale",
          avgDealSize: "Taille Moyenne",
          winRate: "Taux de Réussite"
        },
        tasks: {
          title: "Tâches",
          addTask: "Ajouter une Tâche",
          searchPlaceholder: "Rechercher des tâches...",
          allTasks: "Toutes les Tâches",
          today: "Aujourd'hui",
          upcoming: "À Venir",
          overdue: "En Retard",
          completed: "Terminées",
          noTasks: "Aucune tâche trouvée",
          addFirst: "Ajoutez votre première tâche pour commencer",
          taskName: "Nom de la Tâche",
          dueDate: "Date d'Échéance",
          dueTime: "Heure d'Échéance",
          priority: "Priorité",
          priorities: {
            low: "Basse",
            medium: "Moyenne",
            high: "Haute",
            urgent: "Urgente"
          },
          status: "Statut",
          statuses: {
            pending: "En Attente",
            inProgress: "En Cours",
            completed: "Terminée",
            cancelled: "Annulée"
          },
          relatedTo: "Lié à",
          description: "Description",
          markComplete: "Marquer Terminée",
          markIncomplete: "Marquer Incomplète"
        },
        properties: {
          title: "Propriétés",
          addProperty: "Ajouter une Propriété",
          searchPlaceholder: "Rechercher des propriétés...",
          allProperties: "Toutes les Propriétés",
          active: "Actives",
          pending: "En Attente",
          sold: "Vendues",
          noProperties: "Aucune propriété trouvée",
          addFirst: "Ajoutez votre première propriété pour commencer",
          propertyTitle: "Titre",
          address: "Adresse",
          city: "Ville",
          province: "Province",
          postalCode: "Code Postal",
          price: "Prix",
          type: "Type",
          bedrooms: "Chambres",
          bathrooms: "Salles de Bain",
          squareFeet: "Pieds Carrés",
          yearBuilt: "Année de Construction",
          mlsNumber: "Numéro MLS",
          listingType: "Type d'Inscription",
          types: {
            house: "Maison",
            condo: "Condo",
            townhouse: "Maison de Ville",
            land: "Terrain",
            commercial: "Commercial"
          }
        },
        settings: {
          title: "Paramètres",
          profile: "Profil",
          account: "Compte",
          notifications: "Notifications",
          integrations: "Intégrations",
          billing: "Facturation",
          security: "Sécurité",
          language: "Langue",
          timezone: "Fuseau Horaire",
          fullName: "Nom Complet",
          emailAddress: "Adresse Courriel",
          phoneNumber: "Numéro de Téléphone",
          company: "Entreprise/Courtage",
          licenseNumber: "Numéro de Permis",
          province: "Province",
          city: "Ville",
          save: "Enregistrer",
          cancel: "Annuler"
        },
        common: {
          loading: "Chargement...",
          save: "Enregistrer",
          cancel: "Annuler",
          delete: "Supprimer",
          edit: "Modifier",
          add: "Ajouter",
          search: "Rechercher",
          filter: "Filtrer",
          sort: "Trier",
          export: "Exporter",
          import: "Importer",
          refresh: "Actualiser",
          back: "Retour",
          next: "Suivant",
          previous: "Précédent",
          close: "Fermer",
          confirm: "Confirmer",
          yes: "Oui",
          no: "Non",
          all: "Tout",
          none: "Aucun",
          selectAll: "Tout Sélectionner",
          deselectAll: "Tout Désélectionner",
          noResults: "Aucun résultat trouvé",
          error: "Erreur",
          success: "Succès",
          warning: "Avertissement",
          info: "Info",
          required: "Requis",
          optional: "Optionnel",
          saving: "Sauvegarde...",
          continue: "Continuer",
          skip: "Passer pour l'instant"
        },
        auth: {
          signIn: "Se Connecter",
          signUp: "S'Inscrire",
          signOut: "Se Déconnecter",
          email: "Courriel",
          password: "Mot de Passe",
          confirmPassword: "Confirmer le Mot de Passe",
          forgotPassword: "Mot de Passe Oublié?",
          resetPassword: "Réinitialiser le Mot de Passe",
          createAccount: "Créer un Compte",
          alreadyHaveAccount: "Vous avez déjà un compte?",
          dontHaveAccount: "Vous n'avez pas de compte?",
          verifyEmail: "Vérifier le Courriel",
          checkYourEmail: "Vérifiez votre courriel pour un lien de vérification",
          invalidCredentials: "Courriel ou mot de passe invalide",
          emailRequired: "Le courriel est requis",
          passwordRequired: "Le mot de passe est requis",
          passwordMinLength: "Le mot de passe doit contenir au moins 8 caractères",
          passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
          passwordRequirements: {
            minLength: "Au moins 8 caractères",
            uppercase: "Au moins 1 lettre majuscule (A-Z)",
            lowercase: "Au moins 1 lettre minuscule (a-z)",
            number: "Au moins 1 chiffre (0-9)",
            special: "Au moins 1 caractère spécial (!@#$%^&*)",
            notMet: "Le mot de passe ne répond pas à toutes les exigences"
          }
        },
        validation: {
          required: "Ce champ est requis",
          email: "Veuillez entrer une adresse courriel valide",
          phone: "Veuillez entrer un numéro de téléphone valide",
          minLength: "Doit contenir au moins {{min}} caractères",
          maxLength: "Ne doit pas dépasser {{max}} caractères",
          number: "Veuillez entrer un nombre valide",
          date: "Veuillez entrer une date valide",
          url: "Veuillez entrer une URL valide"
        },
        notifications: {
          contactCreated: "Contact créé avec succès",
          contactUpdated: "Contact mis à jour avec succès",
          contactDeleted: "Contact supprimé avec succès",
          dealCreated: "Transaction créée avec succès",
          dealUpdated: "Transaction mise à jour avec succès",
          dealDeleted: "Transaction supprimée avec succès",
          taskCreated: "Tâche créée avec succès",
          taskUpdated: "Tâche mise à jour avec succès",
          taskDeleted: "Tâche supprimée avec succès",
          taskCompleted: "Tâche marquée comme terminée",
          propertyCreated: "Propriété créée avec succès",
          propertyUpdated: "Propriété mise à jour avec succès",
          propertyDeleted: "Propriété supprimée avec succès",
          settingsSaved: "Paramètres enregistrés avec succès",
          errorOccurred: "Une erreur s'est produite. Veuillez réessayer."
        },
        modals: {
          addContact: {
            title: "Ajouter un Nouveau Contact",
            firstName: "Prénom",
            lastName: "Nom de Famille",
            email: "Courriel",
            phone: "Téléphone",
            source: "Source",
            selectSource: "Sélectionner la source",
            tags: "Étiquettes",
            tagsPlaceholder: "Premier acheteur, Pré-approuvé, Urgent (séparés par des virgules)",
            notes: "Notes",
            notesPlaceholder: "Ajoutez des informations supplémentaires sur ce contact...",
            caslTitle: "🇨🇦 Conformité Canadienne (LCAP)",
            preferredLanguage: "Langue Préférée",
            selectLanguage: "Sélectionner la langue",
            english: "Anglais",
            french: "Français",
            consentLabel: "Le contact a donné son consentement pour les communications (LCAP)",
            consentDescription: "Requis en vertu de la Loi canadienne anti-pourriel pour l'envoi de messages électroniques commerciaux",
            cancel: "Annuler",
            addContact: "Ajouter le Contact",
            adding: "Ajout en cours...",
            notAuthenticated: "Non authentifié",
            pleaseLogin: "Veuillez vous connecter pour ajouter des contacts",
            success: "Contact ajouté avec succès",
            contactAdded: "a été ajouté à vos contacts",
            errorAdding: "Erreur lors de l'ajout du contact",
            sources: {
              website: "Site Web",
              referral: "Référence",
              openHouse: "Portes Ouvertes",
              zillow: "Zillow",
              realtorCom: "Realtor.com",
              socialMedia: "Médias Sociaux",
              import: "Importation",
              other: "Autre"
            }
          },
          addDeal: {
            title: "Ajouter une Nouvelle Transaction",
            contact: "Contact",
            selectContact: "Sélectionner un contact",
            transactionTitle: "Titre de la Transaction",
            titlePlaceholder: "ex., Achat de Condo au Centre-Ville",
            clientType: "Type de Client",
            selectType: "Sélectionner le type",
            buyer: "Acheteur",
            seller: "Vendeur",
            both: "Les Deux",
            propertyType: "Type de Propriété",
            propertyAddress: "Adresse de la Propriété",
            addressPlaceholder: "123 Rue Principale, Toronto, ON M1A 1A1",
            mlsNumber: "Numéro MLS",
            listingPrice: "Prix d'Inscription (CAD)",
            commission: "Commission %",
            stage: "Étape",
            stages: {
              newLead: "Nouveau Prospect",
              contacted: "Contacté",
              showingScheduled: "Visite Planifiée",
              offerMade: "Offre Faite",
              underContract: "Sous Contrat",
              closing: "Conclusion"
            },
            dealProbability: "Probabilité de Transaction",
            expectedClosingDate: "Date de Conclusion Prévue",
            pickDate: "Choisir une date",
            notes: "Notes",
            notesPlaceholder: "Détails supplémentaires sur cette transaction...",
            cancel: "Annuler",
            createTransaction: "Créer la Transaction",
            creating: "Création en cours...",
            fillRequired: "Veuillez remplir le contact et le titre",
            failedCreate: "Échec de la création de la transaction",
            successCreate: "Transaction créée avec succès",
            propertyTypes: {
              condo: "Condo",
              house: "Maison",
              townhouse: "Maison en Rangée",
              commercial: "Commercial",
              land: "Terrain",
              other: "Autre"
            }
          },
          addTask: {
            title: "Ajouter une Nouvelle Tâche",
            taskTitle: "Titre de la Tâche",
            titlePlaceholder: "ex., Appeler le client pour la visite de propriété",
            description: "Description",
            descriptionPlaceholder: "Détails supplémentaires...",
            dueDate: "Date d'Échéance",
            pickDate: "Choisir une date",
            dueTime: "Heure d'Échéance",
            priority: "Priorité",
            priorities: {
              low: "Basse",
              medium: "Normale",
              high: "Haute",
              urgent: "Urgente"
            },
            taskType: "Type de Tâche",
            taskTypes: {
              call: "Appel",
              email: "Courriel",
              meeting: "Réunion",
              viewing: "Visite",
              followup: "Suivi",
              other: "Autre"
            },
            associatedContact: "Contact Associé",
            selectContactOptional: "Sélectionner un contact (optionnel)",
            associatedDeal: "Transaction Associée",
            selectDealOptional: "Sélectionner une transaction (optionnel)",
            reminder: "Rappel",
            reminders: {
              none: "Aucun",
              fifteenMin: "15 minutes avant",
              oneHour: "1 heure avant",
              oneDay: "1 jour avant"
            },
            cancel: "Annuler",
            addAnother: "Ajouter et En Ajouter Une Autre",
            addTask: "Ajouter la Tâche",
            creating: "Création en cours...",
            fillRequired: "Veuillez remplir les champs requis",
            failedCreate: "Échec de la création de la tâche",
            successCreate: "Tâche créée avec succès"
          },
          addProperty: {
            title: "Ajouter une Nouvelle Propriété",
            quickAdd: "🚀 Ajout Rapide depuis l'URL de l'Inscription MLS",
            pasteUrl: "Coller l'URL de l'Inscription (Bientôt: Remplissage Auto depuis CREA DDF)",
            urlPlaceholder: "https://realtor.ca/listing/...",
            urlNote: "Phase 1: Nous récupérerons les infos de base. Phase 2: Intégration complète CREA DDF prévue T1 2026.",
            propertyTitle: "Titre de la Propriété",
            titlePlaceholder: "Belle Maison Familiale 3 Chambres",
            address: "Adresse",
            addressPlaceholder: "123 Rue Principale",
            city: "Ville",
            cityPlaceholder: "Toronto",
            province: "Province",
            provincePlaceholder: "ON",
            propertyType: "Type de Propriété",
            types: {
              house: "Maison",
              condo: "Condo",
              townhouse: "Maison en Rangée",
              land: "Terrain",
              commercial: "Commercial"
            },
            status: "Statut",
            statuses: {
              active: "Actif",
              pending: "En Attente",
              sold: "Vendu",
              comingSoon: "Bientôt Disponible",
              offMarket: "Hors Marché"
            },
            price: "Prix (CAD)",
            bedrooms: "Chambres",
            bathrooms: "Salles de Bain",
            squareFeet: "Pieds Carrés",
            mlsNumber: "Numéro MLS",
            imageUrl: "URL de l'Image",
            description: "Description",
            descriptionPlaceholder: "Décrivez les caractéristiques, commodités et avantages de l'emplacement...",
            cancel: "Annuler",
            addProperty: "Ajouter la Propriété",
            adding: "Ajout en cours...",
            success: "Propriété ajoutée avec succès",
            errorAdding: "Erreur lors de l'ajout de la propriété"
          },
          importContacts: {
            title: "Importer des Contacts",
            uploadDescription: "Téléversez un fichier CSV avec vos contacts",
            chooseFile: "Choisir un Fichier",
            selected: "Sélectionné:",
            formatGuide: "Guide de Format CSV",
            formatDescription: "Votre CSV devrait inclure ces colonnes:",
            importing: "Importation des contacts...",
            cancel: "Annuler",
            import: "Importer",
            importingBtn: "Importation...",
            imported: "Importés",
            errors: "Erreurs",
            done: "Terminé",
            importComplete: "Importation terminée",
            importSuccess: "contacts importés avec succès.",
            importFailed: "Échec de l'importation",
            invalidFileType: "Type de fichier invalide",
            pleaseSelectCSV: "Veuillez sélectionner un fichier CSV",
            notAuthenticated: "Non authentifié",
            pleaseLogin: "Veuillez vous connecter pour importer des contacts"
          }
        }
      },
      howItWorks: {
        hero: {
          title: "Soyez Opérationnel en",
          titleGradient: "20 Minutes",
          subtitle: "De l'inscription à la capture de prospects en moins de temps qu'il n'en faut pour se rendre à une visite. Aucune compétence technique requise."
        },
        steps: {
          signUp: {
            title: "Inscription",
            time: "2 minutes",
            description: "Créez votre compte et choisissez votre forfait. Aucune carte de crédit requise pour l'essai de 14 jours.",
            details: [
              "Entrez votre nom, courriel et info courtage",
              "Choisissez votre niveau d'abonnement",
              "Vérifiez votre adresse courriel",
              "Accédez immédiatement à votre tableau de bord"
            ]
          },
          connectTools: {
            title: "Connectez Vos Outils",
            time: "5 minutes",
            description: "Liez votre CRM, courriel, site web et système téléphonique avec des intégrations en un clic.",
            details: [
              "Connectez votre CRM existant via Zapier/Make ou import CSV",
              "Liez Gmail ou Outlook",
              "Ajoutez le code widget à votre site",
              "Importez vos contacts existants (CSV ou sync directe)"
            ]
          },
          trainAI: {
            title: "Entraînez Votre IA",
            time: "10 minutes",
            description: "Enseignez à l'IA vos propriétés, style et préférences. Notre assistant rend cela facile.",
            details: [
              "Téléversez vos inscriptions actuelles et infos propriétés",
              "Ajoutez les questions fréquemment posées",
              "Définissez votre style de communication",
              "Configurez les critères de qualification des prospects",
              "Configurez les préférences de notification"
            ]
          },
          customize: {
            title: "Personnalisez",
            time: "5 minutes",
            description: "Affinez les salutations, modèles de réponse et règles d'escalade selon votre flux de travail.",
            details: [
              "Personnalisez les messages d'accueil du chatbot",
              "Définissez les heures d'ouverture et le comportement hors heures",
              "Créez des modèles de réponse",
              "Définissez quand escalader vers un humain",
              "Configurez les règles de routage des prospects"
            ]
          },
          goLive: {
            title: "Mettez en Ligne",
            time: "Instantané",
            description: "Activez le commutateur et regardez votre équipe IA capturer et qualifier des prospects 24/7.",
            details: [
              "Activez le chatbot sur votre site web",
              "Activez l'automatisation des courriels",
              "Activez l'agent vocal",
              "Commencez à recevoir des notifications de prospects",
              "Surveillez le tableau de bord pour l'activité en temps réel"
            ]
          },
          optimize: {
            title: "Optimisez et Développez",
            time: "En continu",
            description: "Examinez les analyses, améliorez les réponses et regardez vos taux de conversion monter.",
            details: [
              "Examinez les rapports de performance hebdomadaires",
              "Affinez les réponses IA selon les données",
              "Testez différentes approches en A/B",
              "Développez à mesure que vous grandissez",
              "Accédez au support et formation continus"
            ]
          }
        },
        dashboard: {
          title: "Votre Centre de Commande Vous Attend",
          subtitle: "Tout ce dont vous avez besoin pour gérer prospects, conversations et transactions dans une interface élégante",
          unifiedInbox: "Boîte de Réception Unifiée",
          unifiedInboxDesc: "Toutes les conversations au même endroit",
          aiInsights: "Insights IA",
          aiInsightsDesc: "Notation intelligente des prospects et recommandations",
          analytics: "Analyses en Temps Réel",
          analyticsDesc: "Suivez la performance et le ROI",
          cta: "Commencez Votre Essai Gratuit de 14 Jours"
        },
        support: {
          title: "Nous Sommes Là pour Vous Aider à Chaque Étape",
          subtitle: "Notre équipe de support basée au Canada s'assure que vous ne soyez jamais bloqué",
          videoTutorials: "📚 Tutoriels Vidéo",
          videoTutorialsDesc: "Guides étape par étape pour chaque fonctionnalité",
          liveChat: "💬 Chat en Direct",
          liveChatDesc: "Réponses instantanées pendant les heures d'ouverture",
          freeOnboarding: "🎓 Intégration Gratuite",
          freeOnboardingDesc: "Assistance personnalisée à la configuration",
          avgSetupTime: "Temps de configuration moyen : 22 minutes",
          basedOn: "(basé sur nos sessions d'intégration bêta)"
        }
      },
      integrationsPage: {
        stats: {
          nativeIntegrations: "Intégrations Natives",
          viaZapier: "Via Connexion Zapier",
          realTimeSync: "Synchronisation en Temps Réel"
        },
        partners: {
          title: "Nos Partenaires d'Intégration",
          subtitle: "Connectez-vous à {count}+ outils et plateformes de premier plan"
        },
        categories: {
          crmPlatforms: "Plateformes CRM",
          automationTools: "Outils d'Automatisation et Flux de Travail",
          communicationTools: "Outils de Communication",
          calendarTools: "Outils de Calendrier",
          contactLeadTools: "Outils de Contacts et Prospects"
        },
        api: {
          title: "Besoin d'une Intégration Personnalisée?",
          subtitle: "Notre API REST et intégration Zapier vous offrent une flexibilité illimitée pour connecter n'importe quel outil.",
          restApi: "Accès API REST Complet",
          restApiDesc: "Le plan Entreprise inclut la documentation API complète",
          zapier: "Intégration Zapier",
          zapierDesc: "Connectez-vous à 5 000+ applications sans coder",
          webhooks: "Support Webhook",
          webhooksDesc: "Synchronisation de données en temps réel avec vos outils personnalisés",
          devSupport: "Support Développeur",
          devSupportDesc: "Équipe technique dédiée pour les intégrations personnalisées",
          enterpriseApi: "Accès API Entreprise",
          enterpriseApiDesc: "Créez des intégrations personnalisées avec notre API complète. Disponible sur les plans Entreprise."
        },
        cta: {
          title: "Prêt à Connecter Votre Pile Technologique?",
          subtitle: "Commencez à intégrer vos outils aujourd'hui et profitez d'une automatisation fluide",
          button: "Commencez à Conclure Plus",
          pricing: "Voir les Tarifs"
        },
        buttons: {
          bookDemo: "Réserver Votre Démo Gratuite",
          viewFeatures: "Voir Toutes les Fonctionnalités"
        }
      },
      resourcesPage: {
        categories: {
          all: "Tous les Articles",
          aiTech: "IA et Technologie",
          canadianMarket: "Marché Canadien",
          marketing: "Marketing",
          compliance: "Conformité",
          sales: "Ventes et Prospects",
          successStories: "Histoires de Succès",
          comparison: "Comparaisons CRM"
        },
        articles: {
          aiTransformation: {
            title: "Comment l'IA Transforme l'Immobilier Canadien en 2025",
            excerpt: "Découvrez les dernières innovations IA qui révolutionnent le travail des agents immobiliers canadiens, de l'analyse prédictive à la gestion automatisée des transactions."
          },
          creaDdf: {
            title: "Le Guide Complet de l'Intégration CREA DDF®",
            excerpt: "Tout ce que vous devez savoir pour accéder aux données MLS nationales et intégrer CREA DDF® dans votre flux de travail immobilier."
          },
          compliance: {
            title: "Liste de Contrôle de Conformité Provinciale : ON, BC, AB, QC",
            excerpt: "Restez conforme aux réglementations à travers le Canada. Un guide complet des exigences RECO, BCFSA, RECA et AMF."
          },
          leadConversion: {
            title: "10 Façons d'Augmenter la Conversion des Prospects avec l'Analyse Prédictive",
            excerpt: "Apprenez comment la notation des prospects et l'analyse prédictive alimentées par l'IA peuvent augmenter votre taux de conversion de 5% à 18%."
          },
          bilingual: {
            title: "Marketing Immobilier Bilingue : Au-delà de la Traduction",
            excerpt: "Maîtrisez l'art du vrai marketing bilingue pour les marchés canadiens. Ce n'est pas juste de la traduction - c'est de la communication culturelle."
          },
          successStory: {
            title: "Comment Sarah Chen a Conclu 14 Transactions de Plus au T1 avec l'IA",
            excerpt: "Le parcours d'une agente de Toronto du CRM traditionnel au succès propulsé par l'IA. Vrais chiffres, vrais résultats, vraie transformation."
          }
        },
        readTime: "min de lecture",
        readMore: "Lire la Suite",
        newsletter: {
          title: "Recevez des Insights Hebdomadaires dans Votre Boîte de Réception",
          subtitle: "Rejoignez 2 000+ agents immobiliers canadiens qui reçoivent des conseils pratiques sur l'IA et l'immobilier chaque semaine",
          placeholder: "Entrez votre courriel",
          subscribe: "S'abonner",
          noSpam: "Pas de spam. Désabonnez-vous à tout moment. Politique de confidentialité."
        }
      },
      footer: {
        tagline: "Succès Immobilier Propulsé par l'IA",
        product: "Produit",
        features: "Fonctionnalités",
        pricing: "Tarification",
        howItWorks: "Comment Ça Marche",
        integrations: "Intégrations",
        roadmap: "Feuille de Route",
        status: "Page de Statut",
        blogs: "Blogues",
        blog: "Blogue",
        helpCenter: "Centre d'Aide",
        apiDocs: "Documentation API",
        videoTutorials: "Tutoriels Vidéo",
        caseStudies: "Études de Cas",
        webinars: "Webinaires",
        company: "Entreprise",
        about: "À Propos",
        contact: "Contact",
        careers: "Carrières",
        privacy: "Politique de Confidentialité",
        terms: "Conditions d'Utilisation",
        casl: "Conformité LCAP",
        copyright: "© 2025 RealtorDesk.ai. Tous droits réservés.",
        madeInCanada: "Fabriqué au Canada 🇨🇦 pour les Agents Immobiliers Canadiens",
        poweredBy: "Propulsé par Brainfy AI Inc",
        cookieSettings: "Paramètres des Cookies"
      },
      trial: {
        daysRemaining: "{{count}} jours restants dans votre essai gratuit",
        oneDay: "1 jour restant dans votre essai gratuit",
        expirestoday: "Votre essai expire aujourd'hui !",
        upgradeMessage: "Passez à l'offre supérieure maintenant pour conserver vos données et débloquer les fonctionnalités premium",
        upgradeNow: "Passer à l'Offre Supérieure",
        expired: {
          title: "Votre Essai Gratuit Est Terminé",
          description: "Abonnez-vous maintenant pour continuer à utiliser Realtor Desk et conserver toutes vos données"
        },
        monthly: "Mensuel",
        yearly: "Annuel",
        savePercent: "Économisez 44%",
        billedYearly: "Facturé annuellement à {{price}} $",
        subscribeMonthly: "S'Abonner Mensuellement",
        subscribeYearly: "S'Abonner Annuellement",
        includesFeatures: "Tous les plans incluent :",
        guarantee: "Garantie de remboursement de 30 jours • Annulez à tout moment",
        feature: {
          unlimitedContacts: "Contacts et prospects illimités",
          aiLeadScoring: "Score de prospects propulsé par l'IA",
          emailAutomation: "Automatisation des courriels",
          dealPipeline: "Gestion du pipeline de transactions",
          marketInsights: "Analyses et aperçus du marché",
          prioritySupport: "Support prioritaire"
        },
        status: {
          title: "Statut de l'Abonnement",
          trialActive: "Essai Actif",
          trialExpired: "Essai Expiré",
          subscribed: "Abonnement Actif",
          daysLeft: "{{count}} jours restants dans l'essai",
          endsOn: "Se termine le {{date}}",
          tier: "Plan actuel : {{tier}}"
        }
      },
      today: {
        loading: "Chargement de votre journée...",
        goodMorning: "Bonjour",
        goodAfternoon: "Bon après-midi",
        goodEvening: "Bonsoir",
        there: "cher courtier",
        weeklyActivity: "Activité de la semaine",
        callsLogged: "Appels effectués",
        followUps: "Suivis planifiés",
        dealsMoved: "Transactions avancées",
        makeCalls: "Passer les appels du jour",
        contact: "contact",
        contacts: "contacts",
        readyToCall: "prêt(s) à appeler",
        whoToTalk: "À qui parler aujourd'hui",
        whoToTalkDesc: "Vos contacts prioritaires pour aujourd'hui, triés par urgence",
        allCaughtUp: "Tout est à jour!",
        noUrgent: "Aucun suivi urgent prévu pour aujourd'hui. Revenez demain ou consultez votre liste de contacts.",
        noCalls: "Aucun contact à appeler aujourd'hui. Excellent travail!",
        quickActions: "Actions rapides",
        viewContacts: "Voir tous les contacts",
        checkDeals: "Vérifier les transactions",
        noContactsYet: "Ajoutez des contacts pour commencer à appeler",
        importContacts: "Importer des contacts",
        unnamedContact: "Contact sans nom",
        loadFailed: "Échec du chargement des données",
        reasons: {
          checkIn: "Suivi régulier",
          firstContact: "Premier contact - nouveau prospect",
          overdue: "Suivi en retard",
          scheduledToday: "Suivi prévu aujourd'hui",
          hotLead: "Prospect chaud - attention requise",
          activeDeal: "Transaction active - vérifier le statut",
          activeProspect: "Prospect actif - entretenir la relation",
          longOverdue: "Très en retard - recontacter"
        }
      },
      stages: {
        newLead: "Nouveau prospect",
        coldLead: "Prospect froid",
        warmLead: "Prospect tiède",
        hotLead: "Prospect chaud",
        viewing: "Visite",
        offer: "Offre",
        negotiation: "Négociation",
        underContract: "Sous contrat",
        closed: "Conclu",
        lost: "Perdu",
        pastClient: "Ancien client",
        sphere: "Réseau"
      },
      billing: {
        title: "Facturation et abonnement",
        subtitle: "Gérez votre abonnement et vos informations de facturation",
        activated: "Abonnement activé avec succès!",
        trialAccount: "Compte d'essai",
        daysLeft: "jours restants dans votre essai gratuit",
        upgradeNow: "Passez à un forfait payant pour un accès illimité et continuez à développer votre entreprise avec un CRM propulsé par l'IA.",
        agentPlan: "Forfait Courtier",
        teamPlan: "Forfait Équipe",
        subscriptionActive: "Votre abonnement est actif",
        nextBilling: "Prochaine date de facturation",
        opening: "Ouverture...",
        manageBilling: "Gérer la facturation",
        selectPeriod: "Sélectionner la période de facturation",
        monthly: "Mensuel",
        yearly: "Annuel",
        year: "an",
        month: "mois",
        saveYearly: "Économisez jusqu'à 789$/an",
        availablePlans: "Forfaits disponibles",
        choosePlan: "Choisissez votre forfait",
        current: "Actuel",
        mostPopular: "Le plus populaire",
        agentDesc: "Parfait pour les courtiers individuels",
        teamDesc: "Pour les équipes de 2 à 5 courtiers",
        switchAgent: "Passer au forfait Courtier",
        upgradeAgent: "Passer au forfait Courtier",
        upgradeTeam: "Passer au forfait Équipe",
        features: {
          unlimitedContacts: "Contacts et prospects illimités",
          aiCrm: "CRM prédictif propulsé par l'IA",
          chatbot: "Chatbot IA 24/7",
          emailSms: "Automatisation courriel et SMS",
          mobileApp: "Application mobile incluse",
          everythingAgent: "Tout le forfait Courtier, plus :",
          teamCollab: "Outils de collaboration d'équipe",
          leadRouting: "Distribution et routage des prospects",
          advReporting: "Rapports avancés",
          accountManager: "Gestionnaire de compte dédié"
        }
      },
      
      onboarding: {
        profile: {
          title: "Configurons votre profil",
          subtitle: "Parlez-nous de vous pour personnaliser votre expérience",
          fullName: "Nom complet",
          companyName: "Nom de l'entreprise/courtage",
          licenseNumber: "Numéro de permis immobilier",
          province: "Province",
          city: "Ville",
          primaryLanguage: "Langue principale",
          avatarUploaded: "Photo téléchargée!",
          avatarFailed: "Échec du téléchargement de la photo",
          saveFailed: "Échec de la sauvegarde du profil"
        },
        goals: {
          title: "Vos objectifs d'affaires",
          subtitle: "Aidez-nous à adapter Realtor Desk AI à vos objectifs",
          role: "Votre rôle",
          soloAgent: "Courtier individuel",
          teamLeader: "Chef d'équipe",
          brokerManager: "Courtier/Gestionnaire",
          saveFailed: "Échec de la sauvegarde des objectifs"
        },
        chatbot: {
          title: "Configuration du chatbot IA",
          subtitle: "Personnalisez votre assistant IA pour qualifier les prospects 24/7",
          botName: "Nom du chatbot",
          greeting: "Message d'accueil",
          configured: "Chatbot configuré!",
          saveFailed: "Échec de la sauvegarde des paramètres du chatbot"
        },
        calendar: {
          title: "Intégration du calendrier",
          subtitle: "Connectez votre calendrier et définissez vos disponibilités",
          saved: "Paramètres du calendrier sauvegardés!",
          saveFailed: "Échec de la sauvegarde des paramètres du calendrier",
          finish: "Terminer la configuration"
        },
        import: {
          title: "Importez vos contacts",
          subtitle: "Choisissez comment ajouter vos contacts",
          skipContacts: "Passer - J'ajouterai mes contacts plus tard"
        },
        complete: {
          title: "Tout est prêt!",
          welcome: "Bienvenue sur Realtor Desk AI",
          whatWeSetUp: "Ce que nous avons configuré",
          whatsNext: "Et maintenant?",
          goDashboard: "Aller au tableau de bord",
          watchTutorial: "Voir le tutoriel",
          skipTutorial: "Passer le tutoriel",
          needHelp: "Besoin d'aide pour commencer?",
          contactSupport: "Contactez notre équipe de support"
        },
        saveFailed: "Échec de la sauvegarde. Veuillez réessayer.",
        welcome: "Bienvenue sur Realtor Desk AI!",
        completeFailed: "Échec de la configuration. Veuillez réessayer."
      },
      auth: {
        backToWebsite: "Retour à realtordesk.ai",
        protectedSession: "Session Protégée",
        pipedaCompliant: "Conforme LPRPDE",
        ssl: "Chiffrement SSL 256 bits",
        canadianData: "Données Canadiennes",
        login: {
          subtitle: "Connectez-vous à votre espace de travail",
          orEmail: "Ou continuer avec un courriel",
          emailAddress: "Adresse courriel",
          password: "Mot de passe",
          forgotPassword: "Mot de passe oublié?",
          signInSecurely: "Connexion sécurisée",
          sslNotice: "Votre connexion est sécurisée avec un chiffrement SSL 256 bits",
          noAccount: "Vous n'avez pas de compte?",
          startTrial: "Commencez votre essai gratuit"
        },
        signup: {
          subtitle: "Commencez votre essai gratuit de 14 jours",
          orEmail: "Ou inscrivez-vous avec un courriel",
          agreeToThe: "J'accepte la",
          privacyPolicy: "Politique de Confidentialité",
          termsOfService: "Conditions d'Utilisation",
          marketingConsent: "Envoyez-moi des conseils et mises à jour produit (facultatif)",
          sslNote: "Vos données sont stockées en toute sécurité sur des serveurs canadiens avec un chiffrement SSL 256 bits"
        },
        forgot: {
          title: "Réinitialiser le mot de passe",
          subtitle: "Entrez votre courriel et nous vous enverrons un lien de réinitialisation",
          enterEmail: "Veuillez entrer votre adresse courriel",
          emailSent: "Courriel de réinitialisation envoyé!",
          sendFailed: "Échec de l'envoi du courriel de réinitialisation",
          sending: "Envoi...",
          sendLink: "Envoyer le lien de réinitialisation",
          backToLogin: "Retour à la connexion",
          checkEmail: "Vérifiez votre courriel",
          sentTo: "Nous avons envoyé un lien de réinitialisation à",
          linkExpiry: "Cliquez sur le lien dans le courriel pour réinitialiser votre mot de passe. Le lien expire dans 1 heure.",
          checkSpam: "Si vous ne voyez pas le courriel, vérifiez votre dossier de courrier indésirable."
        },
        reset: {
          title: "Nouveau mot de passe",
          subtitle: "Entrez votre nouveau mot de passe ci-dessous",
          newPassword: "Nouveau mot de passe",
          confirmPassword: "Confirmer le mot de passe",
          success: "Mot de passe réinitialisé avec succès!",
          fillAll: "Veuillez remplir tous les champs",
          noMatch: "Les mots de passe ne correspondent pas",
          requirements: "Le mot de passe ne répond pas à toutes les exigences",
          updated: "Mot de passe mis à jour avec succès!",
          failed: "Échec de la réinitialisation du mot de passe",
          resetting: "Réinitialisation...",
          resetButton: "Réinitialiser le mot de passe"
        }
      },
      cookie: {
        title: "🍪 Préférences de cookies",
        description: "Nous utilisons des cookies pour améliorer votre expérience de navigation et analyser le trafic du site. Vous pouvez personnaliser vos préférences ou tout accepter.",
        privacyLink: "Politique de confidentialité",
        acceptAll: "Accepter tous les cookies",
        necessaryOnly: "Nécessaires uniquement",
        customize: "Personnaliser",
        necessary: "Cookies nécessaires",
        necessaryDesc: "Requis pour le fonctionnement de base du site. Ne peut pas être désactivé.",
        analytics: "Cookies analytiques",
        analyticsDesc: "Nous aident à comprendre comment les visiteurs interagissent avec notre site.",
        marketing: "Cookies marketing",
        marketingDesc: "Utilisés pour diffuser des publicités personnalisées pertinentes pour vous.",
        functional: "Cookies fonctionnels",
        functionalDesc: "Permettent des fonctionnalités améliorées comme les widgets de chat et les préférences.",
        savePreferences: "Sauvegarder les préférences",
        back: "Retour"
      },
      boldtrail: {
        compare: {
          heading: "Quatre lignes. Pas quarante.",
          sub: "Nous ne nous comparons pas sur l'étendue des fonctionnalités. BoldTrail compte plus de 400\u00a0000 agents; nous en avons moins d'une centaine. Voici les quatre axes que nous pouvons défendre, chacun sourcé du centre d'aide de BoldTrail, de signaux tarifaires ou d'avis publics."
        },
        betterWhen: {
          heading: "Quand BoldTrail est le meilleur choix",
          body: "Si vous dirigez un grand courtage aux États-Unis, avez besoin de BackOffice pour les partages de commissions, ou d'une intégration profonde avec des systèmes MLS propres aux États-Unis que notre travail CREA DDF ne couvre pas encore, BoldTrail est aujourd'hui l'option plus mature. Nous sommes bâtis pour l'agent canadien indépendant ou la petite équipe — nous sommes plus petits, plus ciblés, et le resterons dans un avenir prévisible. Choisissez l'outil qui convient, pas la liste la plus longue."
        }
      },
      leadScore: {
        title: "Pourquoi ce score",
        openExplainer: "Pourquoi ce score",
        emailActivity: "Activité courriel (30 derniers jours)",
        propertyViews: "Vues de propriétés",
        daysSinceContact: "Jours depuis le dernier contact",
        loading: "Chargement des signaux\u2026",
        noSignals: "Aucun signal comportemental pour le moment. Consignez des appels, courriels et vues de propriétés pour alimenter ce panneau.",
        manualNotice: "Votre score est actuellement calculé par une formule fixe. Le scoring dérivé par IA, entraîné sur votre propre historique de conversion, sera livré au T2 2026."
      },
      onboardingChecklist: {
        heading: "Démarrage — 60 minutes, guidé",
        subheading: "Cinq étapes pour passer d'un tableau de bord vide à votre premier appel de suivi.",
        ack: "Compris",
        step: {
          profile: {
            title: "Complétez votre profil",
            desc: "Ajoutez votre courtage, permis et coordonnées."
          },
          contact: {
            title: "Ajoutez votre premier contact",
            desc: "Importez un CSV ou saisissez un prospect manuellement."
          },
          property: {
            title: "Ajoutez votre première propriété",
            desc: "Collez un lien realtor.ca ou saisissez les détails."
          },
          widget: {
            title: "Configurez votre widget de site web",
            desc: "Livraison au T3 2026 — voir la feuille de route."
          },
          calendar: {
            title: "Connectez Google ou Outlook Calendar",
            desc: "Synchronisez vos rendez-vous dans /today."
          }
        }
      },
      roadmap: {
        badge: "Feuille de route publique",
        title: "Ce que nous livrons — et ce que nous ne livrons pas.",
        subtitle: "L'honnêteté est une fonctionnalité. Cette page liste nos engagements datés sur les capacités que nos clients et concurrents demandent le plus. Si une date glisse, nous la déplaçons — nous ne l'abandonnons pas en silence.",
        lastUpdated: "Dernière mise à jour : 2026-04-20",
        status: {
          shipping: "En livraison",
          shipped: "Livré",
          building: "En construction",
          designing: "En conception",
          roadmapped: "Planifié",
          considering: "À l'étude"
        },
        quarter: {
          apr_2026: "Avr 2026",
          q2_2026: "T2 2026",
          q3_2026: "T3 2026",
          q1_2027: "T1 2027",
          tbd: "—"
        },
        section: {
          now: { heading: "Livraisons du sprint en cours (avril 2026)" },
          q2: { heading: "T2 2026" },
          q3: { heading: "T3 2026" },
          q1_2027: { heading: "T1 2027 — palier Équipes" },
          not_on: { heading: "Hors feuille de route 2026" }
        },
        item: {
          casl_footer: {
            title: "Pied de courriel conforme à la LCAP + désabonnement fonctionnel",
            desc: "Chaque courriel système envoyé contient l'identification de l'expéditeur, l'adresse physique, la base de consentement et un désabonnement en un clic qui écrit réellement dans une liste d'exclusion."
          },
          pricing_parity: {
            title: "Page de tarifs alignée sur le paiement Stripe",
            desc: "Chaque montant sur /pricing est dérivé de la même constante que la fonction create-checkout transmet à Stripe, avec une étiquette CAD et une mention TPS/TVH."
          },
          lead_score_explainer: {
            title: "Explication du score des prospects",
            desc: "La page de détail du contact expose les 3 signaux comportementaux derrière le score au lieu d'afficher un simple chiffre."
          },
          onboarding_checklist: {
            title: "Liste d'intégration sur /today",
            desc: "Les nouveaux comptes voient une configuration guidée en 5 étapes (profil, contact, propriété, widget de site, connexion du calendrier). Persistée en base de données, pas en localStorage."
          },
          ai_scoring: {
            title: "Scoring de prospects dérivé par IA",
            desc: "Remplace le score manuel actuel par un modèle entraîné sur votre historique de conversion. Notification web quand un prospect chauffe (aucune application native requise)."
          },
          trigger_campaigns: {
            title: "Séquences de courriels déclenchées",
            desc: "Connecte /campaigns et /automations à un véritable moteur de séquences. Déclencheurs : nouveau prospect, refroidi, anniversaire, anniversaire d'inscription. Détection de réponse pour mise en pause. Tous les modèles sont bilingues et incluent le pied LCAP."
          },
          idx_sites: {
            title: "Sites publics d'agents + capture comportementale (CREA DDF)",
            desc: "Sites d'agent hébergés sur realtordesk.ai, alimentés par le flux CREA DDF. Les widgets comportementaux alimentent les scores en temps réel. Inclus avec tous les paliers payants."
          },
          teams_tier: {
            title: "Lancement du palier Équipes",
            desc: "Tableau de bord multi-agents, vues gestionnaire, agrégats de vitaux quotidiens. Jusqu'à cette livraison, RealtorDesk AI est conçu pour l'agent solo ou la petite équipe (≤5)."
          },
          social_promotion: {
            title: "Promotion sociale en un clic",
            desc: "Reconsidéré au T1 2027 au plus tôt. Aujourd'hui, vous pouvez partager la page publique de la propriété manuellement."
          },
          native_mobile: {
            title: "Application mobile native",
            desc: "Nous prenons en charge le mobile via notifications web + PWA encapsulée par Capacitor. Une application iOS/Android native n'est pas prévue pour 2026."
          },
          commissions: {
            title: "Module Commissions / BackOffice",
            desc: "Hors champ. Cela constituerait une surface produit distincte, pas un module additionnel du CRM."
          },
          recruiting: {
            title: "Outils de recrutement d'agents",
            desc: "Hors champ. Nous construisons pour les agents actifs, pas pour les courtiers qui recrutent des agents."
          }
        },
        footer: {
          title: "Vous voyez quelque chose qui manque ou voulez voter sur les priorités\u00a0?",
          body: "Écrivez à product@realtordesk.ai ou ouvrez une demande dans le panneau de rétroaction de l'application. Les éléments avec un signal client sont priorisés avant les demandes internes.",
          viewPricing: "Voir la tarification",
          viewFeatures: "Ce qui est livré aujourd'hui"
        }
      },
      unsubscribe: {
        title: "Se désabonner des courriels de RealtorDesk AI",
        working: "Traitement de votre demande\u2026",
        success: "Vous êtes désabonné. Nous n'enverrons plus de courriels à",
        thisAddress: "cette adresse",
        effectiveImmediate: "Votre désinscription prend effet immédiatement conformément à la LCAP §11.",
        errorExpired: "Ce lien de désabonnement a expiré. Demandez-en un nouveau ci-dessous.",
        errorInvalid: "Ce lien de désabonnement est invalide. Demandez-en un nouveau ci-dessous.",
        linkSent: "Si cette adresse figure sur notre liste, nous venons de vous envoyer un lien de confirmation. Cliquez dessus pour terminer le désabonnement.",
        linkSentNote: "Les liens expirent dans 30 jours. Vérifiez votre dossier «\u00a0pourriels\u00a0» si vous ne le voyez pas d'ici une minute.",
        manualPrompt: "Saisissez l'adresse courriel à retirer de notre liste. Nous vous enverrons un lien de confirmation en un clic.",
        ctaSendLink: "M'envoyer un lien de désabonnement",
        casl: "Exploité sous LCAP par Brainfy AI Inc. (RealtorDesk AI).",
        back: "Retour à RealtorDesk AI"
      },
      rd: {
        sidebar: {
          workspaceTier: "Forfait Équipe",
          collapse: "Réduire la barre latérale",
          nav: {
            dashboard: "Tableau de bord",
            leads: "Clients potentiels",
            conversations: "Conversations",
            pipeline: "Pipeline",
            automation: "Automatisation",
            reports: "Rapports",
            settings: "Paramètres"
          },
          desk: {
            title: "IA Desk · de garde",
            summary: "{{count}} clients répondus cette semaine. Réponse moyenne {{response}}."
          }
        },
        topnav: {
          search: "Rechercher clients, inscriptions, conversations…",
          live: "En direct",
          notifications: "Notifications",
          language: "Langue"
        },
        pages: {
          dashboard: {
            title: "Tableau de bord",
            saluteMorning: "Bonjour",
            saluteAfternoon: "Bon après-midi",
            saluteEvening: "Bonsoir",
            subhead: "IA Desk a travaillé pendant la nuit."
          },
          leads: { title: "Clients potentiels" },
          inbox: { title: "Conversations" },
          pipeline: { title: "Pipeline" },
          automation: { title: "Automatisation" },
          reports: { title: "Rapports" }
        }
      }
    }
  }
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
    }
  });

export default i18n;
