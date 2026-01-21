import { Bot, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavigationProps {
  isReady?: boolean;
}

export default function Navigation({ isReady = false }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleHashNavigation = (hash: string) => {
    if (isHomePage) {
      // Already on homepage, just scroll to section
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to homepage first, then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Bot className="w-8 h-8 text-cyan-600" />
            <span className="text-xl font-bold text-gray-900">Simple Vault - SDK</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => handleHashNavigation('#vaults')} className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Vaults</button>
            <button onClick={() => handleHashNavigation('#agents')} className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Agents</button>
            <button onClick={() => handleHashNavigation('#solutions')} className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Solutions</button>
            <button onClick={() => handleHashNavigation('#pricing')} className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Pricing</button>
            <Link to="/user-stories" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Technical Stories</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium flex items-center gap-1">
              Dashboard
              <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </Link>
            <button onClick={() => handleHashNavigation('#contact')} className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors font-medium">Get Started</button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <button onClick={() => { handleHashNavigation('#vaults'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-700 hover:text-cyan-600 transition-colors font-medium">Vaults</button>
            <button onClick={() => { handleHashNavigation('#agents'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-700 hover:text-cyan-600 transition-colors font-medium">Agents</button>
            <button onClick={() => { handleHashNavigation('#solutions'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-700 hover:text-cyan-600 transition-colors font-medium">Solutions</button>
            <button onClick={() => { handleHashNavigation('#pricing'); setMobileMenuOpen(false); }} className="block w-full text-left text-gray-700 hover:text-cyan-600 transition-colors font-medium">Pricing</button>
            <Link to="/user-stories" className="block text-gray-700 hover:text-cyan-600 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>Technical Stories</Link>
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-cyan-600 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
              <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </Link>
            <button onClick={() => { handleHashNavigation('#contact'); setMobileMenuOpen(false); }} className="block w-full bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors font-medium text-center">Get Started</button>
          </div>
        </div>
      )}
    </nav>
  );
}
