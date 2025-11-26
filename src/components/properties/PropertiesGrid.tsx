import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, Bed, Bath, Maximize, MapPin, DollarSign, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Property } from "@/pages/Properties";
import PropertyDetailModal from "./PropertyDetailModal";

interface PropertiesGridProps {
  properties: Property[];
  loading: boolean;
  onRefresh: () => void;
}

const PropertiesGrid = ({ properties, loading, onRefresh }: PropertiesGridProps) => {
  const { toast } = useToast();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "sold":
        return "bg-muted text-muted-foreground";
      case "coming_soon":
        return "bg-info/10 text-info border-info/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "Price on Request";
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this property?")) return;

    const { error } = await supabase.from("properties").delete().eq("id", id);
    
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No properties found</h3>
        <p className="text-muted-foreground mb-4">
          Start by adding your first property listing
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card
            key={property.id}
            className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-border group"
            onClick={() => setSelectedProperty(property)}
          >
            {/* Property Image */}
            <div className="relative h-48 bg-muted overflow-hidden">
              {property.image_url ? (
                <img
                  src={property.image_url}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="h-16 w-16 text-muted-foreground/50" />
                </div>
              )}
              <div className="absolute top-3 right-3">
                <Badge variant="outline" className={getStatusColor(property.status)}>
                  {property.status}
                </Badge>
              </div>
              {property.mls_number && (
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                    MLS# {property.mls_number}
                  </Badge>
                </div>
              )}
            </div>

            <CardContent className="p-4 space-y-3">
              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(property.price)}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleDelete(property.id, e)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>

              {/* Address */}
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">
                  {property.address}
                  {property.city && `, ${property.city}`}
                  {property.province && `, ${property.province}`}
                </span>
              </div>

              {/* Property Details */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                {property.bedrooms !== null && (
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms !== null && (
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                )}
                {property.square_feet !== null && (
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    <span>{property.square_feet.toLocaleString()} sqft</span>
                  </div>
                )}
              </div>

              {/* Property Type */}
              {property.property_type && (
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="outline" className="text-xs">
                    {property.property_type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {property.listing_type}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
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

export default PropertiesGrid;
