import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { fetchRealtorListings, ListingResult, validateRealtorUrl } from "@/lib/apify";
import { Home, Loader2, Download, Save, ExternalLink, AlertCircle } from "lucide-react";

export function ImportListingsWidget() {
  const [url, setUrl] = useState("");
  const [maxListings, setMaxListings] = useState(100);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ListingResult[]>([]);
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());
  const [urlError, setUrlError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value.trim()) {
      const validation = validateRealtorUrl(value);
      setUrlError(validation.valid ? null : validation.error || null);
    } else {
      setUrlError(null);
    }
  };

  const handleImport = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a Realtor.ca search URL",
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

    setLoading(true);
    setUrlError(null);
    try {
      const data = await fetchRealtorListings({
        startUrls: [url],
        maxListings,
      });
      setResults(data);
      toast({
        title: "Import Complete",
        description: `Found ${data.length} listings`,
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
  };

  const handleSaveToCRM = async (listing: ListingResult, index: number) => {
    setSavingIds(prev => new Set(prev).add(index));
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const priceValue = typeof listing.price === 'string' 
        ? parseFloat(listing.price.replace(/[^0-9.]/g, '')) 
        : listing.price;

      const { error } = await supabase.from("properties").insert({
        user_id: user.id,
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
      });

      if (error) throw error;

      toast({
        title: "Saved!",
        description: `${listing.address} added to your properties`,
      });
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

  const formatPrice = (price: string | number | undefined) => {
    if (!price) return "N/A";
    const num = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          Import Listings from Realtor.ca
        </CardTitle>
        <CardDescription>
          Enter a Realtor.ca search URL to import property listings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
          />
          <Input
            type="number"
            placeholder="Max listings"
            value={maxListings}
            onChange={(e) => setMaxListings(Number(e.target.value))}
            className="w-32"
            min={1}
            max={500}
          />
          <Button onClick={handleImport} disabled={loading}>
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
            <div className="p-3 bg-muted/50 border-t text-sm text-muted-foreground">
              Showing {results.length} listings
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
