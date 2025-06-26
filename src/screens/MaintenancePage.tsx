import React from 'react';

export const MaintenancePage = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5e8] via-[#f0f8f0] to-[#e8f5e8] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/logo-sama-naffa-vf-logo-1.png" 
            alt="Sama Naffa" 
            className="mx-auto h-16 w-auto"
          />
        </div>
        
        {/* Main Message */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.415-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Site en Développement
            </h1>
            <p className="text-gray-600 mb-4">
              Nous travaillons actuellement sur quelque chose d'extraordinaire pour vous !
            </p>
          </div>
          
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Nous serons bientôt de retour
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Notre équipe de développement met les dernières touches à votre nouvelle expérience d'épargne. 
              Restez connecté pour découvrir nos solutions innovantes.
            </p>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Besoin d'aide ?
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Notre équipe support reste disponible pour répondre à vos questions.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-center text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>contact@everestfin.com</span>
            </div>
            <div className="flex items-center justify-center text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+221 33 822 87 00 ou +221 33 822 87 01</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Sama Naffa. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}; 