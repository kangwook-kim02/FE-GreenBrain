'use client'

import { createContext, useContext } from 'react'

interface SidebarContextValue {
  toggleButton: React.ReactNode
}

const SidebarContext = createContext<SidebarContextValue>({ toggleButton: null })

export function useSidebar() {
  return useContext(SidebarContext)
}

export default SidebarContext
