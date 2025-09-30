-- New Database Schema: Modules and Lessons Structure
-- Run this in Supabase SQL Editor

-- 1. Create modules table
CREATE TABLE public.modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  "order" int NOT NULL,
  created_at timestamp DEFAULT now()
);

-- 2. Create lessons table
CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES public.modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  "order" int NOT NULL,
  video_url text,
  content text,
  created_at timestamp DEFAULT now()
);

-- 3. Update progress table to reference lessons
ALTER TABLE public.progress 
ADD COLUMN lesson_id uuid REFERENCES public.lessons(id);

-- 4. Row Level Security (RLS) Policies

-- Modules: All authenticated users can read
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Modules readable by all" ON public.modules;
CREATE POLICY "Modules readable by all" 
ON public.modules FOR SELECT 
USING (true);

-- Lessons: All authenticated users can read
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lessons readable by all" ON public.lessons;
CREATE POLICY "Lessons readable by all" 
ON public.lessons FOR SELECT 
USING (true);

-- Progress: Users can only manage their own progress
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to insert their own progress" ON public.progress;
DROP POLICY IF EXISTS "Allow authenticated users to select their own progress" ON public.progress;
DROP POLICY IF EXISTS "Allow authenticated users to update their own progress" ON public.progress;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own progress" ON public.progress;

-- Create new policies
CREATE POLICY "Users can view own progress"
ON public.progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
ON public.progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
ON public.progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
ON public.progress FOR DELETE
USING (auth.uid() = user_id);

-- 5. Seed data for modules
INSERT INTO public.modules (title, "order") VALUES
('Introductie en basisbegrippen', 1),
('Mindset I', 2),
('Technische analyse', 3),
('Fundamentele analyse', 4),
('Risk management', 5),
('Trading strategieën', 6),
('Mindset II', 7),
('Advanced concepts', 8);

-- 6. Seed data for lessons (Module 1: Introductie en basisbegrippen)
INSERT INTO public.lessons (module_id, title, "order", video_url, content) 
SELECT 
  m.id,
  lesson_data.title,
  lesson_data."order",
  lesson_data.video_url,
  lesson_data.content
FROM public.modules m,
(VALUES
  ('Bullish en bearish', 1, 'https://vimeo.com/example1', '# Bullish en Bearish\n\nIn deze les leer je over:\n\n- **Bullish**: Positieve marktverwachting\n- **Bearish**: Negatieve marktverwachting\n\n## Belangrijke concepten\n\n1. Market sentiment\n2. Trend identificatie\n3. Psychologie achter bullish/bearish denken'),
  ('Long en short', 2, 'https://vimeo.com/example2', '# Long en Short\n\n## Long positie\n- Je koopt een asset\n- Je profiteert van stijgende prijzen\n- "Buy low, sell high"\n\n## Short positie\n- Je verkoopt een asset die je niet bezit\n- Je profiteert van dalende prijzen\n- "Sell high, buy low"'),
  ('Spot vs. leverage traden', 3, 'https://vimeo.com/example3', '# Spot vs. Leverage Trading\n\n## Spot Trading\n- Je koopt de daadwerkelijke asset\n- Geen leverage\n- Volledige controle\n\n## Leverage Trading\n- Je handelt met geleend geld\n- Hogere winst/verlies potentieel\n- Risico van liquidation')
) AS lesson_data(title, "order", video_url, content)
WHERE m.title = 'Introductie en basisbegrippen';

-- 7. Seed data for lessons (Module 2: Mindset I)
INSERT INTO public.lessons (module_id, title, "order", video_url, content) 
SELECT 
  m.id,
  lesson_data.title,
  lesson_data."order",
  lesson_data.video_url,
  lesson_data.content
FROM public.modules m,
(VALUES
  ('Emotionele controle', 1, 'https://vimeo.com/example4', '# Emotionele Controle\n\n## Belangrijke principes\n\n1. **FOMO vermijden**\n2. **Greed management**\n3. **Fear control**\n\n## Praktische tips\n\n- Stel duidelijke regels op\n- Houd een trading journal bij\n- Neem regelmatig pauzes'),
  ('Discipline en consistentie', 2, 'https://vimeo.com/example5', '# Discipline en Consistentie\n\n## Wat is trading discipline?\n\n- Het volgen van je trading plan\n- Geen impulsieve beslissingen\n- Consistentie in je aanpak\n\n## Hoe ontwikkel je discipline?\n\n1. Maak een trading plan\n2. Stel duidelijke regels op\n3. Review je trades regelmatig'),
  ('Risk tolerance', 3, 'https://vimeo.com/example6', '# Risk Tolerance\n\n## Wat is risk tolerance?\n\nJe vermogen om verliezen te accepteren zonder emotioneel overweldigd te raken.\n\n## Factoren die risk tolerance beïnvloeden\n\n- Financiële situatie\n- Ervaring\n- Persoonlijkheid\n- Levensfase')
) AS lesson_data(title, "order", video_url, content)
WHERE m.title = 'Mindset I';

-- 8. Add some resources
INSERT INTO public.resources (title, url) VALUES
('TradingView - Charting Platform', 'https://www.tradingview.com'),
('CoinMarketCap - Market Data', 'https://coinmarketcap.com'),
('Binance Academy - Educational Content', 'https://academy.binance.com'),
('Crypto.com University', 'https://university.crypto.com');
