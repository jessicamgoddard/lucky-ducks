import type { Settings as SettingsValues } from '../utils/storage';

import '../scss/components/_settings.scss';

type Props = {
  settings: SettingsValues;
  onChange: (settings: SettingsValues) => void;
};

/**
 * The settings panel contents: a labelled checkbox for each preference.
 */
export default function Settings({ settings, onChange }: Props) {
  return (
    <div className="settings">
      <label className="settings__row">
        <input
          type="checkbox"
          checked={settings.sounds}
          onChange={(e) => onChange({ ...settings, sounds: e.target.checked })}
        />
        <span>
          Sounds
          <span className="settings__hint">Quack when a duck is picked.</span>
        </span>
      </label>

      <label className="settings__row">
        <input
          type="checkbox"
          checked={settings.decoys}
          onChange={(e) => onChange({ ...settings, decoys: e.target.checked })}
        />
        <span>
          Decoy ducks
          <span className="settings__hint">Extra ducks that hide a fun surprise instead of an option.</span>
        </span>
      </label>
    </div>
  );
}
