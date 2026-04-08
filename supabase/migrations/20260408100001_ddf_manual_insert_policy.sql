-- Allow authenticated users to manually insert DDF properties
-- (for manual data injection until CREA DDF API credentials are live)
-- Users can insert but NOT update/delete (those remain service-role only)

CREATE POLICY "Authenticated users can insert DDF properties"
  ON ddf_properties FOR INSERT
  TO authenticated
  WITH CHECK (true);

COMMENT ON POLICY "Authenticated users can insert DDF properties" ON ddf_properties
  IS 'Temporary policy for manual property data injection. Remove when CREA DDF sync is live.';
