export interface DesktopApi {
  isElectron: true;
  openFile: (filters?: { name: string; extensions: string[] }[]) => Promise<{
    path: string;
    content: string;
  } | null>;
  saveFile: (payload: {
    defaultPath?: string;
    content: string;
    filters?: { name: string; extensions: string[] }[];
  }) => Promise<string | null>;
  onMenu: (channel: string, handler: () => void) => () => void;
}

declare global {
  interface Window {
    desktop?: DesktopApi;
  }
}

export {};
