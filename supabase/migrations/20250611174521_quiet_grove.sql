/*
  # Création de la table des inscriptions utilisateurs

  1. Nouvelle table
    - `user_registrations`
      - `id` (uuid, clé primaire)
      - `full_name` (text, nom complet)
      - `whatsapp_number` (text, numéro WhatsApp)
      - `country` (text, pays de résidence)
      - `has_used_savings_app` (boolean, a déjà utilisé une app d'épargne)
      - `saving_motivation` (text, motivation pour épargner)
      - `ideal_monthly_amount` (text, montant idéal mensuel)
      - `selected_objective` (text, objectif sélectionné)
      - `monthly_amount` (integer, montant mensuel configuré)
      - `duration` (integer, durée en années)
      - `projected_amount` (integer, montant projeté)
      - `created_at` (timestamp, date de création)
      - `updated_at` (timestamp, date de mise à jour)

  2. Sécurité
    - Activer RLS sur la table `user_registrations`
    - Ajouter une politique pour permettre l'insertion publique (pour les inscriptions)
    - Ajouter une politique pour la lecture authentifiée (pour l'admin)
*/

CREATE TABLE IF NOT EXISTS user_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  whatsapp_number text NOT NULL,
  country text NOT NULL DEFAULT 'Sénégal',
  has_used_savings_app boolean NOT NULL DEFAULT false,
  saving_motivation text NOT NULL,
  ideal_monthly_amount text NOT NULL,
  selected_objective text NOT NULL,
  monthly_amount integer NOT NULL,
  duration integer NOT NULL,
  projected_amount integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE user_registrations ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion publique (inscriptions)
CREATE POLICY "Allow public insertions"
  ON user_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Politique pour permettre la lecture aux utilisateurs authentifiés (admin)
CREATE POLICY "Allow authenticated read"
  ON user_registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_user_registrations_updated_at
  BEFORE UPDATE ON user_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_user_registrations_created_at ON user_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_registrations_country ON user_registrations(country);
CREATE INDEX IF NOT EXISTS idx_user_registrations_objective ON user_registrations(selected_objective);