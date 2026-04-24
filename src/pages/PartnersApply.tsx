import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// /partners/apply — public partner program application.
//
// Submits into the same contact_submissions table that /contact and
// /careers use, with status = 'affiliate_application'. Reviewed manually
// by the partner-program admin (no self-serve approval in v1). Zero
// new backend surface needed.

const maxWords = (n: number) => (value: string) =>
  value.trim().split(/\s+/).filter(Boolean).length <= n;

const PartnersApply = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        fullName: z.string().trim().min(2, t("partnersApply.errFullNameReq")),
        email: z.string().trim().email(t("partnersApply.errEmail")),
        company: z.string().trim().max(200).optional().or(z.literal("")),
        country: z.string().trim().min(2, t("partnersApply.errCountryReq")),
        website: z
          .string()
          .trim()
          .min(1, t("partnersApply.errWebsiteReq"))
          .url(t("partnersApply.errWebsiteInvalid")),
        audienceSize: z.string().optional().or(z.literal("")),
        promoteHow: z
          .string()
          .trim()
          .min(20, t("partnersApply.errPromoteMin"))
          .refine(maxWords(150), t("partnersApply.errPromoteMax")),
        audienceWhy: z
          .string()
          .trim()
          .min(20, t("partnersApply.errAudienceMin"))
          .refine(maxWords(150), t("partnersApply.errAudienceMax")),
        pipedaConsent: z
          .boolean()
          .refine((v) => v === true, { message: t("partnersApply.errPipedaConsent") }),
        termsConsent: z
          .boolean()
          .refine((v) => v === true, { message: t("partnersApply.errTermsConsent") }),
      }),
    [t],
  );

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      country: "",
      website: "",
      audienceSize: "",
      promoteHow: "",
      audienceWhy: "",
      pipedaConsent: false,
      termsConsent: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const summary = [
      `Application Type: Partner Program`,
      `Full Name: ${values.fullName}`,
      `Email: ${values.email}`,
      `Company: ${values.company || "N/A"}`,
      `Country: ${values.country}`,
      `Website / Social: ${values.website}`,
      `Audience Size: ${values.audienceSize || "N/A"}`,
      "",
      `Q1 How will you promote Realtor Desk:\n${values.promoteHow}`,
      "",
      `Q2 Why Realtor Desk fits your audience:\n${values.audienceWhy}`,
      "",
      `PIPEDA consent: yes`,
      `Program Terms accepted: yes`,
    ].join("\n");

    const { error } = await supabase.from("contact_submissions").insert([
      {
        name: values.fullName,
        email: values.email,
        phone: "",
        message: summary,
        status: "affiliate_application",
      },
    ]);

    if (error) {
      toast({
        title: t("partnersApply.errorHeading"),
        description: t("partnersApply.errorBody"),
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    form.reset();
  };

  return (
    <div className="min-h-screen">
      <SEO
        title={t("pageSeo.partnersApplyTitle")}
        description={t("pageSeo.partnersApplyDesc")}
        canonicalUrl="https://www.realtordesk.ai/partners/apply"
      />
      <Navbar />

      <section className="pt-32 md:pt-40 pb-16">
        <div className="container-custom max-w-3xl">
          {submitted ? (
            <Card className="p-8 md:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 text-3xl">
                ✓
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3">
                {t("partnersApply.successHeading")}
              </h1>
              <p className="text-muted-foreground mb-6">{t("partnersApply.successBody")}</p>
              <Link to="/partners">
                <Button className="btn-gradient">{t("partnersApply.successCta")}</Button>
              </Link>
            </Card>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  {t("partnersApply.pageHeading")}
                </h1>
                <p className="text-muted-foreground">{t("partnersApply.pageSubtitle")}</p>
              </div>

              <Card className="p-6 md:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* About you */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        {t("partnersApply.sectionAbout")}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("partnersApply.fieldFullName")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  name="fullName"
                                  autoComplete="name"
                                  placeholder={t("partnersApply.fieldFullNamePh")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("partnersApply.fieldEmail")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  name="email"
                                  autoComplete="email"
                                  placeholder={t("partnersApply.fieldEmailPh")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("partnersApply.fieldCompany")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  name="company"
                                  autoComplete="organization"
                                  placeholder={t("partnersApply.fieldCompanyPh")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("partnersApply.fieldCountry")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  name="country"
                                  autoComplete="country-name"
                                  placeholder={t("partnersApply.fieldCountryPh")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Audience */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        {t("partnersApply.sectionAudience")}
                      </h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("partnersApply.fieldWebsite")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="url"
                                  autoComplete="url"
                                  placeholder={t("partnersApply.fieldWebsitePh")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="audienceSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("partnersApply.fieldAudienceSize")}</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={t("partnersApply.fieldAudienceSizePh")}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="<1000">
                                    {t("partnersApply.audienceTier1")}
                                  </SelectItem>
                                  <SelectItem value="1000-10000">
                                    {t("partnersApply.audienceTier2")}
                                  </SelectItem>
                                  <SelectItem value="10000-50000">
                                    {t("partnersApply.audienceTier3")}
                                  </SelectItem>
                                  <SelectItem value="50000-250000">
                                    {t("partnersApply.audienceTier4")}
                                  </SelectItem>
                                  <SelectItem value="250000+">
                                    {t("partnersApply.audienceTier5")}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="promoteHow"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("partnersApply.fieldPromoteHow")}</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  rows={4}
                                  placeholder={t("partnersApply.fieldPromoteHowPh")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="audienceWhy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("partnersApply.fieldAudienceWhy")}</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  rows={4}
                                  placeholder={t("partnersApply.fieldAudienceWhyPh")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Consent */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        {t("partnersApply.sectionConsent")}
                      </h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="pipedaConsent"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-start gap-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) =>
                                      field.onChange(Boolean(checked))
                                    }
                                  />
                                </FormControl>
                                <div>
                                  <FormLabel>{t("partnersApply.fieldPipedaConsent")}</FormLabel>
                                  <FormDescription>
                                    {t("partnersApply.fieldPipedaConsentHelp")}
                                  </FormDescription>
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="termsConsent"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-start gap-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) =>
                                      field.onChange(Boolean(checked))
                                    }
                                  />
                                </FormControl>
                                <div>
                                  <FormLabel>
                                    {t("partnersApply.fieldTermsConsent")}{" "}
                                    <Link
                                      to="/partners/terms"
                                      className="text-primary underline"
                                    >
                                      /partners/terms
                                    </Link>
                                  </FormLabel>
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="btn-gradient w-full min-h-[48px]"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting
                        ? t("partnersApply.submittingBtn")
                        : t("partnersApply.submitBtn")}
                    </Button>
                  </form>
                </Form>
              </Card>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PartnersApply;
