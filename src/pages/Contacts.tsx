import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List, Plus, Upload, Download, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import ContactsTable from "@/components/contacts/ContactsTable";
import ContactsCardView from "@/components/contacts/ContactsCardView";
import AddContactModal from "@/components/contacts/AddContactModal";
import ImportContactsModal from "@/components/contacts/ImportContactsModal";
import ContactFilters from "@/components/contacts/ContactFilters";
import BulkActionsToolbar from "@/components/contacts/BulkActionsToolbar";

export interface Contact {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  tags: string[] | null;
  ai_score: number | null;
  last_contact_date: string | null;
  best_contact_time: string | null;
  metadata: unknown;
  created_at: string;
  updated_at: string;
}

export interface ContactFiltersState {
  search: string;
  scoreRange: [number, number];
  status: string[];
  source: string[];
  tags: string[];
}

const Contacts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [user, setUser] = useState<unknown>(null);
  const [profile, setProfile] = useState<unknown>(null);
  const [filters, setFilters] = useState<ContactFiltersState>({
    search: "",
    scoreRange: [0, 100],
    status: [],
    source: [],
    tags: [],
  });

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      toast({
        title: t('app.common.error'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  const checkAuthAndFetch = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
    
    setUser(session.user);
    
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    
    setProfile(profileData);
    fetchContacts();
  }, [fetchContacts, navigate]);

  const applyFilters = useCallback(() => {
    let filtered = [...contacts];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.first_name?.toLowerCase().includes(searchLower) ||
          c.last_name?.toLowerCase().includes(searchLower) ||
          c.email?.toLowerCase().includes(searchLower) ||
          c.phone?.includes(searchLower)
      );
    }

    filtered = filtered.filter(
      (c) =>
        (c.ai_score || 0) >= filters.scoreRange[0] &&
        (c.ai_score || 0) <= filters.scoreRange[1]
    );

    if (filters.source.length > 0) {
      filtered = filtered.filter((c) => c.source && filters.source.includes(c.source));
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter((c) =>
        c.tags?.some((tag) => filters.tags.includes(tag))
      );
    }

    setFilteredContacts(filtered);
  }, [contacts, filters]);

  useEffect(() => {
    checkAuthAndFetch();
  }, [checkAuthAndFetch]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleExportCSV = () => {
    const csvData = filteredContacts.map((c) => ({
      FirstName: c.first_name || "",
      LastName: c.last_name || "",
      Email: c.email || "",
      Phone: c.phone || "",
      Source: c.source || "",
      Score: c.ai_score || 0,
      Tags: c.tags?.join("; ") || "",
    }));

    const headers = Object.keys(csvData[0] || {}).join(",");
    const rows = csvData.map((row) => Object.values(row).join(",")).join("\n");
    const csv = `${headers}\n${rows}`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: t('app.common.success'),
      description: `${filteredContacts.length} ${t('app.contacts.title').toLowerCase()}`,
    });
  };

  const handleStartCallSession = () => {
    // Get contacts with phone numbers that need follow-up
    const callableContacts = filteredContacts
      .filter(c => c.phone)
      .slice(0, 10);
    
    if (callableContacts.length === 0) {
      toast({
        title: "No contacts to call",
        description: "Filter your contacts or add phone numbers to start a call session",
        variant: "destructive",
      });
      return;
    }

    const contactQueue = callableContacts.map(c => c.id);
    navigate(`/call-workflow/${contactQueue[0]}`, {
      state: { contactQueue }
    });
  };

  return (
    <AppLayout user={user} profile={profile}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-semibold">{t('app.contacts.title')}</h1>
            <Badge variant="secondary" className="text-xs">
              {filteredContacts.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="default"
              size="sm"
              className="h-8 text-xs font-semibold"
              onClick={handleStartCallSession}
            >
              <Phone className="h-3.5 w-3.5 mr-1.5" />
              {t("app.contacts.startCallSession", "Start Call Session")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setIsImportModalOpen(true)}
            >
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              {t('app.contacts.importContacts')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={handleExportCSV}
              disabled={filteredContacts.length === 0}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              {t('app.contacts.exportContacts')}
            </Button>
            <Button size="sm" className="h-8 text-xs" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              {t('app.contacts.addContact')}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <ContactFilters filters={filters} onFiltersChange={setFilters} />

        {/* Bulk Actions */}
        {selectedContacts.length > 0 && (
          <BulkActionsToolbar
            selectedCount={selectedContacts.length}
            onClearSelection={() => setSelectedContacts([])}
            onBulkDelete={async () => {
              // PostgREST serializes .in() into ?id=in.(uuid,uuid,...) which
              // blows past URL length limits (~16KB) around ~350 UUIDs.
              // Chunk the delete so large selections (1000+) actually work.
              const CHUNK = 200;
              let deleted = 0;
              let failed = 0;
              for (let i = 0; i < selectedContacts.length; i += CHUNK) {
                const chunk = selectedContacts.slice(i, i + CHUNK);
                const { error } = await supabase
                  .from("contacts")
                  .delete()
                  .in("id", chunk);
                if (error) {
                  console.error("Bulk delete chunk failed:", error);
                  failed += chunk.length;
                } else {
                  deleted += chunk.length;
                }
              }

              if (failed === 0) {
                toast({
                  title: t('app.notifications.contactDeleted'),
                  description: `Deleted ${deleted} contact${deleted === 1 ? "" : "s"}.`,
                });
              } else {
                toast({
                  title: "Partial delete",
                  description: `Deleted ${deleted}, failed ${failed}. Refreshing…`,
                  variant: "destructive",
                });
              }
              setSelectedContacts([]);
              fetchContacts();
            }}
          />
        )}

        {/* View Toggle and Content */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "cards" | "table")}>
          <div className="flex justify-end mb-4">
            <TabsList className="h-8">
              <TabsTrigger value="table" className="text-xs h-7 px-3">
                <List className="h-3.5 w-3.5 mr-1.5" />
                {t("app.contacts.viewTable", "Table")}
              </TabsTrigger>
              <TabsTrigger value="cards" className="text-xs h-7 px-3">
                <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
                {t("app.contacts.viewCards", "Cards")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="table">
            <ContactsTable
              contacts={filteredContacts}
              loading={loading}
              selectedContacts={selectedContacts}
              onSelectionChange={setSelectedContacts}
              onRefresh={fetchContacts}
            />
          </TabsContent>

          <TabsContent value="cards">
            <ContactsCardView
              contacts={filteredContacts}
              loading={loading}
              onRefresh={fetchContacts}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AddContactModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={fetchContacts}
      />

      <ImportContactsModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onSuccess={fetchContacts}
      />
    </AppLayout>
  );
};

export default Contacts;
