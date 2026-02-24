import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";

type RoleCategory = "engineering" | "sales-cs" | "marketing" | "operations";

type Role = {
  id: string;
  title: string;
  category: RoleCategory;
  mission: string;
  responsibilities: string[];
  qualifications: string[];
  hiringNow?: boolean;
};

const roles: Role[] = [
  {
    id: "full-stack-engineer-ai-backend",
    title: "Full-Stack Engineer (AI/Backend Focus)",
    category: "engineering",
    hiringNow: true,
    mission:
      "Build and maintain the core RealtorDesk.ai platform — from AI-powered lead response pipelines to CRM automation workflows. You'll work across our stack to ship features that help Canadian real estate agents close more deals with less manual work.",
    responsibilities: [
      "Build and scale backend APIs powering AI lead response, contact management, and automation triggers",
      "Integrate with third-party platforms (CREA DDF/MLS, Brevo, Twilio, Stripe)",
      "Maintain AWS Canada infrastructure with a focus on data residency and PIPEDA compliance",
      "Implement AI/LLM workflows for lead qualification, follow-up sequencing, and property matching",
      "Write clean, well-tested code and participate in code reviews",
      "Optimize platform performance to maintain sub-60-second AI response times",
      "Collaborate directly with the founder on feature prioritization and architecture decisions",
    ],
    qualifications: [
      "3+ years with Node.js, Python, or similar backend stack",
      "Experience with relational + NoSQL databases (PostgreSQL, DynamoDB, or similar)",
      "Familiarity with OpenAI/Anthropic APIs or LLM integrations",
      "Comfort working in a fast-moving startup where you wear multiple hats",
      "Bonus: Experience in PropTech, SaaS, or Canadian compliance frameworks",
    ],
  },
  {
    id: "frontend-engineer-react-next",
    title: "Frontend Engineer (React/Next.js)",
    category: "engineering",
    mission:
      "Own the visual and interactive layer of RealtorDesk.ai — the dashboards, pipelines, and workflows that agents use every day. You care deeply about UX and build interfaces that feel fast, intuitive, and polished for non-technical users.",
    responsibilities: [
      "Build responsive, accessible UI components in React/Next.js following our brand guidelines (Navy #1E40AF, Green #10B981)",
      "Develop the agent-facing CRM dashboard, lead inbox, pipeline views, and reporting screens",
      "Implement real-time features (live lead alerts, conversation feeds) using WebSockets or SSE",
      "Collaborate closely with the backend team on API contracts and data flows",
      "Optimize for mobile responsiveness for agents using the platform in the field",
      "Ensure bilingual (EN/FR) support is built into UI components for Quebec market",
    ],
    qualifications: [
      "2+ years in React and/or Next.js",
      "Strong CSS/Tailwind skills and an eye for detail in UI design",
      "Experience consuming REST or GraphQL APIs",
      "Ability to work independently without a dedicated design team",
      "Bonus: Experience with Framer, Figma-to-code workflows, or building SaaS dashboards",
    ],
  },
  {
    id: "qa-devops-engineer",
    title: "QA & DevOps Engineer",
    category: "engineering",
    mission:
      "Keep RealtorDesk.ai reliable, secure, and fast as we scale. You'll own our CI/CD pipelines, cloud infrastructure, and testing frameworks — making sure every release is smooth and every agent's data is protected.",
    responsibilities: [
      "Manage and optimize AWS Canada infrastructure (ECS, RDS, Lambda, S3)",
      "Build and maintain CI/CD pipelines (GitHub Actions or similar)",
      "Write automated test suites (unit, integration, end-to-end)",
      "Monitor system health, uptime, and performance metrics; set up alerting",
      "Enforce security best practices aligned with PIPEDA and SOC 2 requirements",
      "Manage environment configurations across dev, staging, and production",
    ],
    qualifications: [
      "2+ years in DevOps or cloud infrastructure roles",
      "Hands-on AWS experience (certifications a plus)",
      "Familiarity with Docker, Kubernetes, or serverless architectures",
      "Experience with monitoring tools (Datadog, CloudWatch, Sentry)",
      "Bonus: Experience with compliance-focused environments (PIPEDA, SOC 2, HIPAA)",
    ],
  },
  {
    id: "customer-success-manager",
    title: "Customer Success Manager (Real Estate Focus)",
    category: "sales-cs",
    hiringNow: true,
    mission:
      "Be the human anchor that keeps our agents successful and retained. You'll onboard new real estate professionals onto the platform, train them on AI automation features, and proactively prevent churn by turning hesitant realtors into power users.",
    responsibilities: [
      "Own the full onboarding journey from signup to first AI-assisted lead follow-up",
      "Conduct 1:1 and group training sessions via video call and pre-recorded walkthroughs",
      "Monitor usage metrics and proactively reach out to at-risk accounts",
      "Gather product feedback from agents and communicate it clearly to the product team",
      "Build a library of reusable onboarding resources (guides, videos, FAQ docs)",
      "Support renewal and upsell conversations in collaboration with sales",
      "Handle inbound support tickets with a focus on fast, empathetic resolution",
    ],
    qualifications: [
      "2+ years in customer success or account management for a B2B SaaS product",
      "Strong communication skills — both written and on video/phone",
      "Comfortable learning and explaining technical products to non-technical users",
      "Highly organized, self-directed, and comfortable in ambiguous startup environments",
      "Bonus: Background in or direct exposure to Canadian real estate industry",
    ],
  },
  {
    id: "sales-development-representative",
    title: "Sales Development Representative (SDR)",
    category: "sales-cs",
    hiringNow: true,
    mission:
      "Fill the top of our pipeline by connecting with Canadian real estate agents, teams, and brokerages who are frustrated with slow follow-ups and overpriced US-built tools. You'll be the first voice of RealtorDesk.ai for many prospects.",
    responsibilities: [
      "Prospect and qualify leads across Canadian real estate agent communities (Facebook Groups, LinkedIn, CREA directories, brokerage networks)",
      "Run outbound email, LinkedIn, and phone outreach sequences",
      "Book demo calls for the founder or account executive",
      "Manage and track all activity accurately in the CRM (yes, you'll use our own product)",
      "Develop scripts and messaging that speak directly to Canadian agent pain points",
      "Attend virtual real estate events and webinars to generate leads",
      "Report weekly on pipeline activity and conversion metrics",
    ],
    qualifications: [
      "1+ years in SaaS sales, SDR, or business development role",
      "Excellent written communication — you know how to write a cold email that gets opened",
      "Comfortable with rejection and motivated by results",
      "Familiarity with the Canadian real estate market is a strong asset",
      "Bonus: Experience selling to small business owners or professional services clients",
    ],
  },
  {
    id: "growth-marketer-demand-generation",
    title: "Growth Marketer / Demand Generation",
    category: "marketing",
    hiringNow: true,
    mission:
      "Drive qualified traffic and leads into the RealtorDesk.ai funnel through SEO, paid campaigns, email marketing, and content distribution. You understand what makes a Canadian realtor click, sign up, and stay.",
    responsibilities: [
      "Own and execute multi-channel demand generation: SEO/blog, paid social (Facebook, Instagram, LinkedIn), email sequences via Brevo",
      "Manage and optimize Google Ads and Meta Ads campaigns targeting Canadian real estate agents",
      "Build and A/B test landing pages, email subject lines, and ad creatives",
      "Maintain our editorial calendar across 50+ planned blog posts targeting Canadian real estate keywords",
      "Track funnel performance (MQLs, CPL, CAC) and report weekly with actionable insights",
      "Collaborate with SDR and CS teams to align messaging across the funnel",
      "Support local SEO strategy for city-specific pages (Toronto, Vancouver, Calgary, Montreal)",
    ],
    qualifications: [
      "2+ years in growth marketing or demand generation for a B2B SaaS product",
      "Hands-on experience with Google Ads, Meta Ads, and email marketing platforms",
      "Strong analytical skills — you make decisions based on data, not gut feel",
      "Excellent writing skills for producing or editing Canadian real estate content",
      "Bonus: Experience in Canadian digital advertising, bilingual content (EN/FR), or PropTech",
    ],
  },
  {
    id: "content-writer-seo-specialist",
    title: "Content Writer / SEO Specialist",
    category: "marketing",
    mission:
      "Build RealtorDesk.ai's authority in the Canadian real estate space through high-quality, search-optimized content that helps agents solve real problems — and naturally leads them to discover our platform.",
    responsibilities: [
      "Research and write 4–8 long-form blog posts per month targeting Canadian real estate SEO keywords",
      "Optimize all content for on-page SEO (title tags, meta descriptions, internal linking, schema)",
      "Develop city-specific landing page copy for major Canadian markets",
      "Write email newsletter content, social media captions, and short-form ad copy",
      "Conduct keyword research using Ahrefs, Semrush, or similar tools",
      "Repurpose blog content into LinkedIn posts, Twitter threads, and YouTube scripts",
    ],
    qualifications: [
      "2+ years writing long-form SEO content, preferably in SaaS or real estate",
      "Strong understanding of on-page and technical SEO fundamentals",
      "Ability to write in a clear, professional, and relatable voice for Canadian realtors",
      "Experience using keyword research and content performance tools",
      "Bonus: Bilingual writing in English and French",
    ],
  },
  {
    id: "operations-partnerships-manager",
    title: "Operations & Partnerships Manager",
    category: "operations",
    mission:
      "Keep the business running smoothly and build strategic relationships with Canadian real estate associations, brokerages, and technology partners that expand RealtorDesk.ai's reach and credibility.",
    responsibilities: [
      "Manage internal workflows, vendor relationships, and operational processes",
      "Identify and pursue partnership opportunities with brokerages, CREA chapters, and real estate coaches",
      "Coordinate product launches, campaigns, and cross-functional initiatives",
      "Draft partnership proposals, co-marketing agreements, and referral program structures",
      "Track business KPIs and prepare regular reporting for leadership",
      "Support hiring, contractor onboarding, and team coordination as we scale",
    ],
    qualifications: [
      "3+ years in operations, business development, or strategy roles",
      "Strong project management skills (Notion, Linear, Asana, or similar)",
      "Excellent relationship-building and written communication skills",
      "Comfortable working in a startup with no defined playbook",
      "Bonus: Existing network in Canadian real estate or PropTech",
    ],
  },
];

