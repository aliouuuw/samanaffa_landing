/*
  # Correction de la politique RLS pour les inscriptions

  1. Modifications
    - Supprimer l'ancienne politique d'insertion
    - Créer une nouvelle politique d'insertion plus permissive pour les utilisateurs anonymes
    - Vérifier que RLS est bien activé

  2. Sécurité
    - Permettre les insertions anonymes (nécessaire pour les inscriptions publiques)
    - Maintenir la restriction de lecture pour les utilisateurs authentifiés uniquement
*/

-- Supprimer l'ancienne politique d'insertion si elle existe
DROP POLICY IF EXISTS "Allow public insertions" ON user_registrations;

-- Créer une nouvelle politique d'insertion pour les utilisateurs anonymes
CREATE POLICY "Enable insert for anon users"
  ON user_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Créer également une politique d'insertion pour les utilisateurs authentifiés (au cas où)
CREATE POLICY "Enable insert for authenticated users"
  ON user_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Vérifier que RLS est bien activé
ALTER TABLE user_registrations ENABLE ROW LEVEL SECURITY;

-- Vérifier que la politique de lecture existe toujours
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_registrations' 
    AND policyname = 'Allow authenticated read'
  ) THEN
    CREATE POLICY "Allow authenticated read"
      ON user_registrations
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;