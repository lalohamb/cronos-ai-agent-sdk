import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import VaultFeatures from '../components/VaultFeatures';
import AIAgents from '../components/AIAgents';
import PlatformCapabilities from '../components/PlatformCapabilities';
import Solutions from '../components/Solutions';
import Pricing from '../components/Pricing';
import UseCases from '../components/UseCases';
import UserStories from '../components/UserStories';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

interface HomePageProps {
  isReady?: boolean;
}

export default function HomePage({ isReady = false }: HomePageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation isReady={isReady} />
      <Hero />
      <VaultFeatures />
      <AIAgents />
      <PlatformCapabilities />
      <Solutions />
      <UseCases />
      <UserStories />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}
