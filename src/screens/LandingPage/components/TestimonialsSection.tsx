import React from 'react';
import { TestimonialCarousel } from '../../../components/TestimonialCarousel';
import { Card, CardContent } from '../../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';

export const TestimonialsSection = () => {
    return (
        <React.Fragment>
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
                                "Sama Naffa a complètement transformé ma façon d'épargner.
                                L'interface est intuitive et les objectifs sont clairs."
                            </p>
                            <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src="/rectangle-13-1.png" alt="Rabyatou" />
                                    <AvatarFallback>R</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold text-sm">Rabyatou</div>
                                    <div className="text-gray-600 text-xs">
                                        Digital Marketing Specialist
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </React.Fragment>
    )
} 