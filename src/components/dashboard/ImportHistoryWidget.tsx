import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { History, RefreshCw, Eye, AlertCircle, CheckCircle, Clock, XCircle, Radio } from "lucide-react";
import { format } from "date-fns";

interface ImportRecord {
  id: string;
  import_type: string;
  source_url: string;
  status: string;
  total_records: number | null;
  saved_records: number | null;
  duplicate_records: number | null;
  failed_records: number | null;
  error_message: string | null;
  parser_version: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

const statusConfig: Record<string, { icon: React.ElementType; variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
  pending: { icon: Clock, variant: "secondary", label: "Pending" },
  running: { icon: RefreshCw, variant: "default", label: "Running" },
  completed: { icon: CheckCircle, variant: "outline", label: "Completed" },
  failed: { icon: XCircle, variant: "destructive", label: "Failed" },
  partial: { icon: AlertCircle, variant: "secondary", label: "Partial" },
};

export function ImportHistoryWidget() {
  const [imports, setImports] = useState<ImportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImport, setSelectedImport] = useState<ImportRecord | null>(null);
  const [isLive, setIsLive] = useState(true);

  const fetchImports = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("import_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setImports(data || []);
    } catch (err) {
      console.error("Failed to fetch import history:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to realtime updates
  useEffect(() => {
    fetchImports();

    if (!isLive) return;

    const channel = supabase
      .channel('import-history-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'import_history'
        },
        (payload) => {
          console.log('Import history change:', payload);
          
          if (payload.eventType === 'INSERT') {
            setImports(prev => [payload.new as ImportRecord, ...prev].slice(0, 50));
          } else if (payload.eventType === 'UPDATE') {
            setImports(prev => 
              prev.map(imp => 
                imp.id === (payload.new as ImportRecord).id 
                  ? payload.new as ImportRecord 
                  : imp
              )
            );
            // Also update selected import if it's the one being viewed
            setSelectedImport(prev => 
              prev?.id === (payload.new as ImportRecord).id 
                ? payload.new as ImportRecord 
                : prev
            );
          } else if (payload.eventType === 'DELETE') {
            setImports(prev => prev.filter(imp => imp.id !== (payload.old as ImportRecord).id));
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchImports, isLive]);

  const runningCount = imports.filter(i => i.status === 'running').length;

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${status === 'running' ? 'animate-spin' : ''}`} />
        {config.label}
      </Badge>
    );
  };

  const formatImportType = (type: string) => {
    const types: Record<string, string> = {
      realtor_listings: "Property Listings",
      realtor_agents: "Agent Intelligence",
      combined_area: "Area Import",
    };
    return types[type] || type;
  };

  const truncateUrl = (url: string, maxLength = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          Import History
          {isLive && (
            <Badge variant="outline" className="ml-2 flex items-center gap-1 text-xs">
              <Radio className={`h-3 w-3 ${runningCount > 0 ? 'text-green-500 animate-pulse' : 'text-muted-foreground'}`} />
              Live
            </Badge>
          )}
          {runningCount > 0 && (
            <Badge variant="default" className="ml-1 text-xs">
              {runningCount} running
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button 
            variant={isLive ? "default" : "outline"} 
            size="sm" 
            onClick={() => setIsLive(!isLive)}
            className="h-7 text-xs"
          >
            {isLive ? "Live" : "Paused"}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={fetchImports} disabled={loading}>
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {imports.length === 0 && !loading ? (
          <div className="text-center py-6 text-muted-foreground">
            <History className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No imports yet</p>
            <p className="text-xs">Your import history will appear here</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Records</TableHead>
                  <TableHead className="text-center">Saved</TableHead>
                  <TableHead className="text-center">Duplicates</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {imports.map((imp) => (
                  <TableRow key={imp.id}>
                    <TableCell className="font-medium">
                      {formatImportType(imp.import_type)}
                    </TableCell>
                    <TableCell>{getStatusBadge(imp.status)}</TableCell>
                    <TableCell className="text-center">
                      {imp.total_records ?? "-"}
                    </TableCell>
                    <TableCell className="text-center text-green-600">
                      {imp.saved_records ?? "-"}
                    </TableCell>
                    <TableCell className="text-center text-amber-600">
                      {imp.duplicate_records ?? "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(imp.created_at), "MMM d, h:mm a")}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setSelectedImport(imp)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Import Details</DialogTitle>
                          </DialogHeader>
                          {selectedImport && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Type</p>
                                  <p className="font-medium">{formatImportType(selectedImport.import_type)}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Status</p>
                                  {getStatusBadge(selectedImport.status)}
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Parser Version</p>
                                  <p className="font-medium">{selectedImport.parser_version || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Created</p>
                                  <p className="font-medium">
                                    {format(new Date(selectedImport.created_at), "MMM d, yyyy h:mm a")}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Source URL</p>
                                <p className="text-sm bg-muted p-2 rounded break-all">
                                  {selectedImport.source_url}
                                </p>
                              </div>

                              <div className="grid grid-cols-4 gap-2 text-center">
                                <div className="bg-muted p-3 rounded">
                                  <p className="text-2xl font-bold">{selectedImport.total_records ?? 0}</p>
                                  <p className="text-xs text-muted-foreground">Total</p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-950 p-3 rounded">
                                  <p className="text-2xl font-bold text-green-600">{selectedImport.saved_records ?? 0}</p>
                                  <p className="text-xs text-muted-foreground">Saved</p>
                                </div>
                                <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded">
                                  <p className="text-2xl font-bold text-amber-600">{selectedImport.duplicate_records ?? 0}</p>
                                  <p className="text-xs text-muted-foreground">Duplicates</p>
                                </div>
                                <div className="bg-red-50 dark:bg-red-950 p-3 rounded">
                                  <p className="text-2xl font-bold text-red-600">{selectedImport.failed_records ?? 0}</p>
                                  <p className="text-xs text-muted-foreground">Failed</p>
                                </div>
                              </div>

                              {selectedImport.error_message && (
                                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded">
                                  <p className="text-sm text-destructive flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    {selectedImport.error_message}
                                  </p>
                                </div>
                              )}

                              {selectedImport.started_at && selectedImport.completed_at && (
                                <div>
                                  <p className="text-sm text-muted-foreground">Duration</p>
                                  <p className="font-medium">
                                    {Math.round(
                                      (new Date(selectedImport.completed_at).getTime() -
                                        new Date(selectedImport.started_at).getTime()) /
                                        1000
                                    )}{" "}
                                    seconds
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
