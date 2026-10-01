import { motion, useReducedMotion } from 'framer-motion';
import { Triangle } from 'lucide-react';

const point = (angle, radius = 180) => [200 + radius * Math.cos(angle), 200 + radius * Math.sin(angle)];
export default function HandleWheel({ names, rotation, onFinish }) {
  const reduced = useReducedMotion();
  const step = 2 * Math.PI / names.length;
  return <div className="relative mx-auto aspect-square w-full max-w-md p-3">
    <Triangle aria-hidden="true" className="absolute left-1/2 top-0 z-10 h-8 w-8 -translate-x-1/2 rotate-180 fill-names-accent text-names-accent"/>
    <motion.div animate={{ rotate: rotation }} transition={{ duration: reduced ? 0.2 : 4, ease: [0.12, 0.8, 0.15, 1] }} onAnimationComplete={onFinish} className="h-full w-full rounded-full border-4 border-names-accent/40 shadow-xl shadow-names-secondary/20">
      <svg viewBox="0 0 400 400" role="img" aria-label={`Handle wheel: ${names.map(item => '@' + item.handle).join(', ')}`} className="h-full w-full">
        <circle cx="200" cy="200" r="198" className="fill-card"/>
        {names.map((item, index) => {
          const start = index * step - Math.PI / 2, end = start + step, middle = start + step / 2;
          const [x1, y1] = point(start), [x2, y2] = point(end), [tx, ty] = point(middle, 120);
          const fill = index % 2 ? 'fill-names-secondary/25' : 'fill-names-accent/20';
          return <g key={item.handle}><title>@{item.handle}</title>
            {names.length === 1 ? <circle cx="200" cy="200" r="180" className={fill}/> : <path d={`M 200 200 L ${x1} ${y1} A 180 180 0 ${step > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`} className={`${fill} stroke-border`} strokeWidth="1.5"/>}
            <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" transform={`rotate(${middle * 180 / Math.PI + 90} ${tx} ${ty})`} className="fill-foreground font-mono text-xs font-semibold">@{item.handle.length > 12 ? item.handle.slice(0, 11) + '…' : item.handle}</text>
          </g>;
        })}
        <circle cx="200" cy="200" r="43" className="fill-card stroke-names-accent" strokeWidth="2"/>
        <text x="200" y="203" textAnchor="middle" dominantBaseline="middle" className="fill-names-accent font-display text-4xl font-semibold">@</text>
      </svg>
    </motion.div>
  </div>;
}