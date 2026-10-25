import { createContext, useContext } from 'react';
const Context = createContext(false);
export const useEcosystemFrame = () => useContext(Context);
export default function EcosystemFrameContext({ children }) {
  return <Context.Provider value={true}>{children}</Context.Provider>;
}