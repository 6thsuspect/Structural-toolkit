import { contextBridge, ipcRenderer } from "electron";

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

const api: DesktopApi = {
  isElectron: true,
  openFile: (filters) => ipcRenderer.invoke("dialog:open", { filters }),
  saveFile: (payload) => ipcRenderer.invoke("dialog:save", payload),
  onMenu: (channel, handler) => {
    const listener = () => handler();
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },
};

contextBridge.exposeInMainWorld("desktop", api);
