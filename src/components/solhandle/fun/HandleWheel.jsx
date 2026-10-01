import { motion, useReducedMotion } from 'framer-motion';

const point = (angle, radius = 174) => [200 + radius * Math.cos(angle), 200 + radius * Math.sin(angle)];
export default function HandleWheel({ names, rotation, onFinish }) {
  const reduced = useReducedMotion();
  const step = 2 * Math.PI / names.length;
  return <div className="relative mx-auto aspect-square w-full max-w-md" style={{ filter: 'drop-shadow(0 12px 18px rgba(0,0,0,.65))' }}>
    <motion.div animate={{ rotate: rotation }} transition={{ duration: reduced ? 0.2 : 4, ease: [0.12, 0.8, 0.15, 1] }} onAnimationComplete={onFinish} className="h-full w-full">
      <svg viewBox="0 0 400 400" role="img" aria-label={`Handle wheel: ${names.map(item => '@' + item.handle).join(', ')}`} className="h-full w-full">
        <defs>
          <linearGradient id="wheel-steel" x1="0" y1="0" x2=".3" y2="1"><stop stopColor="#535d70"/><stop offset=".25" stopColor="#151b25"/><stop offset=".65" stopColor="#070a10"/><stop offset="1" stopColor="#354151"/></linearGradient>
          <linearGradient id="wheel-cyan-glass" x1="0" y1="0" x2=".5" y2="1"><stop stopColor="#557378"/><stop offset=".44" stopColor="#1e373d"/><stop offset=".45" stopColor="#0b1d22"/><stop offset="1" stopColor="#142a30"/></linearGradient>
          <linearGradient id="wheel-purple-glass" x1="0" y1="0" x2=".5" y2="1"><stop stopColor="#625d7c"/><stop offset=".44" stopColor="#353147"/><stop offset=".45" stopColor="#191528"/><stop offset="1" stopColor="#262139"/></linearGradient>
        </defs>
        <circle cx="200" cy="200" r="196" fill="url(#wheel-steel)" stroke="#768190" strokeWidth="1.2"/>
        <circle cx="200" cy="200" r="187" fill="#090e18" stroke="#758395" strokeWidth="1"/>
        <circle cx="200" cy="200" r="180" fill="#141a25" stroke="#a5bfdd" strokeWidth="2"/>
        {names.map((item, index) => {
          const start = index * step - Math.PI / 2, end = start + step, middle = start + step / 2;
          const [x1, y1] = point(start), [x2, y2] = point(end), [tx, ty] = point(middle, 123);
          const color = index % 2 ? '#aa69ff' : '#32f0d3';
          return <g key={item.handle}><title>@{item.handle}</title>
            {names.length === 1 ? <circle cx="200" cy="200" r="174" fill="url(#wheel-cyan-glass)" stroke={color}/> : <path d={`M 200 200 L ${x1} ${y1} A 174 174 0 ${step > Math.PI ? 1 : 0} 1 ${x2} ${y2} Z`} fill={`url(#${index % 2 ? 'wheel-purple-glass' : 'wheel-cyan-glass'})`} stroke={color} strokeWidth="2.3" style={{ filter: `drop-shadow(0 0 2px ${color})` }}/>}
            <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" transform={`rotate(${middle * 180 / Math.PI + 90} ${tx} ${ty})`} fill="#e4eaf2" className="font-body text-sm">@{item.handle.length > 12 ? item.handle.slice(0, 11) + '…' : item.handle}</text>
          </g>;
        })}
        <circle cx="200" cy="200" r="169" fill="none" stroke="#91a3b9" strokeOpacity=".18" strokeWidth="2"/>
      </svg>
    </motion.div>
    <svg viewBox="0 0 400 400" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full">
      <defs>
        <radialGradient id="wheel-hub"><stop stopColor="#192538"/><stop offset=".57" stopColor="#03070f"/><stop offset=".76" stopColor="#2c3544"/><stop offset=".87" stopColor="#070b13"/><stop offset="1" stopColor="#242b38"/></radialGradient>
        <linearGradient id="wheel-gold" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#917938"/><stop offset=".48" stopColor="#fff0a0"/><stop offset=".65" stopColor="#d7be65"/><stop offset="1" stopColor="#6e5927"/></linearGradient>
      </defs>
      <circle cx="200" cy="200" r="82" fill="#070a11" stroke="#697584" strokeWidth=".8"/>
      <circle cx="200" cy="200" r="73" fill="url(#wheel-steel)" stroke="#4e5869" strokeWidth="1"/>
      <circle cx="200" cy="200" r="65" fill="#070b12" stroke="#080b12" strokeWidth="5"/>
      <circle cx="200" cy="200" r="58" fill="url(#wheel-hub)" stroke="#727c8a" strokeWidth="1.4"/>
      <circle cx="200" cy="200" r="45" fill="url(#wheel-hub)" stroke="#43516b" strokeWidth="1.2"/>
      <circle cx="200" cy="200" r="37" fill="#070e1a" stroke="#5b6889" strokeWidth=".7"/>
      <text x="200" y="204" textAnchor="middle" dominantBaseline="middle" fill="#aff5ff" className="font-display text-5xl font-semibold" style={{ filter: 'drop-shadow(0 0 8px #32d9ef)' }}>@</text>
      <path d="M 200 104 L 186 142 Q 200 138 214 142 Z" fill="url(#wheel-gold)" stroke="#fff1a8" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 7px rgba(247,213,104,.7))' }}/>
      <path d="M 200 111 L 190 137 L 200 133 Z" fill="#fff2a8" fillOpacity=".5"/>
    </svg>
  </div>;
}