import { FONT_FAMILIES, PAGE, SETTINGS_KEY } from './enum';
import type { Settings } from './types';

const SETTINGS_LOCAL_STORAGE_KEY = 'settings';
const DEFAULT_SETTINGS: Settings = {
  [SETTINGS_KEY.FONT_FAMILY]: FONT_FAMILIES.SANS_SERIF,
  [SETTINGS_KEY.DARK_HIGHLIGHT_COLOR]: '#4682b4',
  [SETTINGS_KEY.LIGHT_HIGHLIGHT_COLOR]: '#add8e6',
  [SETTINGS_KEY.START_TIMESTAMP_PADDING]: 0,
  [SETTINGS_KEY.OPEN_PAGE]: PAGE.COMMENTS,
};


const getStoredSettings = (): Settings => {
  let result = DEFAULT_SETTINGS;

  const storedSettings = localStorage.getItem(SETTINGS_LOCAL_STORAGE_KEY);

  if (storedSettings) {
    result = JSON.parse(storedSettings);
  } else {
    setSettings(result);
  }

  return result;
}

const getSettingsValue = (key: keyof Settings) => getStoredSettings()[key];

const setSettings = (settings: Settings) => {
  localStorage.setItem(SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(settings));
}

const removeSettings = () => {
  localStorage.setItem(SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
}

export {
  getSettingsValue,
  getStoredSettings,
  removeSettings,
  setSettings,
  DEFAULT_SETTINGS
}
