import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List, Plus, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import PropertiesGrid from "@/components/properties/PropertiesGrid";
import PropertiesList from "@/components/properties/PropertiesList";
import PropertyFilters from "@/components/properties/PropertyFilters";
import AddPropertyModal from "@/components/properties/AddPropertyModal";

export interface Property {
  id: string;
  user_id: string;
  title: string;
  address: string;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  property_type: string | null;
  listing_type: string;
  status: string;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  lot_size: number | null;
  year_built: number | null;
  description: string | null;
  image_url: string | null;
  images: any;
  virtual_tour_url: string | null;
  features: any;
  mls_number: string | null;
  days_on_market: number;
  contact_id: string | null;
  deal_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyFiltersState {
  search: string;
  status: string[];
  propertyType: string[];
  priceRange: [number, number];
  bedrooms: string;
}

const Properties = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [filters, setFilters] = useState<PropertyFiltersState>({
    search: "",
    status: [],
    propertyType: [],
    priceRange: [0, 10000000],
    bedrooms: "any",
  });

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [properties, filters]);

  const checkAuthAndFetch = async () => {
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
    fetchProperties();
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading properties",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchLower) ||
          p.address?.toLowerCase().includes(searchLower) ||
          p.city?.toLowerCase().includes(searchLower) ||
          p.mls_number?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter((p) => filters.status.includes(p.status));
    }

    if (filters.propertyType.length > 0) {
      filtered = filtered.filter((p) => p.property_type && filters.propertyType.includes(p.property_type));
    }

    filtered = filtered.filter(
      (p) =>
        (p.price || 0) >= filters.priceRange[0] &&
        (p.price || 0) <= filters.priceRange[1]
    );

    if (filters.bedrooms !== "any") {
      const bedroomCount = parseInt(filters.bedrooms);
      filtered = filtered.filter((p) => (p.bedrooms || 0) >= bedroomCount);
    }

    setFilteredProperties(filtered);
  };

  const getStatusCounts = () => {
    return {
      active: properties.filter((p) => p.status === "active").length,
      pending: properties.filter((p) => p.status === "pending").length,
      sold: properties.filter((p) => p.status === "sold").length,
      total: properties.length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar user={user} profile={profile} />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold">Properties</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="secondary">
                      {statusCounts.total} Total
                    </Badge>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      {statusCounts.active} Active
                    </Badge>
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                      {statusCounts.pending} Pending
                    </Badge>
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                      {statusCounts.sold} Sold
                    </Badge>
                  </div>
                </div>
              </div>
              <Button onClick={() => setIsAddModalOpen(true)} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </div>

            {/* Filters */}
            <PropertyFilters filters={filters} onFiltersChange={setFilters} />

            {/* View Toggle and Content */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
              <div className="flex justify-end mb-4">
                <TabsList>
                  <TabsTrigger value="grid">
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <List className="h-4 w-4 mr-2" />
                    List
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="grid">
                <PropertiesGrid
                  properties={filteredProperties}
                  loading={loading}
                  onRefresh={fetchProperties}
                />
              </TabsContent>

              <TabsContent value="list">
                <PropertiesList
                  properties={filteredProperties}
                  loading={loading}
                  onRefresh={fetchProperties}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <AddPropertyModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={fetchProperties}
      />
    </div>
  );
};

export default Properties;
