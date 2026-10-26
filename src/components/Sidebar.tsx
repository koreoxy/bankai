import { Home, Search, Library, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface SidebarProps {
  activeTab: 'home' | 'search' | 'library';
  setActiveTab: (tab: 'home' | 'search' | 'library') => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menu = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'search', name: 'Search', icon: Search },
    { id: 'library', name: 'Your Library', icon: Library },
  ] as const;

  const { isAppInstalled, install } = usePWAInstall();

  const handleManualInstall = () => {
    install();
  };

  return (
    <aside className="w-64 bg-black p-4 hidden md:flex flex-col gap-6 justify-between">
      <div>
        <div className="text-xl font-black text-white tracking-widest px-4 flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-black font-bold text-xs">B</span>
          </div>
          BANKAI
        </div>
        <nav className="flex flex-col gap-2">
          {menu.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-4 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <item.icon size={24} strokeWidth={isActive ? 3 : 2} />
                <span>{item.name}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>
      
      {isAppInstalled ? null : (
        <button 
          onClick={handleManualInstall}
          className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-2 transition-colors text-sm font-bold rounded-full"
        >
          <Download size={20} />
          <span>Install App</span>
        </button>
      )}
    </aside>
  );
};

export default Sidebar;