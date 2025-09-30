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
    <Card className="p-8">
      <h3 className="text-2xl font-bold mb-6 text-center">Calculate Your Potential Revenue Increase</h3>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Input 1 */}
        <div>
          <Label htmlFor="leads" className="text-sm font-medium mb-2 block">
            Monthly Leads
          </Label>
          <Input
            id="leads"
            type="number"
            value={leads}
            onChange={(e) => setLeads(Number(e.target.value))}
            className="text-lg"
          />
        </div>

        {/* Input 2 */}
        <div>
          <Label htmlFor="commission" className="text-sm font-medium mb-2 block">
            Average Commission ($)
          </Label>
          <Input
            id="commission"
            type="number"
            value={commission}
            onChange={(e) => setCommission(Number(e.target.value))}
            className="text-lg"
          />
        </div>

        {/* Input 3 */}
        <div>
          <Label htmlFor="conversion" className="text-sm font-medium mb-2 block">
            Current Conversion Rate (%)
          </Label>
          <Input
            id="conversion"
            type="number"
            value={conversionRate}
            onChange={(e) => setConversionRate(Number(e.target.value))}
            className="text-lg"
          />
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold mb-4 text-center">With Realtor Desk AI, You Could Achieve:</h4>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Result 1 */}
          <div className="text-center">
            <TrendingUp className="w-10 h-10 mx-auto mb-2 text-accent" />
            <div className="text-3xl font-bold gradient-text mb-1">
              ${additionalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Additional Annual Revenue</div>
          </div>

          {/* Result 2 */}
          <div className="text-center">
            <Target className="w-10 h-10 mx-auto mb-2 text-accent" />
            <div className="text-3xl font-bold gradient-text mb-1">
              {additionalDeals.toFixed(0)}
            </div>
            <div className="text-sm text-muted-foreground">Additional Deals Closed/Year</div>
          </div>

          {/* Result 3 */}
          <div className="text-center">
            <Clock className="w-10 h-10 mx-auto mb-2 text-accent" />
            <div className="text-3xl font-bold gradient-text mb-1">
              {timeSaved}hrs
            </div>
            <div className="text-sm text-muted-foreground">Time Saved Per Week</div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Based on {leads} monthly leads at {conversionRate}% conversion → {brainfyConversionRate}% with Realtor Desk AI
        </p>
      </div>
    </Card>
  );
};

export default ROICalculator;
