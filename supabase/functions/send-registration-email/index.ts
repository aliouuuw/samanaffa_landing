import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()
    
    // Fonction pour formater les nombres avec des espaces
    const formatNumber = (num: number): string => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    const formatCurrency = (amount: number): string => {
      return `${formatNumber(amount)} FCFA`;
    };
    
    // Configuration de l'email
    const emailData = {
      to: ['marketingeverestfinance@gmail.com'],
      subject: `🎉 Nouvelle inscription Sama Naffa - ${record.full_name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #435933, #5a7344); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .info-item { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #435933; }
            .label { font-weight: bold; color: #435933; margin-bottom: 5px; }
            .value { color: #666; }
            .highlight { background: linear-gradient(135deg, #435933, #C38D1C); color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Nouvelle inscription Sama Naffa</h1>
              <p>Un nouveau utilisateur vient de s'inscrire !</p>
            </div>
            
            <div class="content">
              <div class="highlight">
                <h2>${record.full_name}</h2>
                <p>Objectif : ${record.selected_objective}</p>
                <p><strong>${formatCurrency(record.projected_amount)}</strong> en ${record.duration} ans</p>
              </div>
              
              <div class="info-grid">
                <div class="info-item">
                  <div class="label">📱 WhatsApp</div>
                  <div class="value">${record.whatsapp_number}</div>
                </div>
                
                <div class="info-item">
                  <div class="label">🌍 Pays</div>
                  <div class="value">${record.country}</div>
                </div>
                
                <div class="info-item">
                  <div class="label">💰 Épargne mensuelle</div>
                  <div class="value">${formatCurrency(record.monthly_amount)}</div>
                </div>
                
                <div class="info-item">
                  <div class="label">⏱️ Durée</div>
                  <div class="value">${record.duration} ans</div>
                </div>
                
                <div class="info-item">
                  <div class="label">💡 Motivation</div>
                  <div class="value">${record.saving_motivation}</div>
                </div>
                
                <div class="info-item">
                  <div class="label">💵 Montant idéal</div>
                  <div class="value">${record.ideal_monthly_amount}</div>
                </div>
                
                <div class="info-item">
                  <div class="label">📱 Expérience apps</div>
                  <div class="value">${record.has_used_savings_app ? 'Oui' : 'Non'}</div>
                </div>
                
                <div class="info-item">
                  <div class="label">📅 Date d'inscription</div>
                  <div class="value">${new Date(record.created_at).toLocaleString('fr-FR')}</div>
                </div>
              </div>
              
              <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <h3 style="color: #435933; margin-top: 0;">📊 Résumé du plan d'épargne</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li><strong>Objectif :</strong> ${record.selected_objective}</li>
                  <li><strong>Versements mensuels :</strong> ${formatCurrency(record.monthly_amount)}</li>
                  <li><strong>Durée :</strong> ${record.duration} ans</li>
                  <li><strong>Total versé :</strong> ${formatCurrency(record.monthly_amount * record.duration * 12)}</li>
                  <li><strong>Montant final projeté :</strong> ${formatCurrency(record.projected_amount)}</li>
                  <li><strong>Gain estimé :</strong> ${formatCurrency(record.projected_amount - (record.monthly_amount * record.duration * 12))}</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p>Cette notification a été générée automatiquement par Sama Naffa</p>
              <p>Pour contacter cet utilisateur : ${record.whatsapp_number}</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    // Utiliser un service d'email (exemple avec Resend)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Sama Naffa <notifications@samanaffa.com>',
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      }),
    })

    if (!response.ok) {
      throw new Error(`Erreur envoi email: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('Email envoyé avec succès:', result)

    return new Response(
      JSON.stringify({ success: true, message: 'Email envoyé avec succès' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})