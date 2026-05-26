-- =====================================================
-- CHATBOT KNOWLEDGE BASE - VECTOR SEARCH MIGRATION
-- =====================================================
-- JALANKAN DI SUPABASE SQL EDITOR
-- Menambahkan vector embeddings untuk semantic search
-- =====================================================

-- Step 1: Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Step 2: Add embedding column ke tabel existing
-- Dimensi 768 untuk Gemini embedding model
ALTER TABLE chatbot_knowledge 
ADD COLUMN IF NOT EXISTS embedding vector(768);

-- Step 3: Create index untuk vector similarity search (HNSW - lebih cepat)
CREATE INDEX IF NOT EXISTS chatbot_knowledge_embedding_idx 
ON chatbot_knowledge 
USING hnsw (embedding vector_cosine_ops);

-- Step 4: Create function untuk semantic search
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 3
)
RETURNS TABLE (
  id int,
  question text,
  answer text,
  category text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ck.id,
    ck.question,
    ck.answer,
    ck.category,
    1 - (ck.embedding <=> query_embedding) AS similarity
  FROM chatbot_knowledge ck
  WHERE ck.is_active = TRUE
    AND ck.embedding IS NOT NULL
    AND 1 - (ck.embedding <=> query_embedding) > match_threshold
  ORDER BY ck.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Step 5: Grant execute permission untuk anonymous users
GRANT EXECUTE ON FUNCTION match_knowledge(vector(768), float, int) TO anon;
GRANT EXECUTE ON FUNCTION match_knowledge(vector(768), float, int) TO authenticated;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ pgvector extension enabled';
  RAISE NOTICE '✅ embedding column added to chatbot_knowledge';
  RAISE NOTICE '✅ HNSW index created for fast similarity search';
  RAISE NOTICE '✅ match_knowledge function created';
  RAISE NOTICE '';
  RAISE NOTICE '📋 NEXT STEP: Run the seed-embeddings script to generate embeddings for existing FAQ data';
END $$;
