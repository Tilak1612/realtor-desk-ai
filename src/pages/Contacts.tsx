import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List, Plus, Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
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
  metadata: any;
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [filters, setFilters] = useState<ContactFiltersState>({
    search: "",
    scoreRange: [0, 100],
    status: [],
    source: [],
    tags: [],
  });

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [contacts, filters]);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
    
    setUser(session.user);
    
    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    
    setProfile(profileData);
    fetchContacts();
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading contacts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...contacts];

    // Search filter
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

    // Score range filter
    filtered = filtered.filter(
      (c) =>
        (c.ai_score || 0) >= filters.scoreRange[0] &&
        (c.ai_score || 0) <= filters.scoreRange[1]
    );

    // Source filter
    if (filters.source.length > 0) {
      filtered = filtered.filter((c) => c.source && filters.source.includes(c.source));
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((c) =>
        c.tags?.some((tag) => filters.tags.includes(tag))
      );
    }

    setFilteredContacts(filtered);
  };

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
      title: "Export successful",
      description: `${filteredContacts.length} contacts exported to CSV`,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <DashboardNavbar user={user} profile={profile} />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Contacts</h1>
                <Badge variant="secondary" className="text-sm">
                  {filteredContacts.length}
                </Badge>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsImportModalOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  disabled={filteredContacts.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
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
                  const { error } = await supabase
                    .from("contacts")
                    .delete()
                    .in("id", selectedContacts);

                  if (!error) {
                    toast({ title: "Contacts deleted successfully" });
                    setSelectedContacts([]);
                    fetchContacts();
                  }
                }}
              />
            )}

            {/* View Toggle and Content */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
              <div className="flex justify-end mb-4">
                <TabsList>
                  <TabsTrigger value="table">
                    <List className="h-4 w-4 mr-2" />
                    Table
                  </TabsTrigger>
                  <TabsTrigger value="cards">
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Cards
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
        </main>
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
    </div>
  );
};

export default Contacts;
