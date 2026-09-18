
import { LandingHeader } from '../components/landing/LandingHeader';
import { HeroSection } from '../components/landing/HeroSection';
import { HowItWorks } from '../components/landing/HowItWorks';
import { PipelineSection } from '../components/landing/PipelineSection';
import { ActorsSection } from '../components/landing/ActorsSection';
import { PublicMapSection } from '../components/landing/PublicMapSection';
import { StatsSection } from '../components/landing/StatsSection';
import { ImpactSection } from '../components/landing/ImpactSection';
import { GamificationSection } from '../components/landing/GamificationSection';
import { FinalCta } from '../components/landing/FinalCta';
import { LandingFooter } from '../components/landing/LandingFooter';

export function LandingPage() {
  return (
    <div className="w-full bg-surface">
      <LandingHeader />
      <main>
        <HeroSection />
        <StatsSection />
        <HowItWorks />
        <PipelineSection />
        <ActorsSection />
        <PublicMapSection />
        <ImpactSection />
        <GamificationSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>);

}