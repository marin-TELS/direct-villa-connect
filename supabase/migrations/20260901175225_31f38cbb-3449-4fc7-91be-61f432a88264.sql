CREATE TABLE public.demandes_contact (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('rappel','question')),
  prenom text,
  telephone text,
  email text NOT NULL,
  disponibilites text,
  message text,
  consentement boolean NOT NULL DEFAULT false,
  cree_le timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.demandes_contact TO anon;
GRANT INSERT ON public.demandes_contact TO authenticated;
GRANT ALL ON public.demandes_contact TO service_role;

ALTER TABLE public.demandes_contact ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Envoi public du formulaire"
  ON public.demandes_contact
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (consentement = true);