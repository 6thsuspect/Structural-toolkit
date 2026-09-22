import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "release", "structural-workspace");
fs.mkdirSync(outDir, { recursive: true });

function copyDir(from, to) {
  fs.cpSync(from, to, { recursive: true });
}

copyDir(path.join(root, "dist"), path.join(outDir, "dist"));
copyDir(path.join(root, "dist-electron"), path.join(outDir, "dist-electron"));
fs.copyFileSync(path.join(root, "package.json"), path.join(outDir, "package.json"));

const launcher = `#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");
const electron = require("electron");
const child = spawn(electron, [path.join(__dirname)], { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 0));
`;
fs.writeFileSync(path.join(outDir, "start.cjs"), launcher);

console.log(`Electron payload assembled at ${outDir}`);
console.log("Main process:", path.join(outDir, "dist-electron/main.cjs"));
console.log("Renderer:", path.join(outDir, "dist/index.html"));

const electronBinary = path.join(root, "node_modules", "electron", "dist", "electron");
if (fs.existsSync(electronBinary)) {
  console.log("Electron runtime found. You can launch with: npx electron .");
} else {
  console.log("Electron runtime binary was not downloaded in this environment.");
  console.log("Install a local Electron runtime, then run: npx electron .");
}
