import { supabase } from "@/integrations/supabase/client";

export type EmailCampaignType = "welcome" | "nurture" | "follow_up" | "property_alert";

export interface EmailCampaign {
  contactId: string;
  type: EmailCampaignType;
  delay?: number; // Days to delay
}

export async function sendEmailCampaign(campaign: EmailCampaign) {
  try {
    const { data, error } = await supabase.functions.invoke("email-automation", {
      body: campaign,
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error: unknown) {
    throw new Error(error.message || "Failed to send email campaign");
  }
}

export async function scheduleEmailCampaign(campaign: EmailCampaign & { delay: number }) {
  return sendEmailCampaign(campaign);
}
