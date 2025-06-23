
-- 建立報名者資料表
CREATE TABLE public.registrants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT,
  line_id TEXT,
  is_resident BOOLEAN DEFAULT false,
  housing_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(email, phone)
);

-- 建立活動報名歷史表
CREATE TABLE public.registration_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registrant_id UUID REFERENCES public.registrants(id) ON DELETE CASCADE,
  activity_name TEXT NOT NULL,
  age TEXT,
  children_count TEXT,
  sports_experience TEXT,
  injury_history TEXT,
  info_source TEXT,
  suggestions TEXT,
  submit_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 啟用 Row Level Security
ALTER TABLE public.registrants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_history ENABLE ROW LEVEL SECURITY;

-- 建立 RLS 政策 (暫時允許所有操作，之後可根據需求調整)
CREATE POLICY "Allow all operations on registrants" ON public.registrants FOR ALL USING (true);
CREATE POLICY "Allow all operations on registration_history" ON public.registration_history FOR ALL USING (true);

-- 建立索引來提高查詢效能
CREATE INDEX idx_registrants_email_phone ON public.registrants(email, phone);
CREATE INDEX idx_registration_history_registrant_id ON public.registration_history(registrant_id);
