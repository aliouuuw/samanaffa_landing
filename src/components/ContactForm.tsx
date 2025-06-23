import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Card, CardContent } from './ui/card';
import { CheckCircle, Loader2, AlertCircle, ChevronDown, User, Phone, Heart, Coins, Target, Calendar, TrendingUp, Wifi, WifiOff } from 'lucide-react';
import { insertUserRegistration, UserRegistration, testSupabaseConnection } from '../lib/supabase';
import { formatCurrency } from '../lib/utils';

interface FormData {
  fullName: string;
  whatsappNumber: string;
  country: string;
  hasUsedSavingsApp: boolean;
  savingMotivation: string;
  idealMonthlyAmount: string;
  selectedObjective: string;
  monthlyAmount: number;
  duration: number;
  projectedAmount: number;
}

interface ContactFormProps {
  selectedObjective: string;
  monthlyAmount: number;
  duration: number;
  projectedAmount: number;
}

// Liste des pays avec leurs drapeaux
const countries = [
  { name: 'Sénégal', flag: '🇸🇳', code: 'SN' },
  { name: 'France', flag: '🇫🇷', code: 'FR' },
  { name: 'Mali', flag: '🇲🇱', code: 'ML' },
  { name: 'Burkina Faso', flag: '🇧🇫', code: 'BF' },
  { name: 'Côte d\'Ivoire', flag: '🇨🇮', code: 'CI' },
  { name: 'Niger', flag: '🇳🇪', code: 'NE' },
  { name: 'Guinée', flag: '🇬🇳', code: 'GN' },
  { name: 'Mauritanie', flag: '🇲🇷', code: 'MR' },
  { name: 'Gambie', flag: '🇬🇲', code: 'GM' },
  { name: 'Guinée-Bissau', flag: '🇬🇼', code: 'GW' },
  { name: 'Cap-Vert', flag: '🇨🇻', code: 'CV' },
  { name: 'Belgique', flag: '🇧🇪', code: 'BE' },
  { name: 'Canada', flag: '🇨🇦', code: 'CA' },
  { name: 'États-Unis', flag: '🇺🇸', code: 'US' },
  { name: 'Maroc', flag: '🇲🇦', code: 'MA' },
  { name: 'Algérie', flag: '🇩🇿', code: 'DZ' },
  { name: 'Tunisie', flag: '🇹🇳', code: 'TN' },
  { name: 'Cameroun', flag: '🇨🇲', code: 'CM' },
  { name: 'Gabon', flag: '🇬🇦', code: 'GA' },
  { name: 'Congo', flag: '🇨🇬', code: 'CG' },
];

// Options de motivation prédéfinies
const motivationOptions = [
  'Pour un projet (maison, mariage, voyage...)',
  'Pour les études de mes enfants',
  'Pour ma retraite',
  'Pour créer une entreprise',
  'Pour les urgences médicales',
  'Pour acheter une voiture',
  'Autre'
];

