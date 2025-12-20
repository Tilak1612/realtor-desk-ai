import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { actorId, input } = await req.json()
    const APIFY_TOKEN = Deno.env.get('APIFY_TOKEN')
    
    if (!APIFY_TOKEN) {
      console.error('APIFY_TOKEN not configured')
      return new Response(
        JSON.stringify({ error: 'APIFY_TOKEN not configured' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    if (!actorId) {
      return new Response(
        JSON.stringify({ error: 'actorId is required' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    console.log(`Running Apify actor: ${actorId}`)
    
    const response = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input || {})
      }
    )
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Apify API error: ${response.status} - ${errorText}`)
      return new Response(
        JSON.stringify({ error: `Apify API error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    const data = await response.json()
    console.log(`Apify actor ${actorId} completed successfully`)
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error running Apify actor:', errorMessage)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
