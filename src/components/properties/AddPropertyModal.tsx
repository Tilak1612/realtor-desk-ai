import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle, Download, CheckCircle } from "lucide-react";
import { validateField, ValidationErrors } from "./PropertyValidation";
import { fetchSingleListing, validateRealtorUrl } from "@/lib/apify";

interface AddPropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PROVINCES = [
  { code: "ON", name: "Ontario" },
  { code: "BC", name: "British Columbia" },
  { code: "AB", name: "Alberta" },
  { code: "QC", name: "Quebec" },
  { code: "MB", name: "Manitoba" },
  { code: "SK", name: "Saskatchewan" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland & Labrador" },
  { code: "PE", name: "Prince Edward Island" },
];

const AddPropertyModal = ({ open, onOpenChange, onSuccess }: AddPropertyModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importError, setImportError] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
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

  // Validate on field change
  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Only show errors for touched fields
    if (touched.has(field)) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  // Mark field as touched on blur
  const handleBlur = (field: string) => {
    setTouched((prev) => new Set([...prev, field]));
    const error = validateField(field, formData[field as keyof typeof formData] || "");
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Validate all fields before submit
  const validateAll = (): boolean => {
    const fieldsToValidate = ["title", "address", "city", "province", "postal_code", "price", "mls_number"];
    const newErrors: ValidationErrors = {};
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      const value = formData[field as keyof typeof formData] || "";
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Mark all as touched to show errors
    setTouched(new Set(fieldsToValidate));
    setErrors(newErrors);
    return isValid;
  };

  const handleImportFromUrl = async () => {
    const url = formData.source_url.trim();
    if (!url) return;

    const validation = validateRealtorUrl(url);
    if (!validation.valid) {
      setImportStatus('error');
      setImportError(validation.error || 'Invalid URL');
      return;
    }

    setImporting(true);
    setImportStatus('idle');
    setImportError('');

    try {
      const listing = await fetchSingleListing(url);
      if (!listing) {
        setImportStatus('error');
        setImportError(t('properties.importFailed', "Couldn't import this listing. Please fill details manually."));
        return;
      }

      const provCode = PROVINCES.find(p =>
        p.name.toLowerCase() === (listing.province || '').toLowerCase()
      )?.code || listing.province || '';

      setFormData(prev => ({
        ...prev,
        title: listing.address || prev.title,
        address: listing.address || prev.address,
        city: listing.city || prev.city,
        province: provCode || prev.province,
        postal_code: listing.postalCode || prev.postal_code,
        mls_number: listing.mlsNumber || prev.mls_number,
        price: listing.price ? String(listing.price).replace(/[^0-9.]/g, '') : prev.price,
        bedrooms: listing.bedrooms ? String(listing.bedrooms) : prev.bedrooms,
        bathrooms: listing.bathrooms ? String(listing.bathrooms) : prev.bathrooms,
        square_feet: listing.squareFeet ? String(listing.squareFeet) : prev.square_feet,
        image_url: listing.imageUrl || prev.image_url,
        description: listing.description || prev.description,
        property_type: listing.propertyType?.toLowerCase() || prev.property_type,
        data_source: 'url_scrape',
      }));
      setImportStatus('success');
    } catch (err: unknown) {
      setImportStatus('error');
      setImportError(err instanceof Error ? err.message : t('properties.importError', 'Import failed. Please fill details manually.'));
    } finally {
      setImporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("property_listings").insert([{
        user_id: user.id,
        title: formData.title,
        address: formData.address,
        city: formData.city || null,
        province: formData.province || null,
        postal_code: formData.postal_code || null,
        property_type: formData.property_type,
        listing_type: formData.listing_type,
        status: formData.status as "active" | "coming_soon" | "off_market" | "pending" | "sold",
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
      setErrors({});
      setTouched(new Set());
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

  const renderFieldError = (field: string) => {
    if (!touched.has(field) || !errors[field]) return null;
    return (
      <div className="flex items-center gap-1 mt-1 text-destructive text-xs">
        <AlertCircle className="h-3 w-3" />
        <span>{errors[field]}</span>
      </div>
    );
  };

  const hasErrors = Object.values(errors).some((e) => e);

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
            <div className="flex gap-2 mt-2">
              <Input
                id="source_url"
                value={formData.source_url}
                onChange={(e) => { handleFieldChange("source_url", e.target.value); setImportStatus('idle'); }}
                placeholder={t("app.modals.addProperty.urlPlaceholder")}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleImportFromUrl}
                disabled={importing || !formData.source_url.trim()}
                variant="secondary"
                className="gap-2"
              >
                {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {importing ? t('properties.fetching', 'Fetching...') : t('properties.import', 'Import')}
              </Button>
            </div>
            {importStatus === 'success' && (
              <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {t('properties.importSuccess', 'Imported from Realtor.ca — review and save below')}
              </p>
            )}
            {importStatus === 'error' && (
              <p className="text-destructive text-xs mt-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {importError}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {t("app.modals.addProperty.urlNote")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div className="col-span-2">
              <Label htmlFor="title">{t("app.modals.addProperty.propertyTitle")} *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                onBlur={() => handleBlur("title")}
                placeholder={t("app.modals.addProperty.titlePlaceholder")}
                className={errors.title && touched.has("title") ? "border-destructive" : ""}
              />
              {renderFieldError("title")}
            </div>

            {/* Street Address */}
            <div className="col-span-2">
              <Label htmlFor="address">{t("app.modals.addProperty.address")} *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleFieldChange("address", e.target.value)}
                onBlur={() => handleBlur("address")}
                placeholder="123 Main Street"
                className={errors.address && touched.has("address") ? "border-destructive" : ""}
              />
              {renderFieldError("address")}
            </div>

            {/* City */}
            <div>
              <Label htmlFor="city">{t("app.modals.addProperty.city")} *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleFieldChange("city", e.target.value)}
                onBlur={() => handleBlur("city")}
                placeholder="Toronto"
                className={errors.city && touched.has("city") ? "border-destructive" : ""}
              />
              {renderFieldError("city")}
            </div>

            {/* Province */}
            <div>
              <Label htmlFor="province">{t("app.modals.addProperty.province")} *</Label>
              <Select 
                value={formData.province} 
                onValueChange={(val) => { handleFieldChange("province", val); handleBlur("province"); }}
              >
                <SelectTrigger className={errors.province && touched.has("province") ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map((prov) => (
                    <SelectItem key={prov.code} value={prov.code}>
                      {prov.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {renderFieldError("province")}
            </div>

            {/* Postal Code */}
            <div>
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => handleFieldChange("postal_code", e.target.value.toUpperCase())}
                onBlur={() => handleBlur("postal_code")}
                placeholder="M5V 1A1"
                maxLength={7}
                className={errors.postal_code && touched.has("postal_code") ? "border-destructive" : ""}
              />
              {renderFieldError("postal_code")}
            </div>

            {/* MLS Number */}
            <div>
              <Label htmlFor="mls_number">{t("app.modals.addProperty.mlsNumber")}</Label>
              <Input
                id="mls_number"
                value={formData.mls_number}
                onChange={(e) => handleFieldChange("mls_number", e.target.value.toUpperCase())}
                onBlur={() => handleBlur("mls_number")}
                placeholder="C1234567"
                className={errors.mls_number && touched.has("mls_number") ? "border-destructive" : ""}
              />
              {renderFieldError("mls_number")}
              <p className="text-xs text-muted-foreground mt-1">Format: 1-2 letters + 6-8 digits</p>
            </div>

            {/* Property Type */}
            <div>
              <Label htmlFor="property_type">{t("app.modals.addProperty.propertyType")}</Label>
              <Select value={formData.property_type} onValueChange={(val) => handleFieldChange("property_type", val)}>
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

            {/* Status */}
            <div>
              <Label htmlFor="status">{t("app.modals.addProperty.status")}</Label>
              <Select value={formData.status} onValueChange={(val) => handleFieldChange("status", val)}>
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

            {/* Price */}
            <div>
              <Label htmlFor="price">{t("app.modals.addProperty.price")} (CAD)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="1000"
                value={formData.price}
                onChange={(e) => handleFieldChange("price", e.target.value)}
                onBlur={() => handleBlur("price")}
                placeholder="500000"
                className={errors.price && touched.has("price") ? "border-destructive" : ""}
              />
              {renderFieldError("price")}
            </div>

            {/* Bedrooms */}
            <div>
              <Label htmlFor="bedrooms">{t("app.modals.addProperty.bedrooms")}</Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                max="50"
                value={formData.bedrooms}
                onChange={(e) => handleFieldChange("bedrooms", e.target.value)}
                placeholder="3"
              />
            </div>

            {/* Bathrooms */}
            <div>
              <Label htmlFor="bathrooms">{t("app.modals.addProperty.bathrooms")}</Label>
              <Input
                id="bathrooms"
                type="number"
                step="0.5"
                min="0"
                max="30"
                value={formData.bathrooms}
                onChange={(e) => handleFieldChange("bathrooms", e.target.value)}
                placeholder="2.5"
              />
            </div>

            {/* Square Feet */}
            <div>
              <Label htmlFor="square_feet">{t("app.modals.addProperty.squareFeet")}</Label>
              <Input
                id="square_feet"
                type="number"
                min="0"
                max="100000"
                value={formData.square_feet}
                onChange={(e) => handleFieldChange("square_feet", e.target.value)}
                placeholder="2000"
              />
            </div>

            {/* Image URL */}
            <div>
              <Label htmlFor="image_url">{t("app.modals.addProperty.imageUrl")}</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => handleFieldChange("image_url", e.target.value)}
                placeholder="https://..."
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <Label htmlFor="description">{t("app.modals.addProperty.description")}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder={t("app.modals.addProperty.descriptionPlaceholder")}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("app.modals.addProperty.cancel")}
            </Button>
            <Button type="submit" disabled={loading || hasErrors}>
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