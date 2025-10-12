import { useEffect, useState } from "react";
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
  metadata: any;
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
  { key: "lead", label: "Lead", color: "bg-slate-500" },
  { key: "viewing", label: "Viewing", color: "bg-blue-500" },
  { key: "offer", label: "Offer Made", color: "bg-purple-500" },
  { key: "negotiation", label: "Negotiation", color: "bg-amber-500" },
  { key: "closing", label: "Closing", color: "bg-orange-500" },
  { key: "won", label: "Won", color: "bg-green-500" },
  { key: "lost", label: "Lost", color: "bg-red-500" }
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

  useEffect(() => {
    fetchDeals();
  }, [filter, refreshTrigger]);

  const fetchDeals = async () => {
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
      query = query.eq("status", "active").neq("stage", "won").neq("stage", "lost");
    } else if (filter === "won") {
      query = query.eq("stage", "won");
    } else if (filter === "lost") {
      query = query.eq("stage", "lost");
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load deals");
      return;
    }

    setDeals(data || []);
  };

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
      toast.error("Failed to update deal stage");
      fetchDeals(); // Revert on error
    } else {
      toast.success(`Deal moved to ${STAGES.find(s => s.key === newStage)?.label}`);
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
        <div className="flex gap-4 overflow-x-auto pb-4">
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
