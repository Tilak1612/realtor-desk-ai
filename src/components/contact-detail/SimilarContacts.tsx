import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Contact } from "@/types/contact";

interface SimilarContactsProps { contact: Contact; }

const SimilarContacts = ({ contact }: SimilarContactsProps) => {
  const navigate = useNavigate();
  const [similarContacts, setSimilarContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSimilarContacts = useCallback(async () => {
    try {
      setLoading(true);
      const minScore = (contact.ai_score || 0) - 15;
      const maxScore = (contact.ai_score || 0) + 15;
      const { data, error } = await supabase.from("contacts").select("*").neq("id", contact.id).gte("ai_score", minScore).lte("ai_score", maxScore).limit(3);
      if (error) throw error;
      setSimilarContacts((data || []) as Contact[]);
    } catch { /* silently handled */ } finally { setLoading(false); }
  }, [contact]);

  useEffect(() => { fetchSimilarContacts(); }, [fetchSimilarContacts]);

  const getScoreBadgeColor = (score: number | null) => { if (!score) return "outline"; if (score >= 80) return "default"; if (score >= 50) return "secondary"; return "outline"; };

  if (loading) return (<Card><CardHeader><Skeleton className="h-5 w-32" /></CardHeader><CardContent className="space-y-3">{[...Array(3)].map((_, i) => (<Skeleton key={i} className="h-16" />))}</CardContent></Card>);
  if (similarContacts.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Similar Contacts</CardTitle>
        <p className="text-xs text-muted-foreground">You might also want to follow up with:</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {similarContacts.map((similar) => (
          <div key={similar.id} onClick={() => navigate(`/contacts/${similar.id}`)} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors cursor-pointer">
            <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary text-primary-foreground">{similar.first_name?.[0]?.toUpperCase() || "?"}</AvatarFallback></Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{similar.first_name} {similar.last_name}</p>
              <p className="text-xs text-muted-foreground truncate">{similar.source || "No source"}</p>
            </div>
            <Badge variant={getScoreBadgeColor(similar.ai_score)}>{similar.ai_score || 0}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SimilarContacts;
