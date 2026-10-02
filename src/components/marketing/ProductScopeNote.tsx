// A short, visible scope note for guides about AI capabilities Realtor Desk does
// not have.
//
// WHY. Several long posts (an AI chatbot guide, a voice AI guide, "AI vs
// traditional CRM", cost-of-missed-leads) discuss a category in general and sat
// beside copy implying Realtor Desk is a participant in it. It is not: there is
// no lead-facing chatbot, no voice agent, and nothing is sent without the agent.
// Rewriting every such post is a large job and a content decision; until that is
// made, a reader should not have to infer what the product does from a category
// guide, and the third-party statistics in them should be labelled as such.
//
// The sentences are static on purpose. The prerenderer lifts plain JSX prose but
// skips an element that contains an expression, so interpolating a per-page value
// here would hide this note from every crawler that does not run JavaScript.
// That is exactly the reader most likely to take a category guide for a product
// page.

interface ProductScopeNoteProps {
  className?: string;
}

export function ProductScopeNote({ className }: ProductScopeNoteProps) {
  return (
    <aside
      className={`rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground ${className ?? ""}`}
    >
      <p className="mb-1">
        <strong className="font-semibold text-foreground">What Realtor Desk does and does not do.</strong>
      </p>
      <p>
        This guide covers a category in general. Realtor Desk is a single-agent CRM
        that scores leads, suggests a next action and drafts text for you to review.
        It does not offer a website chatbot or a voice agent, and nothing is sent to
        a lead without you. Figures quoted below come from third-party sources that
        we have not independently verified.
      </p>
    </aside>
  );
}
