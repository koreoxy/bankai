import { Home, Search, Library, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeTab: 'home' | 'search' | 'library' | 'liked';
  setActiveTab: (tab: 'home' | 'search' | 'library' | 'liked') => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menu = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'search', name: 'Search', icon: Search },
    { id: 'library', name: 'Your Library', icon: Library },
    { id: 'liked', name: 'Liked Songs', icon: Heart },
  ] as const;

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
    </aside>
  );
};

export default Sidebar;