import { ChevronRightIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { ContactForm } from "../../components/ContactForm";
import { TestimonialCarousel } from "../../components/TestimonialCarousel";
import { formatNumber, formatCurrency } from "../../lib/utils";

// Personas avec montants par défaut (mensuel), durée (mois) et descriptions personnalisées
const personas = [
  { 
    id: 'mame', 
    name: "La Mame protectrice Maam Seynabou", 
    amount: 20000, 
    duration: 36, 
    description: "Protège et guide sa famille avec sagesse",
    personalizedMessage: "Acheter votre première maison\nRéalisez votre rêve d'accession à la propriété",
    emoji: "🧕🏾",
    shortName: "Maam Seynabou, la Mame protectrice",
    quote: "Tu penses à ta famille d'abord. L'épargne, c'est ta façon de les protéger demain."
  },
  { 
    id: 'etudiante', 
    name: "L'étudiante ambitieuse – Fatima", 
    amount: 8000, 
    duration: 48, 
    description: "Prépare brillamment son avenir académique",
    personalizedMessage: "Financer vos études supérieures\nInvestissez dans votre avenir académique et professionnel",
    emoji: "👩🏾‍🎓",
    shortName: "Fatima, l'étudiante ambitieuse",
    quote: "Tu veux réussir sans être freinée par l'argent. C'est possible, même avec un petit budget."
  },
  { 
    id: 'chauffeur', 
    name: "Le chauffeur de taxi – Yankhoba", 
    amount: 12000, 
    duration: 24, 
    description: "Travailleur acharné des routes de Dakar",
    personalizedMessage: "Acheter votre propre véhicule\nDevenez propriétaire de votre outil de travail",
    emoji: "🧔🏾‍♂️",
    shortName: "Yankhoba, le chauffeur dévoué",
    quote: "Tu bosses dur tous les jours. Une bonne épargne peut t'offrir un vrai bol d'air."
  },
  { 
    id: 'commercante', 
    name: "La commerçante du marché – Sophie", 
    amount: 15000, 
    duration: 30, 
    description: "Dynamique vendeuse du marché local",
    personalizedMessage: "Développer votre commerce\nAgrandissez votre business et augmentez vos revenus",
    emoji: "🛒",
    shortName: "Sophie, commerçante dynamique",
    quote: "Tu gagnes de l'argent chaque jour, mais tu veux mieux le garder pour avancer."
  },
  { 
    id: 'entrepreneur', 
    name: "L'entrepreneur digital – Bilal", 
    amount: 35000, 
    duration: 60, 
    description: "Innovateur du numérique sénégalais",
    personalizedMessage: "Lancer votre startup\nTransformez vos idées innovantes en entreprise prospère",
    emoji: "💻",
    shortName: "Bilal, entrepreneur du digital",
    quote: "Tu veux transformer tes idées en business solide. L'épargne, c'est ton levier."
  },
  { 
    id: 'diaspora', 
    name: "Le jeune mbokk de la diaspora – Mbaye", 
    amount: 30000, 
    duration: 72, 
    description: "Soutient le pays depuis l'étranger",
    personalizedMessage: "Investir au pays\nContribuez au développement du Sénégal tout en bâtissant votre patrimoine",
    emoji: "🌍",
    shortName: "Mbaye, engagé depuis l'étranger",
    quote: "Tu veux soutenir le pays, mais aussi poser les bases de ton propre projet."
  },
  { 
    id: 'mere', 
    name: "La mère célibataire – Khady", 
    amount: 10000, 
    duration: 48, 
    description: "Courageuse maman qui élève seule ses enfants",
    personalizedMessage: "Sécuriser l'avenir de vos enfants\nConstituez un fonds de sécurité pour leur éducation et leur bien-être",
    emoji: "👩🏾‍👧",
    shortName: "Khady, maman courageuse",
    quote: "Tu fais beaucoup avec peu. Épargner, c'est aussi protéger tes enfants."
  },
  { 
    id: 'fonctionnaire', 
    name: "Le fonctionnaire proche de la retraite – Baay Abdou", 
    amount: 25000, 
    duration: 120, 
    description: "Prépare sereinement sa retraite",
    personalizedMessage: "Préparer votre retraite\nAssurez-vous une retraite confortable et paisible",
    emoji: "👴🏾",
    shortName: "Baay Abdou, fonctionnaire prévoyant",
    quote: "Après une vie de service, tu veux une retraite paisible et bien préparée."
  },
  { 
    id: 'journalier', 
    name: "Le jeune journalier – Momar", 
    amount: 5000, 
    duration: 36, 
    description: "Travailleur déterminé du secteur informel",
    personalizedMessage: "Construire votre avenir\nBâtissez votre projet professionnel étape par étape",
    emoji: "👷🏾",
    shortName: "Momar, journalier déterminé",
    quote: "Construire votre avenir professionnel\nBâtissez votre projet étape par étape."
  },
  { 
    id: 'vendeuse', 
    name: "La vendeuse en ligne – Astou", 
    amount: 18000, 
    duration: 42, 
    description: "Entrepreneuse du commerce électronique",
    personalizedMessage: "Développer votre e-commerce\nFaites grandir votre business en ligne et diversifiez vos revenus",
    emoji: "👩🏾‍💼",
    shortName: "Astou, vendeuse connectée",
    quote: "Tu vends en ligne, tu avances vite. Épargne un peu chaque gain, et regarde ton projet grandir."
  },
  { 
    id: 'talibe', 
    name: "Le talibé devenu mentor – Axel", 
    amount: 8000, 
    duration: 60, 
    description: "Guide spirituel et éducateur de la jeunesse",
    personalizedMessage: "Créer votre centre éducatif\nOuvrez votre propre école ou centre de formation",
    emoji: "🧑🏾‍🏫",
    shortName: "Axel, mentor dévoué",
    quote: "Créer votre centre éducatif\nOuvrez votre propre école ou centre de formation."
  },
  { 
    id: 'conseillere', 
    name: "L'amie conseillère – Aminata", 
    amount: 22000, 
    duration: 48, 
    description: "Sage conseillère de son entourage",
    personalizedMessage: "Réaliser un projet collectif\nOrganisez et financez un projet qui bénéficie à votre communauté",
    emoji: "👯‍♀️",
    shortName: "Aminata, l'amie toujours là",
    quote: "Tu conseilles, tu écoutes. Avec un projet commun, tu rassembles et tu bâtis."
  },
  { 
    id: 'tontine', 
    name: "La gérante de tontine – Yaay Absa", 
    amount: 40000, 
    duration: 24, 
    description: "Organise l'épargne collective du quartier",
    personalizedMessage: "Structurer l'épargne collective\nModernisez et sécurisez l'épargne de votre groupe",
    emoji: "🧑🏾‍🌾",
    shortName: "Yaay Absa, la force du quartier",
    quote: "Tu connais la valeur de l'union. En épargnant ensemble, on va plus loin."
  },
  { 
    id: 'dewrigne', 
    name: "Le dewrigne de daahira – Serigne Mame Malick", 
    amount: 15000, 
    duration: 36, 
    description: "Guide spirituel et leader communautaire",
    personalizedMessage: "Développer votre daahira\nFinancez les projets et infrastructures de votre communauté religieuse",
    emoji: "🕌",
    shortName: "Serigne Mame Malick, guide engagé",
    quote: "Tu es un pilier pour ta communauté. Planifie et montre l'exemple par l'épargne."
  },
];

// Fonction pour calculer le taux d'intérêt selon la durée (en mois)
const tauxParDuree = (mois: number): number => {
  if (mois <= 6) return 3.5;
  if (mois <= 12) return 4.5;
  if (mois <= 36) return 6.0;
  if (mois <= 60) return 7.0;
  if (mois <= 120) return 8.5;
  return 10.0;
};

// Define data for objectives avec paramètres du simulateur
const objectives = [
  { 
    id: 1, 
    name: "Maison", 
    icon: "/house-1.png",
    titre: "Acheter votre première maison",
    duree: 120, // En mois (10 ans)
    mensualite: 50000,
    description: "Réalisez votre rêve d'accession à la propriété"
  },
  { 
    id: 2, 
    name: "Etudes", 
    icon: "/mortarboard-1.png",
    titre: "Financer les études universitaires de votre enfant",
    duree: 180, // En mois (15 ans)
    mensualite: 25000,
    description: "Investissez dans l'avenir de vos enfants"
  },
  { 
    id: 3, 
    name: "Voyage", 
    icon: "/flight-1.png",
    titre: "Financer un voyage de rêve",
    duree: 24, // En mois (2 ans)
    mensualite: 40000,
    description: "Explorez le monde sans contraintes financières"
  },
  { 
    id: 4, 
    name: "Projet pro", 
    icon: "/suitcase-1.png",
    titre: "Fais grandir ton business",
    duree: 60, // En mois (5 ans)
    mensualite: 30000,
    description: "Développez votre entreprise avec confiance"
  },
  { 
    id: 5, 
    name: "Retraite", 
    icon: "/person-1.png",
    titre: "Préparer votre retraite",
    duree: 240, // En mois (20 ans)
    mensualite: 20000,
    description: "Assurez-vous une retraite confortable"
  },
];

export const LandingPage = (): JSX.Element => {
  // États pour le simulateur
  const [selectedObjective, setSelectedObjective] = useState(1);
  const [selectedPersona, setSelectedPersona] = useState('');
  const [duree, setDuree] = useState(6); // En mois maintenant
  const [mensualite, setMensualite] = useState(1000);
  const [taux, setTaux] = useState(tauxParDuree(6));
  const [showForm, setShowForm] = useState(false);

  // Mise à jour du taux quand la durée change
  useEffect(() => {
    setTaux(tauxParDuree(duree));
  }, [duree]);

  // Mise à jour des valeurs quand l'objectif change
  useEffect(() => {
    const currentObjective = objectives.find(obj => obj.id === selectedObjective);
    if (currentObjective) {
      setDuree(currentObjective.duree);
      setMensualite(currentObjective.mensualite);
      // Réinitialiser la persona quand on change d'objectif
      setSelectedPersona('');
    }
  }, [selectedObjective]);

  // Calcul de l'épargne avec intérêts simples (comme dans le code fourni)
  const calculerCapitalFinal = (mensuel: number, dureeMois: number, tauxAnnuel: number): { capitalFinal: number; interets: number } => {
    const dureeAnnee = dureeMois / 12;
    const capitalVerse = mensuel * dureeMois;
    const interets = capitalVerse * (tauxAnnuel / 100) * dureeAnnee;
    return {
      capitalFinal: capitalVerse + interets,
      interets,
    };
  };

  const { capitalFinal, interets } = calculerCapitalFinal(mensualite, duree, taux);
  const currentObjective = objectives.find(obj => obj.id === selectedObjective) || objectives[0];
  const selectedPersonaData = personas.find(p => p.id === selectedPersona);

  const handleObjectiveClick = (objectiveId: number) => {
    setSelectedObjective(objectiveId);
    // Scroll vers le simulateur avec un délai pour l'animation
    setTimeout(() => {
      const simulatorElement = document.getElementById('simulator-section');
      if (simulatorElement) {
        simulatorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  };

  const handlePersonaChange = (personaId: string) => {
    setSelectedPersona(personaId);
    const persona = personas.find(p => p.id === personaId);
    if (persona) {
      setMensualite(persona.amount);
      setDuree(persona.duration);
    }
  };

  const handleShowForm = () => {
    setShowForm(true);
    setTimeout(() => {
      const formElement = document.getElementById('contact-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1440px] relative">
        {/* Hero Section - Responsive */}
        <section className="relative w-full min-h-screen lg:h-[742px] overflow-hidden">
          {/* Éléments décoratifs - Cachés sur mobile */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            <div className="absolute w-24 h-24 bg-[#435933]/8 rounded-full top-32 left-32 animate-float"></div>
            <div className="absolute w-16 h-16 bg-[#C38D1C]/10 rounded-full bottom-40 right-40 animate-float" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative w-full h-full z-10">
            {/* Background image - Responsive */}
            <img
              className="absolute w-full h-full lg:w-[1123px] lg:h-[742px] top-0 left-0 object-cover"
              alt="Background element"
              src="/4x3-v2-3h-1.png"
            />

            {/* Logo - Responsive */}
            <img
              className="absolute w-[120px] h-[67px] lg:w-[194px] lg:h-[109px] top-4 lg:top-8 left-4 lg:left-[91px] object-cover hover:scale-105 transition-transform duration-300"
              alt="Logo SAMA NAFFA"
              src="/logo-sama-naffa-vf-logo-1.png"
            />

            {/* Contenu hero - Responsive */}
            <div className="absolute top-[120px] lg:top-[180px] left-4 lg:left-[502px] right-4 lg:right-auto space-y-4 lg:space-y-6 text-left px-2 lg:px-0">
              {/* Badge avec pulsation réduite - Responsive */}
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 lg:px-4 py-1.5 lg:py-2 rounded-full mb-3 lg:mb-4 animate-fade-in shadow-sm text-sm lg:text-base">
                <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-[#C38D1C] rounded-full animate-subtle-pulse"></div>
                <span className="text-[#435933] font-semibold">Épargne innovante</span>
              </div>

              {/* Titre principal - Responsive */}
              <h1 className="font-bold text-4xl lg:text-6xl leading-tight animate-fade-in">
                <span className="block text-[#435933] mb-1 lg:mb-2">Épargner</span>
                <span className="block text-[#C38D1C]">intelligemment</span>
              </h1>

              {/* Sous-titre - Responsive */}
              <h2 className="font-medium text-[#30461f] text-xl lg:text-3xl leading-relaxed max-w-[350px] lg:w-[420px] animate-fade-in" style={{ animationDelay: '0.3s' }}>
                pour réaliser vos projets.
              </h2>

              {/* Description - Responsive */}
              <div className="space-y-3 lg:space-y-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <p className="font-normal text-[#1a1616] text-base lg:text-lg leading-relaxed max-w-[380px] lg:w-[450px]">
                  Rejoignez la révolution de l'épargne digitale en Afrique de l'Ouest avec 
                  <span className="font-semibold text-[#435933]"> Sama Naffa</span>.
                </p>
                
                {/* Points clés - Responsive */}
                <div className="flex flex-wrap gap-2 lg:gap-3">
                  <span className="inline-flex items-center gap-1 text-xs lg:text-sm font-medium text-gray-700 bg-white/80 px-2 lg:px-3 py-1 rounded-full">
                    🔒 Sécurisé
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs lg:text-sm font-medium text-gray-700 bg-white/80 px-2 lg:px-3 py-1 rounded-full">
                    📈 Rentable
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs lg:text-sm font-medium text-gray-700 bg-white/80 px-2 lg:px-3 py-1 rounded-full">
                    ⚡ Simple
                  </span>
                </div>
              </div>

              {/* CTA principal - Responsive */}
              <div className="pt-4 lg:pt-6 animate-fade-in" style={{ animationDelay: '0.9s' }}>
                <button 
                  onClick={handleShowForm}
                  className="group relative px-6 lg:px-8 h-[50px] lg:h-[60px] bg-gradient-to-r from-[#30461f] to-[#435933] hover:from-[#243318] hover:to-[#364529] rounded-xl lg:rounded-2xl text-white text-base lg:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 lg:gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  <span className="relative z-10">Je m'inscris gratuitement</span>
                  <svg 
                    width="20" 
                    height="6" 
                    viewBox="0 0 24 8" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10 group-hover:translate-x-1 transition-transform duration-300 hidden sm:block"
                  >
                    <path 
                      d="M23.3536 4.35355C23.5488 4.15829 23.5488 3.84171 23.3536 3.64645L20.1716 0.464466C19.9763 0.269204 19.6597 0.269204 19.4645 0.464466C19.2692 0.659728 19.2692 0.976311 19.4645 1.17157L22.2929 4L19.4645 6.82843C19.2692 7.02369 19.2692 7.34027 19.4645 7.53553C19.6597 7.7308 19.9763 7.7308 20.1716 7.53553L23.3536 4.35355ZM0 4.5H23V3.5H0V4.5Z" 
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Image du téléphone - Responsive */}
            <img
              className="absolute w-[280px] lg:w-[450px] h-auto top-[400px] lg:top-[70px] left-1/2 transform -translate-x-1/2 lg:translate-x-0 lg:left-[950px] hover:scale-105 transition-transform duration-500 drop-shadow-2xl z-20"
              alt="Application Sama Naffa sur téléphone"
              src="/phone.png"
            />

            {/* Badges app store - Responsive */}
            <div className="absolute flex flex-col lg:flex-row gap-2 lg:gap-4 bottom-8 lg:top-[47px] left-1/2 transform -translate-x-1/2 lg:translate-x-0 lg:left-[1000px]">
              <img
                className="w-[120px] lg:w-[135px] h-8 lg:h-10 hover:scale-105 transition-transform duration-300 cursor-pointer"
                alt="App Store"
                src="/mobile-app-store-badge.svg"
              />

              <div className="w-[120px] lg:w-[135px] h-8 lg:h-10 bg-baseblack rounded-[5px] overflow-hidden border border-solid border-[#a6a6a6] relative hover:scale-105 transition-transform duration-300 cursor-pointer">
                <img
                  className="absolute w-[70px] lg:w-[85px] h-[14px] lg:h-[17px] top-[14px] lg:top-[17px] left-[34px] lg:left-[41px]"
                  alt="Google play"
                  src="/google-play.svg"
                />
                <img
                  className="absolute w-[32px] lg:w-[39px] h-1 lg:h-1.5 top-[6px] lg:top-[7px] left-[34px] lg:left-[41px]"
                  alt="Get it on"
                  src="/get-it-on.svg"
                />
                <img
                  className="absolute w-[19px] lg:w-[23px] h-[22px] lg:h-[26px] top-[6px] lg:top-[7px] left-2 lg:left-2.5"
                  alt="Google play logo"
                  src="/google-play-logo.png"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Objectives Section - Responsive */}
        <section className="relative w-full pt-12 lg:pt-[76px] px-4 lg:px-[148px] bg-white">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="font-bold text-[#01081b] text-2xl lg:text-[38px] leading-tight lg:leading-7 animate-fade-in">
              Choisis ton objectif
            </h2>
            <p className="text-gray-600 text-base lg:text-lg mt-3 lg:mt-4 animate-fade-in px-4" style={{ animationDelay: '0.2s' }}>
              Sélectionnez ce qui vous motive le plus à épargner
            </p>
          </div>

          {/* Objectifs interactifs avec icônes - Responsive */}
          <div className="flex justify-center mb-12 lg:mb-16">
            <div className="grid grid-cols-2 lg:flex gap-4 lg:gap-8 max-w-4xl">
              {objectives.map((objective, index) => (
                <div 
                  key={objective.id} 
                  className={`group flex flex-col items-center cursor-pointer transition-all duration-500 hover:scale-105 ${
                    selectedObjective === objective.id ? 'opacity-100' : 'opacity-70 hover:opacity-90'
                  }`}
                  onClick={() => handleObjectiveClick(objective.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-[120px] h-[120px] lg:w-[162px] lg:h-[162px] rounded-full relative mb-3 lg:mb-4 transition-all duration-500 group-hover:shadow-lg group-hover:-translate-y-2 ${
                    selectedObjective === objective.id 
                      ? 'bg-gradient-to-br from-[#e8f5e8] to-[#d4f4d4] shadow-xl scale-110' 
                      : 'bg-[#F2F8F4] group-hover:bg-gradient-to-br group-hover:from-[#f0f8f0] group-hover:to-[#e8f5e8]'
                  }`}>
                    <img
                      className="absolute w-[64px] h-[64px] lg:w-[86px] lg:h-[86px] top-[28px] lg:top-[38px] left-[28px] lg:left-[38px] object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={objective.name}
                      src={objective.icon}
                    />

                    {/* Effet de pulsation très subtile pour l'objectif sélectionné */}
                    {selectedObjective === objective.id && (
                      <div className="absolute inset-0 rounded-full bg-[#435933]/10 animate-subtle-pulse"></div>
                    )}
                  </div>
                  
                  <span className={`font-medium text-lg lg:text-[26px] transition-all duration-300 text-center mb-1 lg:mb-2 ${
                    selectedObjective === objective.id 
                      ? 'text-[#435933] font-bold' 
                      : 'text-[#060606] group-hover:text-[#435933]'
                  }`}>
                    {objective.name}
                  </span>

                  {/* Description qui apparaît pour l'objectif sélectionné */}
                  {selectedObjective === objective.id && (
                    <p className="text-xs lg:text-sm text-gray-600 text-center max-w-[140px] lg:max-w-[180px] animate-fade-in px-2">
                      {objective.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section Simulateur avec Personas - Responsive */}
          <div id="simulator-section" className="text-center mb-8 lg:mb-12">
            <h2 className="font-bold text-[#01081b] text-2xl lg:text-[38px] leading-tight lg:leading-7 animate-fade-in px-4">
              Simule ton plan d'épargne
            </h2>
            <p className="text-gray-600 text-base lg:text-lg mt-3 lg:mt-4 animate-fade-in px-4" style={{ animationDelay: '0.2s' }}>
              Personnalise ta stratégie pour <span className="font-semibold text-[#435933]">{currentObjective.name}</span> ou choisis un profil qui te correspond
            </p>
          </div>

          {/* Simulateur intégré avec Personas - Responsive */}
          <div className="flex justify-center mb-8 lg:mb-10 px-4">
            <Card className="w-full max-w-[900px] rounded-2xl lg:rounded-[35px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-4 lg:p-8">
                <div className="space-y-4 lg:space-y-6">
                  {/* Objectif sélectionné avec message personnalisé - Responsive */}
                  <div className="text-center p-3 lg:p-4 bg-gradient-to-r from-[#435933]/10 to-[#C38D1C]/10 rounded-xl border border-[#435933]/20">
                    <h3 className="text-lg lg:text-xl font-bold text-[#435933] mb-2">
                      {selectedPersonaData ? selectedPersonaData.personalizedMessage.split('\n')[0] : currentObjective.titre}
                    </h3>
                    <p className="text-sm lg:text-base text-gray-600 mb-2 lg:mb-4">
                      {selectedPersonaData ? selectedPersonaData.personalizedMessage.split('\n')[1] : currentObjective.description}
                    </p>
                    
                    {/* Affichage du profil sélectionné avec emoji et citation */}
                    {selectedPersonaData && (
                      <div className="mt-3 lg:mt-4 p-3 lg:p-4 bg-white/80 rounded-lg border border-[#435933]/10">
                        <div className="flex items-center justify-center gap-2 lg:gap-3 mb-2">
                          <span className="text-2xl lg:text-3xl">{selectedPersonaData.emoji}</span>
                          <span className="font-semibold text-[#435933] text-sm lg:text-base">{selectedPersonaData.shortName}</span>
                        </div>
                        <p className="text-xs lg:text-sm text-gray-600 italic">
                          « {selectedPersonaData.quote} »
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Sélection de Persona - Responsive */}
                  <div className="space-y-2 lg:space-y-3">
                    <label className="block text-base lg:text-lg font-medium text-[#060606]">
                      Je me reconnais dans ce profil :
                    </label>
                    <select
                      value={selectedPersona}
                      onChange={(e) => handlePersonaChange(e.target.value)}
                      className="w-full p-3 lg:p-4 border-2 border-[#435933]/20 rounded-xl text-sm lg:text-base focus:border-[#435933] focus:outline-none transition-colors bg-[#e9f0e9] text-[#116237]"
                    >
                      <option value="">-- Choisissez votre profil (optionnel) --</option>
                      {personas.map((persona) => (
                        <option key={persona.id} value={persona.id}>
                          {persona.emoji} {persona.shortName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Contrôles de montant et durée - Responsive */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Montant mensuel - Responsive */}
                    <div className="space-y-2 lg:space-y-3">
                      <label className="block text-base lg:text-lg font-medium text-[#060606]">
                        Montant mensuel d'épargne : <span className="text-[#C38D1C] font-bold text-sm lg:text-base">{formatCurrency(mensualite)}</span>
                      </label>
                      <input
                        type="range"
                        min="1000"
                        max="500000"
                        step="1000"
                        value={mensualite}
                        onChange={(e) => setMensualite(Number(e.target.value))}
                        className="w-full h-2 lg:h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #435933 0%, #435933 ${((mensualite - 1000) / (500000 - 1000)) * 100}%, #e5e7eb ${((mensualite - 1000) / (500000 - 1000)) * 100}%, #e5e7eb 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs lg:text-sm text-gray-500">
                        <span>1 000 FCFA</span>
                        <span>500 000 FCFA</span>
                      </div>
                    </div>

                    {/* Durée - Responsive */}
                    <div className="space-y-2 lg:space-y-3">
                      <label className="block text-base lg:text-lg font-medium text-[#060606]">
                        Durée d'épargne : <span className="text-[#435933] font-bold text-sm lg:text-base">{duree} mois</span>
                      </label>
                      <input
                        type="range"
                        min="6"
                        max="180"
                        step="1"
                        value={duree}
                        onChange={(e) => setDuree(Number(e.target.value))}
                        className="w-full h-2 lg:h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #435933 0%, #435933 ${((duree - 6) / (180 - 6)) * 100}%, #e5e7eb ${((duree - 6) / (180 - 6)) * 100}%, #e5e7eb 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs lg:text-sm text-gray-500">
                        <span>6 mois</span>
                        <span>180 mois (15 ans)</span>
                      </div>
                    </div>
                  </div>

                  {/* Indicateur de taux - Responsive */}
                  <div className="p-3 lg:p-4 bg-gradient-to-r from-[#435933]/10 to-[#C38D1C]/10 rounded-xl border border-[#435933]/20">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-0">
                      <span className="text-[#435933] font-medium text-base lg:text-lg text-center lg:text-left">
                        Taux d'intérêt : <span className="font-bold text-lg lg:text-xl">{taux.toFixed(1)}%</span> par an
                      </span>
                      <div className="text-xs lg:text-sm text-gray-600">
                        {duree <= 6 && "💡 Très court terme"}
                        {duree > 6 && duree <= 12 && "📈 Court terme"}
                        {duree > 12 && duree <= 36 && "🚀 Moyen terme"}
                        {duree > 36 && duree <= 60 && "💎 Long terme"}
                        {duree > 60 && "🏆 Très long terme"}
                      </div>
                    </div>
                  </div>

                  {/* Résultats - Responsive */}
                  <div className="text-center space-y-3 lg:space-y-4 p-4 lg:p-6 bg-gradient-to-br from-[#F2F8F4] to-white rounded-xl">
                    <h4 className="font-normal text-[#060606] text-lg lg:text-[24px] mb-2">
                      Capital final estimé
                    </h4>
                    <div className="font-bold text-[#435933] text-2xl lg:text-[36px] mb-2">
                      {formatCurrency(Math.round(capitalFinal))}
                    </div>
                    <div className="font-normal text-[#969696] text-sm lg:text-base mb-3 lg:mb-4">
                      Plan {Math.round(duree/12 * 10)/10} ans - Rendement {taux.toFixed(1)}% - {formatCurrency(mensualite)}/mois
                    </div>

                    {/* Comparaison compacte - Responsive */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 p-3 lg:p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-center">
                        <div className="text-xs lg:text-sm text-gray-600 mb-1">Total versé</div>
                        <div className="font-medium text-[#C38D1C] text-base lg:text-lg">
                          {formatCurrency(mensualite * duree)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs lg:text-sm text-gray-600 mb-1">Intérêts gagnés</div>
                        <div className="font-bold text-[#435933] text-base lg:text-lg">
                          +{formatCurrency(Math.round(interets))}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs lg:text-sm text-gray-800 font-medium mb-1">Total final</div>
                        <div className="font-bold text-[#435933] text-lg lg:text-xl">
                          {formatCurrency(Math.round(capitalFinal))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bouton centré - Responsive */}
          <div className="flex justify-center mb-12 lg:mb-16 px-4">
            <button 
              onClick={handleShowForm}
              className="group relative px-6 lg:px-8 h-[50px] lg:h-[60px] bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] rounded-xl lg:rounded-2xl text-white text-base lg:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 lg:gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden w-full sm:w-auto max-w-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              <span className="relative z-10">Je commence à épargner</span>
              <svg 
                width="20" 
                height="6" 
                viewBox="0 0 24 8" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 group-hover:translate-x-1 transition-transform duration-300 hidden sm:block"
              >
                <path 
                  d="M23.3536 4.35355C23.5488 4.15829 23.5488 3.84171 23.3536 3.64645L20.1716 0.464466C19.9763 0.269204 19.6597 0.269204 19.4645 0.464466C19.2692 0.659728 19.2692 0.976311 19.4645 1.17157L22.2929 4L19.4645 6.82843C19.2692 7.02369 19.2692 7.34027 19.4645 7.53553C19.6597 7.7308 19.9763 7.7308 20.1716 7.53553L23.3536 4.35355ZM0 4.5H23V3.5H0V4.5Z" 
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </section>

        {/* Contact Form Section avec background vert clair - Responsive */}
        {showForm && (
          <section id="contact-form" className="w-full py-8 lg:py-16 px-4 lg:px-[133px] bg-gradient-to-br from-[#e8f5e8] via-[#f0f8f0] to-[#e8f5e8] animate-fade-in">
            <ContactForm
              selectedObjective={currentObjective.name}
              monthlyAmount={mensualite}
              duration={Math.round(duree/12 * 10)/10} // Convertir en années avec 1 décimale
              projectedAmount={Math.round(capitalFinal)}
            />
          </section>
        )}

        {/* Dynamic Testimonials Section - Responsive */}
        <div className="hidden lg:block">
          <TestimonialCarousel />
        </div>

        {/* Version mobile simplifiée des témoignages */}
        <section className="lg:hidden w-full py-12 px-4 bg-[#30461f]">
          <div className="text-center mb-8">
            <h2 className="font-bold text-white text-2xl mb-3">
              Ils nous font confiance
            </h2>
            <p className="text-white/90 text-sm">
              Découvrez les témoignages de nos utilisateurs
            </p>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-xl">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      className="w-4 h-4"
                      alt="Star"
                      src="/vuesax-linear-star.svg"
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  "Sama Naffa a complètement transformé ma façon d'épargner. L'interface est intuitive et les objectifs sont clairs."
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/rectangle-13-1.png" alt="Rabyatou" />
                    <AvatarFallback>R</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">Rabyatou</div>
                    <div className="text-gray-600 text-xs">Digital Marketing Specialist</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer - Responsive */}
        <footer className="w-full h-16 lg:h-[86px] bg-[#f7f6f6] flex items-center justify-center px-4">
          <div className="font-normal text-black text-sm lg:text-lg text-center">
            © 2025 Sama Naffa. All Rights Reserved
          </div>
        </footer>
      </div>
    </div>
  );
};