import React from 'react';
import Hero from '@/components/landing/Hero';
import FeaturedBlueprints from '@/components/landing/FeaturedBlueprints';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';

export default function LandingPage() {
  return (
    <div className="flex-grow">
      <Hero />
      <FeaturedBlueprints />
      <Pricing />
      <Testimonials />
      <FAQ />
    </div>
  );
}
