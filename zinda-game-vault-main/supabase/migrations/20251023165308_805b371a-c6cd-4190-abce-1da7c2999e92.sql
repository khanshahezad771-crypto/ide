-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Create games table
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  banner_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  min_requirements TEXT NOT NULL,
  recommended_requirements TEXT NOT NULL,
  download_link TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on games
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read games
CREATE POLICY "Anyone can view games"
  ON public.games
  FOR SELECT
  USING (true);

-- Only admins can insert games
CREATE POLICY "Admins can insert games"
  ON public.games
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update games
CREATE POLICY "Admins can update games"
  ON public.games
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete games
CREATE POLICY "Admins can delete games"
  ON public.games
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create traffic_logs table
CREATE TABLE public.traffic_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  page_views INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on traffic_logs
ALTER TABLE public.traffic_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view traffic logs
CREATE POLICY "Admins can view traffic logs"
  ON public.traffic_logs
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for games updated_at
CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON public.games
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for game assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('game-assets', 'game-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for game assets
CREATE POLICY "Anyone can view game assets"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'game-assets');

CREATE POLICY "Admins can upload game assets"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'game-assets' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update game assets"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'game-assets' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete game assets"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'game-assets' AND
    public.has_role(auth.uid(), 'admin')
  );