const priorityRoles = [
  {
    roleId: "full-stack-engineer-ai-backend",
    why: "Without core platform reliability and AI pipeline performance, everything else breaks. This is the technical foundation.",
  },
  {
    roleId: "customer-success-manager",
    why: "Early churn kills SaaS startups. A dedicated CSM converts trial users into loyal paying customers and captures the product feedback loop needed to improve fast.",
  },
  {
    roleId: "sales-development-representative",
    why: "You need qualified pipeline. An SDR generates demos consistently and tests messaging in the market — giving you real signal on who your best-fit customer is.",
  },
  {
    roleId: "growth-marketer-demand-generation",
    why: "Organic and paid acquisition need to be running in parallel with outbound. This role owns the top-of-funnel engine and reduces CAC over time through compounding SEO and paid efficiency.",
  },
];

const categoryLabels: Record<RoleCategory, string> = {
  engineering: "Product & Engineering",
  "sales-cs": "Customer & Growth",
  marketing: "Customer & Growth",
  operations: "Operations & Strategy",
};

const roleCategoryForLinks = {
  engineering: ["githubProfileUrl", "portfolioUrl"],
  marketing: ["portfolioUrl", "writingSamplesUrl"],
  "sales-cs": ["crmToolsUsed"],
  operations: [],
} as const;

