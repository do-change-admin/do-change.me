import {
  HeroSection,
  HowItWorksSection,
  FooterWeb,
  MobileAppSection, DesktopAppSection, HeaderWeb, PricingSection
} from "@/client/components";

export default function Home() {
  return (
    <>
      <HeaderWeb />
      <HeroSection />
      <PricingSection />
      <HowItWorksSection />
      <DesktopAppSection />
      <MobileAppSection />
      <FooterWeb />
    </>
  );
}
