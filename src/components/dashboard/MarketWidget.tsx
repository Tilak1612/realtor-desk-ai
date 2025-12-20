import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const CITIES = [
  "Toronto",
  "Vancouver",
  "Montreal",
  "Calgary",
  "Edmonton",
  "Ottawa",
  "Winnipeg",
  "Quebec City",
];

interface MarketWidgetProps {
  defaultCity?: string;
}

const MarketWidget = ({ defaultCity = "Toronto" }: MarketWidgetProps) => {
  const [selectedCity, setSelectedCity] = useState(defaultCity);

  // Mock market data - in production, fetch from API
  const marketData = {
    averagePrice: 1150000,
    priceChange: 4.2,
    daysOnMarket: 18,
    daysChange: -3,
    activeListings: 12450,
    listingsChange: 8.5,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <MapPin className="w-4 h-4 text-primary" />
          Market Intelligence
        </CardTitle>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Average Price */}
        <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Average Price</p>
            <p className="text-lg font-semibold">{formatCurrency(marketData.averagePrice)}</p>
          </div>
          <div className={`flex items-center gap-1 ${marketData.priceChange >= 0 ? "text-green-500" : "text-destructive"}`}>
            {marketData.priceChange >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{Math.abs(marketData.priceChange)}%</span>
          </div>
        </div>

        {/* Days on Market */}
        <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Avg. Days on Market</p>
            <p className="text-lg font-semibold">{marketData.daysOnMarket} days</p>
          </div>
          <div className={`flex items-center gap-1 ${marketData.daysChange <= 0 ? "text-green-500" : "text-destructive"}`}>
            {marketData.daysChange <= 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{Math.abs(marketData.daysChange)} days</span>
          </div>
        </div>

        {/* Active Listings */}
        <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Active Listings</p>
            <p className="text-lg font-semibold">{marketData.activeListings.toLocaleString()}</p>
          </div>
          <div className={`flex items-center gap-1 ${marketData.listingsChange >= 0 ? "text-green-500" : "text-destructive"}`}>
            {marketData.listingsChange >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{Math.abs(marketData.listingsChange)}%</span>
          </div>
        </div>

        <Link to="/market" className="block">
          <Button variant="outline" className="w-full">
            View Full Report
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default MarketWidget;
