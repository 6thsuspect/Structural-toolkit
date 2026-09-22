import { SHORTCUTS } from "@/lib/navigation";
import { Panel } from "@/components/ui/Panel";

export function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Panel title="About Structural Workspace">
        <p className="text-sm leading-6 text-muted">
          Structural Workspace is an independent engineering calculator for common civil and structural checks.
          It runs in the browser and as a desktop app. Calculations are performed locally. Project files use the
          <span className="font-mono"> .swproj </span> JSON format.
        </p>
      </Panel>
      <Panel title="Import / export">
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
          <li>Open and save workspace projects as JSON (.swproj).</li>
          <li>Steel catalogs and spectra can be exported as CSV.</li>
          <li>In the desktop build, native file dialogs are used through a sandboxed preload bridge.</li>
        </ul>
      </Panel>
      <Panel title="Keyboard shortcuts">
        <ul className="space-y-2 text-sm">
          {SHORTCUTS.map((item) => (
            <li key={item.keys} className="flex justify-between gap-4">
              <span>{item.action}</span>
              <span className="kbd">{item.keys}</span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="License">
        <p className="text-sm text-muted">
          This application is distributed under the BSD 3-Clause License. Engineering formulas implemented here are
          standard published methods (Whitney stress block, Marcus slab coefficients, ASCE 7 site coefficients, and
          elastic surcharge approximations). See THIRD_PARTY_NOTICES.md in the project root for required notices.
        </p>
      </Panel>
    </div>
  );
}
