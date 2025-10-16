import {
    HeroSection,
    HowItWorksSection,
    FooterWeb,
    MobileAppSection, DesktopAppSection, HeaderWeb, PricingSection
} from "@/components";

export default function Home() {
  return (
      <>
        <HeaderWeb />
        <HeroSection />
        <HowItWorksSection />
        <DesktopAppSection/>
        <MobileAppSection/>
        <PricingSection/>
        <FooterWeb />
      </>
  );
}
