import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import ContactCard from "@/components/contact-detail/ContactCard";
import ContactInfo from "@/components/contact-detail/ContactInfo";
import ActivityTimeline from "@/components/contact-detail/ActivityTimeline";
import NotesTab from "@/components/contact-detail/NotesTab";
import PropertyInterests from "@/components/contact-detail/PropertyInterests";
import DocumentsTab from "@/components/contact-detail/DocumentsTab";
import AIInsights from "@/components/contact-detail/AIInsights";
import EngagementStats from "@/components/contact-detail/EngagementStats";
import SimilarContacts from "@/components/contact-detail/SimilarContacts";
import DealHistory from "@/components/contact-detail/DealHistory";
import EditContactModal from "@/components/contact-detail/EditContactModal";
import { Skeleton } from "@/components/ui/skeleton";

const ContactDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    checkAuthAndFetch();
  }, [id]);

  const checkAuthAndFetch = async () => {
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
    fetchContact();
  };

  const fetchContact = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      // Check if contact belongs to user
      const { data: { user } } = await supabase.auth.getUser();
      if (data.user_id !== user?.id) {
        toast({
          title: "Access denied",
          description: "This contact doesn't belong to you",
          variant: "destructive",
        });
        navigate("/contacts");
        return;
      }

      setContact(data);
    } catch (error: any) {
      toast({
        title: "Error loading contact",
        description: error.message,
        variant: "destructive",
      });
      navigate("/contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this contact? This action cannot be undone.")) {
      return;
    }

    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", id);

    if (!error) {
      toast({ title: "Contact deleted successfully" });
      navigate("/contacts");
    } else {
      toast({
        title: "Error deleting contact",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-muted/30">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardNavbar user={user} profile={profile} />
          <main className="flex-1 overflow-y-auto p-6">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-3">
                <Skeleton className="h-96" />
              </div>
              <div className="col-span-12 lg:col-span-6">
                <Skeleton className="h-96" />
              </div>
              <div className="col-span-12 lg:col-span-3">
                <Skeleton className="h-96" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!contact) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar user={user} profile={profile} />
        <main className="flex-1 overflow-y-auto">
          {/* Top Action Bar */}
          <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b p-4">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/contacts")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">
                  {contact.first_name} {contact.last_name}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => setIsEditModalOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Convert to Client</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Inactive</DropdownMenuItem>
                    <DropdownMenuItem>Merge Contact</DropdownMenuItem>
                    <DropdownMenuItem>Export Data</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Contact
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Three Column Layout */}
          <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Contact Card & Info */}
              <div className="lg:col-span-3 space-y-6">
                <ContactCard contact={contact} onUpdate={fetchContact} />
                <ContactInfo contact={contact} />
              </div>

              {/* Center Column - Tabs */}
              <div className="lg:col-span-6">
                <Tabs defaultValue="activity" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="properties">Properties</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>

                  <TabsContent value="activity">
                    <ActivityTimeline contactId={contact.id} />
                  </TabsContent>

                  <TabsContent value="notes">
                    <NotesTab contactId={contact.id} />
                  </TabsContent>

                  <TabsContent value="properties">
                    <PropertyInterests contactId={contact.id} />
                  </TabsContent>

                  <TabsContent value="documents">
                    <DocumentsTab contactId={contact.id} />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - AI Insights & Stats */}
              <div className="lg:col-span-3 space-y-6">
                <AIInsights contact={contact} />
                <EngagementStats contactId={contact.id} />
                <SimilarContacts contact={contact} />
                <DealHistory contactId={contact.id} />
              </div>
            </div>
          </div>
        </main>
      </div>

      <EditContactModal
        contact={contact}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={fetchContact}
      />
    </div>
  );
};

export default ContactDetail;
