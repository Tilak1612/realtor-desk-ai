import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Plus, Clock, MapPin } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import TrialExpiredModal from "@/components/dashboard/TrialExpiredModal";
import { useSubscription } from "@/contexts/SubscriptionContext";

const CalendarPage = () => {
  const navigate = useNavigate();
  const { trialExpired } = useSubscription();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setProfile(profileData);
    };

    checkAuth();
  }, [navigate]);

  const events = [
    {
      id: 1,
      title: "Property Showing - 123 Main St",
      time: "10:00 AM",
      duration: "1 hour",
      location: "123 Main Street, Toronto",
      type: "showing",
    },
    {
      id: 2,
      title: "Client Meeting - Sarah Johnson",
      time: "2:00 PM",
      duration: "30 mins",
      location: "Office",
      type: "meeting",
    },
    {
      id: 3,
      title: "Open House Prep",
      time: "4:00 PM",
      duration: "2 hours",
      location: "456 Oak Avenue",
      type: "openhouse",
    },
  ];

  if (!user || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 lg:ml-0">
        <DashboardNavbar user={user} profile={profile} />
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Calendar</h1>
              <p className="text-muted-foreground">
                Manage your appointments and schedule
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg p-3 min-w-[80px]">
                        <Clock className="h-4 w-4 text-primary mb-1" />
                        <span className="text-sm font-medium">{event.time}</span>
                        <span className="text-xs text-muted-foreground">{event.duration}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{event.title}</h3>
                          <Badge
                            variant={
                              event.type === "showing"
                                ? "default"
                                : event.type === "meeting"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {event.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-sm">Showings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-secondary rounded-full"></div>
                    <span className="text-sm">Meetings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <span className="text-sm">Open Houses</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <TrialExpiredModal isOpen={trialExpired} />
    </div>
  );
};

export default CalendarPage;
