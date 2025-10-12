import { Contact } from "@/pages/Contacts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, Mail, Eye } from "lucide-react";

interface ContactsCardViewProps {
  contacts: Contact[];
  loading: boolean;
  onRefresh: () => void;
}

const ContactsCardView = ({ contacts, loading, onRefresh }: ContactsCardViewProps) => {
  const getScoreBadge = (score: number | null) => {
    if (!score) return <Badge variant="outline">-</Badge>;
    if (score >= 80) return <Badge className="bg-accent">🔥 {score}</Badge>;
    if (score >= 50) return <Badge variant="secondary">{score}</Badge>;
    return <Badge variant="outline">{score}</Badge>;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
              <Skeleton className="h-4 w-32 mx-auto mb-2" />
              <Skeleton className="h-3 w-24 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No contacts found</p>
          <Button onClick={onRefresh}>Refresh</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {contacts.map((contact) => (
        <Card key={contact.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              {/* Score Badge - Top Right */}
              <div className="self-end mb-2">{getScoreBadge(contact.ai_score)}</div>

              {/* Avatar */}
              <Avatar className="h-16 w-16 mb-3">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {contact.first_name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>

              {/* Name */}
              <h3 className="font-semibold text-lg mb-1">
                {contact.first_name} {contact.last_name}
              </h3>

              {/* Contact Info */}
              <div className="space-y-1 mb-4 w-full">
                {contact.email && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{contact.phone}</span>
                  </div>
                )}
              </div>

              {/* Source Badge */}
              {contact.source && (
                <Badge variant="outline" className="mb-4">
                  {contact.source}
                </Badge>
              )}

              {/* Tags */}
              {contact.tags && contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {contact.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {contact.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{contact.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href={`tel:${contact.phone}`}>
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href={`mailto:${contact.email}`}>
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </a>
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContactsCardView;
