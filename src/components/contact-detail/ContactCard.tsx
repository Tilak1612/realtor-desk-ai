import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageSquare, Calendar, Plus, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import type { Contact } from "@/types/contact";

interface ContactCardProps {
  contact: Contact;
  onUpdate: () => void;
}

const ContactCard = ({ contact, onUpdate }: ContactCardProps) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState("");

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-accent";
    if (score >= 50) return "text-secondary";
    return "text-muted-foreground";
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const updatedTags = (contact.tags || []).filter((t: string) => t !== tagToRemove);
    const { error } = await supabase
      .from("contacts")
      .update({ tags: updatedTags })
      .eq("id", contact.id);
    if (!error) { toast({ title: "Tag removed" }); onUpdate(); }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    const updatedTags = [...(contact.tags || []), newTag.trim()];
    const { error } = await supabase
      .from("contacts")
      .update({ tags: updatedTags })
      .eq("id", contact.id);
    if (!error) { toast({ title: "Tag added" }); setNewTag(""); setIsAddingTag(false); onUpdate(); }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="text-center">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarImage src={contact.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {contact.first_name?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-bold text-lg mb-2">{contact.first_name} {contact.last_name}</h3>
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="none"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - (contact.ai_score || 0) / 100)}`}
                  className={getScoreColor(contact.ai_score)} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${getScoreColor(contact.ai_score)}`}>{contact.ai_score || 0}</span>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">Lead Score</span>
          </div>
          <Badge variant="outline" className="mb-4">{contact.source || t('contact.unknownSource', 'Unknown Source')}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" asChild><a href={`tel:${contact.phone}`}><Phone className="h-4 w-4 mr-2" />{t('contact.call', 'Call')}</a></Button>
          <Button variant="outline" size="sm" asChild><a href={`mailto:${contact.email}`}><Mail className="h-4 w-4 mr-2" />{t('contact.email', 'Email')}</a></Button>
          <Button variant="outline" size="sm"><MessageSquare className="h-4 w-4 mr-2" />{t('contact.text', 'Text')}</Button>
          <Button variant="outline" size="sm"><Calendar className="h-4 w-4 mr-2" />{t('contact.schedule', 'Schedule')}</Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <div className="flex flex-wrap gap-2">
            {(contact.tags || []).map((tag: string, i: number) => (
              <Badge key={i} variant="secondary" className="cursor-pointer group">
                {tag}
                <X className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveTag(tag)} />
              </Badge>
            ))}
            {!isAddingTag ? (
              <Button variant="ghost" size="sm" onClick={() => setIsAddingTag(true)} className="h-6"><Plus className="h-3 w-3 mr-1" />{t('contact.addTag', 'Add Tag')}</Button>
            ) : (
              <div className="flex gap-2 w-full">
                <Input placeholder="New tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleAddTag()} className="h-8 text-sm" autoFocus />
                <Button size="sm" onClick={handleAddTag} className="h-8">Add</Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground">Last contacted:</span>
            <p className="font-medium">{contact.last_contact_date ? formatDistanceToNow(new Date(contact.last_contact_date), { addSuffix: true }) : t('contact.never', 'Never')}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Best time to contact:</span>
            <p className="font-medium">{contact.best_contact_time || t('contact.notSet', 'Not set')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
