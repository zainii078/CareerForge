import { Hero } from "@/components/landing/hero";
import { TrustedCompanies } from "@/components/landing/trusted-companies";
import { Features } from "@/components/landing/features";
import { ATSDemo } from "@/components/landing/ats-demo";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedCompanies />
      <Features />
      <ATSDemo />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </>
  );
}
