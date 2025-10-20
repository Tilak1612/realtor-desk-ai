import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadScoreFactors {
  engagement: number; // 0-30
  recency: number; // 0-20
  propertyMatch: number; // 0-25
  demographics: number; // 0-15
  communication: number; // 0-10
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contactId } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get contact details
    const { data: contact, error: contactError } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", contactId)
      .single();

    if (contactError || !contact) {
      throw new Error("Contact not found");
    }

    // Calculate lead score factors
    const factors: LeadScoreFactors = {
      engagement: 0,
      recency: 0,
      propertyMatch: 0,
      demographics: 0,
      communication: 0,
    };

    // 1. Engagement Score (0-30 points)
    const tags = contact.tags || [];
    if (tags.includes("hot")) factors.engagement += 20;
    else if (tags.includes("warm")) factors.engagement += 10;
    else if (tags.includes("cold")) factors.engagement += 5;

    // Add points for website visits, email opens, etc.
    if (contact.last_activity) {
      const daysSinceActivity = Math.floor(
        (Date.now() - new Date(contact.last_activity).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceActivity < 7) factors.engagement += 10;
      else if (daysSinceActivity < 30) factors.engagement += 5;
    }

    // 2. Recency Score (0-20 points)
    if (contact.created_at) {
      const daysSinceCreated = Math.floor(
        (Date.now() - new Date(contact.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceCreated < 7) factors.recency = 20;
      else if (daysSinceCreated < 30) factors.recency = 15;
      else if (daysSinceCreated < 90) factors.recency = 10;
      else factors.recency = 5;
    }

    // 3. Property Match Score (0-25 points)
    if (tags.includes("buyer")) factors.propertyMatch += 15;
    if (tags.includes("seller")) factors.propertyMatch += 10;
    if (contact.notes && contact.notes.toLowerCase().includes("budget")) {
      factors.propertyMatch += 10;
    }

    // 4. Demographics Score (0-15 points)
    if (contact.email && contact.email.includes("@")) factors.demographics += 5;
    if (contact.phone) factors.demographics += 5;
    if (contact.source === "referral") factors.demographics += 5;

    // 5. Communication Score (0-10 points)
    if (contact.best_contact_time) factors.communication += 5;
    if (contact.notes) factors.communication += 5;

    // Calculate total score
    const totalScore = Math.min(
      100,
      factors.engagement +
        factors.recency +
        factors.propertyMatch +
        factors.demographics +
        factors.communication
    );

    // Determine lead quality
    let quality: "hot" | "warm" | "cold";
    if (totalScore >= 70) quality = "hot";
    else if (totalScore >= 40) quality = "warm";
    else quality = "cold";

    // Generate insights
    const insights = [];
    if (factors.engagement > 15) {
      insights.push("High engagement - contact is actively interested");
    }
    if (factors.recency > 15) {
      insights.push("New lead - strike while the iron is hot");
    }
    if (factors.propertyMatch > 15) {
      insights.push("Strong property match - send listings immediately");
    }
    if (factors.demographics < 5) {
      insights.push("Missing contact information - update profile");
    }
    if (factors.communication < 5) {
      insights.push("Low communication preferences - schedule a call");
    }

    // Generate recommended actions
    const actions = [];
    if (quality === "hot") {
      actions.push("Schedule immediate follow-up call");
      actions.push("Send personalized property recommendations");
      actions.push("Offer exclusive showing slots");
    } else if (quality === "warm") {
      actions.push("Send market update email");
      actions.push("Share relevant blog content");
      actions.push("Schedule follow-up in 3-5 days");
    } else {
      actions.push("Add to nurture campaign");
      actions.push("Send educational content");
      actions.push("Check in monthly");
    }

    // Save lead score to database
    await supabase.from("lead_scores").upsert({
      contact_id: contactId,
      score: totalScore,
      quality,
      engagement_score: factors.engagement,
      recency_score: factors.recency,
      property_match_score: factors.propertyMatch,
      demographics_score: factors.demographics,
      communication_score: factors.communication,
      calculated_at: new Date().toISOString(),
    });

    // Update contact with AI score
    await supabase
      .from("contacts")
      .update({ ai_score: totalScore })
      .eq("id", contactId);

    return new Response(
      JSON.stringify({
        success: true,
        score: totalScore,
        quality,
        factors,
        insights,
        actions,
        confidence: totalScore > 50 ? "high" : totalScore > 30 ? "medium" : "low",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in lead-score-calculator function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
