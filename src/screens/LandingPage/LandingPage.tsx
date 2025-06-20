import React, { useState, useEffect } from "react";
import { ContactForm } from "../../components/ContactForm";
import { formatCurrency } from "../../lib/utils";
import { HeroSection } from "./components/HeroSection";
import { ObjectivesSection } from "./components/ObjectivesSection";
import { SimulatorSection } from "./components/SimulatorSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { Footer } from "./components/Footer";
import { personas, objectives } from "./data";

// Fonction pour calculer le taux d'intérêt selon la durée (en mois)
const tauxParDuree = (mois: number): number => {
  if (mois <= 6) return 3.5;
  if (mois <= 12) return 4.5;
  if (mois <= 36) return 6.0;
  if (mois <= 60) return 7.0;
  if (mois <= 120) return 8.5;
  return 10.0;
};

export const LandingPage = (): JSX.Element => {
  // États pour le simulateur
  const [selectedObjective, setSelectedObjective] = useState(1);
  const [selectedPersona, setSelectedPersona] = useState("");
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
    const currentObjective = objectives.find(
      (obj) => obj.id === selectedObjective,
    );
    if (currentObjective) {
      setDuree(currentObjective.duree);
      setMensualite(currentObjective.mensualite);
      // Réinitialiser la persona quand on change d'objectif
      setSelectedPersona("");
    }
  }, [selectedObjective]);

  // Calcul de l'épargne avec intérêts simples (comme dans le code fourni)
  const calculerCapitalFinal = (
    mensuel: number,
    dureeMois: number,
    tauxAnnuel: number,
  ): { capitalFinal: number; interets: number } => {
    const dureeAnnee = dureeMois / 12;
    const capitalVerse = mensuel * dureeMois;
    const interets = capitalVerse * (tauxAnnuel / 100) * dureeAnnee;
    return {
      capitalFinal: capitalVerse + interets,
      interets,
    };
  };

  const { capitalFinal, interets } = calculerCapitalFinal(
    mensualite,
    duree,
    taux,
  );
  const currentObjective =
    objectives.find((obj) => obj.id === selectedObjective) || objectives[0];
  const selectedPersonaData = personas.find((p) => p.id === selectedPersona);

  const handleObjectiveClick = (objectiveId: number) => {
    setSelectedObjective(objectiveId);
    // Scroll vers le simulateur avec un délai pour l'animation
    setTimeout(() => {
      const simulatorElement = document.getElementById("simulator-section");
      if (simulatorElement) {
        simulatorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 300);
  };

  const handlePersonaChange = (personaId: string) => {
    setSelectedPersona(personaId);
    const persona = personas.find((p) => p.id === personaId);
    if (persona) {
      setMensualite(persona.amount);
      setDuree(persona.duration);
    }
  };

  const handleShowForm = () => {
    setShowForm(true);
    setTimeout(() => {
      const formElement = document.getElementById("contact-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1440px] relative">
        <HeroSection onShowForm={handleShowForm} />
        <ObjectivesSection
          objectives={objectives}
          selectedObjective={selectedObjective}
          onObjectiveClick={handleObjectiveClick}
        />
        <SimulatorSection
          currentObjective={currentObjective}
          selectedPersona={selectedPersona}
          duree={duree}
          mensualite={mensualite}
          taux={taux}
          capitalFinal={capitalFinal}
          interets={interets}
          personas={personas}
          selectedPersonaData={selectedPersonaData}
          onPersonaChange={handlePersonaChange}
          onDureeChange={setDuree}
          onMensualiteChange={setMensualite}
          onShowForm={handleShowForm}
        />

        {/* Contact Form Section avec background vert clair - Responsive */}
        {showForm && (
          <section
            id="contact-form"
            className="w-full py-8 lg:py-16 px-4 lg:px-[133px] bg-gradient-to-br from-[#e8f5e8] via-[#f0f8f0] to-[#e8f5e8] animate-fade-in"
          >
            <ContactForm
              selectedObjective={currentObjective.name}
              monthlyAmount={mensualite}
              duration={Math.round((duree / 12) * 10) / 10} // Convertir en années avec 1 décimale
              projectedAmount={Math.round(capitalFinal)}
            />
          </section>
        )}

        <TestimonialsSection />

        <Footer />
      </div>
    </div>
  );
};
