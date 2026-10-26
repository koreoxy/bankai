import { useState, useEffect } from 'react';
import { Download, WifiOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAStatusBanner = () => {
  const { deferredPrompt, isAppInstalled, install } = usePWAInstall();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    if (deferredPrompt && !isAppInstalled) {
      setShowInstallPrompt(true);
    }
  }, [deferredPrompt, isAppInstalled]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    await install();
    setShowInstallPrompt(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#252525] text-[#b3b3b3] text-xs font-semibold px-4 py-2 flex items-center justify-center gap-2 border-b border-[#333]"
          >
            <WifiOff size={14} className="text-[#ffa42b]" />
            <span>Mode Offline Aktif. Musik lokal tetap dapat diputar.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInstallPrompt && !isAppInstalled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-20 md:bottom-24 right-4 z-50 bg-[#181818] border border-[#272727] text-white p-4 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.6)] flex items-center gap-4 max-w-sm"
          >
            <div className="w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center flex-shrink-0 font-bold">
              B
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold truncate">Install Bankai App</h4>
              <p className="text-xs text-[#b3b3b3]">Akses offline cepat via Desktop / Layar Utama HP.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstall}
                className="bg-white hover:bg-gray-200 text-black px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
              >
                <Download size={12} />
                Install
              </button>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="text-[#b3b3b3] hover:text-white p-1 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};