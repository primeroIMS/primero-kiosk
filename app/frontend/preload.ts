import { ENDPOINTS } from "./constants";
import apiClient from "./lib/api-client";
import AppFlowStore from "./stores/app-flow";
import LookupStore from "./stores/lookup-store";
import SystemSettingsStore from "./stores/system-settings";
import ThemeStore from "./stores/theme";

async function loadAppFlows() {
    const response = await apiClient.get(ENDPOINTS.appFlows);
    AppFlowStore.setData(response.data.data);
}

async function loadLookups() {
    const response = await apiClient.get(ENDPOINTS.lookups);
    LookupStore.setLookups(response.data.data);
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
    loadAppFlows(),
]);

export default preload;
