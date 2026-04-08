import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidUUID = (id: string): boolean => UUID_REGEX.test(id);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Create client with anon key for auth verification
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
    
    if (userError || !userData.user) {
      console.error("Authentication failed:", userError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const userId = userData.user.id;
    console.log("Authenticated user:", userId);

    // Parse and validate input
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { contact_id } = body;

    if (!contact_id) {
      return new Response(
        JSON.stringify({ error: "contact_id is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate UUID format
    if (typeof contact_id !== "string" || !isValidUUID(contact_id)) {
      return new Response(
        JSON.stringify({ error: "Invalid contact_id format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Calculating lead score for contact:", contact_id);

    // Create service role client for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch contact data AND verify ownership
    const { data: contact, error: contactError } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", contact_id)
      .eq("user_id", userId)
      .single();

    if (contactError || !contact) {
      console.error("Contact not found or unauthorized:", contactError?.message);
      return new Response(
        JSON.stringify({ error: "Contact not found or unauthorized" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Contact ownership verified for user:", userId);

    // Fetch engagement stats
    const { data: engagementStats } = await supabase
      .from("engagement_stats")
      .select("*")
      .eq("contact_id", contact_id)
      .single();

    // If no stats exist, create default stats
    const stats = engagementStats || {
      emails_sent: 0,
      emails_opened: 0,
      emails_clicked: 0,
      emails_replied: 0,
      last_email_opened: null,
      website_visits: 0,
      properties_viewed: 0,
      documents_viewed: 0,
      avg_session_duration: 0,
    };

    // 1. ENGAGEMENT SCORE (30 points max)
    let engagementScore = 0;
    let engagementDetails = {
      openRate: 0,
      clickRate: 0,
      responseRate: 0,
      recentActivity: false,
    };

    if (stats.emails_sent > 0) {
      const openRate = stats.emails_opened / stats.emails_sent;
      const clickRate = stats.emails_clicked / stats.emails_sent;
      const responseRate = stats.emails_replied / stats.emails_sent;

      engagementScore += openRate * 10;
      engagementScore += clickRate * 10;
      engagementScore += responseRate * 10;

      engagementDetails = {
        openRate: Math.round(openRate * 100),
        clickRate: Math.round(clickRate * 100),
        responseRate: Math.round(responseRate * 100),
        recentActivity: false,
      };
    }

    // Bonus for recent activity
    if (stats.last_email_opened) {
      const daysSinceOpen = Math.floor(
        (Date.now() - new Date(stats.last_email_opened).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceOpen <= 7) {
        engagementScore += 5;
        engagementDetails.recentActivity = true;
      }
    }

    // 2. BEHAVIOR SCORE (30 points max)
    let behaviorScore = 0;

    // Website visits (max 10 points)
    const websiteScore = Math.min((stats.website_visits / 10) * 10, 10);
    behaviorScore += websiteScore;

    // Property views (max 10 points)
    const propertyScore = Math.min((stats.properties_viewed / 5) * 10, 10);
    behaviorScore += propertyScore;

    // Document views (max 5 points)
    const documentScore = Math.min((stats.documents_viewed / 3) * 5, 5);
    behaviorScore += documentScore;

    // Time on site bonus (5 points)
    if (stats.avg_session_duration > 180) {
      // 3 minutes in seconds
      behaviorScore += 5;
    }

    // 3. BUDGET MATCH SCORE (20 points max)
    // For now, use a default score. In production, this would check inventory
    let budgetMatchScore = 15; // Default to "5-9 properties available"
    
    // Check if contact has budget info in metadata
    if (contact.metadata?.budget_min && contact.metadata?.budget_max) {
      // Mock calculation - in production, query property inventory
      const budgetRange = contact.metadata.budget_max - contact.metadata.budget_min;
      if (budgetRange > 500000) {
        budgetMatchScore = 20;
      } else if (budgetRange > 200000) {
        budgetMatchScore = 15;
      } else {
        budgetMatchScore = 10;
      }
    }

    // 4. TIMELINE SCORE (15 points max)
    let timelineScore = 2; // Default: not specified
    const timeline = contact.metadata?.timeline || "not_specified";

    switch (timeline) {
      case "0-30_days":
        timelineScore = 15;
        break;
      case "1-3_months":
        timelineScore = 12;
        break;
      case "3-6_months":
        timelineScore = 8;
        break;
      case "6+_months":
        timelineScore = 4;
        break;
    }

    // 5. QUALIFICATION SCORE (5 points max)
    let qualificationScore = 0;
    if (contact.metadata?.pre_approved) {
      qualificationScore = 5;
    }

    // Calculate total score
    const totalScore = Math.min(
      Math.round(engagementScore + behaviorScore + budgetMatchScore + timelineScore + qualificationScore),
      100
    );

    // Calculate factors for UI display
    const factors = {
      engagement: Math.round((engagementScore / 30) * 100),
      behavior: Math.round((behaviorScore / 30) * 100),
      budget_match: Math.round((budgetMatchScore / 20) * 100),
      timeline: Math.round((timelineScore / 15) * 100),
      qualification: Math.round((qualificationScore / 5) * 100),
    };

    // Calculate confidence based on data completeness
    let missingFactors = 0;
    if (stats.emails_sent === 0) missingFactors++;
    if (stats.website_visits === 0) missingFactors++;
    if (!contact.metadata?.budget_min) missingFactors++;
    if (!contact.metadata?.timeline) missingFactors++;

    const confidenceMultipliers = [1.0, 0.9, 0.8, 0.7];
    const confidence = confidenceMultipliers[Math.min(missingFactors, 3)];
    const predictionConfidence = Number((confidence * (totalScore / 100)).toFixed(2));

    // Generate recommended actions based on score
    const recommendedActions: string[] = [];
    if (totalScore >= 80) {
      recommendedActions.push("Schedule property viewing ASAP");
      if (!contact.metadata?.pre_approved) {
        recommendedActions.push("Send pre-approval checklist");
      }
      recommendedActions.push("Prepare offer strategy");
    } else if (totalScore >= 60) {
      recommendedActions.push("Send personalized market report");
      recommendedActions.push("Share properties matching their criteria");
      recommendedActions.push("Schedule follow-up call this week");
    } else if (totalScore >= 40) {
      recommendedActions.push("Add to nurture campaign");
      recommendedActions.push("Send monthly newsletter");
      recommendedActions.push("Re-engage with market updates");
    } else {
      recommendedActions.push("Update contact information");
      recommendedActions.push("Verify their timeline and budget");
      recommendedActions.push("Add to long-term nurture sequence");
    }

    // Determine optimal contact time (mock implementation)
    const optimalContactTime = stats.last_email_opened
      ? "Weekdays 10 AM - 12 PM"
      : "Not enough data";

    // ─── LLM-Assisted Insights (OpenAI) ──────────────────────
    // The rule-based score is the source of truth. OpenAI enriches
    // insights and recommended actions with contextual analysis.
    // Falls back to rule-based insights if OpenAI is unavailable.

    let insights = "";
    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    if (openaiKey) {
      try {
        const llmPrompt = `You are a Canadian real estate CRM lead scoring analyst. Analyze this lead and provide a 2-sentence insight plus 3 specific next-step recommendations.

Lead Data:
- Name: ${contact.first_name} ${contact.last_name}
- Score: ${totalScore}/100
- Tags: ${(contact.tags || []).join(", ") || "none"}
- Source: ${contact.source || "unknown"}
- Notes: ${(contact.notes || "").substring(0, 300)}
- Engagement: ${stats.emails_sent} emails sent, ${stats.emails_opened} opened, ${stats.emails_replied} replied
- Website: ${stats.website_visits} visits, ${stats.properties_viewed} properties viewed
- Budget: ${contact.metadata?.budget_min ? "$" + contact.metadata.budget_min + "-$" + contact.metadata.budget_max : "unknown"}
- Timeline: ${contact.metadata?.timeline || "unknown"}
- Pre-approved: ${contact.metadata?.pre_approved ? "yes" : "no/unknown"}
- Last contacted: ${contact.last_contact_date || "never"}

Respond as JSON: {"insights": "2-sentence analysis", "actions": ["action1", "action2", "action3"]}`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const llmRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: llmPrompt }],
            max_tokens: 250,
            temperature: 0.3,
            response_format: { type: "json_object" },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (llmRes.ok) {
          const llmData = await llmRes.json();
          const parsed = JSON.parse(llmData.choices[0].message.content);
          if (parsed.insights) insights = parsed.insights;
          if (Array.isArray(parsed.actions) && parsed.actions.length > 0) {
            recommendedActions.length = 0;
            recommendedActions.push(...parsed.actions.slice(0, 5));
          }
          console.log("LLM insights generated for contact:", contact_id);
        } else {
          console.warn("OpenAI API returned non-OK status:", llmRes.status);
        }
      } catch (llmError) {
        console.warn("LLM scoring fallback to rules:", llmError instanceof Error ? llmError.message : String(llmError));
      }
    }

    // Fallback to rule-based insights if LLM didn't produce any
    if (!insights) {
      if (totalScore >= 80) {
        insights = "This lead has high engagement and is ready to view properties. Act quickly!";
      } else if (totalScore >= 60) {
        insights = "This lead shows strong interest. Continue nurturing with targeted content.";
      } else if (totalScore >= 40) {
        insights = "This lead needs consistent engagement to move forward in their journey.";
      } else {
        insights = "This lead requires basic information updates and long-term nurturing.";
      }
    }

    // Save or update lead score
    const { data: existingScore } = await supabase
      .from("ai_lead_scores")
      .select("id")
      .eq("contact_id", contact_id)
      .single();

    if (existingScore) {
      // Update existing score
      await supabase
        .from("ai_lead_scores")
        .update({
          score: totalScore,
          factors,
          prediction_confidence: predictionConfidence,
          recommended_actions: recommendedActions,
          optimal_contact_time: optimalContactTime,
          insights,
          calculated_at: new Date().toISOString(),
        })
        .eq("contact_id", contact_id);
    } else {
      // Insert new score
      await supabase.from("ai_lead_scores").insert({
        contact_id,
        score: totalScore,
        factors,
        prediction_confidence: predictionConfidence,
        recommended_actions: recommendedActions,
        optimal_contact_time: optimalContactTime,
        insights,
      });
    }

    // Also update the ai_score in contacts table for quick access
    await supabase
      .from("contacts")
      .update({ ai_score: totalScore })
      .eq("id", contact_id);

    console.log("Lead score calculated successfully:", {
      contact_id,
      score: totalScore,
      factors,
      confidence: predictionConfidence,
    });

    return new Response(
      JSON.stringify({
        contact_id,
        score: totalScore,
        factors,
        prediction_confidence: predictionConfidence,
        recommended_actions: recommendedActions,
        optimal_contact_time: optimalContactTime,
        insights,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Log full error details server-side only
    console.error("Error calculating lead score:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Return generic error message to client
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