export const ContactForm: React.FC<ContactFormProps> = ({
  selectedObjective,
  monthlyAmount,
  duration,
  projectedAmount
}) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    whatsappNumber: '',
    country: 'Sénégal',
    hasUsedSavingsApp: false,
    savingMotivation: '',
    idealMonthlyAmount: '',
    selectedObjective,
    monthlyAmount,
    duration,
    projectedAmount
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showMotivationDropdown, setShowMotivationDropdown] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const selectedCountry = countries.find(c => c.name === formData.country) || countries[0];

  // Test de la connexion Supabase au chargement
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await testSupabaseConnection();
        setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      } catch (error) {
        console.error('Erreur de test de connexion:', error);
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }

    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'Le numéro WhatsApp est requis';
    } else if (!/^\+?[\d\s-()]{8,15}$/.test(formData.whatsappNumber.replace(/\s/g, ''))) {
      newErrors.whatsappNumber = 'Format invalide (ex: 77 000 00 00)';
    }

    if (!formData.savingMotivation.trim()) {
      newErrors.savingMotivation = 'La motivation est requise';
    }

    if (!formData.idealMonthlyAmount.trim()) {
      newErrors.idealMonthlyAmount = 'Le montant idéal est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (connectionStatus === 'disconnected') {
      setErrorMessage('Connexion à la base de données indisponible. Veuillez réessayer plus tard.');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const registrationData: Omit<UserRegistration, 'id' | 'created_at' | 'updated_at'> = {
        full_name: formData.fullName.trim(),
        whatsapp_number: formData.whatsappNumber.trim(),
        country: formData.country,
        has_used_savings_app: formData.hasUsedSavingsApp,
        saving_motivation: formData.savingMotivation.trim(),
        ideal_monthly_amount: formData.idealMonthlyAmount.trim(),
        selected_objective: formData.selectedObjective,
        monthly_amount: formData.monthlyAmount,
        duration: formData.duration,
        projected_amount: formData.projectedAmount
      };

      console.log('Envoi des données:', registrationData);
      
      const result = await insertUserRegistration(registrationData);
      
      console.log('Inscription réussie:', result);
      setSubmitStatus('success');
      
      // Réinitialiser le formulaire après 8 secondes
      setTimeout(() => {
        setFormData({
          fullName: '',
          whatsappNumber: '',
          country: 'Sénégal',
          hasUsedSavingsApp: false,
          savingMotivation: '',
          idealMonthlyAmount: '',
          selectedObjective,
          monthlyAmount,
          duration,
          projectedAmount
        });
        setSubmitStatus('idle');
      }, 8000);
      
    } catch (error: any) {
      console.error('Erreur lors de la soumission:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Une erreur inattendue s\'est produite. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCountrySelect = (countryName: string) => {
    handleInputChange('country', countryName);
    setShowCountryDropdown(false);
  };

  const handleMotivationSelect = (motivation: string) => {
    handleInputChange('savingMotivation', motivation);
    setShowMotivationDropdown(false);
  };

  if (submitStatus === 'success') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-lg">
          <CardContent className="p-8 md:p-16 text-center">
            <div className="mb-8 md:mb-12">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                🎉 Inscription réussie !
              </h3>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Félicitations ! Vous faites maintenant partie de la communauté Sama Naffa. 
                Nous vous contacterons bientôt sur WhatsApp pour vous tenir informé du lancement.
              </p>
            </div>

            {/* Récapitulatif du plan responsive */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl md:rounded-3xl p-6 md:p-8">
              <h4 className="font-bold text-gray-900 mb-4 md:mb-6 text-lg md:text-2xl flex items-center justify-center gap-2 md:gap-3">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-[#435933]" />
                Récapitulatif de votre plan
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-left">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between p-3 md:p-4 bg-white rounded-lg md:rounded-xl">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Target className="w-4 h-4 md:w-5 md:h-5 text-[#435933]" />
                      <span className="text-gray-600 font-medium text-sm md:text-base">Objectif</span>
                    </div>
                    <span className="font-bold text-gray-900 text-sm md:text-base">{selectedObjective}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 md:p-4 bg-white rounded-lg md:rounded-xl">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Coins className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                      <span className="text-gray-600 font-medium text-sm md:text-base">Épargne mensuelle</span>
                    </div>
                    <span className="font-bold text-blue-600 text-sm md:text-base">{formatCurrency(monthlyAmount)}</span>
                  </div>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between p-3 md:p-4 bg-white rounded-lg md:rounded-xl">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                      <span className="text-gray-600 font-medium text-sm md:text-base">Durée</span>
                    </div>
                    <span className="font-bold text-purple-600 text-sm md:text-base">{duration} ans</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg md:rounded-xl">
                    <div className="flex items-center gap-2 md:gap-3">
                      <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                      <span className="text-gray-700 font-medium text-sm md:text-base">Objectif final</span>
                    </div>
                    <span className="font-bold text-emerald-600 text-base md:text-xl">{formatCurrency(projectedAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-lg">
        <CardContent className="p-6 md:p-12">
          {/* Header responsive */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">
              Remplissez le formulaire de contact
            </h2>
            
            {/* Indicateur de connexion */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {connectionStatus === 'checking' && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                  <span className="text-sm text-gray-500">Vérification de la connexion...</span>
                </>
              )}
              {connectionStatus === 'connected' && (
                <>
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">Connexion sécurisée</span>
                </>
              )}
              {connectionStatus === 'disconnected' && (
                <>
                  <WifiOff className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">Connexion indisponible</span>
                </>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* Nom complet responsive */}
            <div className="space-y-2">
              <Label className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">
                Nom complet
              </Label>
              <div className="relative">
                <User className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Fatou Diallo"
                  className={`h-10 md:h-12 text-base md:text-lg bg-transparent pl-6 md:pl-8 pr-0 focus:ring-0 transition-colors`}
                  style={{ 
                    borderBottomWidth: '0.85px',
                    border: 'none',
                    borderBottom: errors.fullName ? '0.85px solid #f87171' : '0.85px solid #435933',
                    borderRadius: '0'
                  }}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-xs md:text-sm flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Numéro WhatsApp et Pays responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2">
                <Label className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Numéro WhatsApp
                </Label>
                <div className="relative">
                  <Phone className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <Input
                    value={formData.whatsappNumber}
                    onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                    placeholder="77 000 00 00"
                    className="h-10 md:h-12 text-base md:text-lg bg-transparent pl-6 md:pl-8 pr-0 focus:ring-0 transition-colors"
                    style={{ 
                      borderBottomWidth: '0.85px',
                      border: 'none',
                      borderBottom: errors.whatsappNumber ? '0.85px solid #f87171' : '0.85px solid #435933',
                      borderRadius: '0'
                    }}
                  />
                </div>
                {errors.whatsappNumber && (
                  <p className="text-red-500 text-xs md:text-sm flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                    {errors.whatsappNumber}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Pays de résidence
                </Label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="w-full h-10 md:h-12 flex items-center justify-between bg-transparent pl-0 pr-0 text-base md:text-lg focus:outline-none transition-colors"
                    style={{ 
                      borderBottomWidth: '0.85px',
                      border: 'none',
                      borderBottom: '0.85px solid #435933',
                      borderRadius: '0'
                    }}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-xl md:text-2xl">{selectedCountry.flag}</span>
                      <span className="font-medium">{selectedCountry.name}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-gray-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg md:rounded-xl z-50 max-h-48 md:max-h-60 overflow-y-auto shadow-lg">
                      {countries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => handleCountrySelect(country.name)}
                          className="w-full px-3 py-2 md:px-4 md:py-3 flex items-center gap-2 md:gap-3 hover:bg-gray-50 transition-colors text-left last:rounded-b-lg md:last:rounded-b-xl first:rounded-t-lg md:first:rounded-t-xl"
                        >
                          <span className="text-lg md:text-xl">{country.flag}</span>
                          <span className="text-sm md:text-base">{country.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expérience avec les apps d'épargne responsive - CHECKBOXES EN VERT */}
            <div className="space-y-3 md:space-y-4">
              <Label className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">
                Avez-vous déjà utilisé une application d'épargne ?
              </Label>
              <RadioGroup
                value={formData.hasUsedSavingsApp ? "oui" : "non"}
                onValueChange={(value) => handleInputChange('hasUsedSavingsApp', value === "oui")}
                className="flex flex-col md:flex-row gap-4 md:gap-8"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="oui"
                    id="oui"
                    className="w-4 h-4 md:w-5 md:h-5 border-2 border-gray-400 data-[state=checked]:bg-[#435933] data-[state=checked]:border-[#435933] data-[state=checked]:text-white"
                  />
                  <Label htmlFor="oui" className="text-base md:text-lg font-medium cursor-pointer">
                    Oui
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value="non"
                    id="non"
                    className="w-4 h-4 md:w-5 md:h-5 border-2 border-gray-400 data-[state=checked]:bg-[#435933] data-[state=checked]:border-[#435933] data-[state=checked]:text-white"
                  />
                  <Label htmlFor="non" className="text-base md:text-lg font-medium cursor-pointer">
                    Non
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Motivation responsive */}
            <div className="space-y-2">
              <Label className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">
                Quelle est votre principale motivation pour épargner ?
              </Label>
              <div className="relative">
                <Heart className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowMotivationDropdown(!showMotivationDropdown)}
                  className="w-full h-10 md:h-12 flex items-center justify-between bg-transparent pl-6 md:pl-8 pr-0 text-base md:text-lg text-left transition-colors focus:outline-none"
                  style={{ 
                    borderBottomWidth: '0.85px',
                    border: 'none',
                    borderBottom: errors.savingMotivation ? '0.85px solid #f87171' : '0.85px solid #435933',
                    borderRadius: '0'
                  }}
                >
                  <span className={formData.savingMotivation ? 'text-gray-900' : 'text-gray-400'}>
                    {formData.savingMotivation || 'Pour un projet (maison, mariage, voyage...)'}
                  </span>
                  <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-gray-400 transition-transform ${showMotivationDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showMotivationDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg md:rounded-xl z-50 shadow-lg">
                    {motivationOptions.map((motivation, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleMotivationSelect(motivation)}
                        className="w-full px-3 py-2 md:px-4 md:py-3 hover:bg-gray-50 transition-colors text-left text-sm md:text-base first:rounded-t-lg md:first:rounded-t-xl last:rounded-b-lg md:last:rounded-b-xl"
                      >
                        {motivation}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.savingMotivation && (
                <p className="text-red-500 text-xs md:text-sm flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                  {errors.savingMotivation}
                </p>
              )}
            </div>

            {/* Montant idéal responsive avec icône Coins */}
            <div className="space-y-2">
              <Label className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">
                Quel est, selon vous, le montant idéal à épargner par mois ?
              </Label>
              <div className="relative">
                <Coins className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <Input
                  value={formData.idealMonthlyAmount}
                  onChange={(e) => handleInputChange('idealMonthlyAmount', e.target.value)}
                  placeholder="Ex: 15 000 FCFA, 25 000 FCFA, etc."
                  className="h-10 md:h-12 text-base md:text-lg bg-transparent pl-6 md:pl-8 pr-0 focus:ring-0 transition-colors"
                  style={{ 
                    borderBottomWidth: '0.85px',
                    border: 'none',
                    borderBottom: errors.idealMonthlyAmount ? '0.85px solid #f87171' : '0.85px solid #435933',
                    borderRadius: '0'
                  }}
                />
              </div>
              {errors.idealMonthlyAmount && (
                <p className="text-red-500 text-xs md:text-sm flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                  {errors.idealMonthlyAmount}
                </p>
              )}
            </div>

            {/* Submit button responsive */}
            <div className="pt-6 md:pt-8 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting || connectionStatus === 'disconnected'}
                className="w-full md:w-auto px-6 md:px-8 h-[50px] md:h-[60px] bg-[#435933] hover:bg-[#364529] disabled:bg-gray-400 text-white rounded-xl md:rounded-2xl font-medium text-base md:text-lg transition-all duration-300 flex items-center justify-center gap-3 md:gap-4 disabled:cursor-not-allowed transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    Inscription en cours...
                  </>
                ) : (
                  <>
                    Je m'inscris
                    <svg 
                      width="24" 
                      height="8" 
                      viewBox="0 0 32 12" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 w-6 h-2 md:w-8 md:h-3"
                    >
                      <path 
                        d="M31.5303 6.53033C31.8232 6.23744 31.8232 5.76256 31.5303 5.46967L26.7574 0.696699C26.4645 0.403806 25.9896 0.403806 25.6967 0.696699C25.4038 0.989593 25.4038 1.46447 25.6967 1.75736L29.9393 6L25.6967 10.2426C25.4038 10.5355 25.4038 11.0104 25.6967 11.3033C25.9896 11.5962 26.4645 11.5962 26.7574 11.3033L31.5303 6.53033ZM0 6.75H31V5.25H0V6.75Z" 
                        fill="currentColor"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {submitStatus === 'error' && (
              <div className="bg-red-50 rounded-lg p-3 md:p-4 text-center">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600 mx-auto mb-2" />
                <p className="text-red-700 font-medium text-sm md:text-base">
                  {errorMessage || 'Une erreur s\'est produite. Veuillez réessayer.'}
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};