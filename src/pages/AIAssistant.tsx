import { useState, useEffect, useRef } from "react";
import { Send, User, Sparkles, Trash2, AlertCircle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { useTranslation } from "react-i18next";
import { AgentAvatar, AgentFigure } from "@/components/AgentMascot";
import ReportAIResponse from "@/components/feedback/ReportAIResponse";
import { useAiConsent } from "@/hooks/useAiConsent";
import { aiReportEn } from "@/i18n/aiResponseReport";
import { aiChatEn } from "@/i18n/aiAssistant";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistant = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  // True when the last question in `messages` got no answer. It is state of
  // the conversation, not a notification: it stays until a request that
  // carries that question succeeds or the chat is cleared.
  const [failed, setFailed] = useState(false);
  const aiConsent = useAiConsent();
  // `loading` only changes on the next render, so two taps in the same frame
  // both see false. The ref is what actually stops a second request.
  const inFlight = useRef(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [user, setUser] = useState<unknown>(null);
  const [profile, setProfile] = useState<unknown>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Also on loading / failed: the thinking row and the error row are added
  // under the last message and would otherwise sit below the fold.
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, failed]);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profileData);
      }
    };
    fetchUserData();
  }, []);

  // Every action here is something the claude-chat function can do. It is
  // sent a short summary of the person's CRM and returns text; it has no tools,
  // so it cannot create, change or send anything, and it has no market data.
  // That is why "Create task" became "Draft a task" and "Market research" was
  // removed rather than reworded (see src/i18n/aiAssistant.ts).
  const quickActions = [
    {
      label: t('ai.actions.analyzePipeline', 'Analyze my pipeline'),
      prompt: t('aiChat.prompts.analyzePipeline', aiChatEn.prompts.analyzePipeline),
    },
    {
      label: t('ai.actions.draftEmail', 'Draft follow-up email'),
      prompt: t('aiChat.prompts.draftEmail', aiChatEn.prompts.draftEmail),
    },
    {
      label: t('aiChat.actions.draftTask', aiChatEn.actions.draftTask),
      prompt: t('aiChat.prompts.draftTask', aiChatEn.prompts.draftTask),
    },
  ];

  // The one path to the model, shared by a typed message, a quick action and
  // "Try again". There used to be two copies of this, one per send path, and
  // both ended a failure in a toast: it faded after a few seconds and left the
  // question sitting in the conversation with nothing under it and no way to
  // resend it.
  //
  // `history` is passed in rather than read from state because the caller has
  // only just appended the question and that update has not landed yet. A
  // retry passes the history as it stands, which is what keeps it from adding a
  // second copy of the question.
  const requestAnswer = async (history: Message[]) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setFailed(false);
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke('claude-chat', {
        body: {
          messages: history,
          conversationId
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      // A 200 with no message used to fall through both branches and do
      // nothing at all. No answer is a failure, whatever the status code.
      if (typeof data?.message !== "string" || !data.message) throw new Error("Empty response");

      const assistantMessage: Message = { role: 'assistant', content: data.message };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: unknown) {
      // For whoever is debugging; the person sees the inline row instead of
      // the transport's wording ("Edge Function returned a non-2xx status code").
      console.error("AI assistant request failed:", error);
      setFailed(true);
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  };

  const ask = async (question: string) => {
    const content = question.trim();
    if (!content || inFlight.current) return;
    // Nothing reaches the AI provider before the person allows it (App Store 5.1.2(i)).
    if (!(await aiConsent.ensure())) return;

    const history: Message[] = [...messages, { role: 'user', content }];
    setMessages(history);
    void requestAnswer(history);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input;
    setInput("");
    void ask(text);
  };

  // Resends the conversation as it is. The unanswered question is already its
  // last message, so nothing is appended.
  const retry = async () => {
    if (!(await aiConsent.ensure())) return;
    void requestAnswer(messages);
  };

  const clearChat = () => {
    setMessages([]);
    setFailed(false);
    setConversationId(null);
  };

  return (
    <AppLayout user={user} profile={profile}>
      {aiConsent.dialog}
      <div className="h-full flex flex-col max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
              <AgentAvatar size="lg" className="h-10 w-10" />
              {t('ai.title', 'Realtor AI Assistant')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('ai.subtitle', 'Your intelligent real estate CRM assistant')}
            </p>
          </div>
          {messages.length > 0 && (
            // Not while a request is out: its answer would arrive in the
            // conversation that was just emptied.
            <Button variant="outline" onClick={clearChat} disabled={loading} size="sm" className="h-8 text-xs">
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              {t('ai.clearChat', 'Clear Chat')}
            </Button>
          )}
        </div>

        {/* Quick Actions */}
        {messages.length === 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              {t('ai.quickActions', 'Quick Actions')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => ask(action.prompt)}
                  className="h-auto py-3 text-left justify-start text-sm"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <Card className="flex-1 mb-4 p-4 overflow-y-auto bg-card">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <AgentFigure className="mx-auto mb-4 h-36 w-auto" />
                <h3 className="text-lg font-semibold mb-2">{t('ai.welcomeTitle', 'Welcome to Realtor AI Assistant')}</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {/* aiChat.welcomeDesc, not the older ai.welcomeDesc: that one
                      promised actions the function cannot take. */}
                  {t('aiChat.welcomeDesc', aiChatEn.welcomeDesc)}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
                    message.role === 'assistant' 
                      ? 'bg-white ring-1 ring-border' 
                      : 'bg-muted'
                  }`}>
                    {message.role === 'assistant' ? (
                      <AgentAvatar className="h-full w-full" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div className={`flex-1 rounded-lg p-3 ${
                    message.role === 'assistant'
                      ? 'bg-muted'
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    {message.role === 'assistant' ? (
                      <>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {/* Every model answer can be flagged from where it is
                            read (Google Play AI-generated content policy). */}
                        <ReportAIResponse responseText={message.content} />
                      </>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                // role="status": the three dots are the visible sign that a
                // request is out, and they said nothing to a screen reader.
                <div className="flex gap-3" role="status">
                  <div className="w-8 h-8 overflow-hidden rounded-full bg-white ring-1 ring-border flex items-center justify-center">
                    <AgentAvatar className="h-full w-full" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <span className="sr-only">{t('aiChat.thinking', aiChatEn.thinking)}</span>
                    <div className="flex gap-1" aria-hidden="true">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              {/* The question above this row got no answer. It sits where the
                  answer would have been, on the assistant's side, and stays
                  there: a toast is gone before it is read and leaves no way to
                  resend. role="alert" announces it when it appears; it is
                  unmounted while a retry is out, so a second failure is
                  announced again. */}
              {failed && !loading && (
                <div className="flex gap-3" role="alert">
                  <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-destructive" aria-hidden="true" />
                  </div>
                  <div className="flex-1 rounded-lg border border-destructive/30 bg-destructive/5 p-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm">{t('aiChat.error', aiChatEn.error)}</p>
                    <Button type="button" variant="outline" size="sm" onClick={retry} className="h-8 text-xs">
                      <RotateCw className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                      {t('aiChat.retry', aiChatEn.retry)}
                    </Button>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </Card>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            aria-label={t('ai.inputLabel', 'Message the assistant')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ai.placeholder', 'Ask me anything about your CRM, contacts, deals...')}
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()} size="sm" className="h-10">
            <Send className="w-4 h-4" />
          </Button>
        </form>
        {/* Said where the answers are read, not buried in the terms: this is
            generated text and it can be wrong. */}
        <p className="mt-2 text-xs text-muted-foreground">{t('aiReport.disclaimer', aiReportEn.disclaimer)}</p>
      </div>
    </AppLayout>
  );
};

export default AIAssistant;
