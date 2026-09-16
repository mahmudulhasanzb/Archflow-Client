import React from 'react';
import Hero from '@/components/landing/Hero';
import LiveStats from '@/components/landing/LiveStats';
import FeaturedBlueprints from '@/components/landing/FeaturedBlueprints';
import HowItWorks from '@/components/landing/HowItWorks';
import AgentShowcase from '@/components/landing/AgentShowcase';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import FAQ from '@/components/landing/FAQ';

export default function LandingPage() {
  return (
    <div className="flex-grow">
      <Hero />
      <FeaturedBlueprints />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
    </div>
  );
}

