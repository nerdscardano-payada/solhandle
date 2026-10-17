import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileTabs } from '@/components/solhandle/navigation/MobileTabProvider';
const slides = {
  enter: direction => ({ x: direction ? `${direction * 100}%` : 0, opacity: direction ? 1 : 0 }),
  center: { x: 0, opacity: 1 },
  exit: direction => ({ x: direction ? `${direction * -25}%` : 0, opacity: 0 }),
};
export default function MobilePageTransition({ children, className }) {
  const location = useLocation(), mobile = useIsMobile(), reduced = useReducedMotion();
  const navigation = useMobileTabs();
  const animate = mobile && navigation?.enabled && !reduced;
  const direction = animate ? navigation.direction : 0;
  const key = `${location.pathname}:${location.state?.solhandleTab?.reset || ''}`;
  return <div className="mobile-route-viewport min-w-0">
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div key={key} className={className} custom={direction} variants={slides} initial={animate ? 'enter' : false} animate="center" exit={animate ? 'exit' : undefined} transition={{ duration: animate ? 0.22 : 0, ease: [0.22, 0.7, 0.3, 1] }}>
        {children}
      </motion.div>
    </AnimatePresence>
  </div>;
}