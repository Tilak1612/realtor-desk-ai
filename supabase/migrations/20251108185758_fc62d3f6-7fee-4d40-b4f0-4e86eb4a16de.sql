-- Create property_listings table for real estate properties
CREATE TABLE IF NOT EXISTS public.property_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  property_type TEXT,
  listing_type TEXT DEFAULT 'sale',
  price NUMERIC,
  bedrooms INTEGER,
  bathrooms NUMERIC,
  square_feet INTEGER,
  lot_size NUMERIC,
  year_built INTEGER,
  status TEXT DEFAULT 'active',
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.property_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for property_listings
CREATE POLICY "Users can view their own property listings"
  ON public.property_listings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own property listings"
  ON public.property_listings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own property listings"
  ON public.property_listings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own property listings"
  ON public.property_listings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_property_listings_updated_at
  BEFORE UPDATE ON public.property_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();