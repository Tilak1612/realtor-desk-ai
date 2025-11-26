import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, MapPin, Bed, Bath, Maximize, DollarSign, Calendar, Edit } from "lucide-react";
import type { Property } from "@/pages/Properties";

interface PropertyDetailModalProps {
  property: Property;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const PropertyDetailModal = ({ property, open, onOpenChange, onUpdate }: PropertyDetailModalProps) => {
  const formatPrice = (price: number | null) => {
    if (!price) return "Price on Request";
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(price);
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl">{property.title}</DialogTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {property.address}
                  {property.city && `, ${property.city}`}
                  {property.province && `, ${property.province}`}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={getStatusColor(property.status)}>
                {property.status}
              </Badge>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Image */}
          {property.image_url ? (
            <div className="w-full h-64 rounded-lg overflow-hidden bg-muted">
              <img
                src={property.image_url}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-64 rounded-lg bg-muted flex items-center justify-center">
              <Home className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}

          {/* Price and Key Details */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4 md:col-span-2 p-4 bg-card border rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Price</span>
              </div>
              <div className="text-3xl font-bold text-primary">
                {formatPrice(property.price)}
              </div>
            </div>

            <div className="p-4 bg-card border rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Bed className="h-4 w-4" />
                <span className="text-sm">Bedrooms</span>
              </div>
              <div className="text-2xl font-semibold">
                {property.bedrooms || "-"}
              </div>
            </div>

            <div className="p-4 bg-card border rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Bath className="h-4 w-4" />
                <span className="text-sm">Bathrooms</span>
              </div>
              <div className="text-2xl font-semibold">
                {property.bathrooms || "-"}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Property Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <DetailItem label="Property Type" value={property.property_type || "N/A"} />
              <DetailItem label="Listing Type" value={property.listing_type} />
              <DetailItem
                label="Square Feet"
                value={property.square_feet ? `${property.square_feet.toLocaleString()} sqft` : "N/A"}
              />
              <DetailItem
                label="Lot Size"
                value={property.lot_size ? `${property.lot_size.toLocaleString()} acres` : "N/A"}
              />
              <DetailItem label="Year Built" value={property.year_built || "N/A"} />
              <DetailItem label="MLS Number" value={property.mls_number || "N/A"} />
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>
            </>
          )}

          {/* Timestamps */}
          <Separator />
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Listed: {new Date(property.created_at).toLocaleDateString()}</span>
            </div>
            <span>•</span>
            <span>Days on Market: {property.days_on_market}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="space-y-1">
    <div className="text-sm text-muted-foreground">{label}</div>
    <div className="font-medium capitalize">{value}</div>
  </div>
);

export default PropertyDetailModal;
