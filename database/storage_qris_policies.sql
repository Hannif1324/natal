-- =====================================================
-- STORAGE BUCKET: qris-images - RLS POLICIES
-- =====================================================
-- Jalankan SQL ini SETELAH membuat bucket di Dashboard:
-- Supabase Dashboard -> Storage -> New Bucket -> "qris-images" -> Public: No
-- =====================================================

-- Allow public to view QRIS images
CREATE POLICY "Public can view qris images"
ON storage.objects FOR SELECT
USING (bucket_id = 'qris-images');

-- Only authenticated users (admin) can upload QRIS images
CREATE POLICY "Authenticated users can upload qris images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'qris-images');

-- Only authenticated users (admin) can update QRIS images
CREATE POLICY "Authenticated users can update qris images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'qris-images');

-- Only authenticated users (admin) can delete QRIS images
CREATE POLICY "Authenticated users can delete qris images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'qris-images');

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Storage policies for qris-images bucket created!';
  RAISE NOTICE '📷 Public can view, only admin can upload/update/delete';
END $$;
