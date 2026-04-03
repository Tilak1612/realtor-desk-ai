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
        startClosing: "Start Closing More Deals"
      },
      hero: {
        title: "Close 3X More Deals with AI Automation",
        subtitle: "24/7 AI-powered lead capture, call handling, and email automation—designed for the Canadian market with CREA DDF® integration and full bilingual support.",
        getStarted: "Start Your 14-Day Free Trial",
        watchDemo: "Book Your Free Demo",
        trustLine: "14 Days Free Trial • No credit card required • Cancel anytime",
        badge1: "CREA Certified",
        badge2: "SOC 2 Compliant",
        badge3: "50+ Beta Users",
        conversionBadge: "300% Conversion Increase"
      },
      home: {
        socialProof: {
          agents: "agents",
          usingNow: "using now",
          demos: "demos",
          bookedThisWeek: "booked this week",
          joinAgents: "Join agents closing 3X more deals"
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
        comparison: {
          title: "How We Compare to Leading CRMs",
          disclaimer: "* Pricing and features as of October 2025. Contact competitors directly for current information."
        },
        mobile: {
          title: "Work From Anywhere with Our Mobile App",
          subtitle: "Manage your entire real estate business from your phone. Respond to leads, schedule showings, and close deals on the go.",
          appStores: "Available on iOS & Android"
        }
      },
      pricing: {
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
            description: "Perfect for individual agents ready to scale",
            ctaMonthly: "Start 14-Day Free Trial",
            ctaYearly: "Start 14-Day Free Trial"
          },
          team: {
            name: "TEAM",
            description: "For growing teams of 2-5 agents",
            cta: "Request Team Demo"
          },
          brokerage: {
            name: "BROKERAGE",
            price: "Custom",
            description: "For brokerages with 6+ agents",
            cta: "Get Custom Quote"
          }
        },
        addons: {
          title: "Enhance Your Plan with Add-Ons"
        },
        guarantees: {
          title: "Our Guarantees to You",
          moneyBack: "30-Day Money-Back Guarantee",
          noContracts: "No Contracts, Cancel Anytime",
          freeSetup: "Free Setup & Migration"
        },
        faq: {
          title: "Frequently Asked Questions"
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
          title: "Request a Personalized Demo",
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
          title: "Contact Information",
          email: "Email",
          phone: "Phone",
          address: "Address"
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
          hours: "Business Hours",
          hoursDetails: "Monday - Friday: 9:00 AM - 6:00 PM EST\nSaturday: 10:00 AM - 4:00 PM EST\nSunday: Closed"
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
        }
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
        title: "Tired of Missing Leads While You Sleep?",
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
        title: "Meet Your 24/7 AI Real Estate Team",
        chatbot: {
          title: "Intelligent Lead Capture",
          feature1: "Answers property questions instantly",
          feature2: "Qualifies buyers/sellers automatically",
          feature3: "Captures contact info & preferences",
          feature4: "Bilingual (English/French)",
          feature5: "Works on your website & social media"
        },
        voice: {
          title: "Smart Call Handling",
          feature1: "Takes calls when you're busy",
          feature2: "Schedules showings automatically",
          feature3: "Natural-sounding Canadian voice",
          feature4: "Routes hot leads to your phone",
          feature5: "Records & transcribes every call"
        },
        email: {
          title: "Follow-Up That Never Stops",
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
        feature5: "Performance analytics & ROI tracking"
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
          answer: "We currently integrate with Follow Up Boss, Brivity, LionDesk, and RealtyJuggler - the most popular CRMs among Canadian agents."
        },
        q12: {
          question: "Can I customize the AI's responses?",
          answer: "Yes! You control the AI's personality, response templates, and which questions it handles vs. escalates to you. It learns your style over time."
        },
        q13: {
          question: "How does RealtorDesk AI compare to Follow Up Boss?",
          answer: "RealtorDesk AI offers AI-powered instant lead response (under 3 seconds), native CREA DDF® integration, and bilingual support starting at $149/mo CAD. Follow Up Boss requires manual follow-up, lacks AI features, and costs $49-$99 USD/user/month without Canadian-specific features."
        },
        q14: {
          question: "Does RealtorDesk AI work with CREA DDF®?",
          answer: "Yes! RealtorDesk AI has native CREA DDF® integration built specifically for Canadian agents. Sync MLS listings automatically, match buyers to properties in real-time, and manage listing data directly within the CRM—no third-party tools needed."
        },
        q15: {
          question: "What's the average ROI for agents using RealtorDesk AI?",
          answer: "Based on our beta user data, agents see an average 3X increase in lead conversion due to sub-3-second response times. With an average agent closing 12-18 deals per year, adding just 2-3 extra deals from better follow-up pays for the CRM 10X over."
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
        }
      },
        cta: {
        title: "Ready to Never Miss a Lead Again?",
        subtitle: "Join 500+ Canadian realtors using AI to close more deals",
        button: "Start Your 14-Day Free Trial",
        note: "14 Days Free • No credit card required • Cancel anytime"
      },
      mobileCTA: {
        title: "Start Your 14-Day Free Trial",
        subtitle: "Join 500+ Canadian Realtors"
      },
      trustTransparency: {
        title: "Built on Trust & Transparency",
        beta: {
          title: "Beta Program",
          description: "We're currently in beta with select Canadian realtors. Join our pilot program and help shape the future of AI in real estate.",
          badge: "Limited Spots Available"
        },
        results: {
          title: "Real Results",
          description: "Performance metrics based on our pilot program with 50+ active users. Individual results may vary based on market conditions and usage.",
          disclaimer: "*Results from pilot participants"
        },
        security: {
          title: "Security First",
          description: "SOC 2 compliant architecture, PIPEDA-ready data handling, and enterprise-grade security from day one."
        },
        canadian: {
          title: "Canadian Built",
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
              responseTime: "Team response time",
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
          soc2Title: "SOC 2 Compliant",
          soc2Desc: "Enterprise-grade security and data protection",
          pipedaTitle: "PIPEDA Compliant",
          pipedaDesc: "Full Canadian privacy law compliance",
          creaTitle: "CREA Certified",
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
          api3Desc: "Pre-built connectors for Brivity, Follow Up Boss, Salesforce, HubSpot",
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
          title: "Join 500+ Canadian Agents Growing Their Business with AI",
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
          optional: "Optional"
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
            urlNote: "Phase 1: We'll scrape basic info. Phase 2: Full CREA DDF integration coming Q1 2026.",
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
              "Connect existing CRM (Follow Up Boss, Brivity, etc.)",
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
          basedOn: "(based on 500+ agent onboardings)"
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
          subtitle: "Join 2,000+ Canadian realtors receiving actionable AI and real estate tips every week",
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
        madeInCanada: "Made in Canada 🇨🇦 for Canadian Realtors"
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
        startClosing: "Commencer à Conclure Plus"
      },
      hero: {
        title: "Concluez 3X Plus de Transactions avec l'Automatisation IA",
        subtitle: "Capture de prospects 24/7, gestion d'appels et automation par courriel—conçue pour le marché canadien avec intégration CREA DDF® et support bilingue complet.",
        getStarted: "Commencez Votre Essai Gratuit de 14 Jours",
        watchDemo: "Réserver Votre Démo Gratuite",
        trustLine: "14 Jours Gratuits • Aucune carte de crédit • Annulez à tout moment",
        badge1: "Certifié CREA",
        badge2: "Conforme SOC 2",
        badge3: "50+ Utilisateurs Bêta",
        conversionBadge: "Augmentation de 300% des Conversions"
      },
      home: {
        socialProof: {
          agents: "agents",
          usingNow: "l'utilisent maintenant",
          demos: "démos",
          bookedThisWeek: "réservées cette semaine",
          joinAgents: "Rejoignez les agents qui concluent 3X plus"
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
        comparison: {
          title: "Comment Nous Comparons aux Principaux CRM",
          disclaimer: "* Prix et fonctionnalités à partir d'octobre 2025. Contactez les concurrents directement pour les informations actuelles."
        },
        mobile: {
          title: "Travaillez de N'importe Où avec Notre Application Mobile",
          subtitle: "Gérez toute votre entreprise immobilière depuis votre téléphone. Répondez aux prospects, planifiez des visites et concluez des ventes en déplacement.",
          appStores: "Disponible sur iOS et Android"
        }
      },
      pricing: {
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
            description: "Parfait pour les agents individuels prêts à se développer",
            ctaMonthly: "Commencer l'Essai Gratuit",
            ctaYearly: "Commencer l'Essai Gratuit de 30 Jours"
          },
          team: {
            name: "ÉQUIPE",
            description: "Pour les équipes en croissance de 2 à 5 agents",
            cta: "Demander une Démo Équipe"
          },
          brokerage: {
            name: "COURTAGE",
            price: "Personnalisé",
            description: "Pour les courtages avec 6+ agents",
            cta: "Obtenir un Devis Personnalisé"
          }
        },
        addons: {
          title: "Améliorez Votre Plan avec des Modules Complémentaires"
        },
        guarantees: {
          title: "Nos Garanties Pour Vous",
          moneyBack: "Garantie de Remboursement de 30 Jours",
          noContracts: "Aucun Contrat, Annulez à Tout Moment",
          freeSetup: "Installation et Migration Gratuites"
        },
        faq: {
          title: "Questions Fréquemment Posées"
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
          title: "Demander une Démo Personnalisée",
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
          title: "Informations de Contact",
          email: "E-mail",
          phone: "Téléphone",
          address: "Adresse"
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
          hours: "Heures d'Ouverture",
          hoursDetails: "Lundi - Vendredi: 9h00 - 18h00 HNE\nSamedi: 10h00 - 16h00 HNE\nDimanche: Fermé"
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
        }
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
        title: "Fatigué de Manquer des Prospects Pendant Votre Sommeil?",
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
        title: "Rencontrez Votre Équipe Immobilière IA 24/7",
        chatbot: {
          title: "Capture de Prospects Intelligente",
          feature1: "Répond aux questions sur les propriétés instantanément",
          feature2: "Qualifie les acheteurs/vendeurs automatiquement",
          feature3: "Capture les coordonnées et préférences",
          feature4: "Bilingue (Anglais/Français)",
          feature5: "Fonctionne sur votre site Web et réseaux sociaux"
        },
        voice: {
          title: "Gestion d'Appels Intelligente",
          feature1: "Prend les appels quand vous êtes occupé",
          feature2: "Planifie les visites automatiquement",
          feature3: "Voix canadienne au son naturel",
          feature4: "Achemine les prospects chauds vers votre téléphone",
          feature5: "Enregistre et transcrit chaque appel"
        },
        email: {
          title: "Suivi Qui Ne S'Arrête Jamais",
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
        feature5: "Analyses de performance et suivi du ROI"
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
          answer: "Nous sommes construits sur une infrastructure conforme SOC 2 Type II et suivons les exigences de la LPRPDE. Notre intégration CREA DDF® est compatible avec les flux de données officiels. Alors que nous quittons la bêta, nous compléterons des audits tiers formels et afficherons des badges de certification."
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
          answer: "Nous nous intégrons actuellement avec Follow Up Boss, Brivity, LionDesk et RealtyJuggler - les CRM les plus populaires parmi les agents canadiens."
        },
        q12: {
          question: "Puis-je personnaliser les réponses de l'IA?",
          answer: "Oui! Vous contrôlez la personnalité de l'IA, les modèles de réponse et les questions qu'elle gère par rapport à celles qu'elle vous transmet. Elle apprend votre style au fil du temps."
        },
        q13: {
          question: "Comment RealtorDesk AI se compare-t-il à Follow Up Boss?",
          answer: "RealtorDesk AI offre une réponse instantanée aux prospects par IA (moins de 3 secondes), une intégration native CREA DDF® et un support bilingue à partir de 149$/mois CAD. Follow Up Boss nécessite un suivi manuel, manque de fonctionnalités IA et coûte 49-99$ USD/utilisateur/mois sans fonctionnalités spécifiques au Canada."
        },
        q14: {
          question: "RealtorDesk AI fonctionne-t-il avec CREA DDF®?",
          answer: "Oui! RealtorDesk AI a une intégration native CREA DDF® conçue spécifiquement pour les agents canadiens. Synchronisez les inscriptions MLS automatiquement, jumelez les acheteurs aux propriétés en temps réel et gérez les données d'inscription directement dans le CRM—aucun outil tiers requis."
        },
        q15: {
          question: "Quel est le ROI moyen pour les agents utilisant RealtorDesk AI?",
          answer: "Selon les données de nos utilisateurs bêta, les agents voient une augmentation moyenne de 3X de la conversion des prospects grâce à des temps de réponse inférieurs à 3 secondes. Avec un agent moyen concluant 12-18 transactions par an, ajouter seulement 2-3 transactions supplémentaires grâce à un meilleur suivi paie le CRM 10X."
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
        }
      },
      cta: {
        title: "Prêt à Ne Plus Jamais Manquer un Prospect?",
        subtitle: "Rejoignez 500+ agents immobiliers canadiens utilisant l'IA pour conclure plus de ventes",
        button: "Commencez Votre Essai Gratuit de 14 Jours",
        note: "Aucune carte de crédit requise • Configuration en 20 minutes • Annulez à tout moment"
      },
      mobileCTA: {
        title: "Commencez Votre Essai Gratuit de 14 Jours",
        subtitle: "Rejoignez 500+ Agents Canadiens"
      },
      trustTransparency: {
        title: "Bâti sur la Confiance et la Transparence",
        beta: {
          title: "Programme Bêta",
          description: "Nous sommes actuellement en version bêta avec des agents immobiliers canadiens sélectionnés. Rejoignez notre programme pilote et aidez à façonner l'avenir de l'IA dans l'immobilier.",
          badge: "Places Limitées Disponibles"
        },
        results: {
          title: "Résultats Réels",
          description: "Métriques de performance basées sur notre programme pilote avec plus de 50 utilisateurs actifs. Les résultats individuels peuvent varier selon les conditions du marché et l'utilisation.",
          disclaimer: "*Résultats des participants au programme pilote"
        },
        security: {
          title: "La Sécurité d'Abord",
          description: "Architecture conforme SOC 2, gestion des données prête pour PIPEDA et sécurité de niveau entreprise dès le premier jour."
        },
        canadian: {
          title: "Conçu au Canada",
          description: "Conçu spécifiquement pour les agents immobiliers canadiens avec résidence des données à Toronto/Vancouver et support bilingue complet."
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
              responseTime: "Temps de réponse de l'équipe",
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
          soc2Title: "Conforme SOC 2",
          soc2Desc: "Sécurité et protection des données de niveau entreprise",
          pipedaTitle: "Conforme PIPEDA",
          pipedaDesc: "Conformité totale aux lois canadiennes sur la vie privée",
          creaTitle: "Certifié CREA",
          creaDesc: "Partenaire officiel d'intégration CREA DDF®"
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
          api3Desc: "Connecteurs pré-construits pour Brivity, Follow Up Boss, Salesforce, HubSpot",
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
          title: "Rejoignez 500+ Agents Canadiens Qui Développent Leur Entreprise avec l'IA",
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
          optional: "Optionnel"
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
              "Connectez votre CRM existant (Follow Up Boss, Brivity, etc.)",
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
          basedOn: "(basé sur 500+ intégrations d'agents)"
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
        blogs: "Blogs",
        blog: "Blog",
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
        madeInCanada: "Fabriqué au Canada 🇨🇦 pour les Agents Immobiliers Canadiens"
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
