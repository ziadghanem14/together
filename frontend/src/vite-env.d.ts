/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_LOCATION_UPDATE_INTERVAL: string
  readonly VITE_STALE_THRESHOLD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

