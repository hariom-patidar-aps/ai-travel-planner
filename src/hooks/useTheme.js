import { useEffect, useState } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");

    document.documentElement.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) =>
      prev === "dark" ? "light" : "dark"
    );
  }

  return {
    theme,
    toggleTheme,
  };
}