import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AppLayout from "@/components/layout/AppLayout";
import CommunityBanner from "@/components/dashboard/CommunityBanner";
import TodayOnboardingChecklist from "@/components/dashboard/TodayOnboardingChecklist";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Calendar, Tag, Clock, TrendingUp } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface ContactToCall {
  id: string;
  name: string;
  phone: string;
  email: string;
  tags: string[];
  stage: string;
  last_contact_date: string | null;
  next_followup_date: string | null;
  reason_to_call: string;
  priority_score: number;
}

interface WeeklySummary {
  callsLogged: number;
  followUpsScheduled: number;
  dealsMoved: number;
}

const Today = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [contactsToCall, setContactsToCall] = useState<ContactToCall[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary>({
    callsLogged: 0,
    followUpsScheduled: 0,
    dealsMoved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/login");
          return;
        }

        setUser(session.user);

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        if (!profileData?.onboarding_completed) {
          navigate("/onboarding");
          return;
        }

        setProfile(profileData);
        await fetchTodayData(session.user.id);
      } catch (error: unknown) {
        console.error("Error:", error);
        toast.error(t('today.loadFailed', 'Failed to load data'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchTodayData = async (userId: string) => {
    try {
      // Fetch contacts that need follow-up today or are overdue
      const today = new Date().toISOString().split('T')[0];
      
      const { data: contactsData, error: contactsError } = await supabase
        .from("contacts")
        .select("*")
        .eq("user_id", userId)
        .limit(10);

      if (contactsError) throw contactsError;

      // Calculate priority and reason to call for each contact
      const enrichedContacts: ContactToCall[] = (contactsData || []).map((contact: any) => {
        const lastContactDate = contact.last_contact_date;
        const nextFollowupDate = contact.next_followup_date || null;
        const stage = contact.stage || 'new_lead';
        const tags = contact.tags || [];

        let reason = t('today.reasons.checkIn', 'Regular check-in');
        let priorityScore = 5;

        if (!lastContactDate) {
          reason = t('today.reasons.firstContact', 'First contact - new lead');
          priorityScore = 10;
        } else if (nextFollowupDate && new Date(nextFollowupDate) < new Date()) {
          reason = t('today.reasons.overdue', 'Overdue follow-up');
          priorityScore = 9;
        } else if (nextFollowupDate && nextFollowupDate === today) {
          reason = t('today.reasons.scheduledToday', 'Scheduled follow-up today');
          priorityScore = 8;
        } else if (stage === 'hot_lead' || stage === 'viewing') {
          reason = t('today.reasons.hotLead', 'Hot lead - needs attention');
          priorityScore = 9;
        } else if (stage === 'offer' || stage === 'negotiation') {
          reason = t('today.reasons.activeDeal', 'Active deal - check status');
          priorityScore = 10;
        } else if (tags.includes('buyer') || tags.includes('seller')) {
          reason = t('today.reasons.activeProspect', 'Active prospect - nurture relationship');
          priorityScore = 7;
        } else if (lastContactDate) {
          const daysSinceContact = Math.floor(
            (new Date().getTime() - new Date(lastContactDate).getTime()) / (1000 * 60 * 60 * 24)
          );
          if (daysSinceContact > 30) {
            reason = t('today.reasons.longOverdue', 'Long overdue - reconnect');
            priorityScore = 6;
          }
        }

        return {
          id: contact.id,
          name: `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || t('today.unnamedContact', 'Unnamed Contact'),
          phone: contact.phone || '',
          email: contact.email || '',
          tags: tags,
          stage: stage,
          last_contact_date: lastContactDate,
          next_followup_date: nextFollowupDate,
          reason_to_call: reason,
          priority_score: priorityScore,
        };
      });

      // Sort by priority score
      enrichedContacts.sort((a, b) => b.priority_score - a.priority_score);

      setContactsToCall(enrichedContacts.slice(0, 10));

      // Weekly summary from existing tables:
      // - callsLogged   → contact_activities with activity_type in (call_made, call_received) this week
      // - followUpsScheduled → tasks created this week
      // - dealsMoved    → contact_activities with activity_type = deal_updated this week
      // Note: "deals moved" is a proxy via activity log; a dedicated deal-stage history
      // table would give a more precise count.
      try {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        const weekStartIso = weekStart.toISOString();

        const [{ data: callActivities }, { data: weekTasks }, { data: dealActivities }] =
          await Promise.all([
            supabase
              .from("contact_activities")
              .select("id", { count: "exact", head: false })
              .eq("user_id", userId)
              .in("activity_type", ["call_made", "call_received"])
              .gte("created_at", weekStartIso),
            supabase
              .from("tasks")
              .select("id", { count: "exact", head: false })
              .eq("user_id", userId)
              .gte("created_at", weekStartIso),
            supabase
              .from("contact_activities")
              .select("id", { count: "exact", head: false })
              .eq("user_id", userId)
              .eq("activity_type", "deal_updated")
              .gte("created_at", weekStartIso),
          ]);

        setWeeklySummary({
          callsLogged: callActivities?.length ?? 0,
          followUpsScheduled: weekTasks?.length ?? 0,
          dealsMoved: dealActivities?.length ?? 0,
        });
      } catch {
        // Non-fatal — leave summary at zeros if queries fail
      }
    } catch (error) {
      console.error("Error fetching today data:", error);
    }
  };

  const handleMakeTodaysCalls = () => {
    if (contactsToCall.length > 0) {
      navigate(`/call-workflow/${contactsToCall[0].id}`, {
        state: { contactQueue: contactsToCall.map(c => c.id) }
      });
    } else {
      toast.info(t('today.noCalls', 'No contacts to call today. Great job staying on top of things!'));
    }
  };

  const handleContactClick = (contactId: string) => {
    const currentIndex = contactsToCall.findIndex(c => c.id === contactId);
    const queue = contactsToCall.slice(currentIndex).map(c => c.id);
    navigate(`/call-workflow/${contactId}`, {
      state: { contactQueue: queue }
    });
  };

  const getStageLabel = (stage: string) => {
    const stageMap: Record<string, string> = {
      new_lead: t('stages.newLead', 'New Lead'),
      cold_lead: t('stages.coldLead', 'Cold Lead'),
      warm_lead: t('stages.warmLead', 'Warm Lead'),
      hot_lead: t('stages.hotLead', 'Hot Lead'),
      viewing: t('stages.viewing', 'Viewing'),
      offer: t('stages.offer', 'Offer'),
      negotiation: t('stages.negotiation', 'Negotiation'),
      under_contract: t('stages.underContract', 'Under Contract'),
      closed: t('stages.closed', 'Closed'),
      lost: t('stages.lost', 'Lost'),
      past_client: t('stages.pastClient', 'Past Client'),
      sphere: t('stages.sphere', 'Sphere'),
    };
    return stageMap[stage] || stage;
  };

  const getStageColor = (stage: string) => {
    const colorMap: Record<string, string> = {
      new_lead: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      hot_lead: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      viewing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      offer: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      negotiation: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      under_contract: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      past_client: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    };
    return colorMap[stage] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  if (loading) {
    return (
      <AppLayout user={user} profile={profile}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('today.loading', 'Loading your day...')}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} profile={profile}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {new Date().getHours() < 12 ? t('today.goodMorning', 'Good morning') : new Date().getHours() < 18 ? t('today.goodAfternoon', 'Good afternoon') : t('today.goodEvening', 'Good evening')}, {profile?.full_name?.split(' ')[0] || t('today.there', 'there')}
          </h1>
          <p className="text-muted-foreground">
            {/* PPPP gives date-fns's locale-aware long date: EN → "Tuesday,
                April 21st, 2026", FR → "mardi 21 avril 2026" (no commas,
                day-month order — the Canadian-French convention). */}
            {format(new Date(), "PPPP", { locale: i18n.language === 'fr' ? fr : undefined })}
          </p>
        </div>

        <CommunityBanner />

        {user?.id && <TodayOnboardingChecklist userId={user.id} />}

        {/* Weekly Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {t('today.weeklyActivity', "This Week's Activity")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Stack on phone so "Follow-ups Scheduled" + "Deals Moved Forward"
                don't wrap to 3 lines each and collide at column boundaries at
                ~115px column widths (420px viewport). Grid returns to 3
                columns at sm (640px) where there's room. */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{weeklySummary.callsLogged}</div>
                <div className="text-sm text-muted-foreground mt-1">{t('today.callsLogged', 'Calls Logged')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{weeklySummary.followUpsScheduled}</div>
                <div className="text-sm text-muted-foreground mt-1">{t('today.followUps', 'Follow-ups Scheduled')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{weeklySummary.dealsMoved}</div>
                <div className="text-sm text-muted-foreground mt-1">{t('today.dealsMoved', 'Deals Moved Forward')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Primary Action */}
        <div className="text-center py-6">
          {contactsToCall.length > 0 ? (
            <>
              {/* w-full sm:w-auto + whitespace-normal stops the CTA from
                  clipping past the right edge on narrow phones. Button's
                  default whitespace-nowrap kept "Make Today's Calls" on one
                  line wider than the 420px viewport minus card padding. */}
              <Button
                size="lg"
                className="h-16 w-full sm:w-auto max-w-full px-8 sm:px-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all whitespace-normal"
                onClick={handleMakeTodaysCalls}
              >
                <Phone className="w-6 h-6 mr-3 flex-shrink-0" />
                {t('today.makeCalls', "Make Today's Calls")}
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                {contactsToCall.length} {contactsToCall.length === 1 ? t('today.contact', 'contact') : t('today.contacts', 'contacts')} {t('today.readyToCall', 'ready to call')}
              </p>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-muted-foreground">{t('today.noContactsYet', 'Add contacts to start making calls')}</p>
              <Button
                variant="outline"
                onClick={() => navigate("/contacts")}
              >
                {t('today.importContacts', 'Import Contacts')}
              </Button>
            </div>
          )}
        </div>

        {/* Contacts to Call Today */}
        <Card>
          <CardHeader>
            <CardTitle>{t('today.whoToTalk', 'Who to Talk to Today')}</CardTitle>
            <CardDescription>
              {t('today.whoToTalkDesc', 'Your top priority contacts for today, sorted by urgency')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contactsToCall.length === 0 ? (
              <div className="text-center py-12">
                <Phone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-2">{t('today.allCaughtUp', 'All caught up!')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('today.noUrgent', 'No urgent follow-ups scheduled for today. Check back tomorrow or review your contact list.')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {contactsToCall.map((contact, index) => (
                  <div
                    key={contact.id}
                    onClick={() => handleContactClick(contact.id)}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-accent/50 cursor-pointer transition-all group"
                  >
                    {/* Priority Number */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {index + 1}
                    </div>

                    {/* Contact Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{contact.name}</h3>
                        <Badge className={`${getStageColor(contact.stage)} text-xs`}>
                          {getStageLabel(contact.stage)}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        {contact.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {contact.phone}
                          </span>
                        )}
                        {contact.last_contact_date && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last: {formatDistanceToNow(new Date(contact.last_contact_date), { addSuffix: true })}
                          </span>
                        )}
                        {contact.tags.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {contact.tags.slice(0, 2).join(', ')}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm font-medium text-primary mt-2">
                        {contact.reason_to_call}
                      </p>
                    </div>

                    {/* Call Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactClick(contact.id);
                      }}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('today.quickActions', 'Quick Actions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate("/contacts")}
              >
                <Calendar className="w-5 h-5" />
                <span className="text-sm">{t('today.viewContacts', 'View All Contacts')}</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate("/deals")}
              >
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">{t('today.checkDeals', 'Check Deals')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Today;
