import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImportContactsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ImportContactsModal = ({ open, onOpenChange, onSuccess }: ImportContactsModalProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: number; errors: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setResult(null);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file",
        variant: "destructive",
      });
    }
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(",");
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || "";
      });
      data.push(row);
    }

    return data;
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      setImporting(true);
      setProgress(0);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Not authenticated",
          description: "Please log in to import contacts",
          variant: "destructive",
        });
        return;
      }

      const text = await file.text();
      const rows = parseCSV(text);

      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        try {
          const { error } = await supabase.from("contacts").insert({
            user_id: session.user.id,
            first_name: row.firstname || row.first_name || row["first name"] || "",
            last_name: row.lastname || row.last_name || row["last name"] || "",
            email: row.email || null,
            phone: row.phone || row.mobile || null,
            source: row.source || "Import",
            tags: row.tags ? row.tags.split(";").map((t: string) => t.trim()) : [],
            metadata: {},
          });

          if (error) {
            errorCount++;
          } else {
            successCount++;
          }
        } catch {
          errorCount++;
        }

        setProgress(Math.round(((i + 1) / rows.length) * 100));
      }

      setResult({ success: successCount, errors: errorCount });

      toast({
        title: "Import complete",
        description: `${successCount} contacts imported successfully. ${errorCount} errors.`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setProgress(0);
    setResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!result ? (
            <>
              {/* File Upload */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a CSV file with your contacts
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload">
                  <Button variant="outline" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
                {file && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              {/* CSV Format Guide */}
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">CSV Format Guide</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Your CSV should include these columns:
                </p>
                <code className="text-xs bg-background p-2 rounded block">
                  FirstName, LastName, Email, Phone, Source, Tags
                </code>
              </div>

              {/* Progress */}
              {importing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-center text-muted-foreground">
                    Importing contacts... {progress}%
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetModal} disabled={importing}>
                  Cancel
                </Button>
                <Button onClick={handleImport} disabled={!file || importing}>
                  {importing ? "Importing..." : "Import"}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Results */}
              <div className="space-y-4 text-center py-6">
                <div className="flex justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span className="font-semibold">{result.success} Imported</span>
                  </div>
                  {result.errors > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <span className="font-semibold">{result.errors} Errors</span>
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={resetModal} className="w-full">
                Done
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportContactsModal;
