import { useState, useEffect } from 'react';
import { Download, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAStatusBanner = () => {
  const { deferredPrompt, isAppInstalled, isIOS, install } = usePWAInstall();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    if ((deferredPrompt && !isAppInstalled) || (isIOS && !isAppInstalled && !(window as any).navigator.standalone)) {
      setShowInstallPrompt(true);
    }
  }, [deferredPrompt, isAppInstalled, isIOS]);

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
            className="bevel-inset bg-[#16171B] text-[#8A909A] text-xs font-mono px-4 py-2 flex items-center justify-center gap-2 border-b-2 border-[#3A3D45]"
          >
            <WifiOff size={14} className="text-[#FF7A59]" />
            <span className="tracking-wider uppercase font-bold text-[#F0F4F8]">OFFLINE_MODE // LOCAL_STORAGE_ACTIVE</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInstallPrompt && !isAppInstalled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-32 md:bottom-24 right-4 left-4 md:left-auto z-50 window-frame bg-[#1E2025] p-3 flex flex-col gap-2 max-w-sm"
          >
            {/* Title Bar Retro */}
            <div className="window-title-bar-active px-2 py-0.5 flex items-center justify-between text-xs font-bold border-b border-[#0A0A0C]">
              <span className="tracking-wider text-black">INSTALLER.EXE</span>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="text-black hover:text-[#FF7A59] font-bold px-1"
              >
                [X]
              </button>
            </div>

            <div className="flex items-center gap-3 p-1">
              <div className="w-10 h-10 bevel-inset flex items-center justify-center flex-shrink-0 font-bold text-[#FF7A59] text-lg">
                B:
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold truncate text-[#F0F4F8]">INSTALL BANKAI.OS</h4>
                <p className="text-[11px] text-[#8A909A] font-mono leading-tight">Fast offline launch on desktop & home screen.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1 border-t border-[#3A3D45]">
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="btn-retro text-xs py-1 px-3"
              >
                CANCEL
              </button>
              {isIOS ? (
                <button
                  onClick={() => {
                    setShowInstallPrompt(false);
                    if (window.navigator.share) {
                      window.navigator.share({
                        title: 'Bankai',
                        url: window.location.href,
                      }).catch(() => {});
                    } else {
                      alert('Untuk menginstal di iOS: klik ikon share, lalu "Tambah ke Layar Utama"');
                    }
                  }}
                  className="btn-retro btn-retro-accent text-xs py-1 px-3 flex items-center gap-1"
                >
                  <Download size={12} />
                  ADD_HOME
                </button>
              ) : (
                <button
                  onClick={handleInstall}
                  className="btn-retro btn-retro-accent text-xs py-1 px-3 flex items-center gap-1"
                >
                  <Download size={12} />
                  INSTALL
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};