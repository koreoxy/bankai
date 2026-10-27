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
    <aside className="w-64 p-4 hidden md:flex flex-col gap-6 window-frame bg-[#1E2025]">
      <div>
        <div className="text-xl font-black text-[#FF7A59] tracking-widest px-4 flex items-center gap-2 mb-6">
          BANKAI.OS
        </div>
        <nav className="flex flex-col gap-2">
          {menu.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`btn-retro w-full flex items-center gap-4 ${
                  isActive ? 'btn-retro-accent' : ''
                }`}
              >
                <item.icon size={18} />
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