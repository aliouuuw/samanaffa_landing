/*
  # Installation complète de la base de données Sama Naffa

  1. Nouvelle table
    - `user_registrations` avec tous les champs nécessaires
    - Contraintes et valeurs par défaut appropriées
    - Index pour optimiser les performances

  2. Sécurité
    - Activation de RLS (Row Level Security)
    - Politiques pour insertion publique (formulaire)
    - Politiques pour lecture authentifiée (admin)

  3. Fonctions et triggers
    - Fonction de mise à jour automatique de `updated_at`
    - Fonction d'envoi d'email automatique
    - Triggers associés

  4. Configuration email
    - Trigger pour notification automatique par email
    - Intégration avec Edge Function
*/

-- Supprimer la table si elle existe déjà (pour réinstallation propre)
DROP TABLE IF EXISTS user_registrations CASCADE;

-- Créer la table des inscriptions utilisateurs
CREATE TABLE user_registrations (
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

-- Activer RLS (Row Level Security)
ALTER TABLE user_registrations ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion aux utilisateurs anonymes (formulaire public)
CREATE POLICY "Enable insert for anon users"
  ON user_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Politique pour permettre l'insertion aux utilisateurs authentifiés
CREATE POLICY "Enable insert for authenticated users"
  ON user_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Politique pour permettre la lecture aux utilisateurs authentifiés (dashboard admin)
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

-- Fonction pour déclencher l'envoi d'email (nécessite l'extension http)
CREATE OR REPLACE FUNCTION trigger_email_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Appeler l'Edge Function pour envoyer l'email
  -- Note: Cette fonction nécessite l'extension pg_net qui doit être activée
  PERFORM
    net.http_post(
      url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-registration-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'record', to_jsonb(NEW)
      )
    );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur, on log mais on n'empêche pas l'insertion
    RAISE WARNING 'Erreur lors de l''envoi de l''email: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour envoyer un email à chaque nouvelle inscription
CREATE TRIGGER email_notification_trigger
  AFTER INSERT ON user_registrations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_email_notification();

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_user_registrations_created_at ON user_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_registrations_country ON user_registrations(country);
CREATE INDEX IF NOT EXISTS idx_user_registrations_objective ON user_registrations(selected_objective);

-- Vérification finale des politiques
DO $$
BEGIN
  -- Vérifier que toutes les politiques sont bien créées
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_registrations' 
    AND policyname = 'Enable insert for anon users'
  ) THEN
    RAISE EXCEPTION 'Politique d''insertion pour anon non créée';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_registrations' 
    AND policyname = 'Allow authenticated read'
  ) THEN
    RAISE EXCEPTION 'Politique de lecture pour authenticated non créée';
  END IF;

  RAISE NOTICE 'Base de données Sama Naffa installée avec succès !';
  RAISE NOTICE 'Table: user_registrations créée';
  RAISE NOTICE 'Politiques RLS: configurées';
  RAISE NOTICE 'Triggers: email automatique activé';
  RAISE NOTICE 'Index: optimisations créées';
END $$;