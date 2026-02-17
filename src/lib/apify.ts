import { supabase } from "@/integrations/supabase/client";

// Parser version for tracking changes
export const PARSER_VERSION = "1.0.0";

export interface ApifyListingInput {
  startUrls: string[];
  maxListings?: number;
}

export interface ApifyAgentInput {
  startUrls: string[];
  maxAgents?: number;
}

export interface ApifyCombinedInput {
  startUrls: string[];
  maxListings?: number;
  includeDetails?: boolean;
}

export interface ListingResult {
  address?: string;
  price?: string | number;
  bedrooms?: number;
  bathrooms?: number;
  mlsNumber?: string;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  propertyType?: string;
  squareFeet?: number;
  description?: string;
  imageUrl?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  url?: string;
  _rawData?: Record<string, unknown>; // Store raw data for debugging
}

export interface AgentResult {
  name?: string;
  phone?: string;
  email?: string;
  office?: string;
  areasServed?: string[];
  profileUrl?: string;
  photoUrl?: string;
  _rawData?: Record<string, unknown>; // Store raw data for debugging
}

export interface CombinedResult {
  listings: ListingResult[];
  agents: AgentResult[];
  rawPayload?: unknown[]; // Store raw response
}

export interface ImportHistoryRecord {
  id?: string;
  user_id: string;
  import_type: 'listings' | 'agents' | 'combined';
  source_url: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  total_records?: number;
  saved_records?: number;
  duplicate_records?: number;
  failed_records?: number;
  raw_payload?: unknown;
  error_message?: string;
  parser_version?: string;
}

// Validates if a URL is a supported Realtor.ca URL type
export const validateRealtorUrl = (url: string): { valid: boolean; error?: string; type?: 'search' | 'map' | 'listing' } => {
  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return { valid: false, error: "URL is required" };
  }
  
  if (!trimmedUrl.includes("realtor.ca")) {
    return { valid: false, error: "Please enter a valid Realtor.ca URL" };
  }
  
  // Single listing URL pattern: /real-estate/{id}/
  const singleListingPattern = /realtor\.ca\/real-estate\/\d+\//;
  if (singleListingPattern.test(trimmedUrl)) {
    return { 
      valid: false, 
      type: 'listing',
      error: "Single listing URLs are not supported. Please use a search or map URL instead.\n\nExample formats:\n• Map: realtor.ca/map#...\n• Search: realtor.ca/edmonton/real-estate" 
    };
  }
  
  // Map URL pattern
  if (trimmedUrl.includes("/map#") || trimmedUrl.includes("/map?")) {
    return { valid: true, type: 'map' };
  }
  
  // Search URL pattern (city/real-estate or province/city/real-estate)
  if (trimmedUrl.match(/realtor\.ca\/[a-z-]+\/real-estate/i) || trimmedUrl.match(/realtor\.ca\/[a-z-]+\/[a-z-]+\/real-estate/i)) {
    return { valid: true, type: 'search' };
  }
  
  // Agent search patterns
  if (trimmedUrl.includes("/agent/") || trimmedUrl.includes("/agents")) {
    return { valid: true, type: 'search' };
  }
  
  // Generic realtor.ca URL - allow but warn
  return { valid: true, type: 'search' };
};

// Check if user has exceeded rate limit
export const checkRateLimit = async (userId: string): Promise<{ allowed: boolean; message?: string }> => {
  const { data, error } = await supabase.rpc('check_apify_rate_limit', { 
    checking_user_id: userId,
    max_daily_imports: 10 
  });
  
  if (error) {
    console.error('Rate limit check error:', error);
    return { allowed: true }; // Allow on error to not block users
  }
  
  if (!data) {
    return { 
      allowed: false, 
      message: "Daily import limit reached (10 imports/day). Please try again tomorrow." 
    };
  }
  
  return { allowed: true };
};

// Check if user has a concurrent import running
export const checkConcurrentImport = async (userId: string): Promise<{ allowed: boolean; message?: string }> => {
  const { data, error } = await supabase.rpc('check_concurrent_import', { 
    checking_user_id: userId 
  });
  
  if (error) {
    console.error('Concurrent import check error:', error);
    return { allowed: true }; // Allow on error
  }
  
  if (!data) {
    return { 
      allowed: false, 
      message: "You already have an import running. Please wait for it to complete." 
    };
  }
  
  return { allowed: true };
};

// Create import history record
export const createImportHistory = async (
  record: Omit<ImportHistoryRecord, 'id'>
): Promise<string | null> => {
  const { data, error } = await supabase
    .from('import_history')
    .insert({
      user_id: record.user_id,
      import_type: record.import_type,
      source_url: record.source_url,
      status: record.status,
      parser_version: PARSER_VERSION,
    })
    .select('id')
    .single();
  
  if (error) {
    console.error('Failed to create import history:', error);
    return null;
  }
  
  return data?.id || null;
};

