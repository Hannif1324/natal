-- =====================================================
-- ADD TICKET QUOTA COLUMN
-- =====================================================
-- Jalankan di Supabase SQL Editor
-- =====================================================

ALTER TABLE ticket_config 
ADD COLUMN IF NOT EXISTS ticket_quota INTEGER DEFAULT 150;

-- Update existing row if needed
UPDATE ticket_config SET ticket_quota = 150 WHERE ticket_quota IS NULL;

DO $$
BEGIN
  RAISE NOTICE '✅ ticket_quota column added with default 150';
END $$;
