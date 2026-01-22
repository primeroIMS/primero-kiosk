import apiClient from "./lib/apiClient";
import SystemSettingsStore from "./stores/system-settings";
import ThemeStore from "./stores/theme";

async function loadSystemSettings() {
    const response = await apiClient.get("/theme");
    ThemeStore.setTheme(response.data.data);
}

async function loadTheme() {
    const response = await apiClient.get("/system_settings");
    SystemSettingsStore.setSettings(response.data.data);
}

const preload = Promise.all([loadTheme(), loadSystemSettings()]);

export default preload;
