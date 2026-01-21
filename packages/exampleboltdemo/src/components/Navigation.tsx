import { Bot, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  isReady?: boolean;
}

export default function Navigation({ isReady = false }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Bot className="w-8 h-8 text-cyan-600" />
            <span className="text-xl font-bold text-gray-900">Cronos AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {isHomePage ? (
              <>
                <a href="#solutions" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Solutions</a>
                <a href="#use-cases" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Use Cases</a>
                <Link to="/user-stories" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Technical Stories</Link>
                <Link to="/documentation" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Documentation</Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium flex items-center gap-1">
                  Dashboard
                  <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </Link>
                <a href="#contact" className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors font-medium">Get Started</a>
              </>
            ) : (
              <>
                <Link to="/" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Home</Link>
                <Link to="/user-stories" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Technical Stories</Link>
                <Link to="/documentation" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium">Documentation</Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-cyan-600 transition-colors font-medium flex items-center gap-1">
                  Dashboard
                  <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </Link>
                <Link to="/#contact" className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors font-medium">Get Started</Link>
              </>
            )}
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
            {isHomePage ? (
              <>
                <a href="#solutions" className="block text-gray-700 hover:text-cyan-600 transition-colors font-medium">Solutions</a>
                <a href="#use-cases" className="block text-gray-700 hover:text-cyan-600 transition-colors font-medium">Use Cases</a>
                <Link to="/user-stories" className="block text-gray-700 hover:text-cyan-600 transition-colors font-medium">Technical Stories</Link>
                <Link to="/documentation" className="block text-gray-700 hover:text-cyan-600 transition-colors font-medium">Documentation</Link>
                <Link to="/dashboard" className="block text-gray-700 hover:text-cyan-600 transition-colors font-medium">Dashboard</Link>
                <a href="#contact" className="block bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors font-medium text-center">Get Started</a>
              </>
            ) : (
              <>
                <Link to="/" className="block text-gray-700 hover:text-cyan-600 transition-colors font-medium">Home</Link>
                <Link to="/user-stories" className="block text-gray-700 hover:text-cyan-600 transition-colors font-medium">Technical Stories</Link>
                <Link to="/documentation" className="block text-gray-700 hover:text-cyan-600 transition-colors font-medium">Documentation</Link>
                <Link to="/dashboard" className="block text-gray-700 hover:text-cyan-600 transition-colors font-medium">Dashboard</Link>
                <Link to="/#contact" className="block bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors font-medium text-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
