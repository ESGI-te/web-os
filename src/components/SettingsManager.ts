import BatterySettings from "./settings/BatterySettings";
import DateTimeSettings from "./settings/DateTimeSettings";
import LatencySettings from "./settings/LatencySettings";
import VibrationSettings from "./settings/VibrationSettings";

enum TABS {
	VIBRATION = "vibration",
	BATTERY = "battery",
	LATENCY = "latency",
	DATETIME = "dateTime",
}

export default class SettingsManager {
	private settingsElement: HTMLElement;
	private vibrationSettings: VibrationSettings;
	private batterySettings: BatterySettings;
	private latencySettings: LatencySettings;
	private dateTimeSettings: DateTimeSettings;
	private tabs = {
		[TABS.VIBRATION]: "Vibration",
		[TABS.BATTERY]: "Batterie",
		[TABS.LATENCY]: "Latence",
		[TABS.DATETIME]: "Date et heures",
	};
	private currentTab: TABS;

	constructor() {
		this.vibrationSettings = new VibrationSettings();
		this.batterySettings = new BatterySettings();
		this.latencySettings = new LatencySettings();
		this.dateTimeSettings = new DateTimeSettings();
		this.settingsElement = document.createElement("div");
		this.settingsElement.classList.add("settings");
		this.createSidebar();
		this.setTab(TABS.VIBRATION);
	}

	public saveSettings() {
		const settings = {
			vibration: this.vibrationSettings.getSettings(),
			battery: this.batterySettings.getSettings(),
			latency: this.latencySettings.getSettings(),
			dateTime: this.dateTimeSettings.getSettings(),
		};
		localStorage.setItem("settings", JSON.stringify(settings));
	}

	private setTab(tab: TABS) {
		if (tab === this.currentTab) return;
		const tabForm = this.getTabForm(tab);
		if (!tabForm) return;
		this.currentTab = tab;
		this.settingsElement
			.querySelectorAll(".settings__form")
			.forEach((form) => form.remove());
		this.settingsElement.append(tabForm);
	}

	private createSidebar() {
		const sidebar = document.createElement("ul");
		sidebar.classList.add("settings__sidebar");
		Object.entries(this.tabs).forEach(([key, value]) => {
			const sidebarItem = document.createElement("li");
			sidebarItem.textContent = value;
			sidebarItem.id = "settings_tab_item";
			sidebarItem.classList.add("settings__sidebarItem");
			sidebar.appendChild(sidebarItem);

			sidebarItem.addEventListener("click", () => {
				this.setTab(key as TABS);
			});
		});
		this.settingsElement.append(sidebar);
	}

	private getTabForm(tab: TABS) {
		const tabsForm = {
			[TABS.VIBRATION]: this.vibrationSettings.createFormElement(),
			[TABS.BATTERY]: this.batterySettings.createFormElement(),
			[TABS.LATENCY]: this.latencySettings.createFormElement(),
			[TABS.DATETIME]: this.dateTimeSettings.createFormElement(),
		};
		return tabsForm[tab];
	}

	public getElement() {
		return this.settingsElement;
	}
}
