import useTheme from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-5 right-5 z-50 px-4 py-3 rounded-full shadow-lg transition-all duration-300 bg-slate-800 text-white hover:scale-105"
    >
      {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}