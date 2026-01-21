// import { SentinelAgentSDK } from '@sentinel/ai-agent-sdk';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Solutions from '../components/Solutions';
import UseCases from '../components/UseCases';
import UserStories from '../components/UserStories';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

interface HomePageProps {
  sdk: any;
  isReady: boolean;
}

export default function HomePage({ sdk, isReady }: HomePageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation isReady={isReady} />
      <Hero sdk={sdk} isReady={isReady} />
      <Solutions />
      <UseCases />
      <UserStories />
      <Contact />
      <Footer />
    </div>
  );
}
