import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackProtocol } from "@/lib/protocolAnalytics";

export default function ProtocolPageTracker() {
  const location = useLocation();
  useEffect(() => {
    trackProtocol("page_view", { route: location.pathname, referrer: document.referrer, wallet_connected: Boolean(localStorage.getItem("solhandle_wallet")) });
  }, [location.pathname, location.search]);
  return null;
}