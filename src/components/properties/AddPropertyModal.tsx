import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface AddPropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddPropertyModal = ({ open, onOpenChange, onSuccess }: AddPropertyModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    property_type: "house",
    listing_type: "sale",
    status: "active",
    price: "",
    bedrooms: "",
    bathrooms: "",
    square_feet: "",
    lot_size: "",
    year_built: "",
    description: "",
    image_url: "",
    mls_number: "",
    source_url: "",
    data_source: "manual",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("properties").insert([{
        user_id: user.id,
        title: formData.title,
        address: formData.address,
        city: formData.city || null,
        province: formData.province || null,
        postal_code: formData.postal_code || null,
        property_type: formData.property_type,
        listing_type: formData.listing_type,
        status: formData.status as any,
        price: formData.price ? parseFloat(formData.price) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
        square_feet: formData.square_feet ? parseInt(formData.square_feet) : null,
        lot_size: formData.lot_size ? parseFloat(formData.lot_size) : null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
        description: formData.description || null,
        image_url: formData.image_url || null,
        mls_number: formData.mls_number || null,
        source_url: formData.source_url || null,
        data_source: formData.source_url ? 'url_scrape' : 'manual',
      }]);

      if (error) throw error;

      toast({ title: t("app.modals.addProperty.success") });
      onOpenChange(false);
      onSuccess();
      
      // Reset form
      setFormData({
        title: "",
        address: "",
        city: "",
        province: "",
        postal_code: "",
        property_type: "house",
        listing_type: "sale",
        status: "active",
        price: "",
        bedrooms: "",
        bathrooms: "",
        square_feet: "",
        lot_size: "",
        year_built: "",
        description: "",
        image_url: "",
        mls_number: "",
        source_url: "",
        data_source: "manual",
      });
    } catch (error: any) {
      toast({
        title: t("app.modals.addProperty.errorAdding"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("app.modals.addProperty.title")}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-primary/10 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              {t("app.modals.addProperty.quickAdd")}
            </h3>
            <Label htmlFor="source_url" className="text-sm">{t("app.modals.addProperty.pasteUrl")}</Label>
            <Input
              id="source_url"
              value={formData.source_url}
              onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
              placeholder={t("app.modals.addProperty.urlPlaceholder")}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {t("app.modals.addProperty.urlNote")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">{t("app.modals.addProperty.propertyTitle")} *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t("app.modals.addProperty.titlePlaceholder")}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="address">{t("app.modals.addProperty.address")} *</Label>
              <Input
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder={t("app.modals.addProperty.addressPlaceholder")}
              />
            </div>

            <div>
              <Label htmlFor="city">{t("app.modals.addProperty.city")}</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder={t("app.modals.addProperty.cityPlaceholder")}
              />
            </div>

            <div>
              <Label htmlFor="province">{t("app.modals.addProperty.province")}</Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                placeholder={t("app.modals.addProperty.provincePlaceholder")}
              />
            </div>

            <div>
              <Label htmlFor="property_type">{t("app.modals.addProperty.propertyType")}</Label>
              <Select value={formData.property_type} onValueChange={(val) => setFormData({ ...formData, property_type: val })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">{t("app.modals.addProperty.types.house")}</SelectItem>
                  <SelectItem value="condo">{t("app.modals.addProperty.types.condo")}</SelectItem>
                  <SelectItem value="townhouse">{t("app.modals.addProperty.types.townhouse")}</SelectItem>
                  <SelectItem value="land">{t("app.modals.addProperty.types.land")}</SelectItem>
                  <SelectItem value="commercial">{t("app.modals.addProperty.types.commercial")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">{t("app.modals.addProperty.status")}</Label>
              <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t("app.modals.addProperty.statuses.active")}</SelectItem>
                  <SelectItem value="pending">{t("app.modals.addProperty.statuses.pending")}</SelectItem>
                  <SelectItem value="sold">{t("app.modals.addProperty.statuses.sold")}</SelectItem>
                  <SelectItem value="coming_soon">{t("app.modals.addProperty.statuses.comingSoon")}</SelectItem>
                  <SelectItem value="off_market">{t("app.modals.addProperty.statuses.offMarket")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">{t("app.modals.addProperty.price")}</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="500000"
              />
            </div>

            <div>
              <Label htmlFor="bedrooms">{t("app.modals.addProperty.bedrooms")}</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                placeholder="3"
              />
            </div>

            <div>
              <Label htmlFor="bathrooms">{t("app.modals.addProperty.bathrooms")}</Label>
              <Input
                id="bathrooms"
                type="number"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                placeholder="2.5"
              />
            </div>

            <div>
              <Label htmlFor="square_feet">{t("app.modals.addProperty.squareFeet")}</Label>
              <Input
                id="square_feet"
                type="number"
                value={formData.square_feet}
                onChange={(e) => setFormData({ ...formData, square_feet: e.target.value })}
                placeholder="2000"
              />
            </div>

            <div>
              <Label htmlFor="mls_number">{t("app.modals.addProperty.mlsNumber")}</Label>
              <Input
                id="mls_number"
                value={formData.mls_number}
                onChange={(e) => setFormData({ ...formData, mls_number: e.target.value })}
                placeholder="C1234567"
              />
            </div>

            <div>
              <Label htmlFor="image_url">{t("app.modals.addProperty.imageUrl")}</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">{t("app.modals.addProperty.description")}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t("app.modals.addProperty.descriptionPlaceholder")}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("app.modals.addProperty.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("app.modals.addProperty.addProperty")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyModal;