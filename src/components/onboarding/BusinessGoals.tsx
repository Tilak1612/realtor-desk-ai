import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const PROPERTY_TYPES = [
  "Residential", "Luxury", "Condos", "Commercial", "Land", "Investment"
];

interface BusinessGoalsProps {
  profileData: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const BusinessGoals = ({ profileData, onNext, onBack }: BusinessGoalsProps) => {
  const preferences = profileData.business_preferences || {};
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: preferences.role || "solo_agent",
    target_gci: preferences.target_gci || "",
    target_deals: preferences.target_deals || "",
    database_size: preferences.database_size || "0-100",
    property_types: preferences.property_types || [],
  });

  const handlePropertyTypeToggle = (type: string) => {
    const current = formData.property_types;
    const updated = current.includes(type)
      ? current.filter((t: string) => t !== type)
      : [...current, type];
    setFormData({ ...formData, property_types: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onNext({ business_preferences: formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Your Business Goals</h2>
        <p className="text-muted-foreground">Help us tailor Realtor Desk AI to your objectives</p>
      </div>

      <div className="space-y-3">
        <Label>Your Role *</Label>
        <RadioGroup value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="solo_agent" id="solo_agent" />
            <Label htmlFor="solo_agent" className="cursor-pointer">Solo Agent</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="team_leader" id="team_leader" />
            <Label htmlFor="team_leader" className="cursor-pointer">Team Leader</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="broker_manager" id="broker_manager" />
            <Label htmlFor="broker_manager" className="cursor-pointer">Broker/Manager</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="target_gci">Target Annual GCI ($)</Label>
          <Input
            id="target_gci"
            type="number"
            placeholder="100000"
            value={formData.target_gci}
            onChange={(e) => setFormData({ ...formData, target_gci: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="target_deals">Target Deals Per Year</Label>
          <Input
            id="target_deals"
            type="number"
            placeholder="20"
            value={formData.target_deals}
            onChange={(e) => setFormData({ ...formData, target_deals: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Current Database Size *</Label>
        <RadioGroup value={formData.database_size} onValueChange={(value) => setFormData({ ...formData, database_size: value })}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="0-100" id="0-100" />
            <Label htmlFor="0-100" className="cursor-pointer">0-100 contacts</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="100-500" id="100-500" />
            <Label htmlFor="100-500" className="cursor-pointer">100-500 contacts</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="500-1000" id="500-1000" />
            <Label htmlFor="500-1000" className="cursor-pointer">500-1,000 contacts</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1000+" id="1000+" />
            <Label htmlFor="1000+" className="cursor-pointer">1,000+ contacts</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label>Property Types (select all that apply)</Label>
        <div className="grid grid-cols-2 gap-4">
          {PROPERTY_TYPES.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={formData.property_types.includes(type)}
                onCheckedChange={() => handlePropertyTypeToggle(type)}
              />
              <Label htmlFor={type} className="cursor-pointer">{type}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </form>
  );
};

export default BusinessGoals;