const optionalUrl = z.union([z.literal(""), z.string().trim().url("Please enter a valid URL")]);

const maxWords = (value: string) => value.trim().split(/\s+/).filter(Boolean).length <= 150;

const careersFormSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120, "Name is too long"),
  emailAddress: z.string().trim().email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^[0-9\s()+-]{10,20}$/, "Please enter a valid phone number"),
  location: z.string().trim().min(2, "Location is required").max(120, "Location is too long"),
  roleApplyingFor: z.string().min(1, "Please select a role"),
  availabilityToStart: z.string().min(1, "Please select your availability"),
  workAuthorization: z.string().min(1, "Please select your work authorization"),
  resumeFile: z
    .custom<FileList>((value) => value instanceof FileList && value.length > 0, "Resume/CV is required")
    .refine((files) => files[0]?.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
      (files) => {
        const file = files[0];
        if (!file) {
          return false;
        }
        const allowedMimeTypes = [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/msword",
        ];
        const hasValidMime = allowedMimeTypes.includes(file.type);
        const hasValidExtension = /\.(pdf|doc|docx)$/i.test(file.name);
        return hasValidMime || hasValidExtension;
      },
      "Please upload a PDF or DOCX file",
    ),
  linkedInProfileUrl: z.string().trim().url("Please enter a valid LinkedIn URL"),
  yearsOfRelevantExperience: z.string().min(1, "Please select experience level"),
  githubProfileUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  writingSamplesUrl: optionalUrl,
  crmToolsUsed: z.string().trim().max(250, "Please keep this under 250 characters").optional().or(z.literal("")),
  whyRealtorDeskNow: z
    .string()
    .trim()
    .min(20, "Please provide at least a short answer")
    .refine(maxWords, "Please keep this answer to 150 words or less"),
  limitedGuidanceStory: z
    .string()
    .trim()
    .min(20, "Please provide at least a short answer")
    .refine(maxWords, "Please keep this answer to 150 words or less"),
  canadaMarketView: z
    .string()
    .trim()
    .min(20, "Please provide at least a short answer")
    .refine(maxWords, "Please keep this answer to 150 words or less"),
  referredBy: z.string().trim().max(120, "Please keep this under 120 characters").optional().or(z.literal("")),
  additionalContext: z.string().trim().max(2000, "Please keep this under 2000 characters").optional().or(z.literal("")),
  pipedaConsent: z.boolean().refine((value) => value === true, {
    message: "Consent is required to submit your application",
  }),
});

