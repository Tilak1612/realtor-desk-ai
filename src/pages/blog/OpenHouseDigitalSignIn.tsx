import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";
import blogImage from "@/assets/blog-open-house-digital.jpg";
import blogImageAvif from "@/assets/blog-open-house-digital.avif";
import blogImageWebp from "@/assets/blog-open-house-digital.webp";
import { Picture } from "@/components/Picture";

// /blog/open-house-digital-sign-in-sheets-vs-paper-2025, rewritten 2026-10-12.
//
// WHAT WAS REMOVED, AND WHY. None of it had a source.
//   - Intro: "capture 3x more contact details", "instant follow-up", "conversion
//     rate differences", "free templates", and a garbled "Research Finding" card.
//   - "8-15 qualified visitors" per open house, "$8,000-$15,000 commission" each,
//     "68% of visitors provide fake phone numbers", "22% of contact info unusable",
//     "follow-up delayed by 2-4 hours minimum".
//   - The whole comparison table of figures: capture rate 32% against 87%, accuracy
//     64% against 98%, follow-up "under 60 sec", lead-to-appointment 4.2% against
//     14.6% ("3.5x better"), cost per lead $47 against $18, setup cost $5 against
//     $0-$49 a month, and CASL compliance described as "Automatic, documented".
//   - CASL: "$10,000+ fines per violation", "keep records proving consent for 3
//     years", separate checkboxes for email, SMS and phone presented as a legal
//     requirement, and "paper sign-in sheets rarely meet these requirements".
//   - The "CASL-Compliant Digital Sign-In Template" block. The sheet, its columns
//     and the consent wording now live on /resources/open-house-sign-in-sheet-template
//     and are deliberately not repeated here.
//   - "Best Digital Sign-In Solutions": Realtor Desk listed first with a
//     "Recommended" badge and a wrong price ($69 a month), plus unsourced reviews
//     and prices for two other tools. Realtor Desk is not a sign-in tool at all.
//   - "The Perfect Open House Follow-Up Sequence": an "Automated Follow-Up
//     Timeline" (a text within two minutes, automated listing emails, a monthly
//     drip "until they convert or unsubscribe"). The product sends nothing on its
//     own, and "the sequence top agents use" had nobody behind it.
//   - "ROI Analysis: Is Digital Worth It?" in full: 240 visitors a year, $32,000
//     against $92,000, "$59,292 a year" of additional revenue, "186% more revenue".
//   - Implementation checklist with hardware prices, "automated email/SMS
//     templates" and "just takes 30 seconds".
//   - Common questions: "8-12% of visitors prefer paper", "most apps work
//     offline", "most Canadian carriers include" a hotspot, and a two-minute
//     text being "expected and appreciated".
//   - Related-article blurbs ("Avoid $10,000+ fines", "converts 3.5x better"),
//     the "Capture More Open House Leads" close, and an alt text describing a
//     tablet that is not in the picture.
//
// WHAT THIS PAGE CLAIMS, AND FROM WHERE
//   paper against digital rows        properties of the two media that anyone can
//                                     observe; no measurement, no figure
//   CASL statements                   the Act, S.C. 2010, c. 23, limited to the
//                                     points on the verified fact sheet: onus of
//                                     proof on the sender, what a request for
//                                     express consent must contain, six months for
//                                     an inquiry, two years for a purchase or
//                                     written contract, what a message must
//                                     carry, ten business days to unsubscribe
//   no sign-in kiosk, tablet or QR    verified fact sheet ("does NOT do")
//   manual entry, CSV import, webhook verified fact sheet; CSV limits as on
//                                     /features/import-contacts
//   consent date and source, refusal  verified fact sheet
//     to send without consent
//   price and trial wording           verified fact sheet
// It makes no claim about capture rates, conversion, time saved or revenue.

