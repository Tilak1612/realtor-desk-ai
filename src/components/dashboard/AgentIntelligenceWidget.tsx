import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { fetchRealtorAgents, AgentResult } from "@/lib/apify";
import { Users, Loader2, Search, UserPlus, ExternalLink } from "lucide-react";

export function AgentIntelligenceWidget() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AgentResult[]>([]);
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a city name or Realtor.ca agent search URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
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
  };

  const handleSaveAsContact = async (agent: AgentResult, index: number) => {
    setSavingIds(prev => new Set(prev).add(index));
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

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
        },
      });

      if (error) throw error;

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
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Agent Intelligence
        </CardTitle>
        <CardDescription>
          Search for real estate agents by city or Realtor.ca URL
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Enter city name or Realtor.ca agent URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
