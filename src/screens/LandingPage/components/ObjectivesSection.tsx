import React from 'react';

interface Objective {
    id: number;
    name: string;
    icon: string;
    titre: string;
    duree: number;
    mensualite: number;
    description: string;
}

interface ObjectivesSectionProps {
    objectives: Objective[];
    selectedObjective: number;
    onObjectiveClick: (id: number) => void;
}

export const ObjectivesSection: React.FC<ObjectivesSectionProps> = ({ objectives, selectedObjective, onObjectiveClick }) => {
    return (
        <section className="relative w-full pt-12 lg:pt-[76px] px-4 lg:px-[148px] bg-white">
            <div className="text-center mb-8 lg:mb-12">
                <h2 className="font-bold text-[#01081b] text-2xl lg:text-[38px] leading-tight lg:leading-7 animate-fade-in">
                    Choisis ton objectif
                </h2>
                <p
                    className="text-gray-600 text-base lg:text-lg mt-3 lg:mt-4 animate-fade-in px-4"
                    style={{ animationDelay: "0.2s" }}
                >
                    Sélectionnez ce qui vous motive le plus à épargner
                </p>
            </div>

            {/* Objectifs interactifs avec icônes - Responsive */}
            <div className="flex justify-center mb-12 lg:mb-16">
                <div className="grid grid-cols-2 lg:flex gap-4 lg:gap-8 max-w-4xl">
                    {objectives.map((objective, index) => (
                        <div
                            key={objective.id}
                            className={`group flex flex-col items-center cursor-pointer transition-all duration-500 hover:scale-105 ${selectedObjective === objective.id
                                    ? "opacity-100"
                                    : "opacity-70 hover:opacity-90"
                                }`}
                            onClick={() => onObjectiveClick(objective.id)}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div
                                className={`w-[120px] h-[120px] lg:w-[162px] lg:h-[162px] rounded-full relative mb-3 lg:mb-4 transition-all duration-500 group-hover:shadow-lg group-hover:-translate-y-2 ${selectedObjective === objective.id
                                        ? "bg-gradient-to-br from-[#e8f5e8] to-[#d4f4d4] shadow-xl scale-110"
                                        : "bg-[#F2F8F4] group-hover:bg-gradient-to-br group-hover:from-[#f0f8f0] group-hover:to-[#e8f5e8]"
                                    }`}
                            >
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

                            <span
                                className={`font-medium text-lg lg:text-[26px] transition-all duration-300 text-center mb-1 lg:mb-2 ${selectedObjective === objective.id
                                        ? "text-[#435933] font-bold"
                                        : "text-[#060606] group-hover:text-[#435933]"
                                    }`}
                            >
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
        </section>
    )
} 