import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { notes, contactName, currentStage } = await req.json();

    if (!notes || notes.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Call notes are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call OpenAI API to generate summary
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant helping a Canadian real estate agent analyze their call notes. 
Your job is to:
1. Summarize the key points from the conversation (2-3 bullet points max)
2. Classify the conversation intent (e.g., trust-building, ready to see properties, follow-up on active deal, information gathering, not interested, upset/concerned, financial stress)
3. Determine the emotional tone (positive, neutral, uncertain, negative)
4. Suggest a practical next action with timing (e.g., "Send recap email today + schedule follow-up call in 3 days", "Send listing recommendations within 24 hours", "Wait 2 weeks, then check in")

Provide your response in JSON format with the following structure:
{
  "summary": ["point 1", "point 2", "point 3"],
  "intent": "intent classification",
  "tone": "emotional tone",
  "suggestedAction": "suggested next action with timing"
}`
          },
          {
            role: "user",
            content: `Analyze this call with ${contactName || "a contact"} (current stage: ${currentStage || "unknown"}):\n\n${notes}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      throw new Error("Failed to generate AI summary");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the JSON response from GPT
    let parsedContent;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        parsedContent = JSON.parse(content);
      }
    } catch (e) {
      // If parsing fails, create a structured response
      parsedContent = {
        summary: ["Summary not available"],
        intent: "unclear",
        tone: "neutral",
        suggestedAction: "Review notes and determine next steps"
      };
    }

    return new Response(
      JSON.stringify(parsedContent),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-call-summary:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
