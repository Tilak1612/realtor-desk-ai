import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Mail, Calendar } from "lucide-react";

interface ImportContactsProps {
  userId: string | null;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}

const ImportContacts = ({ userId, onNext, onSkip, onBack }: ImportContactsProps) => {
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedCrm, setSelectedCrm] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setUploadedFile(file);
      toast.success("CSV file selected!");
    } else {
      toast.error("Please upload a valid CSV file");
    }
  };

  const handleOAuthConnect = async (provider: "google" | "azure") => {
    try {
      const redirectUrl = `${window.location.origin}/onboarding`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          scopes: provider === "google" 
            ? "https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/gmail.readonly"
            : "Contacts.Read Mail.Read"
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(`Failed to connect ${provider}`);
    }
  };

  const handleProcessCSV = async () => {
    if (!uploadedFile || !userId) return;

    setLoading(true);
    try {
      const text = await uploadedFile.text();
      const rows = text.split("\n").slice(1); // Skip header
      const contacts = rows.map(row => {
        const [firstName, lastName, email, phone] = row.split(",");
        return {
          user_id: userId,
          first_name: firstName?.trim(),
          last_name: lastName?.trim(),
          email: email?.trim(),
          phone: phone?.trim(),
          source: "csv_import",
        };
      }).filter(c => c.email); // Only import rows with email

      const { error } = await supabase.from("contacts").insert(contacts);
      if (error) throw error;

      toast.success(`Imported ${contacts.length} contacts!`);
      onNext();
    } catch (error: any) {
      toast.error("Failed to import contacts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Import Your Contacts</h2>
        <p className="text-muted-foreground">Choose how you'd like to add your contacts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CSV Upload */}
        <Card className="cursor-pointer hover:border-primary transition-all">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Upload CSV</CardTitle>
            <CardDescription>Import from spreadsheet</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              <Button variant="outline" className="w-full" asChild>
                <span>{uploadedFile ? uploadedFile.name : "Choose File"}</span>
              </Button>
            </label>
            {uploadedFile && (
              <Button onClick={handleProcessCSV} disabled={loading} className="w-full mt-2">
                {loading ? "Importing..." : "Import Contacts"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Gmail */}
        <Card className="cursor-pointer hover:border-primary transition-all">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Gmail</CardTitle>
            <CardDescription>Connect Google account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleOAuthConnect("google")} variant="outline" className="w-full">
              Connect Gmail
            </Button>
          </CardContent>
        </Card>

        {/* Outlook */}
        <Card className="cursor-pointer hover:border-primary transition-all">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Outlook</CardTitle>
            <CardDescription>Connect Microsoft account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleOAuthConnect("azure")} variant="outline" className="w-full">
              Connect Outlook
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Import from CRM */}
      <Card>
        <CardHeader>
          <CardTitle>Import from Another CRM</CardTitle>
          <CardDescription>Migrate your existing CRM data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Your Current CRM</Label>
            <Select value={selectedCrm} onValueChange={setSelectedCrm}>
              <SelectTrigger>
                <SelectValue placeholder="Choose CRM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boldtrail">BoldTrail</SelectItem>
                <SelectItem value="lofty">Lofty</SelectItem>
                <SelectItem value="ixact">IXACT Contact</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {selectedCrm && (
            <p className="text-sm text-muted-foreground">
              Export your contacts from {selectedCrm} as a CSV file and upload it above.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="button" variant="ghost" onClick={onSkip} className="flex-1">
          Skip - I'll add contacts later
        </Button>
      </div>
    </div>
  );
};

export default ImportContacts;
