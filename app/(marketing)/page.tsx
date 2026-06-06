import { LandingHero } from "@/components/landing/hero";
import { TrustBar } from "@/components/landing/trust-bar";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { CtaSection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CtaSection />
    </>
  );
}
