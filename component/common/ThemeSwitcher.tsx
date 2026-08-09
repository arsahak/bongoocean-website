"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/component/providers/ThemeProvider";

const themes: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const current = themes.find((t) => t.value === theme) ?? themes[2];

  return (
    <label className="group flex items-center gap-1.5 text-(--color-text-muted) transition-colors hover:text-(--color-primary)">
      <current.Icon size={16} />
      <select
        aria-label="Select theme"
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
        className="w-auto cursor-pointer border-0 bg-transparent p-0 text-sm text-(--color-text-muted) shadow-none outline-none transition-colors group-hover:text-(--color-primary)"
      >
        {themes.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </label>
  );
}
