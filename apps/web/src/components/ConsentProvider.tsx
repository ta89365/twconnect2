// apps/web/src/components/ConsentProvider.tsx
"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

const GOOGLE_ADS_ID = "AW-17886973732";

function ensureGtagStub() {
  const w = window as any;

  if (!w.dataLayer) w.dataLayer = [];

  if (!w.gtag) {
    w.gtag = function gtag() {
      w.dataLayer.push(arguments);
    };
  }

  return w;
}

export default function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_DENIED);
  const [hasMadeChoice, setHasMadeChoice] = useState(false);

  // 避免重複呼叫 gtag('config', ...) 造成雜訊
  const hasConfiguredAdsRef = useRef(false);

  const pushConsentToGoogle = useCallback(
    (c: ConsentState) => {
      if (typeof window === "undefined") return;

      const w = ensureGtagStub();

      w.gtag("consent", "update", {
        ad_storage: c.ads ? "granted" : "denied",
        ad_user_data: c.ads ? "granted" : "denied",
        ad_personalization: c.ads ? "granted" : "denied",
        analytics_storage: c.analytics ? "granted" : "denied",
      });

      // 只有在 ads 從未 config 過時才做一次 config
      if (c.ads && !hasConfiguredAdsRef.current) {
        w.gtag("config", GOOGLE_ADS_ID);
        hasConfiguredAdsRef.current = true;
      }

      // 如果使用者改成不同意 ads，允許未來再次同意時重新 config
      if (!c.ads) {
        hasConfiguredAdsRef.current = false;
      }
    },
    []
  );

  useEffect(() => {
    const stored = loadStoredConsent();
    if (stored) {
      setConsent(stored);
      setHasMadeChoice(true);

      // 將已儲存的選擇同步到 Google
      pushConsentToGoogle(stored);
    } else {
      // 沒有做過選擇時，先把預設狀態同步為 denied，避免行為提前啟用
      pushConsentToGoogle(DEFAULT_DENIED);
    }
  }, [pushConsentToGoogle]);

  const persist = useCallback(
    (v: ConsentState) => {
      setCookie(
        CONSENT_COOKIE,
        JSON.stringify({ analytics: v.analytics, ads: v.ads }),
        CONSENT_MAX_AGE_DAYS
      );

      setConsent(v);
      setHasMadeChoice(true);

      pushConsentToGoogle(v);
    },
    [pushConsentToGoogle]
  );

  const acceptAll = useCallback(() => persist(ALL_ALLOWED), [persist]);
  const rejectNonEssential = useCallback(() => persist(DEFAULT_DENIED), [persist]);

  const saveCustom = useCallback(
    (v: Pick<ConsentState, "analytics" | "ads">) =>
      persist({ necessary: true, analytics: !!v.analytics, ads: !!v.ads }),
    [persist]
  );

  const resetChoice = useCallback(() => {
    setCookie(CONSENT_COOKIE, "", -1);
    setConsent(DEFAULT_DENIED);
    setHasMadeChoice(false);

    // 重設後同步為 denied
    pushConsentToGoogle(DEFAULT_DENIED);
  }, [pushConsentToGoogle]);

  const value = useMemo<ConsentContextType>(
    () => ({
      consent,
      hasMadeChoice,
      acceptAll,
      rejectNonEssential,
      saveCustom,
      resetChoice,
    }),
    [consent, hasMadeChoice, acceptAll, rejectNonEssential, saveCustom, resetChoice]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}
