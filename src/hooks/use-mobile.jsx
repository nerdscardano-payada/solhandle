import * as React from "react"

// Phones and tablets, including landscape and tablet browser previews.
const APP_MEDIA_QUERY = '(max-width: 1366px)'

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