const ROWS: { row: string; paper: string; digital: string }[] = [
  {
    row: "Setup",
    paper: "Print the sheet, bring a pen and a clipboard.",
    digital: "Build the form once, then charge the device and test it in the property before each open house.",
  },
  {
    row: "Legibility",
    paper: "Depends on handwriting. Some entries cannot be read afterwards.",
    digital: "Typed, so it can be read. A visitor can still mistype an address.",
  },
  {
    row: "Getting contacts into your CRM",
    paper: "Typed in by hand after the open house.",
    digital: "Exported as a file or passed on by the form tool, with no retyping.",
  },
  {
    row: "Proof of consent",
    paper: "The sheet itself, if the consent request is printed on it. Keep the original or a scan.",
    digital: "The form record with its date, if the consent request was on the form. Keep an export.",
  },
  {
    row: "With no signal",
    paper: "Not affected by signal or battery.",
    digital: "Depends on the tool. Some forms need a connection to submit, so test on site and keep a paper sheet as a fallback.",
  },
  {
    row: "Visitor comfort",
    paper: "Familiar. Nobody needs instructions.",
    digital: "Some visitors will not want to type on a device that is not theirs.",
  },
  {
    row: "Privacy between visitors",
    paper: "The next visitor can read earlier entries unless you cover them or use one slip per person.",
    digital: "Earlier entries stay hidden, as long as the form clears after each visitor.",
  },
  {
    row: "Cost",
    paper: "Printing and a pen.",
    digital: "A device you already own, plus a form tool that may be free or paid.",
  },
];

const FAQS = [
  {
    q: "Is a digital open house sign-in sheet better than paper?",
    a: "Neither is better in every case. A form gives you typed contacts you can read and move into a CRM without retyping. Paper needs no device, battery or signal, and some visitors are more comfortable with a pen. What matters more is that you ask for consent clearly and enter the contacts the same day. Running a form with a paper sheet beside it covers both.",
  },
  {
    q: "Do visitors have to sign in at an open house?",
    a: "Nothing in CASL requires a visitor to sign in. Whether signing in is a condition of entry is for the seller and the listing brokerage to decide, and your brokerage or provincial regulator may have its own expectations. Either way, giving a name at the door is separate from agreeing to marketing email, so ask for that on its own line.",
  },
  {
    q: "Can I email everyone who signed my sheet?",
    a: "Not on the strength of the signature alone. Signing in records that someone visited. It is not the same as agreeing to receive marketing email. Under CASL the sender has the onus of proving consent, so ask for it explicitly on the sheet or form and keep the record. This is general information, not legal advice.",
  },
  {
    q: "What should an open house sign-in sheet include?",
    a: "Keep it to what you will use: a name, one way to reach the person, and a separate request for consent to marketing messages that names who is asking, gives your contact details and says consent can be withdrawn. The printable sheet linked from this page has the full column list and the wording, so they are not repeated here.",
  },
  {
    q: "How long can I keep following up after an open house?",
    a: "It depends on the consent you have. Under CASL, implied consent that arises from an inquiry lasts six months, and from a purchase or written contract, two years. Whether a visit counts as an inquiry depends on the facts, so express consent, asked for clearly and recorded, is the firmer footing. An unsubscribe must be given effect within 10 business days. This is general information, not legal advice.",
  },
];

