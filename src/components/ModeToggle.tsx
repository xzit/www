import * as React from "react";
import { RiMoonFill, RiSunFill } from "@remixicon/react";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const [theme, setThemeState] = React.useState<"theme-light" | "dark">(
    "theme-light",
  );

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setThemeState(isDarkMode ? "dark" : "theme-light");
  }, []);

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "theme-light" : "dark"));
  };

  return (
    <Button variant="ghost" size="icon" className="p-8" onClick={toggleTheme}>
      <RiSunFill className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <RiMoonFill className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
