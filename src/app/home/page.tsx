import {
    HeaderWeb,
    HeroSection,
    PricingSection,
    HowItWorksSection,
    CTASection,
    FooterWeb,
    MobileAppSection, DesktopAppSection
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
          <div id="pricing" style={{padding: "5rem 1rem"}}>
              <Plans/>
          </div>
        <CTASection />
        <FooterWeb />
      </>
  );
}
