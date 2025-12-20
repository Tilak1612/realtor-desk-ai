import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAX_RETRIES = 2;
const TIMEOUT_MS = 120000; // 2 minutes timeout

interface ApifyError {
  error: string;
  details?: string;
  code?: string;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs: number): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

const runApifyActor = async (
  actorId: string, 
  input: Record<string, unknown>, 
  token: string,
  retryCount = 0
): Promise<{ data?: unknown; error?: ApifyError }> => {
  try {
    console.log(`[APIFY] Attempt ${retryCount + 1}/${MAX_RETRIES + 1} for actor: ${actorId}`);
    
    const response = await fetchWithTimeout(
      `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input || {}),
      },
      TIMEOUT_MS
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[APIFY] API error: ${response.status} - ${errorText}`);
      
      // Parse error for better messaging
      let errorDetails = errorText;
      let errorCode = '';
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          errorDetails = errorJson.error.message || errorText;
          errorCode = errorJson.error.type || '';
        }
      } catch {
        // Keep original error text
      }
      
      // Retry on 5xx errors or timeouts
      if (response.status >= 500 && retryCount < MAX_RETRIES) {
        console.log(`[APIFY] Retrying after ${(retryCount + 1) * 2}s...`);
        await sleep((retryCount + 1) * 2000);
        return runApifyActor(actorId, input, token, retryCount + 1);
      }
      
      // Handle specific error codes
      if (response.status === 402 || errorText.includes('actor-is-not-rented')) {
        return {
          error: {
            error: 'Apify actor subscription required',
            details: 'The Apify actor free trial has expired. Please subscribe to the actor at apify.com to continue.',
            code: 'ACTOR_NOT_RENTED',
          }
        };
      }
      
      if (response.status === 403) {
        return {
          error: {
            error: 'Access denied',
            details: errorDetails,
            code: 'ACCESS_DENIED',
          }
        };
      }
      
      if (response.status === 429) {
        return {
          error: {
            error: 'Rate limit exceeded',
            details: 'Too many requests. Please wait a moment and try again.',
            code: 'RATE_LIMITED',
          }
        };
      }
      
      return {
        error: {
          error: `Apify API error: ${response.status}`,
          details: errorDetails,
          code: errorCode,
        }
      };
    }
    
    const data = await response.json();
    console.log(`[APIFY] Actor ${actorId} completed successfully, returned ${Array.isArray(data) ? data.length : 0} items`);
    
    return { data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Handle timeout
    if (errorMessage.includes('aborted') || errorMessage.includes('timeout')) {
      console.error(`[APIFY] Request timed out after ${TIMEOUT_MS}ms`);
      
      if (retryCount < MAX_RETRIES) {
        console.log(`[APIFY] Retrying after timeout...`);
        await sleep((retryCount + 1) * 2000);
        return runApifyActor(actorId, input, token, retryCount + 1);
      }
      
      return {
        error: {
          error: 'Request timed out',
          details: 'The scraper took too long to respond. Try reducing the number of listings or try again later.',
          code: 'TIMEOUT',
        }
      };
    }
    
    // Network errors - retry
    if (retryCount < MAX_RETRIES) {
      console.log(`[APIFY] Network error, retrying...`);
      await sleep((retryCount + 1) * 2000);
      return runApifyActor(actorId, input, token, retryCount + 1);
    }
    
    console.error('[APIFY] Error running actor:', errorMessage);
    return {
      error: {
        error: 'Failed to run scraper',
        details: errorMessage,
        code: 'NETWORK_ERROR',
      }
    };
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { actorId, input } = await req.json();
    const APIFY_TOKEN = Deno.env.get('APIFY_TOKEN');
    
    if (!APIFY_TOKEN) {
      console.error('[APIFY] APIFY_TOKEN not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Apify not configured', 
          details: 'APIFY_TOKEN environment variable is not set. Please configure it in your project settings.',
          code: 'NOT_CONFIGURED',
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!actorId) {
      return new Response(
        JSON.stringify({ 
          error: 'actorId is required',
          code: 'INVALID_INPUT',
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[APIFY] Starting actor: ${actorId}`);
    console.log(`[APIFY] Input: ${JSON.stringify(input).slice(0, 200)}...`);
    
    const result = await runApifyActor(actorId, input, APIFY_TOKEN);
    
    if (result.error) {
      const statusCode = result.error.code === 'ACTOR_NOT_RENTED' ? 402 
        : result.error.code === 'ACCESS_DENIED' ? 403
        : result.error.code === 'RATE_LIMITED' ? 429
        : 500;
        
      return new Response(
        JSON.stringify(result.error),
        { status: statusCode, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify(result.data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[APIFY] Unexpected error:', errorMessage);
    return new Response(
      JSON.stringify({ 
        error: 'Unexpected error', 
        details: errorMessage,
        code: 'UNEXPECTED_ERROR',
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
