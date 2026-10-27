import { Home, Search, Library, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeTab: 'home' | 'search' | 'library' | 'liked';
  setActiveTab: (tab: 'home' | 'search' | 'library' | 'liked') => void;
}

const BottomNav = ({ activeTab, setActiveTab }: BottomNavProps) => {
  const menu = [
    { id: 'home', name: 'HOME', icon: Home },
    { id: 'search', name: 'SEARCH', icon: Search },
    { id: 'library', name: 'LIB', icon: Library },
    { id: 'liked', name: 'LIKED', icon: Heart },
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#16171B] border-t-2 border-[#3A3D45] flex justify-around py-1.5 px-2 z-50">
      {menu.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(item.id)}
            className={`btn-retro flex flex-col items-center justify-center py-1 px-3 flex-1 mx-0.5 ${
              isActive ? 'btn-retro-accent' : ''
            }`}
          >
            <item.icon size={16} />
            <span className="text-[10px] font-bold mt-0.5 leading-none">{item.name}</span>
          </motion.button>
        );
      })}
    </nav>
  );
};

export default BottomNav;