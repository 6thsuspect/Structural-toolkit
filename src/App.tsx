import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { HomePage } from "@/features/home/HomePage";
import { SteelPage } from "@/features/steel/SteelPage";
import { FlexuralPage } from "@/features/flexural/FlexuralPage";
import { SlabPage } from "@/features/slab/SlabPage";
import { SpectrumPage } from "@/features/spectrum/SpectrumPage";
import { PointLoadPage } from "@/features/surcharge/PointLoadPage";
import { StripLoadPage } from "@/features/surcharge/StripLoadPage";
import { ConverterPage } from "@/features/converter/ConverterPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import { HelpPage } from "@/features/help/HelpPage";
import { useUiStore } from "@/stores/uiStore";

export function App() {
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/steel" element={<SteelPage />} />
        <Route path="/flexural" element={<FlexuralPage />} />
        <Route path="/slab" element={<SlabPage />} />
        <Route path="/spectrum" element={<SpectrumPage />} />
        <Route path="/surcharge/point" element={<PointLoadPage />} />
        <Route path="/surcharge/strip" element={<StripLoadPage />} />
        <Route path="/converter" element={<ConverterPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
