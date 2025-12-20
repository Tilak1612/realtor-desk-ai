import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { fetchRealtorAgents, AgentResult, validateRealtorUrl } from "@/lib/apify";
import { Users, Loader2, Search, UserPlus, ExternalLink, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

export function AgentIntelligenceWidget() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AgentResult[]>([]);
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());
  const [urlError, setUrlError] = useState<string | null>(null);
  const [lastImportTime, setLastImportTime] = useState<number>(0);
  const [savedCount, setSavedCount] = useState(0);
  const { toast } = useToast();

  const COOLDOWN_MS = 5000; // 5 second cooldown between imports

  const handleQueryChange = (value: string) => {
    setSearchQuery(value);
    // Only validate if it looks like a URL
    if (value.trim() && value.startsWith("http")) {
      const validation = validateRealtorUrl(value);
      setUrlError(validation.valid ? null : validation.error || null);
    } else {
      setUrlError(null);
    }
  };

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a city name or Realtor.ca agent search URL",
        variant: "destructive",
      });
      return;
    }

    // Check cooldown
    const now = Date.now();
    if (now - lastImportTime < COOLDOWN_MS) {
      toast({
        title: "Please Wait",
        description: "Please wait a few seconds before searching again",
        variant: "destructive",
      });
      return;
    }

    // Validate URL if it looks like one
    if (searchQuery.startsWith("http")) {
      const validation = validateRealtorUrl(searchQuery);
      if (!validation.valid) {
        setUrlError(validation.error || "Invalid URL");
        toast({
          title: "Invalid URL",
          description: validation.error || "Please enter a valid Realtor.ca URL",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    setUrlError(null);
    setSavedCount(0);
    setLastImportTime(now);

    try {
      // If it's not a URL, construct a search URL
      const url = searchQuery.startsWith("http") 
        ? searchQuery 
        : `https://www.realtor.ca/agent/search?searchTerm=${encodeURIComponent(searchQuery)}`;
      
      const data = await fetchRealtorAgents({
        startUrls: [url],
        maxAgents: 50,
      });
      setResults(data);
      toast({
        title: "Search Complete",
        description: `Found ${data.length} agents`,
      });
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Failed to search agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, lastImportTime, toast]);

  const checkDuplicate = async (agent: AgentResult): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !agent.name) return false;

    const nameParts = agent.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const { data: existing } = await supabase
      .from("contacts")
      .select("id")
      .eq("user_id", user.id)
      .eq("first_name", firstName)
      .eq("last_name", lastName)
      .limit(1);

    return (existing?.length || 0) > 0;
  };

  const handleSaveAsContact = async (agent: AgentResult, index: number) => {
    setSavingIds(prev => new Set(prev).add(index));
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check for duplicates
      const isDuplicate = await checkDuplicate(agent);
      if (isDuplicate) {
        toast({
          title: "Duplicate Contact",
          description: `${agent.name} already exists in your contacts`,
          variant: "destructive",
        });
        return;
      }

      // Parse name into first/last
      const nameParts = (agent.name || "").split(" ");
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
        tags: ["agent", "realtor.ca"],
        metadata: {
          office: agent.office,
          areasServed: agent.areasServed,
          profileUrl: agent.profileUrl,
          photoUrl: agent.photoUrl,
          importedFrom: "agent-intelligence",
          importedAt: new Date().toISOString(),
        },
      });

      if (error) throw error;

      setSavedCount(prev => prev + 1);
      toast({
        title: "Contact Saved!",
        description: `${agent.name} added to your contacts`,
      });
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save contact",
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Agent Intelligence
            <Badge variant="secondary" className="ml-2 text-xs">Beta</Badge>
          </CardTitle>
        </div>
        <CardDescription>
          Search for real estate agents by city or Realtor.ca URL
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

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Enter city name or Realtor.ca agent URL..."
            value={searchQuery}
            onChange={(e) => handleQueryChange(e.target.value)}
            className={`flex-1 ${urlError ? 'border-destructive' : ''}`}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSearch()}
            disabled={loading}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search Agents
              </>
            )}
          </Button>
        </div>

        {/* Success message */}
        {savedCount > 0 && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              {savedCount} contact{savedCount > 1 ? 's' : ''} saved to your CRM
            </AlertDescription>
          </Alert>
        )}

        {/* Empty state */}
        {!loading && results.length === 0 && searchQuery && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No agents found. Try a different search term or URL.</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Office</TableHead>
                    <TableHead>Areas Served</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((agent, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {agent.name || "N/A"}
                        {agent.profileUrl && (
                          <a href={agent.profileUrl} target="_blank" rel="noopener noreferrer" className="ml-1 text-muted-foreground hover:text-primary">
                            <ExternalLink className="h-3 w-3 inline" />
                          </a>
                        )}
                      </TableCell>
                      <TableCell>{agent.phone || "-"}</TableCell>
                      <TableCell className="max-w-32 truncate">{agent.email || "-"}</TableCell>
                      <TableCell className="max-w-40 truncate">{agent.office || "-"}</TableCell>
                      <TableCell className="max-w-40 truncate">
                        {agent.areasServed?.join(", ") || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSaveAsContact(agent, index)}
                          disabled={savingIds.has(index)}
                        >
                          {savingIds.has(index) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-1" />
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
              Showing {results.length} agents
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
