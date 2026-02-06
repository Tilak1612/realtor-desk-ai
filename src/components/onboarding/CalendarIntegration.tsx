import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar, Clock } from "lucide-react";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return [`${hour}:00`, `${hour}:30`];
}).flat();

const MEETING_TYPES = [
  { name: "Phone Consultation", duration: 30 },
  { name: "Property Viewing", duration: 60 },
  { name: "Buyer Consultation", duration: 45 },
  { name: "Listing Presentation", duration: 90 },
];

interface CalendarIntegrationProps {
  userId: string | null;
  onNext: () => void;
  onBack: () => void;
}

const CalendarIntegration = ({ userId, onNext, onBack }: CalendarIntegrationProps) => {
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<unknown>({
    Monday: { start: "09:00", end: "17:00" },
    Tuesday: { start: "09:00", end: "17:00" },
    Wednesday: { start: "09:00", end: "17:00" },
    Thursday: { start: "09:00", end: "17:00" },
    Friday: { start: "09:00", end: "17:00" },
    Saturday: { start: "10:00", end: "14:00" },
    Sunday: { start: "", end: "" },
  });
  const [bufferTime, setBufferTime] = useState("15");
  const [selectedMeetingTypes, setSelectedMeetingTypes] = useState<string[]>(
    MEETING_TYPES.map(t => t.name)
  );

  const handleOAuthConnect = async (provider: "google" | "azure") => {
    try {
      const redirectUrl = `${window.location.origin}/onboarding`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          scopes: provider === "google"
            ? "https://www.googleapis.com/auth/calendar"
            : "Calendars.ReadWrite"
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      toast.error(`Failed to connect ${provider} Calendar`);
    }
  };

  const handleMeetingTypeToggle = (name: string) => {
    setSelectedMeetingTypes(prev =>
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    try {
      const meetingTypesData = MEETING_TYPES
        .filter(t => selectedMeetingTypes.includes(t.name))
        .map(t => ({ name: t.name, duration: t.duration }));

      const { error } = await supabase.from("calendar_settings").upsert({
        user_id: userId,
        availability,
        buffer_time: parseInt(bufferTime),
        meeting_types: meetingTypesData,
      });

      if (error) throw error;
      toast.success("Calendar settings saved!");
      onNext();
    } catch (error: unknown) {
      toast.error("Failed to save calendar settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Calendar Integration</h2>
        <p className="text-muted-foreground">Connect your calendar and set your availability</p>
      </div>

      {/* Calendar Connection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="cursor-pointer hover:border-primary transition-all" onClick={() => handleOAuthConnect("google")}>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Google Calendar</CardTitle>
            <CardDescription>Sync with Google Calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" className="w-full">
              Connect Google Calendar
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-all" onClick={() => handleOAuthConnect("azure")}>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Outlook Calendar</CardTitle>
            <CardDescription>Sync with Outlook Calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" className="w-full">
              Connect Outlook Calendar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Availability Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Your Availability</CardTitle>
          <CardDescription>Set your working hours for each day</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="grid grid-cols-3 gap-4 items-center">
              <Label className="font-medium">{day}</Label>
              <Select
                value={availability[day].start}
                onValueChange={(value) =>
                  setAvailability({ ...availability, [day]: { ...availability[day], start: value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Start" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={availability[day].end}
                onValueChange={(value) =>
                  setAvailability({ ...availability, [day]: { ...availability[day], end: value } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="End" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Buffer Time */}
      <div className="space-y-2">
        <Label htmlFor="buffer_time">Buffer Time Between Meetings</Label>
        <Select value={bufferTime} onValueChange={setBufferTime}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="45">45 minutes</SelectItem>
            <SelectItem value="60">60 minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Meeting Types */}
      <Card>
        <CardHeader>
          <CardTitle>Meeting Types</CardTitle>
          <CardDescription>Select the types of meetings you offer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {MEETING_TYPES.map((type) => (
            <div key={type.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={type.name}
                  checked={selectedMeetingTypes.includes(type.name)}
                  onCheckedChange={() => handleMeetingTypeToggle(type.name)}
                />
                <Label htmlFor={type.name} className="cursor-pointer">
                  {type.name}
                </Label>
              </div>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {type.duration} min
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? "Saving..." : "Finish Setup"}
        </Button>
      </div>
    </form>
  );
};

export default CalendarIntegration;
