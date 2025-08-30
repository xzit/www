"use client";

import { useEffect, useState } from "react";

import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function LiveClock({ timezone }: { timezone?: string }) {
  const [time, setTime] = useState(
    TZDate.tz(timezone || "America/Mexico_City"),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(TZDate.tz(timezone || "America/Mexico_City"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = format(time, "HH:mm:ss z", {
    locale: es,
  });

  return formattedTime;
}
