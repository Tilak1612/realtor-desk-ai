import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { toast } from "sonner";
import DealCard from "./DealCard";
import KanbanColumn from "./KanbanColumn";
import DealDetailSidebar from "./DealDetailSidebar";

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
  expected_close_date: string | null;
  notes: string | null;
  metadata: unknown;
  contacts?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface DealsKanbanProps {
  filter: string;
  refreshTrigger: number;
}

const STAGES = [
  { key: "new_lead", label: "New Lead", color: "bg-slate-500" },
  { key: "contacted", label: "Contacted", color: "bg-blue-500" },
  { key: "showing_scheduled", label: "Showing Scheduled", color: "bg-indigo-500" },
  { key: "offer_made", label: "Offer Made", color: "bg-purple-500" },
  { key: "under_contract", label: "Under Contract", color: "bg-amber-500" },
  { key: "closing", label: "Closing", color: "bg-orange-500" },
  { key: "sold", label: "Sold/Closed", color: "bg-green-500" },
  { key: "withdrawn", label: "Withdrawn", color: "bg-red-500" }
];

const DealsKanban = ({ filter, refreshTrigger }: DealsKanbanProps) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const fetchDeals = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase
      .from("deals")
      .select(`
        *,
        contacts (
          first_name,
          last_name,
          email
        )
      `)
      .eq("user_id", user.id);

    if (filter === "active") {
      query = query.eq("status", "active").neq("stage", "sold").neq("stage", "withdrawn");
    } else if (filter === "sold") {
      query = query.eq("stage", "sold");
    } else if (filter === "withdrawn") {
      query = query.eq("stage", "withdrawn");
    } else if (filter === "buyer") {
      query = query.eq("client_type", "buyer");
    } else if (filter === "seller") {
      query = query.eq("client_type", "seller");
    } else if (filter === "closing_this_month") {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      query = query.gte("closing_date", startOfMonth.toISOString()).lte("closing_date", endOfMonth.toISOString());
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load transactions");
      return;
    }

    setDeals(data || []);
  }, [filter]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals, refreshTrigger]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveDeal(null);
      return;
    }

    const dealId = active.id as string;
    const newStage = over.id as string;

    const deal = deals.find(d => d.id === dealId);
    if (!deal || deal.stage === newStage) {
      setActiveDeal(null);
      return;
    }

    // Optimistic update
    setDeals(prev => prev.map(d => 
      d.id === dealId ? { ...d, stage: newStage } : d
    ));

    const { error } = await supabase
      .from("deals")
      .update({ stage: newStage, updated_at: new Date().toISOString() })
      .eq("id", dealId);

    if (error) {
      toast.error("Failed to update transaction stage");
      fetchDeals(); // Revert on error
    } else {
      toast.success(`Transaction moved to ${STAGES.find(s => s.key === newStage)?.label}`);
    }

    setActiveDeal(null);
  };

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setSidebarOpen(true);
  };

  const handleDealUpdated = () => {
    fetchDeals();
  };

  const getDealsByStage = (stage: string) => {
    return deals.filter(d => d.stage === stage);
  };

  const getStageValue = (stage: string) => {
    return getDealsByStage(stage).reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  };

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={(e) => {
        const deal = deals.find(d => d.id === e.active.id);
        setActiveDeal(deal || null);
      }}>
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none touch-pan-x">
          {STAGES.map(stage => (
            <KanbanColumn
              key={stage.key}
              stage={stage}
              deals={getDealsByStage(stage.key)}
              totalValue={getStageValue(stage.key)}
              onDealClick={handleDealClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeDeal ? (
            <DealCard deal={activeDeal} isDragging onClick={() => {}} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <DealDetailSidebar
        deal={selectedDeal}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        onDealUpdated={handleDealUpdated}
      />
    </>
  );
};

export default DealsKanban;
