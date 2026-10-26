import { motion } from 'framer-motion';

export const AudioVisualizer = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="flex items-end gap-1 h-3.5 w-4 px-0.5">
      {[0.4, 0.8, 0.5, 0.9].map((height, i) => (
        <motion.div
          key={i}
          className="w-0.5 bg-accent rounded-full"
          animate={
            isPlaying
              ? {
                  height: ['20%', `${height * 100}%`, '30%'],
                }
              : { height: '20%' }
          }
          transition={
            isPlaying
              ? {
                  duration: 0.5 + i * 0.15,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
};
