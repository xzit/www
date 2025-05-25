import * as React from "react";
import { RiMoonFill, RiSunFill } from "@remixicon/react";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const [theme, setTheme] = React.useState<"dark" | "theme-light">();

  // Leer tema en mount, sincronizado con SSR
  React.useEffect(() => {
    const saved = localStorage.getItem("theme") as
      | "dark"
      | "theme-light"
      | null;

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initial = saved || (prefersDark ? "dark" : "theme-light");

    document.documentElement.classList.toggle("dark", initial === "dark");
    setTheme(initial);
  }, []);

  // Cambia el modo y guarda preferencia
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "theme-light" : "dark";
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <Button variant="ghost" size="icon" className="p-8" onClick={toggleTheme}>
      <RiSunFill className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <RiMoonFill className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
