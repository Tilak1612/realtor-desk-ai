import { Card } from "@/components/ui/card";
import { Clock, Monitor, DollarSign } from "lucide-react";

const ProblemSection = () => {
  return (
    <section className="section-padding bg-muted">
      <div className="container-custom">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="mb-4">Tired of Missing Leads While You Sleep?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Traditional CRMs leave money on the table. Here's what you're losing every day:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 text-center card-hover">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-bold mb-3">Lost Opportunities</h3>
            <p className="text-muted-foreground leading-relaxed">
              67% of leads contact realtors outside business hours. Are you there to respond? Your competitors are.
            </p>
          </Card>

          <Card className="p-8 text-center card-hover">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Monitor className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-bold mb-3">Tool Overload</h3>
            <p className="text-muted-foreground leading-relaxed">
              Juggling 5+ platforms for chat, email, calls, and CRM. There's a better way that saves 15 hours per week.
            </p>
          </Card>

          <Card className="p-8 text-center card-hover">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-bold mb-3">Wasted Ad Spend</h3>
            <p className="text-muted-foreground leading-relaxed">
              You pay for leads, but slow response times mean competitors close them first. First responder wins 78% of the time.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
