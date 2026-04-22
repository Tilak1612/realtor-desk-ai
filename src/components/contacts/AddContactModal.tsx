import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation, type TFunction } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/utils/analytics";

// Schema factory so validation messages track the active i18n locale.
// react-hook-form + zod runs validation synchronously, so we rebuild the
// schema via useMemo whenever the translation function identity changes.
const makeFormSchema = (t: TFunction) =>
  z.object({
    first_name: z
      .string()
      .min(1, t("app.modals.addContact.validation.firstNameRequired", "First name is required"))
      .max(100),
    last_name: z
      .string()
      .min(1, t("app.modals.addContact.validation.lastNameRequired", "Last name is required"))
      .max(100),
    email: z
      .string()
      .email(t("app.modals.addContact.validation.invalidEmail", "Please enter a valid email address"))
      .optional()
      .or(z.literal("")),
    phone: z.string().optional(),
    source: z.string().optional(),
    tags: z.string().optional(),
    notes: z.string().optional(),
    preferred_language: z.string().optional(),
    consent_given: z.boolean().default(false),
    consent_source: z.string().optional(),
  });

type FormSchema = ReturnType<typeof makeFormSchema>;
type FormValues = z.infer<FormSchema>;

interface AddContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddContactModal = ({ open, onOpenChange, onSuccess }: AddContactModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const formSchema = useMemo(() => makeFormSchema(t), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      source: "",
      tags: "",
      notes: "",
      preferred_language: "en",
      consent_given: false,
      consent_source: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: t("app.modals.addContact.notAuthenticated"),
          description: t("app.modals.addContact.pleaseLogin"),
          variant: "destructive",
        });
        return;
      }

      const tags = values.tags
        ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const { data: contactData, error } = await supabase.from("contacts").insert({
        user_id: session.user.id,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email || null,
        phone: values.phone || null,
        source: values.source || null,
        tags,
        preferred_language: values.preferred_language,
        consent_given: values.consent_given,
        consent_date: values.consent_given ? new Date().toISOString() : null,
        consent_source: values.consent_source || values.source || 'manual_entry',
      }).select('id').single();

      if (error) throw error;

      trackEvent('contact_created', { source: values.source || 'manual_entry' });

      // If notes were provided, save them to contact_notes table
      if (values.notes && values.notes.trim() && contactData) {
        await supabase.from("contact_notes").insert({
          user_id: session.user.id,
          contact_id: contactData.id,
          content: values.notes.trim(),
        });
      }

      toast({
        title: t("app.modals.addContact.success"),
        description: `${values.first_name} ${values.last_name} ${t("app.modals.addContact.contactAdded")}`,
      });

      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: t("app.modals.addContact.errorAdding"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("app.modals.addContact.title")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("app.modals.addContact.firstName")} *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("app.modals.addContact.lastName")} *</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("app.modals.addContact.email")}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("app.modals.addContact.phone")}</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("app.modals.addContact.source")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("app.modals.addContact.selectSource")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Website">{t("app.modals.addContact.sources.website")}</SelectItem>
                      <SelectItem value="Referral">{t("app.modals.addContact.sources.referral")}</SelectItem>
                      <SelectItem value="Open House">{t("app.modals.addContact.sources.openHouse")}</SelectItem>
                      <SelectItem value="Zillow">{t("app.modals.addContact.sources.zillow")}</SelectItem>
                      <SelectItem value="Realtor.com">{t("app.modals.addContact.sources.realtorCom")}</SelectItem>
                      <SelectItem value="Social Media">{t("app.modals.addContact.sources.socialMedia")}</SelectItem>
                      <SelectItem value="Import">{t("app.modals.addContact.sources.import")}</SelectItem>
                      <SelectItem value="Other">{t("app.modals.addContact.sources.other")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("app.modals.addContact.tags")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("app.modals.addContact.tagsPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("app.modals.addContact.notes")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("app.modals.addContact.notesPlaceholder")}
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 text-sm">{t("app.modals.addContact.caslTitle")}</h3>
              
              <FormField
                control={form.control}
                name="preferred_language"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>{t("app.modals.addContact.preferredLanguage")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("app.modals.addContact.selectLanguage")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en">{t("app.modals.addContact.english")}</SelectItem>
                        <SelectItem value="fr">{t("app.modals.addContact.french")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consent_given"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {t("app.modals.addContact.consentLabel")}
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        {t("app.modals.addContact.consentDescription")}
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                {t("app.modals.addContact.cancel")}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? t("app.modals.addContact.adding") : t("app.modals.addContact.addContact")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactModal;