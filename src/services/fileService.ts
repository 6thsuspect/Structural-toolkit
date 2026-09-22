import { downloadText } from "@/lib/format";

const PROJECT_FILTERS = [{ name: "Workspace Project", extensions: ["swproj", "json"] }];

export async function openProjectFile(): Promise<{ path: string | null; content: string } | null> {
  if (window.desktop) {
    const result = await window.desktop.openFile(PROJECT_FILTERS);
    return result;
  }
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".swproj,.json,application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      resolve({ path: file.name, content: await file.text() });
    };
    input.click();
  });
}

export async function saveProjectFile(
  content: string,
  defaultPath = "project.swproj",
): Promise<string | null> {
  if (window.desktop) {
    return window.desktop.saveFile({
      defaultPath,
      content,
      filters: PROJECT_FILTERS,
    });
  }
  downloadText(defaultPath, content, "application/json");
  return defaultPath;
}

export async function exportTextFile(
  content: string,
  defaultPath: string,
  extensions: string[],
  mime = "text/plain",
): Promise<string | null> {
  if (window.desktop) {
    return window.desktop.saveFile({
      defaultPath,
      content,
      filters: [{ name: "Export", extensions }],
    });
  }
  downloadText(defaultPath, content, mime);
  return defaultPath;
}
