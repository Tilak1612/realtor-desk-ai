import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Property } from "@/pages/Properties";
import PropertyDetailModal from "./PropertyDetailModal";

interface PropertiesListProps {
  properties: Property[];
  loading: boolean;
  onRefresh: () => void;
}

const PropertiesList = ({ properties, loading, onRefresh }: PropertiesListProps) => {
  const { toast } = useToast();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const formatPrice = (price: number | null) => {
    if (!price) return "POA";
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    const { error } = await supabase.from("property_listings").delete().eq("id", id);
    
    if (error) {
      toast({
        title: "Error deleting property",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Property deleted successfully" });
      onRefresh();
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border">
        <p className="text-muted-foreground">No properties found</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Property</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Beds/Baths</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>MLS#</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id} className="cursor-pointer" onClick={() => setSelectedProperty(property)}>
                <TableCell className="font-medium">{property.title}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {property.address}
                  {property.city && `, ${property.city}`}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs capitalize">
                    {property.property_type || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  {formatPrice(property.price)}
                </TableCell>
                <TableCell>
                  {property.bedrooms || "-"} / {property.bathrooms || "-"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={property.status} size="sm" />
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {property.mls_number || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProperty(property);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(property.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          open={!!selectedProperty}
          onOpenChange={(open) => !open && setSelectedProperty(null)}
          onUpdate={onRefresh}
        />
      )}
    </>
  );
};

export default PropertiesList;
