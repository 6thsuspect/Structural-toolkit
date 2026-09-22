import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUiStore } from "@/stores/uiStore";

const TOOL_KEYS: Record<string, string> = {
  "1": "/",
  "2": "/steel",
  "3": "/flexural",
  "4": "/slab",
  "5": "/spectrum",
  "6": "/surcharge/point",
  "7": "/surcharge/strip",
  "8": "/converter",
};

export function useKeyboardShortcuts(handlers: {
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onExport: () => void;
}): void {
  const navigate = useNavigate();
  const setCommandOpen = useUiStore((s) => s.setCommandOpen);
  const setShortcutsOpen = useUiStore((s) => s.setShortcutsOpen);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const commandOpen = useUiStore((s) => s.commandOpen);
  const shortcutsOpen = useUiStore((s) => s.shortcutsOpen);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const meta = event.ctrlKey || event.metaKey;
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);

      if (event.key === "Escape") {
        setCommandOpen(false);
        setShortcutsOpen(false);
        return;
      }
      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(!commandOpen);
        return;
      }
      if (meta && event.key === "/") {
        event.preventDefault();
        setShortcutsOpen(!shortcutsOpen);
        return;
      }
      if (meta && event.shiftKey && event.key.toLowerCase() === "t") {
        event.preventDefault();
        toggleTheme();
        return;
      }
      if (meta && event.key.toLowerCase() === "o") {
        event.preventDefault();
        handlersRef.current.onOpen();
        return;
      }
      if (meta && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (event.shiftKey) handlersRef.current.onSaveAs();
        else handlersRef.current.onSave();
        return;
      }
      if (meta && event.key.toLowerCase() === "e") {
        event.preventDefault();
        handlersRef.current.onExport();
        return;
      }
      if (!meta && !typing && TOOL_KEYS[event.key]) {
        navigate(TOOL_KEYS[event.key]!);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commandOpen, handlers, navigate, setCommandOpen, setShortcutsOpen, shortcutsOpen, toggleTheme]);

  useEffect(() => {
    if (!window.desktop) return;
    const off = [
      window.desktop.onMenu("menu:open", handlers.onOpen),
      window.desktop.onMenu("menu:save", handlers.onSave),
      window.desktop.onMenu("menu:save-as", handlers.onSaveAs),
      window.desktop.onMenu("menu:export", handlers.onExport),
      window.desktop.onMenu("menu:toggle-theme", toggleTheme),
      window.desktop.onMenu("menu:shortcuts", () => setShortcutsOpen(true)),
      window.desktop.onMenu("menu:about", () => navigate("/help")),
    ];
    return () => off.forEach((fn) => fn());
  }, [handlers, navigate, setShortcutsOpen, toggleTheme]);
}
