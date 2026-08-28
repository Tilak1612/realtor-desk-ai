-- Add listing_price, commission_percentage, closing_date to deals table.
--
-- The frontend (Dashboard, DealsList, DealCard, DealDetailSidebar,
-- DealsStats, DealsKanban, AddDealModal, EditDealModal) has always read
-- and written these columns, and the generated types.ts includes them,
-- but the columns were never in the live schema — causing
-- `GET /rest/v1/deals?select=listing_price,commission_percentage,closing_date`
-- to 400 on every dashboard load.

ALTER TABLE public.deals
  ADD COLUMN IF NOT EXISTS listing_price numeric,
  ADD COLUMN IF NOT EXISTS commission_percentage numeric,
  ADD COLUMN IF NOT EXISTS closing_date date;

-- Backfill closing_date from expected_close_date for existing rows
-- so historical deals show a close date in the new UI.
UPDATE public.deals
SET closing_date = expected_close_date
WHERE closing_date IS NULL AND expected_close_date IS NOT NULL;
