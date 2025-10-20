import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Building2, MapPin, Calendar, MessageSquare } from "lucide-react";

interface DemoRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  brokerage: string | null;
  province: string;
  current_crm: string | null;
  team_size: string | null;
  biggest_challenge: string | null;
  comments: string | null;
  status: string;
  created_at: string;
}

const AdminDemoRequests = () => {
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("demo_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load demo requests. Please make sure you're logged in.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("demo_requests")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setRequests(
        requests.map((req) =>
          req.id === id ? { ...req, status: newStatus } : req
        )
      );

      toast({
        title: "Status Updated",
        description: "Demo request status has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: "bg-blue-500",
      contacted: "bg-yellow-500",
      scheduled: "bg-purple-500",
      completed: "bg-green-500",
      cancelled: "bg-gray-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === "all") return true;
    return req.status === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading demo requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 md:pt-40 pb-16">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="mb-2">Demo Requests</h1>
              <p className="text-muted-foreground">
                Manage incoming demo requests from potential clients
              </p>
            </div>
            <Button onClick={fetchRequests} variant="outline">
              Refresh
            </Button>
          </div>

          {/* Filter Bar */}
          <div className="flex gap-4 mb-8">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ({requests.length})</SelectItem>
                <SelectItem value="new">
                  New ({requests.filter((r) => r.status === "new").length})
                </SelectItem>
                <SelectItem value="contacted">
                  Contacted ({requests.filter((r) => r.status === "contacted").length})
                </SelectItem>
                <SelectItem value="scheduled">
                  Scheduled ({requests.filter((r) => r.status === "scheduled").length})
                </SelectItem>
                <SelectItem value="completed">
                  Completed ({requests.filter((r) => r.status === "completed").length})
                </SelectItem>
                <SelectItem value="cancelled">
                  Cancelled ({requests.filter((r) => r.status === "cancelled").length})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Requests Grid */}
          {filteredRequests.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                No demo requests found. Check your filters or wait for new submissions.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="p-6 card-hover">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{request.full_name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(request.created_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      <Select
                        value={request.status}
                        onValueChange={(value) => updateStatus(request.id, value)}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <a
                          href={`mailto:${request.email}`}
                          className="text-sm font-medium hover:text-primary"
                        >
                          {request.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <a
                          href={`tel:${request.phone}`}
                          className="text-sm font-medium hover:text-primary"
                        >
                          {request.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Province</p>
                        <p className="text-sm font-medium">{request.province}</p>
                      </div>
                    </div>

                    {request.brokerage && (
                      <div className="flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Brokerage</p>
                          <p className="text-sm font-medium">{request.brokerage}</p>
                        </div>
                      </div>
                    )}

                    {request.current_crm && (
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Current CRM</p>
                          <p className="text-sm font-medium">{request.current_crm}</p>
                        </div>
                      </div>
                    )}

                    {request.team_size && (
                      <div className="flex items-start gap-2">
                        <div className="w-4 h-4 text-primary mt-0.5">👥</div>
                        <div>
                          <p className="text-xs text-muted-foreground">Team Size</p>
                          <p className="text-sm font-medium">{request.team_size}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {request.biggest_challenge && (
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Biggest Challenge</p>
                      <p className="text-sm">{request.biggest_challenge}</p>
                    </div>
                  )}

                  {request.comments && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Comments</p>
                      <p className="text-sm">{request.comments}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdminDemoRequests;
