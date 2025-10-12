import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import DealDetailSidebar from "./DealDetailSidebar";
import EditDealModal from "./EditDealModal";

interface Deal {
  id: string;
  title: string;
  stage: string;
  status: string;
  value: number;
  probability: number;
  contact_id: string;
  created_at: string;
  updated_at: string;
  contacts?: {
    first_name: string;
    last_name: string;
  };
}

interface DealsListProps {
  filter: string;
  refreshTrigger: number;
}

const DealsList = ({ filter, refreshTrigger }: DealsListProps) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  useEffect(() => {
    fetchDeals();
  }, [filter, refreshTrigger]);

  const fetchDeals = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase
      .from("deals")
      .select(`*, contacts (first_name, last_name)`)
      .eq("user_id", user.id);

    if (filter === "active") {
      query = query.eq("status", "active").neq("stage", "won").neq("stage", "lost");
    } else if (filter === "won") {
      query = query.eq("stage", "won");
    } else if (filter === "lost") {
      query = query.eq("stage", "lost");
    }

    const { data } = await query.order("created_at", { ascending: false });
    setDeals(data || []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this deal?")) return;

    const { error } = await supabase.from("deals").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete deal");
    } else {
      toast.success("Deal deleted");
      fetchDeals();
    }
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      lead: "bg-slate-500",
      viewing: "bg-blue-500",
      offer: "bg-purple-500",
      negotiation: "bg-amber-500",
      closing: "bg-orange-500",
      won: "bg-green-500",
      lost: "bg-red-500"
    };
    return colors[stage] || "bg-gray-500";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deal Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell className="font-medium">{deal.title}</TableCell>
                <TableCell>
                  {deal.contacts
                    ? `${deal.contacts.first_name} ${deal.contacts.last_name}`
                    : "-"}
                </TableCell>
                <TableCell>
                  <Badge className={`${getStageColor(deal.stage)} text-white`}>
                    {deal.stage}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(deal.value || 0)}</TableCell>
                <TableCell>{deal.probability}%</TableCell>
                <TableCell>{new Date(deal.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(deal.updated_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedDeal(deal);
                        setSidebarOpen(true);
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingDeal(deal)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(deal.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DealDetailSidebar
        deal={selectedDeal}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        onDealUpdated={fetchDeals}
      />

      <EditDealModal
        deal={editingDeal}
        open={!!editingDeal}
        onOpenChange={(open) => !open && setEditingDeal(null)}
        onDealUpdated={fetchDeals}
      />
    </>
  );
};

export default DealsList;
