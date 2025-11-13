// File: apps/web/src/app/contact/TimezoneHidden.tsx
"use client";

import * as React from "react";

export default function TimezoneHidden() {
  const [tz, setTz] = React.useState("America/Chicago");

  React.useEffect(() => {
    try {
      const detected =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago";
      setTz(detected);
    } catch {
      setTz("America/Chicago");
    }
  }, []);

  return <input type="hidden" name="timezone" value={tz} />;
}
