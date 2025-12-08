interface NavigationBarProps {
  onFeaturesClick: () => void
  onAboutClick: () => void
}

export default function NavigationBar({ onFeaturesClick, onAboutClick }: NavigationBarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="text-white text-xl font-bold">shopspy</div>
          <div className="hidden md:flex items-center gap-8">
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
          </div>
        </div>
      </div>
    </nav>
  )
}

