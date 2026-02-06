import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface DealHistoryProps {
  contactId: string;
}

const DealHistory = ({ contactId }: DealHistoryProps) => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("contact_id", contactId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDeals(data || []);
    } catch (error) {
      // Error silently handled
    } finally {
      setLoading(false);
    }
  }, [contactId]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "lead":
        return "outline";
      case "viewing":
        return "secondary";
      case "offer":
        return "default";
      case "negotiation":
        return "default";
      case "closing":
        return "default";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "won":
        return "default";
      case "lost":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Deal History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {deals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">No deals yet</p>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Deal
            </Button>
          </div>
        ) : (
          <>
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-sm">{deal.title}</h4>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => navigate(`/deals/${deal.id}`)}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={getStageColor(deal.stage)} className="text-xs">
                    {deal.stage}
                  </Badge>
                  <Badge variant={getStatusColor(deal.status)} className="text-xs">
                    {deal.status}
                  </Badge>
                </div>

                {deal.value && (
                  <p className="text-sm font-semibold text-primary">
                    ${deal.value.toLocaleString()}
                  </p>
                )}
              </div>
            ))}

            <Button size="sm" variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create New Deal
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DealHistory;
