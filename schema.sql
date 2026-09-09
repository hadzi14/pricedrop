-- 1. Tabele
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' NOT NULL,
  is_pro BOOLEAN DEFAULT false NOT NULL,
  pro_expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description_summary TEXT,
  current_price NUMERIC,
  estimated_market_value NUMERIC,
  discount_percentage NUMERIC,
  location TEXT,
  source_url TEXT,
  contact_details TEXT,
  action_deadline TIMESTAMPTZ,
  is_verified BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT opportunities_title_source_key UNIQUE (title, source_name)
);

-- 2. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Korisnici mogu da menjaju i čitaju samo svoj profil
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Svi mogu da čitaju prilike
CREATE POLICY "Anyone can view opportunities" 
  ON public.opportunities FOR SELECT 
  USING (true);

-- 3. Trigger za automatsko kreiranje profila pri registraciji
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
