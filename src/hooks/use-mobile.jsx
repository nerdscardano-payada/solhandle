import * as React from "react"

// Phones and touch tablets, including iPad Pro in landscape.
const APP_MEDIA_QUERY = '(max-width: 767px), (max-width: 1366px) and (pointer: coarse)'

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(() => window.matchMedia(APP_MEDIA_QUERY).matches)

  React.useEffect(() => {
    const mql = window.matchMedia(APP_MEDIA_QUERY)
    const onChange = () => setIsMobile(mql.matches)
    mql.addEventListener("change", onChange)
    onChange()
    return () => mql.removeEventListener("change", onChange);
  }, [])

  return isMobile
}