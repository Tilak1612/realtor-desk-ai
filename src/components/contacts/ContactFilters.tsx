import { ContactFiltersState } from "@/pages/Contacts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, X } from "lucide-react";

interface ContactFiltersProps {
  filters: ContactFiltersState;
  onFiltersChange: (filters: ContactFiltersState) => void;
}

const ContactFilters = ({ filters, onFiltersChange }: ContactFiltersProps) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleScoreChange = (value: number[]) => {
    onFiltersChange({ ...filters, scoreRange: [value[0], value[1]] });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      scoreRange: [0, 100],
      status: [],
      source: [],
      tags: [],
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.scoreRange[0] !== 0 ||
    filters.scoreRange[1] !== 100 ||
    filters.status.length > 0 ||
    filters.source.length > 0 ||
    filters.tags.length > 0;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Lead Score Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Lead Score</label>
            <span className="text-sm text-muted-foreground">
              {filters.scoreRange[0]} - {filters.scoreRange[1]}
            </span>
          </div>
          <Slider
            min={0}
            max={100}
            step={5}
            value={filters.scoreRange}
            onValueChange={handleScoreChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Cold (0-49)</span>
            <span>Warm (50-79)</span>
            <span>Hot (80+)</span>
          </div>
        </div>

        {/* Quick Score Filters */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filters.scoreRange[0] === 80 ? "default" : "outline"}
            size="sm"
            onClick={() => onFiltersChange({ ...filters, scoreRange: [80, 100] })}
          >
            🔥 Hot Leads
          </Button>
          <Button
            variant={filters.scoreRange[0] === 50 && filters.scoreRange[1] === 79 ? "default" : "outline"}
            size="sm"
            onClick={() => onFiltersChange({ ...filters, scoreRange: [50, 79] })}
          >
            Warm Leads
          </Button>
          <Button
            variant={filters.scoreRange[0] === 0 && filters.scoreRange[1] === 49 ? "default" : "outline"}
            size="sm"
            onClick={() => onFiltersChange({ ...filters, scoreRange: [0, 49] })}
          >
            Cold Leads
          </Button>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="w-full"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <Badge variant="secondary">
                Search: {filters.search}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => handleSearchChange("")}
                />
              </Badge>
            )}
            {(filters.scoreRange[0] !== 0 || filters.scoreRange[1] !== 100) && (
              <Badge variant="secondary">
                Score: {filters.scoreRange[0]}-{filters.scoreRange[1]}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => handleScoreChange([0, 100])}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ContactFilters;
