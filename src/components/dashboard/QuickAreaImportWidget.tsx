import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { fetchCombinedData, CombinedResult } from "@/lib/apify";
import { MapPin, Loader2, Download, CheckCircle2 } from "lucide-react";

export function QuickAreaImportWidget() {
  const [url, setUrl] = useState("");
  const [includeDetails, setIncludeDetails] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [results, setResults] = useState<CombinedResult | null>(null);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a Realtor.ca map URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
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
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    if (!results) return;
    
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let savedListings = 0;
      let savedContacts = 0;

      // Save listings
      for (const listing of results.listings) {
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
          city: listing.city || null,
          province: listing.province || null,
          source_url: listing.url || null,
          data_source: "realtor.ca",
          status: "active",
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
          },
        });

        if (!error) savedContacts++;
      }

      toast({
        title: "All Data Saved!",
        description: `Saved ${savedListings} listings and ${savedContacts} contacts`,
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Quick Area Import
        </CardTitle>
        <CardDescription>
          Import listings and agents from a Realtor.ca map area in one action
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <Input
            placeholder="https://www.realtor.ca/map#..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="include-details"
                checked={includeDetails}
                onCheckedChange={setIncludeDetails}
              />
              <Label htmlFor="include-details" className="text-sm">
                Include listing details (slower but more data)
              </Label>
            </div>
            
            <Button onClick={handleImport} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Import Area
                </>
              )}
            </Button>
          </div>
        </div>

        {results && (
          <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Import Summary</p>
                <p className="text-sm text-muted-foreground">
                  Found {results.listings.length} listings and {results.agents.length} agents
                </p>
              </div>
              <Button onClick={handleSaveAll} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
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
