// apps/web/src/components/ConsentProvider.tsx
"use client";

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_DAYS,
  DEFAULT_DENIED,
  ALL_ALLOWED,
  loadStoredConsent,
  setCookie,
  type ConsentState,
} from "@/lib/consent";

type ConsentContextType = {
  consent: ConsentState;
  hasMadeChoice: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  saveCustom: (v: Pick<ConsentState, "analytics" | "ads">) => void;
  resetChoice: () => void;
};

export const ConsentContext = createContext<ConsentContextType>({
  consent: DEFAULT_DENIED,
  hasMadeChoice: false,
  acceptAll: () => {},
  rejectNonEssential: () => {},
  saveCustom: () => {},
  resetChoice: () => {},
});

// === 目前暫不使用 Google Consent Mode，可改為空函數 ===
function pushConsentToGoogle(_c: ConsentState) {
  // 留白：未啟用任何行銷追蹤
}

export default function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_DENIED);
  const [hasMadeChoice, setHasMadeChoice] = useState(false);

  useEffect(() => {
    const stored = loadStoredConsent();
    if (stored) {
      setConsent(stored);
      setHasMadeChoice(true);
    }
  }, []);

  const persist = useCallback((v: ConsentState) => {
    setCookie(CONSENT_COOKIE, JSON.stringify({ analytics: v.analytics, ads: v.ads }), CONSENT_MAX_AGE_DAYS);
    setConsent(v);
    setHasMadeChoice(true);
    pushConsentToGoogle(v);
  }, []);

  const acceptAll = useCallback(() => persist(ALL_ALLOWED), [persist]);
  const rejectNonEssential = useCallback(() => persist(DEFAULT_DENIED), [persist]);
  const saveCustom = useCallback(
    (v: Pick<ConsentState, "analytics" | "ads">) => persist({ necessary: true, analytics: !!v.analytics, ads: !!v.ads }),
    [persist]
  );

  const resetChoice = useCallback(() => {
    setCookie(CONSENT_COOKIE, "", -1);
    setConsent(DEFAULT_DENIED);
    setHasMadeChoice(false);
  }, []);

  const value = useMemo<ConsentContextType>(
    () => ({ consent, hasMadeChoice, acceptAll, rejectNonEssential, saveCustom, resetChoice }),
    [consent, hasMadeChoice, acceptAll, rejectNonEssential, saveCustom, resetChoice]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}
