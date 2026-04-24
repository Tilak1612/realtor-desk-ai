import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { getCareersContent, type RoleCategory } from "@/data/careersContent";
import { normalizeLocale } from "@/lib/i18n/format";

// /careers — bilingual job listings + application form.
//
// Role content lives in src/data/careersContent.ts (EN + FR, keyed by
// locale). Page chrome + form labels + validation messages live under
// the careersPage.* namespace in src/i18n/config.ts. Component picks
// content via getCareersContent(normalizeLocale(i18n.language)).

const roleCategoryForLinks: Record<RoleCategory, readonly string[]> = {
  engineering: ["githubProfileUrl", "portfolioUrl"],
  marketing: ["portfolioUrl", "writingSamplesUrl"],
  "sales-cs": ["crmToolsUsed"],
  operations: [],
} as const;

const CAREERS_RESUME_BUCKET = import.meta.env.VITE_CAREERS_RESUME_BUCKET || "career-resumes";

const sanitizeFileBaseName = (fileName: string) =>
  fileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const maxWords = (value: string) => value.trim().split(/\s+/).filter(Boolean).length <= 150;

const Careers = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  const locale = normalizeLocale(i18n.language);
  const content = useMemo(() => getCareersContent(locale), [locale]);
  const roles = content.roles;
  const priorityRoles = content.priorityRoles;

  // Zod schema moved inside the component so validation messages can
  // flow through t() and swap on locale change. Rebuilt when t changes.
  const careersFormSchema = useMemo(() => {
    const optionalUrl = z.union([z.literal(""), z.string().trim().url(t("careersPage.errUrlInvalid"))]);
    return z.object({
      fullName: z
        .string()
        .trim()
        .min(2, t("careersPage.errFullNameReq"))
        .max(120, t("careersPage.errFullNameMax")),
      emailAddress: z.string().trim().email(t("careersPage.errEmail")),
      phoneNumber: z
        .string()
        .trim()
        .regex(/^[0-9\s()+-]{10,20}$/, t("careersPage.errPhone")),
      location: z
        .string()
        .trim()
        .min(2, t("careersPage.errLocationReq"))
        .max(120, t("careersPage.errLocationMax")),
      roleApplyingFor: z.string().min(1, t("careersPage.errRoleReq")),
      availabilityToStart: z.string().min(1, t("careersPage.errAvailabilityReq")),
      workAuthorization: z.string().min(1, t("careersPage.errWorkAuthReq")),
      resumeFile: z
        .custom<FileList>(
          (value) => value instanceof FileList && value.length > 0,
          t("careersPage.errResumeReq"),
        )
        .refine((files) => files[0]?.size <= 5 * 1024 * 1024, t("careersPage.errResumeSize"))
        .refine(
          (files) => {
            const file = files[0];
            if (!file) return false;
            const allowedMimeTypes = [
              "application/pdf",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "application/msword",
            ];
            const hasValidMime = allowedMimeTypes.includes(file.type);
            const hasValidExtension = /\.(pdf|doc|docx)$/i.test(file.name);
            return hasValidMime || hasValidExtension;
          },
          t("careersPage.errResumeType"),
        ),
      linkedInProfileUrl: z.string().trim().url(t("careersPage.errLinkedInReq")),
      yearsOfRelevantExperience: z.string().min(1, t("careersPage.errExperienceReq")),
      githubProfileUrl: optionalUrl,
      portfolioUrl: optionalUrl,
      writingSamplesUrl: optionalUrl,
      crmToolsUsed: z
        .string()
        .trim()
        .max(250, t("careersPage.errCrmMax"))
        .optional()
        .or(z.literal("")),
      whyRealtorDeskNow: z
        .string()
        .trim()
        .min(20, t("careersPage.errAnswerMin"))
        .refine(maxWords, t("careersPage.errAnswerWords")),
      limitedGuidanceStory: z
        .string()
        .trim()
        .min(20, t("careersPage.errAnswerMin"))
        .refine(maxWords, t("careersPage.errAnswerWords")),
      canadaMarketView: z
        .string()
        .trim()
        .min(20, t("careersPage.errAnswerMin"))
        .refine(maxWords, t("careersPage.errAnswerWords")),
      referredBy: z
        .string()
        .trim()
        .max(120, t("careersPage.errReferredByMax"))
        .optional()
        .or(z.literal("")),
      additionalContext: z
        .string()
        .trim()
        .max(2000, t("careersPage.errAdditionalMax"))
        .optional()
        .or(z.literal("")),
      pipedaConsent: z.boolean().refine((value) => value === true, {
        message: t("careersPage.errConsentReq"),
      }),
    });
  }, [t]);

  type CareersFormValues = z.infer<typeof careersFormSchema>;

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
    [roles, selectedRoleId],
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
        `Locale: ${locale}`,
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
        `Q1 Why Realtor Desk now:\n${values.whyRealtorDeskNow}`,
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
        title: t("careersPage.submitBtn"),
        description: locale === "fr-CA"
          ? "Merci pour votre candidature. Notre équipe l'examinera et reviendra vers vous sous peu."
          : "Thanks for applying. Our team will review your application and reach out soon.",
      });

      form.reset();
      setFileInputKey((prev) => prev + 1);
    } catch (_error) {
      toast({
        title: locale === "fr-CA" ? "Impossible de soumettre la candidature" : "Could not submit application",
        description: locale === "fr-CA"
          ? "Veuillez réessayer dans un instant ou écrire à careers@realtordesk.ai."
          : "Please try again in a moment or email careers@realtordesk.ai.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryLabels: Record<RoleCategory, string> = {
    engineering: t("careersPage.catEngineering"),
    "sales-cs": t("careersPage.catCustomerGrowth"),
    marketing: t("careersPage.catCustomerGrowth"),
    operations: t("careersPage.catOperations"),
  };

  const engineeringRoles = roles.filter((role) => role.category === "engineering");
  const customerGrowthRoles = roles.filter(
    (role) => role.category === "sales-cs" || role.category === "marketing",
  );
  const operationsRoles = roles.filter((role) => role.category === "operations");

  return (
    <div className="min-h-screen">
      <SEO
        title={t("pageSeo.careersTitle")}
        description={t("pageSeo.careersDesc")}
        keywords="RealtorDesk careers, Canadian real estate SaaS jobs, AI startup jobs Canada, proptech careers"
      />
      <Navbar />

      <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center">
          <h1 className="mb-6 animate-fade-in-up">
            {t("careersPage.heroH1Pre")} <span className="gradient-text">{t("careersPage.heroH1Gradient")}</span> {t("careersPage.heroH1Post")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            {t("careersPage.heroSubtitle")}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <h3 className="font-bold mb-2">{t("careersPage.valueRemoteTitle")}</h3>
              <p className="text-sm text-muted-foreground">{t("careersPage.valueRemoteBody")}</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-2">{t("careersPage.valueActionTitle")}</h3>
              <p className="text-sm text-muted-foreground">{t("careersPage.valueActionBody")}</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-2">{t("careersPage.valueCanadaTitle")}</h3>
              <p className="text-sm text-muted-foreground">{t("careersPage.valueCanadaBody")}</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-2">{t("careersPage.valueImpactTitle")}</h3>
              <p className="text-sm text-muted-foreground">{t("careersPage.valueImpactBody")}</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="max-w-4xl mb-8">
            <h2 className="mb-3">{t("careersPage.prioritySectionTitle")}</h2>
            <p className="text-muted-foreground">{t("careersPage.prioritySectionBody")}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {priorityRoles.map((priority) => {
              const role = roles.find((item) => item.id === priority.roleId);
              if (!role) return null;
              return (
                <Card key={priority.roleId} className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="destructive">{t("careersPage.priorityBadge")}</Badge>
                    <Badge variant="secondary">{categoryLabels[role.category]}</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{role.title}</h3>
                  <p className="text-sm text-muted-foreground mb-5">{priority.why}</p>
                  <Button onClick={() => onApplyNow(role.id)} className="btn-gradient">
                    {t("careersPage.priorityApplyCta")}
                  </Button>
                </Card>
              );
            })}
          </div>

          <Card className="p-6 mt-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {t("careersPage.priorityOptionalFifth")}
              </span>{" "}
              {t("careersPage.priorityOptionalBody")}
            </p>
          </Card>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="mb-8">{t("careersPage.allRolesTitle")}</h2>

          <div className="space-y-8">
            <RoleCategoryCard
              title={t("careersPage.catEngineering")}
              roles={engineeringRoles}
              labels={{
                responsibilities: t("careersPage.accordionResponsibilities"),
                qualifications: t("careersPage.accordionQualifications"),
                hiringNow: t("careersPage.priorityBadge"),
              }}
            />
            <RoleCategoryCard
              title={t("careersPage.catCustomerGrowth")}
              roles={customerGrowthRoles}
              labels={{
                responsibilities: t("careersPage.accordionResponsibilities"),
                qualifications: t("careersPage.accordionQualifications"),
                hiringNow: t("careersPage.priorityBadge"),
              }}
            />
            <RoleCategoryCard
              title={t("careersPage.catOperations")}
              roles={operationsRoles}
              labels={{
                responsibilities: t("careersPage.accordionResponsibilities"),
                qualifications: t("careersPage.accordionQualifications"),
                hiringNow: t("careersPage.priorityBadge"),
              }}
            />
          </div>
        </div>
      </section>

      <section id="careers-application-form" className="section-padding bg-muted">
        <div className="container-custom max-w-5xl">
          <h2 className="mb-2">{t("careersPage.applicationSectionTitle")}</h2>
          <p className="text-muted-foreground mb-8">{t("careersPage.applicationSectionBody")}</p>

          <Card className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t("careersPage.sectionCoreInfo")}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("careersPage.fieldFullName")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("careersPage.fieldFullNamePh")} {...field} />
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
                          <FormLabel>{t("careersPage.fieldEmail")}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder={t("careersPage.fieldEmailPh")} {...field} />
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
                          <FormLabel>{t("careersPage.fieldPhone")}</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder={t("careersPage.fieldPhonePh")} {...field} />
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
                          <FormLabel>{t("careersPage.fieldLocation")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("careersPage.fieldLocationPh")} {...field} />
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
                          <FormLabel>{t("careersPage.fieldRole")}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("careersPage.fieldRolePh")} />
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
                          <FormLabel>{t("careersPage.fieldAvailability")}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("careersPage.fieldAvailabilityPh")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Immediately">{t("careersPage.availImmediately")}</SelectItem>
                              <SelectItem value="2 weeks">{t("careersPage.avail2Weeks")}</SelectItem>
                              <SelectItem value="1 month">{t("careersPage.avail1Month")}</SelectItem>
                              <SelectItem value="2+ months">{t("careersPage.avail2PlusMonths")}</SelectItem>
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
                            <FormLabel>{t("careersPage.fieldWorkAuth")}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("careersPage.fieldWorkAuthPh")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Canadian Citizen">{t("careersPage.authCitizen")}</SelectItem>
                                <SelectItem value="PR">{t("careersPage.authPR")}</SelectItem>
                                <SelectItem value="Valid Work Permit">{t("careersPage.authWorkPermit")}</SelectItem>
                                <SelectItem value="US-based (open to consideration)">{t("careersPage.authUsBased")}</SelectItem>
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
                  <h3 className="text-lg font-semibold mb-4">{t("careersPage.sectionProfessionalBackground")}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="resumeFile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("careersPage.fieldResume")}</FormLabel>
                          <FormControl>
                            <Input
                              key={fileInputKey}
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(event) => field.onChange(event.target.files)}
                            />
                          </FormControl>
                          <FormDescription>{t("careersPage.fieldResumeHelp")}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="linkedInProfileUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("careersPage.fieldLinkedIn")}</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder={t("careersPage.fieldLinkedInPh")} {...field} />
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
                            <FormLabel>{t("careersPage.fieldExperience")}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("careersPage.fieldExperiencePh")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Under 1 yr">{t("careersPage.expUnder1")}</SelectItem>
                                <SelectItem value="1–2 yrs">{t("careersPage.exp1to2")}</SelectItem>
                                <SelectItem value="3–5 yrs">{t("careersPage.exp3to5")}</SelectItem>
                                <SelectItem value="5–10 yrs">{t("careersPage.exp5to10")}</SelectItem>
                                <SelectItem value="10+ yrs">{t("careersPage.exp10plus")}</SelectItem>
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
                    <h3 className="text-lg font-semibold mb-4">{t("careersPage.sectionRoleSpecific")}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {isEngineering && (
                        <FormField
                          control={form.control}
                          name="githubProfileUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("careersPage.fieldGithub")}</FormLabel>
                              <FormControl>
                                <Input type="url" placeholder={t("careersPage.fieldGithubPh")} {...field} />
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
                              <FormLabel>{t("careersPage.fieldPortfolio")}</FormLabel>
                              <FormControl>
                                <Input type="url" placeholder={t("careersPage.fieldPortfolioPh")} {...field} />
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
                              <FormLabel>{t("careersPage.fieldWriting")}</FormLabel>
                              <FormControl>
                                <Input type="url" placeholder={t("careersPage.fieldWritingPh")} {...field} />
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
                              <FormLabel>{t("careersPage.fieldCrmTools")}</FormLabel>
                              <FormControl>
                                <Input placeholder={t("careersPage.fieldCrmToolsPh")} {...field} />
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
                  <h3 className="text-lg font-semibold mb-4">{t("careersPage.sectionFitQuestions")}</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="whyRealtorDeskNow"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("careersPage.fieldWhyNow")}</FormLabel>
                          <FormControl>
                            <Textarea rows={4} placeholder={t("careersPage.fieldWhyNowPh")} {...field} />
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
                          <FormLabel>{t("careersPage.fieldLimitedGuidance")}</FormLabel>
                          <FormControl>
                            <Textarea rows={4} placeholder={t("careersPage.fieldLimitedGuidancePh")} {...field} />
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
                          <FormLabel>{t("careersPage.fieldCanadaView")}</FormLabel>
                          <FormControl>
                            <Textarea rows={4} placeholder={t("careersPage.fieldCanadaViewPh")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">{t("careersPage.sectionFinalDetails")}</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="referredBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("careersPage.fieldReferredBy")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("careersPage.fieldReferredByPh")} {...field} />
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
                          <FormLabel>{t("careersPage.fieldAdditional")}</FormLabel>
                          <FormControl>
                            <Textarea rows={4} placeholder={t("careersPage.fieldAdditionalPh")} {...field} />
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
                          <FormLabel>{t("careersPage.fieldPipedaConsent")}</FormLabel>
                          <FormDescription>{t("careersPage.fieldPipedaConsentHelp")}</FormDescription>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="btn-gradient w-full" disabled={isSubmitting}>
                  {isSubmitting ? t("careersPage.submittingBtn") : t("careersPage.submitBtn")}
                </Button>
              </form>
            </Form>
          </Card>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-secondary/5">
            <h2 className="mb-3">{t("careersPage.dontSeeRoleTitle")}</h2>
            <p className="text-muted-foreground mb-6">{t("careersPage.dontSeeRoleBody")}</p>
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

function RoleCategoryCard({
  title,
  roles,
  labels,
}: {
  title: string;
  roles: ReturnType<typeof getCareersContent>["roles"];
  labels: { responsibilities: string; qualifications: string; hiringNow: string };
}) {
  if (roles.length === 0) return null;
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <Accordion type="single" collapsible>
        {roles.map((role) => (
          <AccordionItem key={role.id} value={role.id}>
            <AccordionTrigger className="text-left">
              <div className="flex flex-wrap items-center gap-2 pr-4">
                <span>{role.title}</span>
                {role.hiringNow && <Badge variant="destructive">{labels.hiringNow}</Badge>}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground mb-4">{role.mission}</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">{labels.responsibilities}</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {role.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{labels.qualifications}</h4>
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
  );
}

export default Careers;
