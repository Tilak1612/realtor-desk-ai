import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Contact } from "@/types/contact";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(100),
  last_name: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  source: z.string().optional(),
  tags: z.string().optional(),
  best_contact_time: z.string().optional(),
});

interface EditContactModalProps {
  contact: Contact;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditContactModal = ({ contact, open, onOpenChange, onSuccess }: EditContactModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      first_name: contact?.first_name || "",
      last_name: contact?.last_name || "",
      email: contact?.email || "",
      phone: contact?.phone || "",
      source: contact?.source || "",
      tags: contact?.tags?.join(", ") || "",
      best_contact_time: contact?.best_contact_time || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const tags = values.tags ? values.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
      const { error } = await supabase.from("contacts").update({
        first_name: values.first_name, last_name: values.last_name, email: values.email || null,
        phone: values.phone || null, source: values.source || null, tags, best_contact_time: values.best_contact_time || null,
      }).eq("id", contact.id);
      if (error) throw error;
      toast({ title: "Contact updated successfully" });
      onOpenChange(false);
      onSuccess();
    } catch (error: unknown) {
      const err = error as Error;
      toast({ title: "Error updating contact", description: err.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Contact</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="first_name" render={({ field }) => (<FormItem><FormLabel>First Name *</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="last_name" render={({ field }) => (<FormItem><FormLabel>Last Name *</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+1 (555) 123-4567" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="source" render={({ field }) => (
              <FormItem><FormLabel>Source</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Website">Website</SelectItem><SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Open House">Open House</SelectItem><SelectItem value="Zillow">Zillow</SelectItem>
                    <SelectItem value="Realtor.com">Realtor.com</SelectItem><SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Import">Import</SelectItem><SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select><FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tags" render={({ field }) => (<FormItem><FormLabel>Tags</FormLabel><FormControl><Input placeholder="First-time buyer, Pre-approved (comma separated)" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="best_contact_time" render={({ field }) => (<FormItem><FormLabel>Best Time to Contact</FormLabel><FormControl><Input placeholder="Weekdays 10 AM - 12 PM" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactModal;
