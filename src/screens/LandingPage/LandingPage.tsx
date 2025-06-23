import { useState } from "react";
import { ContactForm } from "../../components/ContactForm";
import { HeroSection } from "./components/HeroSection";
import { SavingsPlanner } from "./components/ObjectivesSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { Footer } from "./components/Footer";

interface FormSubmissionData {
  objective: string;
  monthlyAmount: number;
  duration: number;
  projectedAmount: number;
}

const defaultFormData: FormSubmissionData = {
    objective: "N/A",
    monthlyAmount: 0,
    duration: 0,
    projectedAmount: 0,
}

export const LandingPage = (): JSX.Element => {
  const [showForm, setShowForm] = useState(false);
  const [formSubmissionData, setFormSubmissionData] = useState<FormSubmissionData>(defaultFormData);


  const handleShowForm = (data: Partial<FormSubmissionData> = {}) => {
    const finalData = { ...defaultFormData, ...data };
    setFormSubmissionData(finalData);
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
      <div className="bg-white w-full relative">
        <HeroSection onShowForm={() => handleShowForm()} />
        <SavingsPlanner onShowForm={handleShowForm} />

        {/* Contact Form Section avec background vert clair - Responsive */}
        {showForm && (
          <section
            id="contact-form"
            className="w-full py-8 lg:py-16 px-4 lg:px-[133px] bg-gradient-to-br from-[#e8f5e8] via-[#f0f8f0] to-[#e8f5e8] animate-fade-in"
          >
            <ContactForm
              selectedObjective={formSubmissionData.objective}
              monthlyAmount={formSubmissionData.monthlyAmount}
              duration={formSubmissionData.duration}
              projectedAmount={formSubmissionData.projectedAmount}
            />
          </section>
        )}

        <TestimonialsSection />

        <Footer />
      </div>
    </div>
  );
};
