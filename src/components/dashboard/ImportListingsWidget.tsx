import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  fetchRealtorListingsWithTracking, 
  ListingResult, 
  validateRealtorUrl,
  checkRateLimit,
  checkConcurrentImport,
  updateImportHistory,
  getApifyUsageStats,
  PARSER_VERSION
} from "@/lib/apify";
import { Home, Loader2, Download, Save, ExternalLink, AlertCircle, AlertTriangle, CheckCircle2, History, Info } from "lucide-react";

export function ImportListingsWidget() {
  const [url, setUrl] = useState("");
  const [maxListings, setMaxListings] = useState(100);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ListingResult[]>([]);
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());
  const [urlError, setUrlError] = useState<string | null>(null);
  const [lastImportTime, setLastImportTime] = useState<number>(0);
  const [savedCount, setSavedCount] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [currentImportId, setCurrentImportId] = useState<string | null>(null);
  const [usageStats, setUsageStats] = useState<{ todayImports: number; totalRecords: number }>({ todayImports: 0, totalRecords: 0 });
  const { toast } = useToast();

  const COOLDOWN_MS = 5000; // 5 second cooldown between imports

  // Fetch usage stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const stats = await getApifyUsageStats(user.id);
        setUsageStats(stats);
      }
    };
    fetchStats();
  }, []);

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
        description: "Please enter a Realtor.ca search URL",
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

    // Validate URL before making request
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

    // Get user for rate limiting
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to import listings",
        variant: "destructive",
      });
      return;
    }

    // Check rate limit
    const rateLimitCheck = await checkRateLimit(user.id);
    if (!rateLimitCheck.allowed) {
      toast({
        title: "Rate Limit Reached",
        description: rateLimitCheck.message,
        variant: "destructive",
      });
      return;
    }

    // Check concurrent imports
    const concurrentCheck = await checkConcurrentImport(user.id);
    if (!concurrentCheck.allowed) {
      toast({
        title: "Import In Progress",
        description: concurrentCheck.message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setUrlError(null);
    setSavedCount(0);
    setDuplicateCount(0);
    setLastImportTime(now);

    try {
      const { listings, importHistoryId } = await fetchRealtorListingsWithTracking(
        { startUrls: [url], maxListings },
        user.id,
        url
      );
      
      setResults(listings);
      setCurrentImportId(importHistoryId);
      
      // Update usage stats
      const stats = await getApifyUsageStats(user.id);
      setUsageStats(stats);
      
      toast({
        title: "Import Complete",
        description: `Found ${listings.length} listings`,
      });
    } catch (error) {
      console.error("Import error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch listings";
      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [url, maxListings, lastImportTime, toast]);

  const saveSingleListing = async (listing: ListingResult, userId: string): Promise<{ saved: boolean; duplicate: boolean }> => {
    // Check by MLS number first (more reliable)
    if (listing.mlsNumber) {
      const { data: byMls } = await supabase
        .from("properties")
        .select("id")
        .eq("user_id", userId)
        .eq("mls_number", listing.mlsNumber)
        .limit(1);
      if ((byMls?.length || 0) > 0) return { saved: false, duplicate: true };
    }

    // Check by address
    if (listing.address) {
      const { data: byAddress } = await supabase
        .from("properties")
        .select("id")
        .eq("user_id", userId)
        .eq("address", listing.address)
        .limit(1);
      if ((byAddress?.length || 0) > 0) return { saved: false, duplicate: true };
    }

    const priceValue = typeof listing.price === 'string' 
      ? parseFloat(listing.price.replace(/[^0-9.]/g, '')) 
      : listing.price;

    const { error } = await supabase.from("properties").insert({
      user_id: userId,
      title: listing.address || "Imported Listing",
      address: listing.address || "",
      price: priceValue || null,
      bedrooms: listing.bedrooms || null,
      bathrooms: listing.bathrooms || null,
      mls_number: listing.mlsNumber || null,
      property_type: listing.propertyType || null,
      square_feet: listing.squareFeet || null,
      description: listing.description || null,
      image_url: listing.imageUrl || null,
      city: listing.city || null,
      province: listing.province || null,
      postal_code: listing.postalCode || null,
      source_url: listing.url || null,
      data_source: "realtor.ca",
      status: "active",
      metadata: {
        agentName: listing.agentName,
        agentPhone: listing.agentPhone,
        agentEmail: listing.agentEmail,
        importedAt: new Date().toISOString(),
        importedFrom: "import-listings-widget",
        parserVersion: PARSER_VERSION,
      },
    });

    return { saved: !error, duplicate: false };
  };

  const handleSaveToCRM = async (listing: ListingResult, index: number) => {
    setSavingIds(prev => new Set(prev).add(index));
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const result = await saveSingleListing(listing, user.id);
      
      if (result.duplicate) {
        setDuplicateCount(prev => prev + 1);
        toast({
          title: "Duplicate Listing",
          description: `${listing.address || listing.mlsNumber || "This listing"} already exists`,
          variant: "destructive",
        });
        return;
      }

      if (result.saved) {
        setSavedCount(prev => prev + 1);
        toast({
          title: "Saved!",
          description: `${listing.address} added to your properties`,
        });
      }
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save listing",
        variant: "destructive",
      });
    } finally {
      setSavingIds(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  const handleSaveAll = useCallback(async () => {
    if (results.length === 0) return;
    
    setBulkSaving(true);
    setSavedCount(0);
    setDuplicateCount(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let saved = 0;
      let duplicates = 0;

      for (const listing of results) {
        const result = await saveSingleListing(listing, user.id);
        if (result.saved) saved++;
        if (result.duplicate) duplicates++;
      }

      setSavedCount(saved);
      setDuplicateCount(duplicates);

      // Update import history with save results
      if (currentImportId) {
        await updateImportHistory(currentImportId, {
          saved_records: saved,
          duplicate_records: duplicates,
        });
      }

      toast({
        title: "Bulk Save Complete",
        description: `Saved ${saved} listing${saved !== 1 ? 's' : ''}${duplicates > 0 ? `, ${duplicates} duplicate${duplicates !== 1 ? 's' : ''} skipped` : ''}`,
      });

      // Clear results after successful save
      if (saved > 0) {
        setResults([]);
      }
    } catch (error) {
      console.error("Bulk save error:", error);
      toast({
        title: "Bulk Save Failed",
        description: error instanceof Error ? error.message : "Failed to save listings",
        variant: "destructive",
      });
    } finally {
      setBulkSaving(false);
    }
  }, [results, currentImportId, toast]);

  const formatPrice = (price: string | number | undefined) => {
    if (!price) return "N/A";
    const num = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Import Listings from Realtor.ca
            <Badge variant="secondary" className="ml-2 text-xs">Beta</Badge>
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <History className="h-3 w-3" />
            <span>{usageStats.todayImports}/10 imports today</span>
          </div>
        </div>
        <CardDescription>
          Enter a Realtor.ca search URL to import property listings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data Source Disclaimer */}
        <Alert variant="default" className="border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-600 dark:text-amber-400">Data Source Notice</AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground">
            This data is scraped from Realtor.ca and is NOT official MLS or CREA DDF data. 
            Use for research purposes only. Parser v{PARSER_VERSION}
          </AlertDescription>
        </Alert>

        {urlError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="whitespace-pre-line">{urlError}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="https://www.realtor.ca/map#... or .../city/real-estate"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className={`flex-1 ${urlError ? 'border-destructive' : ''}`}
            disabled={loading}
          />
          <Input
            type="number"
            placeholder="Max listings"
            value={maxListings}
            onChange={(e) => setMaxListings(Number(e.target.value))}
            className="w-32"
            min={1}
            max={500}
            disabled={loading}
          />
          <Button onClick={handleImport} disabled={loading || usageStats.todayImports >= 10}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Import
              </>
            )}
          </Button>
        </div>

        {/* Rate limit warning */}
        {usageStats.todayImports >= 8 && usageStats.todayImports < 10 && (
          <Alert className="border-amber-500/50 bg-amber-500/10">
            <Info className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-600 dark:text-amber-400">
              You have {10 - usageStats.todayImports} import{10 - usageStats.todayImports !== 1 ? 's' : ''} remaining today.
            </AlertDescription>
          </Alert>
        )}

        {usageStats.todayImports >= 10 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Daily import limit reached (10/day). Limit resets at midnight.
            </AlertDescription>
          </Alert>
        )}

        {/* Success/duplicate status */}
        {(savedCount > 0 || duplicateCount > 0) && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              {savedCount} listing{savedCount !== 1 ? 's' : ''} saved to your CRM
              {duplicateCount > 0 && ` (${duplicateCount} duplicate${duplicateCount !== 1 ? 's' : ''} skipped)`}
            </AlertDescription>
          </Alert>
        )}

        {/* Empty state */}
        {!loading && results.length === 0 && url && (
          <div className="text-center py-8 text-muted-foreground">
            <Home className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No listings found. Try a different URL or check the format.</p>
            <p className="text-xs mt-2">Use a search or map URL, not a single listing page.</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Beds</TableHead>
                    <TableHead>Baths</TableHead>
                    <TableHead>MLS</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((listing, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {listing.address || "N/A"}
                        {listing.url && (
                          <a href={listing.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-muted-foreground hover:text-primary">
                            <ExternalLink className="h-3 w-3 inline" />
                          </a>
                        )}
                      </TableCell>
                      <TableCell>{formatPrice(listing.price)}</TableCell>
                      <TableCell>{listing.bedrooms || "-"}</TableCell>
                      <TableCell>{listing.bathrooms || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {listing.mlsNumber || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-32 truncate">{listing.agentName || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSaveToCRM(listing, index)}
                          disabled={savingIds.has(index)}
                        >
                          {savingIds.has(index) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="p-3 bg-muted/50 border-t flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Showing {results.length} listings
              </span>
              <Button 
                onClick={handleSaveAll} 
                disabled={bulkSaving || results.length === 0}
                size="sm"
              >
                {bulkSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving All...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Save All ({results.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
