import { Home, Search, Library } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeTab: 'home' | 'search' | 'library';
  setActiveTab: (tab: 'home' | 'search' | 'library') => void;
}

const BottomNav = ({ activeTab, setActiveTab }: BottomNavProps) => {
  const menu = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'search', name: 'Search', icon: Search },
    { id: 'library', name: 'Library', icon: Library },
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1f1f1f] backdrop-blur border-t border-gray-900 flex justify-around py-2 z-50">
      {menu.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center py-1 transition-colors ${
              isActive ? 'text-white' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <item.icon size={20} className={isActive ? 'text-accent' : ''} />
            <span className="text-[10px] font-medium mt-1">{item.name}</span>
          </motion.button>
        );
      })}
    </nav>
  );
};

export default BottomNav;