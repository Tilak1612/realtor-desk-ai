import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { fetchCombinedData, CombinedResult, validateRealtorUrl } from "@/lib/apify";
import { MapPin, Loader2, Download, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";

export function QuickAreaImportWidget() {
  const [url, setUrl] = useState("");
  const [includeDetails, setIncludeDetails] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [results, setResults] = useState<CombinedResult | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [lastImportTime, setLastImportTime] = useState<number>(0);
  const [saveResult, setSaveResult] = useState<{ listings: number; contacts: number; duplicates: number } | null>(null);
  const { toast } = useToast();

  const COOLDOWN_MS = 5000; // 5 second cooldown between imports

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value.trim()) {
      const validation = validateRealtorUrl(value);
      setUrlError(validation.valid ? null : validation.error || null);
    } else {
      setUrlError(null);
    }
  };

  const handleImport = useCallback(async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a Realtor.ca map URL",
        variant: "destructive",
      });
      return;
    }

    // Check cooldown
    const now = Date.now();
    if (now - lastImportTime < COOLDOWN_MS) {
      toast({
        title: "Please Wait",
        description: "Please wait a few seconds before importing again",
        variant: "destructive",
      });
      return;
    }

    // Validate URL
    const validation = validateRealtorUrl(url);
    if (!validation.valid) {
      setUrlError(validation.error || "Invalid URL");
      toast({
        title: "Invalid URL",
        description: validation.error || "Please enter a valid search or map URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setUrlError(null);
    setSaveResult(null);
    setLastImportTime(now);

    try {
      const data = await fetchCombinedData({
        startUrls: [url],
        maxListings: 100,
        includeDetails,
      });
      setResults(data);
      toast({
        title: "Import Complete",
        description: `Found ${data.listings.length} listings and ${data.agents.length} agents`,
      });
    } catch (error) {
      console.error("Import error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch data";
      
      // Check for Apify subscription errors
      const isSubscriptionError = 
        errorMessage.toLowerCase().includes('actor') && 
        (errorMessage.toLowerCase().includes('not rented') || 
         errorMessage.toLowerCase().includes('subscription') ||
         errorMessage.toLowerCase().includes('expired') ||
         errorMessage.toLowerCase().includes('trial'));
      
      if (isSubscriptionError) {
        setUrlError(
          "⚠️ Apify Subscription Required\n\n" +
          "The Realtor.ca scraper requires an active Apify subscription.\n\n" +
          "To fix this:\n" +
          "1. Go to apify.com and log in\n" +
          "2. Subscribe to the Realtor.ca Scraper actor\n" +
          "3. Ensure your APIFY_TOKEN is configured in project secrets"
        );
        toast({
          title: "Subscription Required",
          description: "The Apify actor subscription has expired. Please renew to continue importing.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Import Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [url, includeDetails, lastImportTime, toast]);

  const checkListingDuplicate = async (mlsNumber: string | undefined, address: string, userId: string): Promise<boolean> => {
    if (!mlsNumber && !address) return false;

    // Check by MLS number first (more reliable)
    if (mlsNumber) {
      const { data: byMls } = await supabase
        .from("property_listings")
        .select("id")
        .eq("user_id", userId)
        .eq("mls_number", mlsNumber)
        .limit(1);
      if ((byMls?.length || 0) > 0) return true;
    }

    // Check by address
    if (address) {
      const { data: byAddress } = await supabase
        .from("property_listings")
        .select("id")
        .eq("user_id", userId)
        .eq("address", address)
        .limit(1);
      if ((byAddress?.length || 0) > 0) return true;
    }

    return false;
  };

  const checkContactDuplicate = async (firstName: string, lastName: string | null, userId: string): Promise<boolean> => {
    const { data: existing } = await supabase
      .from("contacts")
      .select("id")
      .eq("user_id", userId)
      .eq("first_name", firstName)
      .eq("last_name", lastName || "")
      .limit(1);

    return (existing?.length || 0) > 0;
  };

  const handleSaveAll = useCallback(async () => {
    if (!results) return;
    
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let savedListings = 0;
      let savedContacts = 0;
      let duplicates = 0;

      // Save listings with duplicate check
      for (const listing of results.listings) {
        const isDuplicate = await checkListingDuplicate(listing.mlsNumber, listing.address || "", user.id);
        if (isDuplicate) {
          duplicates++;
          continue;
        }

        const priceValue = typeof listing.price === 'string' 
          ? parseFloat(listing.price.replace(/[^0-9.]/g, '')) 
          : listing.price;

        const { error } = await supabase.from("property_listings").insert({
          user_id: user.id,
          title: listing.address || "Imported Listing",
          address: listing.address || "",
          price: priceValue || null,
          bedrooms: listing.bedrooms || null,
          bathrooms: listing.bathrooms || null,
          mls_number: listing.mlsNumber || null,
          property_type: listing.propertyType || null,
          city: listing.city || null,
          province: listing.province || null,
          source_url: listing.url || null,
          data_source: "realtor.ca",
          status: "active",
          metadata: {
            importedAt: new Date().toISOString(),
            importedFrom: "quick-area-import",
          },
        });

        if (!error) savedListings++;
      }

      // Save agents as contacts (deduplicated by name)
      const seenAgents = new Set<string>();
      for (const agent of results.agents) {
        if (!agent.name || seenAgents.has(agent.name)) continue;
        seenAgents.add(agent.name);

        const nameParts = agent.name.split(" ");
        const firstName = nameParts[0] || "Unknown";
        const lastName = nameParts.slice(1).join(" ") || null;

        const isDuplicate = await checkContactDuplicate(firstName, lastName, user.id);
        if (isDuplicate) {
          duplicates++;
          continue;
        }

        const { error } = await supabase.from("contacts").insert({
          user_id: user.id,
          first_name: firstName,
          last_name: lastName,
          email: agent.email || `${firstName.toLowerCase()}@placeholder.com`,
          phone: agent.phone || null,
          source: "realtor.ca",
          status: "lead",
          tags: ["agent", "realtor.ca", "area-import"],
          metadata: {
            office: agent.office,
            importedFrom: "quick-area-import",
            importedAt: new Date().toISOString(),
          },
        });

        if (!error) savedContacts++;
      }

      setSaveResult({ listings: savedListings, contacts: savedContacts, duplicates });

      toast({
        title: "All Data Saved!",
        description: `Saved ${savedListings} listings and ${savedContacts} contacts${duplicates > 0 ? ` (${duplicates} duplicates skipped)` : ''}`,
      });
      
      setResults(null);
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save data",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [results, toast]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <MapPin className="h-4 w-4 text-primary" />
            Quick Area Import
            <Badge variant="secondary" className="ml-2 text-xs">Beta</Badge>
          </CardTitle>
        </div>
        <CardDescription className="text-sm">
          Import listings and agents from a Realtor.ca map area in one action
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data Source Disclaimer */}
        <Alert variant="default" className="border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-600 dark:text-amber-400">Data Source Notice</AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground">
            This data is scraped from Realtor.ca and is NOT official MLS or CREA DDF data. 
            Use for research purposes only.
          </AlertDescription>
        </Alert>

        {urlError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="whitespace-pre-line">{urlError}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-4">
          <Input
            placeholder="https://www.realtor.ca/map#... or .../city/real-estate"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className={urlError ? 'border-destructive' : ''}
            disabled={loading}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="include-details"
                checked={includeDetails}
                onCheckedChange={setIncludeDetails}
                disabled={loading}
              />
              <Label htmlFor="include-details" className="text-sm">
                Include listing details (slower but more data)
              </Label>
            </div>
            
            <Button onClick={handleImport} disabled={loading} size="sm" className="h-8">
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="mr-1.5 h-3 w-3" />
                  Import Area
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Success message */}
        {saveResult && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              Saved {saveResult.listings} listings and {saveResult.contacts} contacts
              {saveResult.duplicates > 0 && ` (${saveResult.duplicates} duplicates skipped)`}
            </AlertDescription>
          </Alert>
        )}

        {/* Empty state */}
        {!loading && !results && url && !saveResult && (
          <div className="text-center py-6 text-muted-foreground">
            <MapPin className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Enter a Realtor.ca map URL and click Import</p>
          </div>
        )}

        {results && (
          <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Import Summary</p>
                <p className="text-sm text-muted-foreground">
                  Found {results.listings.length} listings and {results.agents.length} agents
                </p>
              </div>
              <Button onClick={handleSaveAll} disabled={saving} size="sm" className="h-8">
                {saving ? (
                  <>
                    <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-1.5 h-3 w-3" />
                    Save All to CRM
                  </>
                )}
              </Button>
            </div>
            
            {results.listings.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Sample listings: {results.listings.slice(0, 3).map(l => l.address).filter(Boolean).join(", ")}
                {results.listings.length > 3 && "..."}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
