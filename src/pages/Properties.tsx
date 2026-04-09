import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List, Plus, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
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
  images: unknown;
  virtual_tour_url: string | null;
  features: unknown;
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [user, setUser] = useState<unknown>(null);
  const [profile, setProfile] = useState<unknown>(null);
  const [filters, setFilters] = useState<PropertyFiltersState>({
    search: "",
    status: [],
    propertyType: [],
    priceRange: [0, 10000000],
    bedrooms: "any",
  });

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("property_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
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
    fetchProperties();
  }, [fetchProperties, navigate]);

  const applyFilters = useCallback(() => {
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
  }, [properties, filters]);

  useEffect(() => {
    checkAuthAndFetch();
  }, [checkAuthAndFetch]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

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
    <AppLayout user={user} profile={profile}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">{t('app.properties.title')}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {statusCounts.total} {t('app.common.all')}
                </Badge>
                <Badge variant="outline" className="text-xs bg-status-active/10 text-status-active border-status-active/20">
                  {statusCounts.active} {t('app.properties.active')}
                </Badge>
                <Badge variant="outline" className="text-xs bg-status-pending/10 text-status-pending border-status-pending/20">
                  {statusCounts.pending} {t('app.properties.pending')}
                </Badge>
                <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">
                  {statusCounts.sold} {t('app.properties.sold')}
                </Badge>
              </div>
            </div>
          </div>
          <Button size="sm" className="h-8 text-xs" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            {t('app.properties.addProperty')}
          </Button>
        </div>

        {/* Filters */}
        <PropertyFilters filters={filters} onFiltersChange={setFilters} />

        {/* View Toggle and Content */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
          <div className="flex justify-end mb-4">
            <TabsList className="h-8">
              <TabsTrigger value="grid" className="text-xs h-7 px-3">
                <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="list" className="text-xs h-7 px-3">
                <List className="h-3.5 w-3.5 mr-1.5" />
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

      <AddPropertyModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={fetchProperties}
      />
    </AppLayout>
  );
};

export default Properties;
