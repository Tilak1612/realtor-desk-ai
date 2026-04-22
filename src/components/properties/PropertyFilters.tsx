import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { PropertyFiltersState } from "@/pages/Properties";

interface PropertyFiltersProps {
  filters: PropertyFiltersState;
  onFiltersChange: (filters: PropertyFiltersState) => void;
}

const PropertyFilters = ({ filters, onFiltersChange }: PropertyFiltersProps) => {
  const { t, i18n } = useTranslation();
  const isFr = (i18n.language || "en").toLowerCase().startsWith("fr");

  const statusOptions = [
    { value: "active", label: t("app.properties.status.active", "Active") },
    { value: "pending", label: t("app.properties.status.pending", "Pending") },
    { value: "sold", label: t("app.properties.status.sold", "Sold") },
    { value: "coming_soon", label: t("app.properties.status.comingSoon", "Coming soon") },
    { value: "off_market", label: t("app.properties.status.offMarket", "Off market") },
  ];

  const propertyTypes = [
    { value: "house", label: t("app.properties.types.house", "House") },
    { value: "condo", label: t("app.properties.types.condo", "Condo") },
    { value: "townhouse", label: t("app.properties.types.townhouse", "Townhouse") },
    { value: "land", label: t("app.properties.types.land", "Land") },
    { value: "commercial", label: t("app.properties.types.commercial", "Commercial") },
  ];

  const handleStatusToggle = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatuses });
  };

  const handlePropertyTypeToggle = (type: string) => {
    const newTypes = filters.propertyType.includes(type)
      ? filters.propertyType.filter((t) => t !== type)
      : [...filters.propertyType, type];
    onFiltersChange({ ...filters, propertyType: newTypes });
  };

  // Canadian French currency: space before $, comma decimal separator,
  // e.g. "1 250 $" vs en-CA "$1,250". We render $XK / $X.XM shorthand
  // for brevity, but swap order + separators based on locale.
  const fmtShort = (cents: number) => {
    if (isFr) {
      if (cents >= 1_000_000) return `${(cents / 1_000_000).toFixed(1).replace(".", ",")} M$`;
      return `${Math.round(cents / 1000)} k$`;
    }
    if (cents >= 1_000_000) return `$${(cents / 1_000_000).toFixed(1)}M`;
    return `$${Math.round(cents / 1000)}K`;
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("app.properties.searchPlaceholder", "Search by address, MLS#, city…")}
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="w-[150px]">
          <Select
            value={filters.bedrooms}
            onValueChange={(value) => onFiltersChange({ ...filters, bedrooms: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("app.properties.beds.label", "Bedrooms")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t("app.properties.beds.any", "Any beds")}</SelectItem>
              <SelectItem value="1">{t("app.properties.beds.plus", "{{n}}+ beds", { n: 1 })}</SelectItem>
              <SelectItem value="2">{t("app.properties.beds.plus", "{{n}}+ beds", { n: 2 })}</SelectItem>
              <SelectItem value="3">{t("app.properties.beds.plus", "{{n}}+ beds", { n: 3 })}</SelectItem>
              <SelectItem value="4">{t("app.properties.beds.plus", "{{n}}+ beds", { n: 4 })}</SelectItem>
              <SelectItem value="5">{t("app.properties.beds.plus", "{{n}}+ beds", { n: 5 })}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">{t("app.properties.filters.status", "Status")}</Label>
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${option.value}`}
                  checked={filters.status.includes(option.value)}
                  onCheckedChange={() => handleStatusToggle(option.value)}
                />
                <label
                  htmlFor={`status-${option.value}`}
                  className="text-sm cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Property Type Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">{t("app.properties.filters.propertyType", "Property type")}</Label>
          <div className="space-y-2">
            {propertyTypes.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type.value}`}
                  checked={filters.propertyType.includes(type.value)}
                  onCheckedChange={() => handlePropertyTypeToggle(type.value)}
                />
                <label
                  htmlFor={`type-${type.value}`}
                  className="text-sm cursor-pointer"
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">
            {t("app.properties.filters.priceRange", "Price range")}
            {/* Canadian French typography: non-breaking space before colon. EN uses plain colon. */}
            {isFr ? " :" : ":"} {fmtShort(filters.priceRange[0])} – {fmtShort(filters.priceRange[1])}
          </Label>
          <Slider
            min={0}
            max={10000000}
            step={50000}
            value={filters.priceRange}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, priceRange: value as [number, number] })
            }
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