type CareersFormValues = z.infer<typeof careersFormSchema>;

const CAREERS_RESUME_BUCKET = import.meta.env.VITE_CAREERS_RESUME_BUCKET || "career-resumes";

const sanitizeFileBaseName = (fileName: string) =>
  fileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const Careers = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  const form = useForm<CareersFormValues>({
    resolver: zodResolver(careersFormSchema),
    defaultValues: {
      fullName: "",
      emailAddress: "",
      phoneNumber: "",
      location: "",
      roleApplyingFor: "",
      availabilityToStart: "",
      workAuthorization: "",
      linkedInProfileUrl: "",
      yearsOfRelevantExperience: "",
      githubProfileUrl: "",
      portfolioUrl: "",
      writingSamplesUrl: "",
      crmToolsUsed: "",
      whyRealtorDeskNow: "",
      limitedGuidanceStory: "",
      canadaMarketView: "",
      referredBy: "",
      additionalContext: "",
      pipedaConsent: false,
    },
  });

  const selectedRoleId = form.watch("roleApplyingFor");

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId),
    [selectedRoleId],
  );

  const selectedRoleCategory = selectedRole?.category;

  const isEngineering = selectedRoleCategory === "engineering";
  const isMarketing = selectedRoleCategory === "marketing";
  const isSalesCs = selectedRoleCategory === "sales-cs";

  const onApplyNow = (roleId: string) => {
    form.setValue("roleApplyingFor", roleId, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    const formSection = document.getElementById("careers-application-form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const onSubmit = async (values: CareersFormValues) => {
    setIsSubmitting(true);

    try {
      const resume = values.resumeFile[0];
      const selected = roles.find((role) => role.id === values.roleApplyingFor);

      const fileExtension = resume.name.split(".").pop()?.toLowerCase() || "pdf";
      const normalizedBaseName = sanitizeFileBaseName(resume.name) || "resume";
      const objectPath = `applications/${new Date().getFullYear()}/${values.roleApplyingFor}/${Date.now()}-${crypto.randomUUID()}-${normalizedBaseName}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from(CAREERS_RESUME_BUCKET)
        .upload(objectPath, resume, {
          cacheControl: "3600",
          upsert: false,
          contentType: resume.type || undefined,
        });

      if (uploadError) {
        throw new Error(`Resume upload failed: ${uploadError.message}`);
      }

      const summary = [
        `Application Type: Careers`,
        `Role: ${selected?.title ?? values.roleApplyingFor}`,
        `Availability: ${values.availabilityToStart}`,
        `Work Authorization: ${values.workAuthorization}`,
        `Location: ${values.location}`,
        `Experience: ${values.yearsOfRelevantExperience}`,
        `LinkedIn: ${values.linkedInProfileUrl}`,
        `GitHub: ${values.githubProfileUrl || "N/A"}`,
        `Portfolio: ${values.portfolioUrl || "N/A"}`,
        `Writing Samples: ${values.writingSamplesUrl || "N/A"}`,
        `CRM/Sales Tools: ${values.crmToolsUsed || "N/A"}`,
        `Resume Filename: ${resume?.name || "N/A"}`,
        `Resume Size: ${resume?.size || 0}`,
        `Resume Bucket: ${CAREERS_RESUME_BUCKET}`,
        `Resume Path: ${objectPath}`,
        "",
        `Q1 Why RealtorDesk.ai now:\n${values.whyRealtorDeskNow}`,
        "",
        `Q2 Limited guidance example:\n${values.limitedGuidanceStory}`,
        "",
        `Q3 Canadian market perspective:\n${values.canadaMarketView}`,
        "",
        `Referred By: ${values.referredBy || "N/A"}`,
        `Additional Context:\n${values.additionalContext || "N/A"}`,
      ].join("\n");

      const { error } = await supabase.from("contact_submissions").insert([
        {
          name: values.fullName,
          email: values.emailAddress,
          phone: values.phoneNumber,
          message: summary,
          status: "career_application",
        },
      ]);

      if (error) {
        await supabase.storage.from(CAREERS_RESUME_BUCKET).remove([objectPath]);
        throw error;
      }

      toast({
        title: "Application submitted",
        description: "Thanks for applying. Our team will review your application and reach out soon.",
      });

      form.reset();
      setFileInputKey((prev) => prev + 1);
    } catch (error) {
      toast({
        title: "Could not submit application",
        description: "Please try again in a moment or email careers@realtordesk.ai.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const engineeringRoles = roles.filter((role) => role.category === "engineering");
  const customerGrowthRoles = roles.filter((role) => role.category === "sales-cs" || role.category === "marketing");
  const operationsRoles = roles.filter((role) => role.category === "operations");

  return (
    <div className="min-h-screen">
      <SEO
        title="Careers | RealtorDesk AI"
        description="Build the future of Canadian real estate with RealtorDesk.ai. Explore open roles and apply through our unified careers application form."
        keywords="RealtorDesk careers, Canadian real estate SaaS jobs, AI startup jobs Canada, proptech careers"
      />
      <Navbar />

      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <h1 className="mb-6 animate-fade-in-up">
            Build the Future of <span className="gradient-text">Canadian Real Estate</span> with Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            RealtorDesk.ai helps agents close more deals with less manual work. Join a lean, high-ownership team shipping AI products built for the Canadian market.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <h3 className="font-bold mb-2">Remote-first</h3>
              <p className="text-sm text-muted-foreground">Work from anywhere in Canada or North America with async-friendly collaboration.</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-2">Bias to action</h3>
              <p className="text-sm text-muted-foreground">Own outcomes, move quickly, and make practical decisions with imperfect information.</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-2">Canada-focused</h3>
              <p className="text-sm text-muted-foreground">Solve real workflows for Canadian agents with local compliance and market context.</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-2">Real impact</h3>
              <p className="text-sm text-muted-foreground">Your work ships fast and directly affects retention, revenue, and customer success.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="max-w-4xl mb-8">
            <h2 className="mb-3">Hiring Now — Priority Roles</h2>
            <p className="text-muted-foreground">
              These 4 roles are critical hires that directly unblock product velocity, retention, and growth.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {priorityRoles.map((priority) => {
              const role = roles.find((item) => item.id === priority.roleId);
              if (!role) {
                return null;
              }
              return (
                <Card key={priority.roleId} className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="destructive">Hiring Now</Badge>
                    <Badge variant="secondary">{categoryLabels[role.category]}</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{role.title}</h3>
                  <p className="text-sm text-muted-foreground mb-5">{priority.why}</p>
                  <Button onClick={() => onApplyNow(role.id)} className="btn-gradient">
                    Apply Now
                  </Button>
                </Card>
              );
            })}
          </div>

          <Card className="p-6 mt-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Optional 5th hire:</span> If the founder is stretched thin on product decisions, a part-time <span className="font-semibold text-foreground">Product Manager / Founding PM</span> who can own roadmap execution and cross-functional coordination would be a high-leverage addition.
            </p>
          </Card>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="mb-8">All Roles</h2>

          <div className="space-y-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-2">Product & Engineering</h3>
              <Accordion type="single" collapsible>
                {engineeringRoles.map((role) => (
                  <AccordionItem key={role.id} value={role.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex flex-wrap items-center gap-2 pr-4">
                        <span>{role.title}</span>
                        {role.hiringNow && <Badge variant="destructive">Hiring Now</Badge>}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground mb-4">{role.mission}</p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Responsibilities</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {role.responsibilities.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Qualifications</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {role.qualifications.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-2">Customer & Growth</h3>
              <Accordion type="single" collapsible>
                {customerGrowthRoles.map((role) => (
                  <AccordionItem key={role.id} value={role.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex flex-wrap items-center gap-2 pr-4">
                        <span>{role.title}</span>
                        {role.hiringNow && <Badge variant="destructive">Hiring Now</Badge>}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground mb-4">{role.mission}</p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Responsibilities</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {role.responsibilities.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Qualifications</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {role.qualifications.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-2">Operations & Strategy</h3>
              <Accordion type="single" collapsible>
                {operationsRoles.map((role) => (
                  <AccordionItem key={role.id} value={role.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex flex-wrap items-center gap-2 pr-4">
                        <span>{role.title}</span>
                        {role.hiringNow && <Badge variant="destructive">Hiring Now</Badge>}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground mb-4">{role.mission}</p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Responsibilities</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {role.responsibilities.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Qualifications</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {role.qualifications.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>
        </div>
      </section>

      <section id="careers-application-form" className="section-padding bg-muted">
        <div className="container-custom max-w-5xl">
          <h2 className="mb-2">Application Form</h2>
          <p className="text-muted-foreground mb-8">
            Submit one application for any role. Role-specific fields appear automatically based on your selection.
          </p>

          <Card className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Core Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name as it appears professionally" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="We'll use this to reach you" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Including area code (Canada/US preferred)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location (City, Province) *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Toronto, ON" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="roleApplyingFor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role Applying For *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select the role that best matches your background" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="availabilityToStart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Availability to Start *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select one" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Immediately">Immediately</SelectItem>
                              <SelectItem value="2 weeks">2 weeks</SelectItem>
                              <SelectItem value="1 month">1 month</SelectItem>
                              <SelectItem value="2+ months">2+ months</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="workAuthorization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Work Authorization *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select one" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Canadian Citizen">Canadian Citizen</SelectItem>
                                <SelectItem value="PR">PR</SelectItem>
                                <SelectItem value="Valid Work Permit">Valid Work Permit</SelectItem>
                                <SelectItem value="US-based (open to consideration)">US-based (open to consideration)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Professional Background</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="resumeFile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resume / CV Upload *</FormLabel>
                          <FormControl>
                            <Input
                              key={fileInputKey}
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(event) => field.onChange(event.target.files)}
                            />
                          </FormControl>
                          <FormDescription>Max 5MB. PDF preferred.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="linkedInProfileUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn Profile URL *</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="Your up-to-date LinkedIn profile" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="yearsOfRelevantExperience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of Relevant Experience *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select experience range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Under 1 yr">Under 1 yr</SelectItem>
                                <SelectItem value="1–2 yrs">1–2 yrs</SelectItem>
                                <SelectItem value="3–5 yrs">3–5 yrs</SelectItem>
                                <SelectItem value="5–10 yrs">5–10 yrs</SelectItem>
                                <SelectItem value="10+ yrs">10+ yrs</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {selectedRoleCategory && roleCategoryForLinks[selectedRoleCategory].length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Role-Specific Links (Optional)</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {isEngineering && (
                        <FormField
                          control={form.control}
                          name="githubProfileUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GitHub Profile URL</FormLabel>
                              <FormControl>
                                <Input type="url" placeholder="Link to your GitHub or GitLab" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {(isEngineering || isMarketing) && (
                        <FormField
                          control={form.control}
                          name="portfolioUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Portfolio / Personal Site</FormLabel>
                              <FormControl>
                                <Input type="url" placeholder="Personal site, portfolio, or work samples" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {isMarketing && (
                        <FormField
                          control={form.control}
                          name="writingSamplesUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Writing Samples URL</FormLabel>
                              <FormControl>
                                <Input type="url" placeholder="Published articles, posts, or portfolio" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {isSalesCs && (
                        <FormField
                          control={form.control}
                          name="crmToolsUsed"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CRM / Sales Tools Used</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., HubSpot, Salesforce, Follow Up Boss" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-4">Fit Questions (Required, 150 words max each)</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="whyRealtorDeskNow"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Why RealtorDesk.ai — and why now?
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Tell us what drew you to this role and why an early-stage, Canadian real estate SaaS company excites you now."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="limitedGuidanceStory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Tell us about a time you had to figure something out with limited guidance or resources.
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Walk us through the situation, what you did, and what happened."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="canadaMarketView"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            What do you know about the Canadian real estate market, and what do you think agents struggle with most?
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Share your perspective on Canadian market dynamics and agent pain points."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Final Details</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="referredBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Referred By</FormLabel>
                          <FormControl>
                            <Input placeholder="Were you referred by someone in our network?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="additionalContext"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anything else you'd like us to know?</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Add context your resume doesn’t capture — side projects, non-linear paths, motivations, and more."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="pipedaConsent"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                          />
                        </FormControl>
                        <div>
                          <FormLabel>
                            I consent to store my application data in accordance with PIPEDA. *
                          </FormLabel>
                          <FormDescription>
                            We store your application information securely and use it only for hiring purposes.
                          </FormDescription>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="btn-gradient w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting Application..." : "Submit Application"}
                </Button>
              </form>
            </Form>
          </Card>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-secondary/5">
            <h2 className="mb-3">Don't see your role?</h2>
            <p className="text-muted-foreground mb-6">
              Send us a short note and tell us how you can help us build RealtorDesk.ai.
            </p>
            <a href="mailto:careers@realtordesk.ai">
              <Button size="lg" className="btn-gradient">careers@realtordesk.ai</Button>
            </a>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;