import {
    HeroSection,
    HowItWorksSection,
    CTASection,
    FooterWeb,
    MobileAppSection, DesktopAppSection, HeaderWeb, PricingSection
} from "@/components";
import {Plans} from "@/components";

export default function Home() {
  return (
      <>
        <HeaderWeb />
        <HeroSection />
        <HowItWorksSection />
        <DesktopAppSection/>
        <MobileAppSection/>
        <PricingSection/>
        <CTASection />
        <FooterWeb />
      </>
  );
}
