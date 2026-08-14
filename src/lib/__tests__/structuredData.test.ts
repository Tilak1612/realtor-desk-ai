import { describe, it, expect } from "vitest";
import { productSchema, breadcrumbSchema, articleSchema } from "@/lib/structuredData";

// Regression coverage for the JSON-LD schema builders used by <SEO> (SEO /
// rich-results surface). Added by audit 2026-06-21.

describe("productSchema", () => {
  it("formats price to 2dp in CAD and namespaces the plan", () => {
    const s = productSchema("Solo", 149, "Single-agent plan");
    expect(s["@type"]).toBe("Product");
    expect(s.name).toBe("Realtor Desk - Solo Plan");
    expect(s.offers.price).toBe("149.00");
    expect(s.offers.priceCurrency).toBe("CAD");
    expect(s.brand.name).toBe("Realtor Desk");
  });
});

describe("breadcrumbSchema", () => {
  it("assigns 1-based positions and absolute item URLs", () => {
    const s = breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Pricing", url: "/pricing" },
    ]);
    expect(s.itemListElement).toHaveLength(2);
    expect(s.itemListElement[0]).toMatchObject({ position: 1, name: "Home", item: "https://www.realtordesk.ai/" });
    expect(s.itemListElement[1]).toMatchObject({ position: 2, item: "https://www.realtordesk.ai/pricing" });
  });
});

describe("articleSchema", () => {
  it("maps article fields into an Article node", () => {
    const s = articleSchema("Title", "Desc", "RealtorDesk AI", "2026-06-01", "2026-06-02", "https://img");
    expect(s["@type"]).toBe("Article");
    expect(s.headline).toBe("Title");
    expect(s.author).toMatchObject({ "@type": "Person", name: "RealtorDesk AI" });
    expect(s.datePublished).toBe("2026-06-01");
    expect(s.dateModified).toBe("2026-06-02");
    expect(s.image).toBe("https://img");
  });
});
