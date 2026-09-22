import { useProjectStore } from "@/stores/projectStore";
import { NumberField } from "@/components/ui/Field";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { useUiStore } from "@/stores/uiStore";
import { shearModulus } from "@/lib/concrete";
import { formatNumber } from "@/lib/format";

export function SettingsPage() {
  const settings = useProjectStore((s) => s.project.settings);
  const update = useProjectStore((s) => s.updateSettings);
  const reset = useProjectStore((s) => s.resetSettings);
  const setName = useProjectStore((s) => s.setName);
  const name = useProjectStore((s) => s.project.name);
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const Gc = shearModulus(settings.fc, settings.Ec, settings.concPoissonRatio);

  const setNum = (key: keyof typeof settings) => (raw: string) => {
    const value = Number(raw);
    if (Number.isFinite(value)) update({ [key]: value });
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-2">
      <Panel title="Project">
        <label className="block space-y-1">
          <span className="text-xs uppercase tracking-wide text-muted">Project name</span>
          <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <div className="mt-4 space-y-2">
          <div className="text-xs uppercase tracking-wide text-muted">Theme</div>
          <div className="flex gap-2">
            <Button variant={theme === "light" ? "primary" : "secondary"} onClick={() => setTheme("light")}>Light</Button>
            <Button variant={theme === "dark" ? "primary" : "secondary"} onClick={() => setTheme("dark")}>Dark</Button>
          </div>
        </div>
      </Panel>
      <Panel title="Reinforced concrete defaults">
        <div className="space-y-3">
          <NumberField label="fc'" value={settings.fc} unit="MPa" onChange={setNum("fc")} hint="Ec is updated automatically when fc' changes." />
          <NumberField label="fyr" value={settings.fyr} unit="MPa" onChange={setNum("fyr")} />
          <NumberField label="Ec" value={settings.Ec} unit="MPa" onChange={setNum("Ec")} />
          <NumberField label="Unit weight" value={settings.concUnitWeight} unit="kg/m³" onChange={setNum("concUnitWeight")} />
          <NumberField label="Poisson ratio" value={settings.concPoissonRatio} onChange={setNum("concPoissonRatio")} />
          <p className="text-sm text-muted">Estimated shear modulus Gc = {formatNumber(Gc)} MPa</p>
        </div>
      </Panel>
      <Panel title="Steel defaults">
        <div className="space-y-3">
          <NumberField label="fys" value={settings.fys} unit="MPa" onChange={setNum("fys")} />
          <NumberField label="fus" value={settings.fus} unit="MPa" onChange={setNum("fus")} />
          <NumberField label="Es" value={settings.Es} unit="MPa" onChange={setNum("Es")} />
          <NumberField label="Unit weight" value={settings.steelUnitWeight} unit="kg/m³" onChange={setNum("steelUnitWeight")} />
          <NumberField label="Poisson ratio" value={settings.steelPoissonRatio} onChange={setNum("steelPoissonRatio")} />
        </div>
      </Panel>
      <Panel title="Reset">
        <p className="text-sm text-muted">Restore material defaults without deleting the current calculation inputs.</p>
        <Button className="mt-3" variant="danger" onClick={reset}>Reset material defaults</Button>
      </Panel>
    </div>
  );
}
