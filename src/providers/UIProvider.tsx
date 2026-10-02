"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface UIContextValue {
  searchOpen: boolean;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  booted: boolean;
  setBooted: React.Dispatch<React.SetStateAction<boolean>>;
  firstVisit: boolean;
}

const UIContext = createContext<UIContextValue | null>(null);

const BOOT_KEY = "aquarium-lk-booted";

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside UIProvider");
  return ctx;
}

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [booted, setBooted] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);

  useEffect(() => {
    const seen = window.sessionStorage.getItem(BOOT_KEY);
    if (seen) {
      setBooted(true);
      setFirstVisit(false);
    }
  }, []);

  useEffect(() => {
    if (booted) window.sessionStorage.setItem(BOOT_KEY, "1");
  }, [booted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const locked = searchOpen || menuOpen || !booted;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen, menuOpen, booted]);

  const value = useMemo(
    () => ({ searchOpen, setSearchOpen, menuOpen, setMenuOpen, booted, setBooted, firstVisit }),
    [searchOpen, menuOpen, booted, firstVisit]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
