import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TrendingUp, ArrowRight } from "lucide-react";

const ROICalculator = () => {
  const [monthlyLeads, setMonthlyLeads] = useState(50);
  const [conversionRate, setConversionRate] = useState(3);
  const [avgCommission, setAvgCommission] = useState(15000);
  const [selectedPlan, setSelectedPlan] = useState("solo");

  const planPricing = {
    solo: 119,
    team: 319
  };

  // Without AI calculations
  const currentDealsPerMonth = (monthlyLeads * conversionRate) / 100;
  const currentMonthlyRevenue = currentDealsPerMonth * avgCommission;
  const currentAnnualRevenue = currentMonthlyRevenue * 12;

  // With AI calculations (30% improvement)
  const improvedConversionRate = conversionRate * 1.3;
  const aiDealsPerMonth = (monthlyLeads * improvedConversionRate) / 100;
  const aiMonthlyRevenue = aiDealsPerMonth * avgCommission;
  const aiAnnualRevenue = aiMonthlyRevenue * 12;
  const platformCost = planPricing[selectedPlan] * 12;
  const netGain = aiAnnualRevenue - currentAnnualRevenue - platformCost;
  const roi = ((netGain / platformCost) * 100).toFixed(0);

  return (
    <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-2">
          Calculate Your Potential ROI
        </h3>
        <p className="text-sm text-muted-foreground">
          See your projected returns with conservative estimates
        </p>
      </div>
      
      {/* Interactive Inputs */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Input 1: Monthly Leads */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-semibold">Current Monthly Leads</Label>
            <span className="text-lg font-bold text-primary">{monthlyLeads} leads/month</span>
          </div>
          <Slider
            value={[monthlyLeads]}
            onValueChange={(value) => setMonthlyLeads(value[0])}
            min={10}
            max={200}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10</span>
            <span>200</span>
          </div>
        </div>

        {/* Input 2: Conversion Rate */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-semibold">Current Conversion Rate</Label>
            <span className="text-lg font-bold text-primary">{conversionRate}%</span>
          </div>
          <Slider
            value={[conversionRate]}
            onValueChange={(value) => setConversionRate(value[0])}
            min={1}
            max={10}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1%</span>
            <span>10%</span>
          </div>
        </div>

        {/* Input 3: Average Commission */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-semibold">Average Commission per Deal</Label>
            <span className="text-lg font-bold text-primary">${avgCommission.toLocaleString()} CAD</span>
          </div>
          <Slider
            value={[avgCommission]}
            onValueChange={(value) => setAvgCommission(value[0])}
            min={5000}
            max={50000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$5k</span>
            <span>$50k</span>
          </div>
        </div>

        {/* Input 4: Plan Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold block mb-3">Plan Selection</Label>
          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="flex gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <RadioGroupItem value="solo" id="solo" />
              <Label htmlFor="solo" className="cursor-pointer flex-1 p-3 border rounded-lg hover:bg-accent/5">
                <div className="font-semibold">Solo</div>
                <div className="text-sm text-muted-foreground">$119/month</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 flex-1">
              <RadioGroupItem value="team" id="team" />
              <Label htmlFor="team" className="cursor-pointer flex-1 p-3 border rounded-lg hover:bg-accent/5">
                <div className="font-semibold">Team</div>
                <div className="text-sm text-muted-foreground">$319/month</div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Results Panel - Side by Side */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Left: Without AI */}
        <Card className="p-6 bg-muted/50">
          <h4 className="text-lg font-bold mb-4 text-center">Without RealtorDesk AI</h4>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Deals per month:</span>
              <span className="font-semibold">{currentDealsPerMonth.toFixed(1)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Monthly revenue:</span>
              <span className="font-semibold">${currentMonthlyRevenue.toLocaleString('en-CA', {maximumFractionDigits: 0})}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-muted-foreground">Annual revenue:</span>
              <span className="font-bold text-lg">${currentAnnualRevenue.toLocaleString('en-CA', {maximumFractionDigits: 0})}</span>
            </div>
          </div>
        </Card>

        {/* Right: With AI */}
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30">
          <h4 className="text-lg font-bold mb-4 text-center flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            With RealtorDesk AI
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-accent/20">
              <span className="text-sm text-muted-foreground">Improved conversion:</span>
              <span className="font-semibold text-accent">{improvedConversionRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-accent/20">
              <span className="text-sm text-muted-foreground">Deals per month:</span>
              <span className="font-semibold text-accent">{aiDealsPerMonth.toFixed(1)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-accent/20">
              <span className="text-sm text-muted-foreground">Monthly revenue:</span>
              <span className="font-semibold">${aiMonthlyRevenue.toLocaleString('en-CA', {maximumFractionDigits: 0})}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-accent/20">
              <span className="text-sm text-muted-foreground">Annual revenue:</span>
              <span className="font-bold">${aiAnnualRevenue.toLocaleString('en-CA', {maximumFractionDigits: 0})}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-accent/20">
              <span className="text-sm text-muted-foreground">Platform cost:</span>
              <span className="font-semibold text-red-600">-${platformCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-3 bg-accent/10 -mx-6 px-6 rounded">
              <span className="font-bold">Net Gain:</span>
              <span className="font-bold text-xl text-green-600">${netGain.toLocaleString('en-CA', {maximumFractionDigits: 0})}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-bold">ROI:</span>
              <span className="font-bold text-2xl gradient-text">{roi}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Disclaimers */}
      <div className="text-center space-y-2 mb-6">
        <p className="text-sm text-muted-foreground">
          Conservative estimate based on improved response time and 24/7 availability.
        </p>
        <p className="text-xs text-[#6B7280]">
          *Assumes 30% conversion improvement, lower than pilot program average.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link to="/signup">
          <Button size="lg" className="btn-gradient text-lg group">
            See this ROI for yourself—Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ROICalculator;
