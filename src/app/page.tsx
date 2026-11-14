import CTASection from "@/components/layout/CTASection";
import FeaturesSection from "@/components/layout/FeaturesSection";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import JobsSection from "@/components/layout/Jobsection";
import PricingSection from "@/components/layout/PricingSection";
import { SiteHeader } from "@/components/layout/site-header";

export default function Home() {
  return (
    <main>
       <SiteHeader />
      <Hero></Hero>
      <JobsSection></JobsSection>
      <FeaturesSection></FeaturesSection>
      <PricingSection></PricingSection>
      <CTASection></CTASection>
      <Footer></Footer>
    </main>
  );
}
