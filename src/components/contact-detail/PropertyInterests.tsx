import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { PropertyInterest } from "@/types/contact";

interface PropertyInterestsProps { contactId: string; }

const PropertyInterests = ({ contactId }: PropertyInterestsProps) => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<PropertyInterest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("property_interests").select("*").eq("contact_id", contactId).order("created_at", { ascending: false });
      if (error) throw error;
      setProperties((data || []) as PropertyInterest[]);
    } catch { /* silently handled */ } finally { setLoading(false); }
  }, [contactId]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("property_interests").delete().eq("id", id);
    if (!error) { toast({ title: "Property removed" }); fetchProperties(); }
  };

  const getInterestColor = (level: string) => { switch (level) { case "high": return "bg-accent"; case "medium": return "bg-secondary"; default: return "bg-muted"; } };

  if (loading) return (<Card><CardContent className="p-6 space-y-4">{[...Array(3)].map((_, i) => (<Skeleton key={i} className="h-32" />))}</CardContent></Card>);

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Property Interests</h3>
          <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Property</Button>
        </div>
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No properties tracked yet. Add properties this contact is interested in.</p>
            <Button><Plus className="h-4 w-4 mr-2" />Add First Property</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <div key={property.id} className="p-4 rounded-lg border bg-card space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium">{property.address}</h4>
                    {property.price && <p className="text-lg font-bold text-primary">${property.price.toLocaleString()}</p>}
                    {property.property_type && <Badge variant="outline" className="mt-2">{property.property_type}</Badge>}
                  </div>
                  <Badge className={getInterestColor(property.interest_level)}>{property.interest_level}</Badge>
                </div>
                {property.notes && <p className="text-sm text-muted-foreground">{property.notes}</p>}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  {property.viewed_date && <span>Viewed: {format(new Date(property.viewed_date), "MMM d, yyyy")}</span>}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Create Deal</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(property.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyInterests;
