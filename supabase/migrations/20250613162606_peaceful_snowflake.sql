/*
  # Correction des politiques RLS pour les inscriptions

  1. Problème identifié
    - Les utilisateurs anonymes ne peuvent pas insérer dans user_registrations
    - Les politiques RLS bloquent les inscriptions depuis le formulaire

  2. Solution
    - Supprimer les anciennes politiques problématiques
    - Créer de nouvelles politiques permettant l'insertion anonyme
    - Maintenir la sécurité pour la lecture (admin seulement)

  3. Sécurité
    - Insertion autorisée pour anon et authenticated
    - Lecture autorisée uniquement pour authenticated
    - RLS reste activé pour la protection
*/

-- Supprimer toutes les anciennes politiques pour repartir sur une base saine
DROP POLICY IF EXISTS "Allow public insertions" ON user_registrations;
DROP POLICY IF EXISTS "Enable insert for anon users" ON user_registrations;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_registrations;
DROP POLICY IF EXISTS "Allow authenticated read" ON user_registrations;

-- S'assurer que RLS est activé
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

-- Vérifier que les politiques sont bien créées
DO $$
BEGIN
  -- Vérifier les politiques d'insertion
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_registrations' 
    AND policyname = 'Enable insert for anon users'
    AND cmd = 'INSERT'
  ) THEN
    RAISE EXCEPTION 'Politique d''insertion pour anon non créée';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_registrations' 
    AND policyname = 'Enable insert for authenticated users'
    AND cmd = 'INSERT'
  ) THEN
    RAISE EXCEPTION 'Politique d''insertion pour authenticated non créée';
  END IF;

  -- Vérifier la politique de lecture
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_registrations' 
    AND policyname = 'Allow authenticated read'
    AND cmd = 'SELECT'
  ) THEN
    RAISE EXCEPTION 'Politique de lecture pour authenticated non créée';
  END IF;

  RAISE NOTICE 'Toutes les politiques RLS ont été créées avec succès';
END $$;