import { ENDPOINTS } from "./constants";
import apiClient from "./lib/apiClient";
import LookupStore from "./stores/lookup-store";
import ScreenStore from "./stores/screen";
import SystemSettingsStore from "./stores/system-settings";
import ThemeStore from "./stores/theme";

async function loadLookups() {
    const response = await apiClient.get(ENDPOINTS.lookups);
    LookupStore.setLookups(response.data.data);
}

async function loadScreens() {
    const response = await apiClient.get(ENDPOINTS.screens);
    ScreenStore.setScreens(response.data.data);
}

async function loadSystemSettings() {
    const response = await apiClient.get(ENDPOINTS.systemSettings);
    SystemSettingsStore.setSettings(response.data.data);
}

async function loadTheme() {
    const response = await apiClient.get(ENDPOINTS.theme);
    ThemeStore.setTheme(response.data.data);
}

const preload = Promise.all([
    loadTheme(),
    loadLookups(),
    loadSystemSettings(),
    loadScreens(),
]);

export default preload;
