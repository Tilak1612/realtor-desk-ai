import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ContactInfoProps {
  contact: any;
}

const ContactInfo = ({ contact }: ContactInfoProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied to clipboard` });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {contact.email && (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-muted-foreground">Email</span>
              <p className="font-medium break-all">{contact.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(contact.email, "Email")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}

        {contact.phone && (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-muted-foreground">Phone</span>
              <p className="font-medium">{contact.phone}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(contact.phone, "Phone")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}

        {contact.metadata?.company && (
          <div>
            <span className="text-muted-foreground">Company</span>
            <p className="font-medium">{contact.metadata.company}</p>
          </div>
        )}

        {contact.metadata?.license_number && (
          <div>
            <span className="text-muted-foreground">License Number</span>
            <p className="font-medium">{contact.metadata.license_number}</p>
          </div>
        )}

        {contact.source && (
          <div>
            <span className="text-muted-foreground">Source</span>
            <p className="font-medium">{contact.source}</p>
          </div>
        )}

        <div>
          <span className="text-muted-foreground">Created</span>
          <p className="font-medium">
            {format(new Date(contact.created_at), "MMM d, yyyy")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
