import CTASection from "@/components/layout/CTASection";
import FeaturesSection from "@/components/layout/FeaturesSection";
import Hero from "@/components/layout/Hero";
import JobsSection from "@/components/layout/Jobsection";
import PricingSection from "@/components/layout/PricingSection";

export default function Home() {
  return (
    <main>
      <Hero></Hero>
      <JobsSection></JobsSection>
      <FeaturesSection></FeaturesSection>
      <PricingSection></PricingSection>
      <CTASection></CTASection>
    </main>
  );
}
