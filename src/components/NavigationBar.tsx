import { Link, useLocation } from 'react-router-dom'
import { Github } from 'lucide-react'

interface NavigationBarProps {
  onFeaturesClick: () => void
  onAboutClick: () => void
}

export default function NavigationBar({ onFeaturesClick, onAboutClick }: NavigationBarProps) {
  const location = useLocation()
  const isComponentsPage = location.pathname === '/shopify-components'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-white text-xl font-bold hover:text-blue-400 transition-colors">
            shopspy
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {isComponentsPage ? (
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            ) : (
              <>
                {location.pathname === '/' ? (
                  <>
                    <button 
                      onClick={onFeaturesClick}
                      className="text-white/80 hover:text-white text-sm transition-colors"
                    >
                      Features
                    </button>
                    <button 
                      onClick={onAboutClick}
                      className="text-white/80 hover:text-white text-sm transition-colors"
                    >
                      About
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/#features"
                      className="text-white/80 hover:text-white text-sm transition-colors"
                    >
                      Features
                    </Link>
                    <Link
                      to="/#about"
                      className="text-white/80 hover:text-white text-sm transition-colors"
                    >
                      About
                    </Link>
                  </>
                )}
                <Link
                  to="/shopify-components"
                  className="text-white/80 hover:text-white text-sm transition-colors"
                >
                  Components
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

