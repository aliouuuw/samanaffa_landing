/*
  # Trigger pour envoyer un email à chaque nouvelle inscription

  1. Fonction
    - Créer une fonction qui appelle l'Edge Function d'envoi d'email
    
  2. Trigger
    - Déclencher l'envoi d'email après chaque insertion dans user_registrations
*/

-- Fonction pour déclencher l'envoi d'email
CREATE OR REPLACE FUNCTION trigger_email_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Appeler l'Edge Function pour envoyer l'email
  PERFORM
    net.http_post(
      url := 'https://sjsjlrclmbxvxlegripm.supabase.co/functions/v1/send-registration-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'record', to_jsonb(NEW)
      )
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger
DROP TRIGGER IF EXISTS email_notification_trigger ON user_registrations;

CREATE TRIGGER email_notification_trigger
  AFTER INSERT ON user_registrations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_email_notification();