// Update import history record
export const updateImportHistory = async (
  id: string,
  updates: Partial<ImportHistoryRecord>
): Promise<boolean> => {
  const updateData: Record<string, unknown> = {};
  
  if (updates.status) updateData.status = updates.status;
  if (updates.total_records !== undefined) updateData.total_records = updates.total_records;
  if (updates.saved_records !== undefined) updateData.saved_records = updates.saved_records;
  if (updates.duplicate_records !== undefined) updateData.duplicate_records = updates.duplicate_records;
  if (updates.error_message) updateData.error_message = updates.error_message;
  if (updates.raw_payload) updateData.raw_payload = updates.raw_payload as object;
  if (updates.status === 'completed' || updates.status === 'failed') {
    updateData.completed_at = new Date().toISOString();
  }
  
  const { error } = await supabase
    .from('import_history')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error('Failed to update import history:', error);
    return false;
  }
  
  return true;
};

// Track Apify usage
export const trackApifyUsage = async (
  userId: string,
  actorId: string,
  recordsFetched: number,
  importHistoryId?: string
): Promise<void> => {
  const { error } = await supabase.from('apify_usage').insert({
    user_id: userId,
    actor_id: actorId,
    records_fetched: recordsFetched,
    import_history_id: importHistoryId,
  });
  
  if (error) {
    console.error('Failed to track Apify usage:', error);
  }
};

const callApifyRunner = async (actorId: string, input: Record<string, unknown>) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Authentication required");
  }

  const response = await supabase.functions.invoke("apify-runner", {
    body: { actorId, input },
  });

  if (response.error) {
    // Try to extract the function's JSON error body (more reliable than error.message)
    try {
      const resp = (response as any).response as Response | undefined;
      if (resp) {
        const contentType = resp.headers.get("Content-Type") || "";
        if (contentType.includes("application/json")) {
          const body = await resp.json();
          if (body?.code === "ACTOR_NOT_RENTED") {
            throw new Error(
              body.details ||
                "Apify actor subscription required (expired / not rented). Please renew your Apify actor subscription and try again."
            );
          }
          if (body?.details || body?.error) {
            throw new Error(body.details || body.error);
          }
        } else {
          const text = await resp.text();
          if (text) throw new Error(text);
        }
      }
    } catch (parseErr) {
      // Fall back to generic message
      console.log("[Apify] Could not parse function error body:", parseErr);
    }

    const errorMessage = response.error.message || "Failed to run Apify actor";
    throw new Error(errorMessage);
  }

  // Check if the response contains an error from Apify
  if (response.data && typeof response.data === 'object' && 'error' in response.data) {
    const apifyError = response.data as { error: string; details?: string };
    
    // Parse common Apify error types for better messaging
    if (apifyError.details?.includes("actor-is-not-rented")) {
      throw new Error("Apify actor subscription required. The free trial has expired. Please rent the actor at apify.com to continue.");
    }
    if (apifyError.details?.includes("rate-limit")) {
      throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    }
    
    throw new Error(apifyError.details || apifyError.error || "Apify actor failed");
  }

  return response.data;
};

export interface FetchResult<T> {
  data: T;
  rawPayload: unknown[];
  actorId: string;
}

export const fetchRealtorListings = async (input: ApifyListingInput): Promise<ListingResult[]> => {
  const actorId = "scrapemind~realtor-ca-scraper";
  const data = await callApifyRunner(actorId, {
    startUrls: input.startUrls.map(url => ({ url })),
    maxItems: input.maxListings || 100,
  });
  
  // Normalize the response data
  if (Array.isArray(data)) {
    return data.map((item: Record<string, unknown>) => ({
      address: item.address as string || item.streetAddress as string || '',
      price: item.price as string | number || item.listPrice as string | number || 0,
      bedrooms: Number(item.bedrooms) || Number(item.beds) || 0,
      bathrooms: Number(item.bathrooms) || Number(item.baths) || 0,
      mlsNumber: item.mlsNumber as string || item.mls as string || '',
      agentName: item.agentName as string || item.agent as string || '',
      agentPhone: item.agentPhone as string || '',
      agentEmail: item.agentEmail as string || '',
      propertyType: item.propertyType as string || item.type as string || '',
      squareFeet: Number(item.squareFeet) || Number(item.sqft) || 0,
      description: item.description as string || '',
      imageUrl: item.imageUrl as string || item.image as string || '',
      city: item.city as string || '',
      province: item.province as string || item.state as string || '',
      postalCode: item.postalCode as string || item.zipCode as string || '',
      url: item.url as string || item.link as string || '',
      _rawData: item, // Store raw data for debugging
    }));
  }
  
  return [];
};

export const fetchRealtorListingsWithTracking = async (
  input: ApifyListingInput,
  userId: string,
  sourceUrl: string
): Promise<{ listings: ListingResult[]; importHistoryId: string | null }> => {
  const actorId = "scrapemind~realtor-ca-scraper";
  
  // Create import history record
  const importHistoryId = await createImportHistory({
    user_id: userId,
    import_type: 'listings',
    source_url: sourceUrl,
    status: 'running',
  });
  
  try {
    const data = await callApifyRunner(actorId, {
      startUrls: input.startUrls.map(url => ({ url })),
      maxItems: input.maxListings || 100,
    });
    
    const rawPayload = Array.isArray(data) ? data : [];
    
    // Track usage
    await trackApifyUsage(userId, actorId, rawPayload.length, importHistoryId || undefined);
    
    // Normalize the response data
    const listings = rawPayload.map((item: Record<string, unknown>) => ({
      address: item.address as string || item.streetAddress as string || '',
      price: item.price as string | number || item.listPrice as string | number || 0,
      bedrooms: Number(item.bedrooms) || Number(item.beds) || 0,
      bathrooms: Number(item.bathrooms) || Number(item.baths) || 0,
      mlsNumber: item.mlsNumber as string || item.mls as string || '',
      agentName: item.agentName as string || item.agent as string || '',
      agentPhone: item.agentPhone as string || '',
      agentEmail: item.agentEmail as string || '',
      propertyType: item.propertyType as string || item.type as string || '',
      squareFeet: Number(item.squareFeet) || Number(item.sqft) || 0,
      description: item.description as string || '',
      imageUrl: item.imageUrl as string || item.image as string || '',
      city: item.city as string || '',
      province: item.province as string || item.state as string || '',
      postalCode: item.postalCode as string || item.zipCode as string || '',
      url: item.url as string || item.link as string || '',
      _rawData: item,
    }));
    
    // Update import history with raw payload
    if (importHistoryId) {
      await updateImportHistory(importHistoryId, {
        status: 'completed',
        total_records: listings.length,
        raw_payload: rawPayload,
      });
    }
    
    return { listings, importHistoryId };
  } catch (error) {
    // Update import history with error
    if (importHistoryId) {
      await updateImportHistory(importHistoryId, {
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
    throw error;
  }
};

export const fetchRealtorAgents = async (input: ApifyAgentInput): Promise<AgentResult[]> => {
  const actorId = "scrapemind~realtor-canada-agents";
  const data = await callApifyRunner(actorId, {
    startUrls: input.startUrls.map(url => ({ url })),
    maxItems: input.maxAgents || 50,
  });
  
  if (Array.isArray(data)) {
    return data.map((item: Record<string, unknown>) => ({
      name: item.name as string || item.agentName as string || '',
      phone: item.phone as string || item.phoneNumber as string || '',
      email: item.email as string || '',
      office: item.office as string || item.brokerage as string || '',
      areasServed: Array.isArray(item.areasServed) ? item.areasServed as string[] : [],
      profileUrl: item.profileUrl as string || item.url as string || '',
      photoUrl: item.photoUrl as string || item.image as string || '',
      _rawData: item,
    }));
  }
  
  return [];
};

export const fetchRealtorAgentsWithTracking = async (
  input: ApifyAgentInput,
  userId: string,
  sourceUrl: string
): Promise<{ agents: AgentResult[]; importHistoryId: string | null }> => {
  const actorId = "scrapemind~realtor-canada-agents";
  
  const importHistoryId = await createImportHistory({
    user_id: userId,
    import_type: 'agents',
    source_url: sourceUrl,
    status: 'running',
  });
  
  try {
    const data = await callApifyRunner(actorId, {
      startUrls: input.startUrls.map(url => ({ url })),
      maxItems: input.maxAgents || 50,
    });
    
    const rawPayload = Array.isArray(data) ? data : [];
    
    await trackApifyUsage(userId, actorId, rawPayload.length, importHistoryId || undefined);
    
    const agents = rawPayload.map((item: Record<string, unknown>) => ({
      name: item.name as string || item.agentName as string || '',
      phone: item.phone as string || item.phoneNumber as string || '',
      email: item.email as string || '',
      office: item.office as string || item.brokerage as string || '',
      areasServed: Array.isArray(item.areasServed) ? item.areasServed as string[] : [],
      profileUrl: item.profileUrl as string || item.url as string || '',
      photoUrl: item.photoUrl as string || item.image as string || '',
      _rawData: item,
    }));
    
    if (importHistoryId) {
      await updateImportHistory(importHistoryId, {
        status: 'completed',
        total_records: agents.length,
        raw_payload: rawPayload,
      });
    }
    
    return { agents, importHistoryId };
  } catch (error) {
    if (importHistoryId) {
      await updateImportHistory(importHistoryId, {
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
    throw error;
  }
};

export const fetchCombinedData = async (input: ApifyCombinedInput): Promise<CombinedResult> => {
  const actorId = "memo23~realtor-canada-search-cheerio";
  const data = await callApifyRunner(actorId, {
    startUrls: input.startUrls.map(url => ({ url })),
    maxItems: input.maxListings || 100,
    includeDetails: input.includeDetails ?? true,
  });
  
  const listings: ListingResult[] = [];
  const agents: AgentResult[] = [];
  const rawPayload = Array.isArray(data) ? data : [];
  
  rawPayload.forEach((item: Record<string, unknown>) => {
    // Extract listing data
    if (item.address || item.price) {
      listings.push({
        address: item.address as string || '',
        price: item.price as string | number || 0,
        bedrooms: Number(item.bedrooms) || 0,
        bathrooms: Number(item.bathrooms) || 0,
        mlsNumber: item.mlsNumber as string || '',
        propertyType: item.propertyType as string || '',
        city: item.city as string || '',
        province: item.province as string || '',
        url: item.url as string || '',
        _rawData: item,
      });
    }
    
    // Extract agent data if present
    if (item.agentName || item.agent) {
      agents.push({
        name: item.agentName as string || item.agent as string || '',
        phone: item.agentPhone as string || '',
        email: item.agentEmail as string || '',
        office: item.office as string || '',
        _rawData: item,
      });
    }
  });
  
  return { listings, agents, rawPayload };
};

export const fetchCombinedDataWithTracking = async (
  input: ApifyCombinedInput,
  userId: string,
  sourceUrl: string
): Promise<{ result: CombinedResult; importHistoryId: string | null }> => {
  const actorId = "memo23~realtor-canada-search-cheerio";
  
  const importHistoryId = await createImportHistory({
    user_id: userId,
    import_type: 'combined',
    source_url: sourceUrl,
    status: 'running',
  });
  
  try {
    const data = await callApifyRunner(actorId, {
      startUrls: input.startUrls.map(url => ({ url })),
      maxItems: input.maxListings || 100,
      includeDetails: input.includeDetails ?? true,
    });
    
    const listings: ListingResult[] = [];
    const agents: AgentResult[] = [];
    const rawPayload = Array.isArray(data) ? data : [];
    
    await trackApifyUsage(userId, actorId, rawPayload.length, importHistoryId || undefined);
    
    rawPayload.forEach((item: Record<string, unknown>) => {
      if (item.address || item.price) {
        listings.push({
          address: item.address as string || '',
          price: item.price as string | number || 0,
          bedrooms: Number(item.bedrooms) || 0,
          bathrooms: Number(item.bathrooms) || 0,
          mlsNumber: item.mlsNumber as string || '',
          propertyType: item.propertyType as string || '',
          city: item.city as string || '',
          province: item.province as string || '',
          url: item.url as string || '',
          _rawData: item,
        });
      }
      
      if (item.agentName || item.agent) {
        agents.push({
          name: item.agentName as string || item.agent as string || '',
          phone: item.agentPhone as string || '',
          email: item.agentEmail as string || '',
          office: item.office as string || '',
          _rawData: item,
        });
      }
    });
    
    if (importHistoryId) {
      await updateImportHistory(importHistoryId, {
        status: 'completed',
        total_records: listings.length + agents.length,
        raw_payload: rawPayload,
      });
    }
    
    return { result: { listings, agents, rawPayload }, importHistoryId };
  } catch (error) {
    if (importHistoryId) {
      await updateImportHistory(importHistoryId, {
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
    throw error;
  }
};

// Get recent import history for a user
export const getImportHistory = async (userId: string, limit = 10) => {
  const { data, error } = await supabase
    .from('import_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Failed to get import history:', error);
    return [];
  }
  
  return data || [];
};

// Get Apify usage stats for a user
export const getApifyUsageStats = async (userId: string) => {
  const { data, error } = await supabase
    .from('apify_usage')
    .select('*')
    .eq('user_id', userId)
    .gte('request_date', new Date().toISOString().split('T')[0])
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Failed to get usage stats:', error);
    return { todayImports: 0, totalRecords: 0 };
  }
  
  return {
    todayImports: data?.length || 0,
    totalRecords: data?.reduce((sum, r) => sum + (r.records_fetched || 0), 0) || 0,
  };
};
