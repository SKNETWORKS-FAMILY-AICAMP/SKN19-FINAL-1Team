import { createContext, useContext, ReactNode, useState } from 'react';

interface SidebarContextType {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (expanded: boolean) => void;
  isPinned: boolean;
  setIsPinned: (pinned: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({ 
  isSidebarExpanded: false,
  setIsSidebarExpanded: () => {},
  isPinned: false,
  setIsPinned: () => {}
});

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  
  return (
    <SidebarContext.Provider value={{ isSidebarExpanded, setIsSidebarExpanded, isPinned, setIsPinned }}>
      {children}
    </SidebarContext.Provider>
  );
}
