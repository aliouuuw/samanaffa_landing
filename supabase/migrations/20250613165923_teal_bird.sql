/*
  # Correction des politiques RLS pour les inscriptions

  1. Problème identifié
    - Les politiques RLS empêchent l'insertion par les utilisateurs anonymes
    - Besoin de reconfigurer les politiques pour permettre les inscriptions publiques

  2. Solution
    - Supprimer toutes les anciennes politiques
    - Recréer des politiques correctes pour anon et authenticated
    - Vérifier que RLS est bien configuré

  3. Sécurité
    - Permettre INSERT pour anon (formulaire public)
    - Permettre SELECT pour authenticated (dashboard admin)
    - Maintenir la sécurité des données
*/

-- Supprimer toutes les politiques existantes pour repartir sur une base saine
DROP POLICY IF EXISTS "Allow public insertions" ON user_registrations;
DROP POLICY IF EXISTS "Enable insert for anon users" ON user_registrations;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_registrations;
DROP POLICY IF EXISTS "Allow authenticated read" ON user_registrations;

-- Désactiver temporairement RLS pour nettoyer
ALTER TABLE user_registrations DISABLE ROW LEVEL SECURITY;

-- Réactiver RLS
ALTER TABLE user_registrations ENABLE ROW LEVEL SECURITY;

-- Créer une politique permissive pour l'insertion par les utilisateurs anonymes
CREATE POLICY "Allow anonymous insertions"
  ON user_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Créer une politique pour l'insertion par les utilisateurs authentifiés
CREATE POLICY "Allow authenticated insertions"
  ON user_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Créer une politique pour la lecture par les utilisateurs authentifiés (dashboard admin)
CREATE POLICY "Allow authenticated reads"
  ON user_registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Vérifier que les politiques sont bien créées
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  -- Compter les politiques créées
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE tablename = 'user_registrations';
  
  IF policy_count < 3 THEN
    RAISE EXCEPTION 'Erreur: Toutes les politiques n''ont pas été créées. Nombre trouvé: %', policy_count;
  END IF;
  
  -- Vérifier spécifiquement la politique d'insertion anonyme
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_registrations' 
    AND policyname = 'Allow anonymous insertions'
    AND cmd = 'INSERT'
    AND roles = '{anon}'
  ) THEN
    RAISE EXCEPTION 'Politique d''insertion anonyme non trouvée';
  END IF;
  
  RAISE NOTICE 'Politiques RLS configurées avec succès:';
  RAISE NOTICE '- Allow anonymous insertions (INSERT pour anon)';
  RAISE NOTICE '- Allow authenticated insertions (INSERT pour authenticated)';
  RAISE NOTICE '- Allow authenticated reads (SELECT pour authenticated)';
  RAISE NOTICE 'Les inscriptions publiques sont maintenant autorisées !';
END $$;

-- Test de la configuration (optionnel)
DO $$
BEGIN
  -- Vérifier que RLS est activé
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = 'user_registrations'
    AND n.nspname = 'public'
    AND c.relrowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS n''est pas activé sur la table user_registrations';
  END IF;
  
  RAISE NOTICE 'Configuration RLS validée avec succès !';
END $$;