const OpenHouseDigitalSignIn = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Open House Sign-In Sheets: Digital vs Paper"
        description="Paper or digital open house sign-in sheet? An honest comparison for Canadian agents, CASL consent basics and what to do after, with a link to a printable sheet."
        keywords="open house sign in sheet, digital open house sign in sheet, open house sign in sheet paper vs digital, open house CASL consent, open house follow up"
        image={blogImage}
        article
        publishedTime="2025-01-29"
        modifiedTime="2026-10-12"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/blog/open-house-digital-sign-in-sheets-vs-paper-2025"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Open House Sign-In Sheets: Digital vs Paper",
            "description": "Paper or digital open house sign-in sheet? An honest comparison for Canadian agents, CASL consent basics and what to do after, with a link to a printable sheet.",
            "author": { "@type": "Organization", "name": "Realtor Desk" },
            "publisher": { "@type": "Organization", "name": "Realtor Desk" },
            "datePublished": "2025-01-29",
            "dateModified": "2026-10-12"
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />

      <Navbar />

      <article className="pt-32 md:pt-40 pb-20">
        <div className="container-custom max-w-4xl">
          <Link to="/resources">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resources
            </Button>
          </Link>

          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground flex-wrap">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold">
                Open houses
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Rewritten October 12, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>7 min read</span>
              </div>
            </div>

            <h1 className="mb-6">
              Open House Sign-In Sheets: Digital vs Paper
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Use a form on a tablet or phone if you will set it up and test it before the doors open, and keep a paper sheet beside it. Paper needs no setup and no battery, but it has to be typed in afterwards and some handwriting cannot be read. A form gives you typed contacts straight away, but it is one more thing to set up and some visitors will not use it.
            </p>

            <p className="mt-6 text-base leading-relaxed">
              Looking for the sheet itself? Our{" "}
              <Link to="/resources/open-house-sign-in-sheet-template" className="underline font-semibold text-primary">printable open house sign-in sheet</Link>{" "}
              has its own page, with the columns and the consent wording. This article compares paper with a form and covers what to do once the open house is over.
            </p>
          </header>

          <Picture
            src={blogImage}
            avif={blogImageAvif}
            webp={blogImageWebp}
            width={1200}
            height={630}
            alt="Model house and a set of keys on a wooden table"
            className="w-full rounded-2xl shadow-xl mb-12"
            priority
          />

          <div className="prose prose-lg max-w-none">
            <h2>Paper against digital, row by row</h2>
            <p>
              By digital we mean any form a visitor fills in on a tablet or phone, whether you hand them the device or they open the form on their own. The table describes how each option behaves. It has no percentages in it, because we have not measured open houses and will not quote figures we cannot stand behind.
            </p>
          </div>

          <div className="overflow-x-auto my-6">
            <table className="min-w-full text-sm">
              <caption className="text-left text-muted-foreground pb-3">
                A paper open house sign-in sheet compared with a digital form, on eight practical points.
              </caption>
              <thead>
                <tr className="border-b-2 text-left">
                  <th scope="col" className="py-2 pr-4 font-semibold">What you are comparing</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Paper sheet</th>
                  <th scope="col" className="py-2 font-semibold">Digital form</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.row} className="border-b align-top">
                    <th scope="row" className="py-3 pr-4 text-left font-semibold">{r.row}</th>
                    <td className="py-3 pr-4 text-muted-foreground">{r.paper}</td>
                    <td className="py-3 text-muted-foreground">{r.digital}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose prose-lg max-w-none">
            <p>
              Neither column wins every row. A form is stronger on legibility and on getting contacts into your CRM. Paper is stronger on setup, on working anywhere and on being familiar to every visitor. If you only want one, pick the one you are sure you will enter into your CRM that evening.
            </p>

            <h2>What to collect, and what to leave out</h2>
            <p>
              Ask only for what you will use in the next few weeks. Every extra field slows the line at the door, and it is one more piece of personal information you then have to store and look after.
            </p>
            <ul>
              <li><strong>Collect:</strong> who the visitor is, one way to reach them, and whether they agree to hear from you about more than this property.</li>
              <li><strong>Leave out:</strong> anything you would not act on, such as a home address, a budget or a detailed questionnaire. You can ask those questions in a conversation later.</li>
              <li><strong>Do not make consent a condition of signing.</strong> A visitor should be able to give a name and still say no to marketing messages.</li>
            </ul>
            <p>
              The exact column list is on the{" "}
              <Link to="/resources/open-house-sign-in-sheet-template">open house sign-in sheet template</Link>{" "}
              page.
            </p>

            <h2>Consent in Canada: signing in is not agreeing to email</h2>
            <p>
              This section is general information, not legal advice. It is limited to a few points from Canada's Anti-Spam Legislation (CASL, S.C. 2010, c. 23). For your own situation, ask your brokerage or a lawyer.
            </p>
            <p>
              A name and an email address on a sign-in sheet show that someone visited. On their own they do not show that the person agreed to receive marketing email from you. If you plan to send any, ask for it explicitly, on the sheet or the form, as a separate line the visitor answers for themselves.
            </p>
            <ul>
              <li><strong>Say who is asking.</strong> A request for express consent must name who is asking, give a mailing address plus a phone number, email address or web address, and say that consent can be withdrawn.</li>
              <li><strong>Keep the record.</strong> The sender has the onus of proving consent. Keep the paper sheet or a scan of it, or the form export with its dates.</li>
              <li><strong>Do not lean on implied consent for long.</strong> Implied consent that arises from an inquiry lasts six months. Whether an open house visit counts as an inquiry depends on the facts, which is one more reason to ask outright.</li>
              <li><strong>Make each message complete.</strong> A commercial message must identify the sender, give contact information and include an unsubscribe mechanism, and an unsubscribe must be given effect within 10 business days.</li>
            </ul>
            <p>
              For more detail, read our{" "}
              <Link to="/resources/casl-compliance-real-estate-email-marketing-canada">CASL guide for real estate email</Link>.
            </p>

            <h2>After the open house</h2>
            <p>
              The sheet is only useful if something happens with it. This is a short process that works the same way for paper and for a form.
            </p>
            <ol>
              <li>
                <strong>Enter or import the contacts the same day.</strong> Type in the paper entries while you still remember who was who, or export the form results as a CSV. If you use Realtor Desk, you can{" "}
                <Link to="/features/import-contacts">import contacts from a CSV</Link>. The import brings in contacts only: it carries no consent and does not merge duplicates.
              </li>
              <li>
                <strong>Record the consent date and source.</strong> For each visitor who agreed to marketing messages, note the date and where the consent came from, for example the sign-in sheet for that address. File the sheet, a scan or the form export where you can find it again.
              </li>
              <li>
                <strong>Send a personal note.</strong> Write to the people who agreed to hear from you, and mention something from the conversation you had. If you want a starting point, our{" "}
                <Link to="/blog/real-estate-drip-campaign-templates-canada-2025">drip campaign email templates</Link>{" "}
                are text to adapt and send yourself.
              </li>
              <li>
                <strong>Set a follow-up date.</strong> Give each contact a date for the next step, so nobody depends on your memory. If someone unsubscribes or asks you to stop, stop.
              </li>
            </ol>

            <h2>Where Realtor Desk fits</h2>
            <p>
              Realtor Desk is a CRM for Canadian real estate agents, not a sign-in tool. It has no sign-in kiosk, no tablet sign-in screen and no QR code sign-in. Open house contacts reach it in one of three ways:
            </p>
            <ul>
              <li>You type them in.</li>
              <li>You import a CSV, which creates contacts only and brings no consent with it.</li>
              <li>A webhook delivers them, for example from a form tool connected through Zapier, Make or n8n.</li>
            </ul>
            <p>
              Once a contact is in, Realtor Desk records a consent date and source for it, and the inbox and SMS refuse to send without consent. Nothing is sent without you. An in-app assistant can draft a note for you to review, and you decide whether it goes.
            </p>
          </div>

          <div className="mt-12">
            <h2 className="mb-6">Open house sign-in sheet questions</h2>
            <FAQAccordion items={FAQS} />
          </div>

          <div className="prose prose-lg max-w-none mt-12">
            <h2>Next steps</h2>
            <ul>
              <li>
                Download the{" "}
                <Link to="/resources/open-house-sign-in-sheet-template">printable open house sign-in sheet</Link>, as a PDF or a CSV.
              </li>
              <li>
                Read the{" "}
                <Link to="/resources/casl-compliance-real-estate-email-marketing-canada">CASL guide for real estate email</Link>{" "}
                before you send anything.
              </li>
              <li>
                See how to{" "}
                <Link to="/features/import-contacts">import contacts from a CSV</Link>{" "}
                and what the import leaves out.
              </li>
            </ul>
          </div>

          <Card className="p-8 mt-12 text-center">
            <h2 className="mb-3">Keep your open house contacts and their consent in one place</h2>
            <p className="text-muted-foreground mb-6">
              14-day trial, then CAD $149 a month. A card is collected up front and nothing is charged before day 14.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg">
                <Link to="/demo">Book a demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/signup">Start free trial</Link>
              </Button>
            </div>
          </Card>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default OpenHouseDigitalSignIn;
