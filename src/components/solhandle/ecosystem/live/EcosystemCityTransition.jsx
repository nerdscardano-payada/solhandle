import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { ecosystemAssets } from '@/components/solhandle/ecosystem/live/ecosystemRoutes';
import '@/components/solhandle/ecosystem/live/ecosystem-city-transition.css';

const CityTransition = createContext(null);
export const useCityTransition = () => useContext(CityTransition);
export default function EcosystemCityTransition({ children }) {
  const navigate = useNavigate(), timers = useRef([]), busy = useRef(false);
  const [flight, setFlight] = useState(null);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const enter = event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (busy.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { navigate('/ecosystem'); return; }
    busy.current = true;
    const rect = event.currentTarget.closest('.ep-public-hero').getBoundingClientRect();
    setFlight({ rect, phase: 'approach' });
    timers.current.push(setTimeout(() => {
      navigate('/ecosystem');
      window.scrollTo({ top: 0, behavior: 'instant' });
      setFlight(current => current && { ...current, phase: 'reveal' });
    }, 950));
    timers.current.push(setTimeout(() => { setFlight(null); busy.current = false; }, 1500));
  };
  return <CityTransition.Provider value={{ enter, entering: Boolean(flight) }}>{children}{flight && createPortal(
    <div className={`eco-preview ecosystem-tokens dark el-city-flight el-city-flight--${flight.phase}`} aria-hidden="true" style={{ '--flight-top': `${flight.rect.top}px`, '--flight-left': `${flight.rect.left}px`, '--flight-width': `${flight.rect.width}px`, '--flight-height': `${flight.rect.height}px` }}>
      <div className="el-city-flight-scene"><Image src={ecosystemAssets.city} alt="" loading="eager" className="el-city-flight-image" focalPointX={0.72}/><div className="el-city-flight-vignette"/></div>
    </div>, document.body
  )}</CityTransition.Provider>;
}