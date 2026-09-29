import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { FAQAccordion } from "@/components/rd/marketing/FAQAccordion";

// /features/listing-import — the third unbuilt feature page.
//
// THE DISTINCTION THIS PAGE EXISTS TO MAKE. The competitor map is blunt about
// it: "Listing import is not IDX website capability", and the pricing page
// already separates "Realtor.ca listing import" from "native CREA DDF® feed
// (Q3 2026)". An importer that pulls one property from a URL and a licensed
// MLS data feed are different products, and conflating them is the single
// easiest overclaim to make in Canadian real estate software.
//
// VERIFIED 2026-09-28 against production:
//   public.import_history    — import_type, source_url, status, total_records,
//     saved_records, duplicate_records, failed_records, parser_version
//   public.property_listings — mls_number, realtor_ca_url, source,
//     source_listing_id, data_source, currency, photos_json
//   public.ddf_properties + ddf_sync_log exist as scaffolding; the CREA
//     credentials are not in place, which is why DDF stays marked Q3 2026
//     everywhere on the site.

const FAQS = [
  {
    q: "What can I import today?",
    a: "A property, from a Realtor.ca address or an MLS number. The importer reads the public listing and creates a record with the address, price, type, beds and baths, photos and the source URL it came from, so you can always get back to the original.",
  },
  {
    q: "Is this a CREA DDF® feed?",
    a: "No, and the difference matters. DDF is a licensed data feed that syncs listings continuously across boards. This reads one public listing at a time, on your instruction. Native DDF sync is on our roadmap for Q3 2026 and is marked that way on the pricing page and the roadmap. We are not affiliated with or endorsed by CREA.",
  },
  {
    q: "Is it an IDX website?",
    a: "No. An IDX website publishes searchable MLS listings to the public. This brings a property into your own CRM so you can attach it to a client and a deal. If you need public IDX search on your own domain, we do not offer it.",
  },
  {
    q: "What happens to duplicates?",
    a: "They are counted, not silently merged. Every import records how many records were read, saved, skipped as duplicates and failed, so a run that half-worked looks different from one that worked. You can see the history rather than guessing why a count changed.",
  },
  {
    q: "Which currency are prices in?",
    a: "Canadian dollars. Listings carry an explicit currency rather than assuming one, and the rest of the product is denominated in CAD throughout.",
  },
];

const ListingImport = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Import listings from Realtor.ca"
        description="Bring a property into your CRM from a Realtor.ca address or MLS number, with duplicates counted. Native CREA DDF sync is on the Q3 2026 roadmap."
        keywords="realtor.ca listing import, mls listing import crm, crea ddf integration, real estate listing crm canada"
        canonicalUrl="https://www.realtordesk.ai/features/listing-import"
        structuredData={[
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

      <main>
        <section className="pt-32 md:pt-40 pb-10">
          <div className="container-custom max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <Link to="/features" className="hover:underline">
                Platform
              </Link>
              <span aria-hidden="true"> / </span>
              <span>Listing import</span>
            </nav>
            <h1 className="mb-6">Bring a listing in from Realtor.ca</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Paste a Realtor.ca address or an MLS number and the property
              becomes a record you can attach to a client and a deal. It is an
              importer, not a data feed, and this page is careful about the
              difference.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">Importer, feed, and IDX are three things</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Vendors blur these constantly, so here is the plain version. An{" "}
                <strong>importer</strong> reads one public listing when you ask
                it to — that is what ships today. A{" "}
                <strong>CREA DDF® feed</strong> is licensed MLS data that syncs
                continuously; ours is scaffolded and waiting on credentials, and
                is marked Q3 2026 on the roadmap and the pricing page. An{" "}
                <strong>IDX website</strong> publishes searchable listings to
                the public on your own domain; we do not offer one at all.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If a demo leaves you unsure which of the three you are buying,
                ask the vendor to show you a listing appearing without anyone
                pasting a URL. That single question separates them.
              </p>
            </div>

            <div>
              <h2 className="mb-4">What comes across</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>Address, city, province and postal code.</li>
                <li>Price in Canadian dollars, property type, beds and baths.</li>
                <li>Photos, and the listing&rsquo;s own MLS number.</li>
                <li>
                  The Realtor.ca URL it came from, kept on the record so the
                  source is always one click away.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4">Every run is counted</h2>
              <p className="text-muted-foreground leading-relaxed">
                An import records how many records it read, saved, skipped as
                duplicates and failed, along with the parser version that did
                it. That sounds like bookkeeping until the day a run half-works:
                the difference between &ldquo;nothing imported&rdquo; and
                &ldquo;eleven imported, three were already there, one was
                malformed&rdquo; is the difference between a support ticket and
                a glance.
              </p>
            </div>

            <div>
              <h2 className="mb-4">What we are not claiming</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are not affiliated with, endorsed by or certified by CREA,
                any real estate board, or Realtor.ca. Listing data is licensed
                and we treat it that way: the importer brings a public listing
                into your own workspace, it does not republish anything, and
                when native DDF sync arrives it will carry the attribution CREA
                requires.
              </p>
            </div>

            <div>
              <h2 className="mb-6">Questions</h2>
              <FAQAccordion items={FAQS} />
            </div>

            <div>
              <h2 className="mb-4">Related</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  <Link to="/roadmap" className="underline">
                    Roadmap
                  </Link>{" "}
                  — where native CREA DDF® sync actually stands.
                </li>
                <li>
                  <Link to="/integrations" className="underline">
                    Integrations
                  </Link>{" "}
                  — what else connects, per capability.
                </li>
                <li>
                  <Link to="/features/pipeline" className="underline">
                    The pipeline
                  </Link>{" "}
                  — attaching a property to a deal.
                </li>
              </ul>
            </div>

            <Card className="p-8 text-center">
              <h2 className="mb-3">Try it on a listing you know</h2>
              <p className="text-muted-foreground mb-6">
                14 days, $149 CAD a month after. Nothing charged before day 14.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/signup">Start free trial</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/roadmap">See the roadmap</Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ListingImport;
