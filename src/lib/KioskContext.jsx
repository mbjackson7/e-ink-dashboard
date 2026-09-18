// src/lib/KioskContext.js
import { createContext, useContext } from 'react'

export const KioskContext = createContext(false)

export function useKiosk() {
  return useContext(KioskContext)
}

export function KioskProvider({ children }) {
  const isKiosk = new URLSearchParams(window.location.search).has('kiosk')
  return <KioskContext.Provider value={isKiosk}>{children}</KioskContext.Provider>
}