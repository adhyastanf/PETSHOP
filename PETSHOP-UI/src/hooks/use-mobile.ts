import { useCallback, useSyncExternalStore } from "react"

const MOBILE_BREAKPOINT = 768
const MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

export function useIsMobile() {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const mediaQuery = window.matchMedia(MEDIA_QUERY)
    mediaQuery.addEventListener("change", onStoreChange)
    return () => mediaQuery.removeEventListener("change", onStoreChange)
  }, [])

  const getSnapshot = useCallback(() => window.matchMedia(MEDIA_QUERY).matches, [])
  const getServerSnapshot = useCallback(() => false, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
