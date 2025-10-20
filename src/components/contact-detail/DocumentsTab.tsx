import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, FileText, Download, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DocumentsTabProps {
  contactId: string;
}

const DocumentsTab = ({ contactId }: DocumentsTabProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [contactId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_documents")
        .select("*")
        .eq("contact_id", contactId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      // Error silently handled
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}/${contactId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("contact-documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("contact_documents").insert({
        contact_id: contactId,
        user_id: session.user.id,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        file_type: file.type,
      });

      if (dbError) throw dbError;

      toast({ title: "Document uploaded successfully" });
      fetchDocuments();
    } catch (error: any) {
      toast({
        title: "Error uploading document",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (document: any) => {
    const { data, error } = await supabase.storage
      .from("contact-documents")
      .download(document.file_path);

    if (error) {
      toast({
        title: "Error downloading document",
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = document.file_name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (document: any) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    const { error: storageError } = await supabase.storage
      .from("contact-documents")
      .remove([document.file_path]);

    if (storageError) {
      toast({
        title: "Error deleting document",
        variant: "destructive",
      });
      return;
    }

    const { error: dbError } = await supabase
      .from("contact_documents")
      .delete()
      .eq("id", document.id);

    if (!dbError) {
      toast({ title: "Document deleted" });
      fetchDocuments();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop files here, or click to browse
          </p>
          <input
            type="file"
            onChange={handleUpload}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <Button variant="outline" asChild disabled={uploading}>
              <span>{uploading ? "Uploading..." : "Choose File"}</span>
            </Button>
          </label>
        </div>

        {/* Documents List */}
        {documents.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No documents uploaded yet.
          </p>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{doc.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(doc.file_size)} •{" "}
                    {format(new Date(doc.created_at), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownload(doc)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(doc)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
