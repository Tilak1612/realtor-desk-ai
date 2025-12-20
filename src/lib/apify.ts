import { supabase } from "@/integrations/supabase/client";

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
}

export interface AgentResult {
  name?: string;
  phone?: string;
  email?: string;
  office?: string;
  areasServed?: string[];
  profileUrl?: string;
  photoUrl?: string;
}

export interface CombinedResult {
  listings: ListingResult[];
  agents: AgentResult[];
}

const callApifyRunner = async (actorId: string, input: Record<string, unknown>) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Authentication required");
  }

  const response = await supabase.functions.invoke("apify-runner", {
    body: { actorId, input },
  });

  if (response.error) {
    throw new Error(response.error.message || "Failed to run Apify actor");
  }

  return response.data;
};

export const fetchRealtorListings = async (input: ApifyListingInput): Promise<ListingResult[]> => {
  const actorId = "scrapemind~Realtor-ca-Scraper";
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
    }));
  }
  
  return [];
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
    }));
  }
  
  return [];
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
  
  if (Array.isArray(data)) {
    data.forEach((item: Record<string, unknown>) => {
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
        });
      }
      
      // Extract agent data if present
      if (item.agentName || item.agent) {
        agents.push({
          name: item.agentName as string || item.agent as string || '',
          phone: item.agentPhone as string || '',
          email: item.agentEmail as string || '',
          office: item.office as string || '',
        });
      }
    });
  }
  
  return { listings, agents };
};
