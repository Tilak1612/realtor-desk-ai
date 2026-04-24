import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseCsv, mapRowToContact } from "@/lib/csvImport";

interface ImportContactsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ImportContactsModal = ({ open, onOpenChange, onSuccess }: ImportContactsModalProps) => {
  const { t } = useTranslation();
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
        title: t("app.modals.importContacts.invalidFileType"),
        description: t("app.modals.importContacts.pleaseSelectCSV"),
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      setImporting(true);
      setProgress(0);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: t("app.modals.importContacts.notAuthenticated"),
          description: t("app.modals.importContacts.pleaseLogin"),
          variant: "destructive",
        });
        return;
      }

      const text = await file.text();
      const rows = parseCsv(text);

      // Build all payloads up front; skip rows with no usable identifier.
      const payloads = rows
        .map((row) => mapRowToContact(row, session.user.id))
        .filter((p): p is NonNullable<typeof p> => p !== null);

      if (payloads.length === 0) {
        toast({
          title: t("app.modals.importContacts.importFailed"),
          description: "We couldn't find any contacts in that file. Make sure your CSV has an Email column, or a Name / First Name / Last Name / Full Name column.",
          variant: "destructive",
        });
        setImporting(false);
        return;
      }

      // Batch insert in chunks so progress updates and a single bad row
      // doesn't fail the whole import.
      const CHUNK = 50;
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < payloads.length; i += CHUNK) {
        const chunk = payloads.slice(i, i + CHUNK);
        const { error, count } = await supabase
          .from("contacts")
          .insert(chunk, { count: "exact" });

        if (error) {
          errorCount += chunk.length;
        } else {
          successCount += count ?? chunk.length;
        }

        setProgress(Math.round(Math.min(i + chunk.length, payloads.length) / payloads.length * 100));
      }

      const skipped = rows.length - payloads.length;
      setResult({ success: successCount, errors: errorCount + skipped });

      toast({
        title: t("app.modals.importContacts.importComplete"),
        description: `${successCount} ${t("app.modals.importContacts.importSuccess")} ${errorCount + skipped} ${t("app.modals.importContacts.errors").toLowerCase()}.`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: t("app.modals.importContacts.importFailed"),
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
          <DialogTitle>{t("app.modals.importContacts.title")}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("a11y.dialogDescription.importContacts", "Import multiple contacts from a CSV file")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!result ? (
            <>
              {/* File Upload */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  {t("app.modals.importContacts.uploadDescription")}
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
                    <span>{t("app.modals.importContacts.chooseFile")}</span>
                  </Button>
                </label>
                {file && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {t("app.modals.importContacts.selected")} {file.name}
                  </p>
                )}
              </div>

              {/* CSV Format Guide */}
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{t("app.modals.importContacts.formatGuide")}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Headers are detected automatically — any common export works.
                  We recognize: <strong>First Name / Last Name / Full Name / Email / Phone / Company / Tags / Source</strong> and their common variants.
                </p>
                <p className="text-xs text-muted-foreground">
                  Rows without a name or email are skipped. Fields like Company Name we don't store in a dedicated column are kept in the contact's metadata.
                </p>
              </div>

              {/* Progress */}
              {importing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-center text-muted-foreground">
                    {t("app.modals.importContacts.importing")} {progress}%
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetModal} disabled={importing}>
                  {t("app.modals.importContacts.cancel")}
                </Button>
                <Button onClick={handleImport} disabled={!file || importing}>
                  {importing ? t("app.modals.importContacts.importingBtn") : t("app.modals.importContacts.import")}
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
                    <span className="font-semibold">{result.success} {t("app.modals.importContacts.imported")}</span>
                  </div>
                  {result.errors > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <span className="font-semibold">{result.errors} {t("app.modals.importContacts.errors")}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={resetModal} className="w-full">
                {t("app.modals.importContacts.done")}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportContactsModal;