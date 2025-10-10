import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Clock, Target } from "lucide-react";

const ROICalculator = () => {
  const [leads, setLeads] = useState(50);
  const [commission, setCommission] = useState(10000);
  const [conversionRate, setConversionRate] = useState(3);

  // Calculations
  const currentDeals = (leads * conversionRate) / 100;
  const currentRevenue = currentDeals * commission * 12;
  
  const brainfyConversionRate = 18; // AI-powered conversion rate
  const brainfyDeals = (leads * brainfyConversionRate) / 100;
  const brainfyRevenue = brainfyDeals * commission * 12;
  
  const additionalRevenue = brainfyRevenue - currentRevenue;
  const additionalDeals = brainfyDeals - currentDeals;
  const timeSaved = 15; // hours per week

  return (
    <Card className="p-4 sm:p-6 md:p-8">
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">Calculate Your Potential Revenue Increase</h3>
      
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Input 1 */}
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

        {/* Input 2 */}
        <div>
          <Label htmlFor="commission" className="text-xs sm:text-sm font-medium mb-2 block">
            Average Commission ($)
          </Label>
          <Input
            id="commission"
            type="number"
            value={commission}
            onChange={(e) => setCommission(Number(e.target.value))}
            className="text-base sm:text-lg h-11 sm:h-12"
            min="0"
          />
        </div>

        {/* Input 3 */}
        <div className="sm:col-span-2 md:col-span-1">
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
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg sm:rounded-xl p-4 sm:p-6">
        <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-center">With Realtor Desk AI, You Could Achieve:</h4>
        
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Result 1 */}
          <div className="text-center p-3 sm:p-0">
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-accent" />
            <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1 leading-none">
              ${additionalRevenue.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-2">Additional Annual Revenue</div>
          </div>

          {/* Result 2 */}
          <div className="text-center p-3 sm:p-0 border-t sm:border-t-0 sm:border-l sm:border-r border-border/50">
            <Target className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-accent" />
            <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1 leading-none">
              {additionalDeals.toFixed(0)}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-2">Additional Deals Closed/Year</div>
          </div>

          {/* Result 3 */}
          <div className="text-center p-3 sm:p-0 border-t sm:border-t-0 border-border/50">
            <Clock className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-accent" />
            <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1 leading-none">
              {timeSaved}hrs
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-2">Time Saved Per Week</div>
          </div>
        </div>

        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6 px-2">
          Based on {leads} monthly leads at {conversionRate}% conversion → {brainfyConversionRate}% with Realtor Desk AI
        </p>
      </div>
    </Card>
  );
};

export default ROICalculator;
