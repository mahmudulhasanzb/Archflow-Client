import React from 'react';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import AgentShowcase from '@/components/landing/AgentShowcase';
import FeaturedBlueprints from '@/components/landing/FeaturedBlueprints';
import LiveStats from '@/components/landing/LiveStats';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';

export default function LandingPage() {
  return (
    <div className="flex-grow">
      <Hero />
      <HowItWorks />
      <AgentShowcase />
      <FeaturedBlueprints />
      <LiveStats />
      <Testimonials />
      <Pricing />
      <FAQ />
    </div>
  );
}
