import { useEffect, useState } from "react";

export default function useHomeHandleLimit() {
  const [limit, setLimit] = useState(() => window.matchMedia("(max-width: 1279px)").matches ? 6 : 2);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1279px)");
    const update = () => setLimit(media.matches ? 6 : 2);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return limit;
}