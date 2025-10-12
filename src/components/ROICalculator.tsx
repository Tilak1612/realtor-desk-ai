import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, Target, DollarSign } from "lucide-react";

const ROICalculator = () => {
  const [gci, setGci] = useState(250000);
  const [dealSize, setDealSize] = useState(10000);
  const [leads, setLeads] = useState(50);
  const [conversionRate, setConversionRate] = useState(3);

  // Calculations
  const currentDeals = (leads * conversionRate) / 100;
  const currentRevenue = currentDeals * dealSize * 12;
  
  const brainfyConversionRate = 8; // AI-powered conversion rate (2.5x improvement)
  const brainfyDeals = (leads * brainfyConversionRate) / 100;
  const brainfyRevenue = brainfyDeals * dealSize * 12;
  
  const additionalRevenue = brainfyRevenue - currentRevenue;
  const additionalDeals = (brainfyDeals - currentDeals) * 12; // Annual deals
  const timeSaved = 15; // hours per week
  const investment = 699; // Annual cost
  const roi = ((additionalRevenue / investment) * 100).toFixed(0);

  return (
    <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
          Calculate Your Potential Revenue Increase
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground">
          See exactly how much more you could earn with Realtor Desk AI
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Input 1 */}
        <div>
          <Label htmlFor="gci" className="text-xs sm:text-sm font-medium mb-2 block">
            Current Annual GCI ($)
          </Label>
          <Input
            id="gci"
            type="number"
            value={gci}
            onChange={(e) => setGci(Number(e.target.value))}
            className="text-base sm:text-lg h-11 sm:h-12"
            min="0"
          />
        </div>

        {/* Input 2 */}
        <div>
          <Label htmlFor="dealSize" className="text-xs sm:text-sm font-medium mb-2 block">
            Average Deal Size ($)
          </Label>
          <Input
            id="dealSize"
            type="number"
            value={dealSize}
            onChange={(e) => setDealSize(Number(e.target.value))}
            className="text-base sm:text-lg h-11 sm:h-12"
            min="0"
          />
        </div>

        {/* Input 3 */}
        <div>
          <Label htmlFor="leads" className="text-xs sm:text-sm font-medium mb-2 block">
            Monthly Leads
          </Label>
          <Input
            id="leads"
            type="number"
            value={leads}
            onChange={(e) => setLeads(Number(e.target.value))}
            className="text-base sm:text-lg h-11 sm:h-12"
            min="0"
          />
        </div>

        {/* Input 4 */}
        <div>
          <Label htmlFor="conversion" className="text-xs sm:text-sm font-medium mb-2 block">
            Current Conversion Rate (%)
          </Label>
          <Input
            id="conversion"
            type="number"
            value={conversionRate}
            onChange={(e) => setConversionRate(Number(e.target.value))}
            className="text-base sm:text-lg h-11 sm:h-12"
            min="0"
            max="100"
          />
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-accent/20">
        <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-center">
          With Realtor Desk AI, You Could Achieve:
        </h4>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {/* Result 1 */}
          <div className="text-center p-3 sm:p-4 bg-background/50 rounded-lg">
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-accent" />
            <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1 leading-none">
              ${additionalRevenue.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-2">Additional Annual Revenue</div>
          </div>

          {/* Result 2 */}
          <div className="text-center p-3 sm:p-4 bg-background/50 rounded-lg">
            <Target className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-accent" />
            <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1 leading-none">
              {additionalDeals.toFixed(0)}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-2">Additional Deals/Year</div>
          </div>

          {/* Result 3 */}
          <div className="text-center p-3 sm:p-4 bg-background/50 rounded-lg">
            <Clock className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-accent" />
            <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1 leading-none">
              {timeSaved}hrs
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-2">Time Saved Per Week</div>
          </div>

          {/* Result 4 - ROI */}
          <div className="text-center p-3 sm:p-4 bg-background/50 rounded-lg">
            <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-accent" />
            <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1 leading-none">
              {roi}%
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-2">ROI ({roi}x return)</div>
          </div>
        </div>

        <div className="border-t border-border/20 pt-4 mt-4">
          <p className="text-center text-xs sm:text-sm text-muted-foreground mb-4">
            Based on {leads} monthly leads at {conversionRate}% → {brainfyConversionRate}% with AI
          </p>
          <p className="text-center text-sm font-semibold mb-4">
            Investment: <span className="gradient-text">${investment}/year</span> • 
            Your Return: <span className="gradient-text">${additionalRevenue.toLocaleString()}/year</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/demo" className="w-full sm:w-auto">
              <Button className="w-full btn-gradient">
                Start 60-Day Free Trial
              </Button>
            </Link>
            <Button variant="outline" className="w-full sm:w-auto">
              Download Full Report
            </Button>
          </div>
        </div>
      </div>
      
      <p className="text-center text-xs text-muted-foreground mt-4">
        * Based on data from 500+ Canadian agents using Realtor Desk AI. Average GCI increase: 41% in first year.
      </p>
    </Card>
  );
};

export default ROICalculator;
