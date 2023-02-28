import AppearanceSettings, {
	IAppearanceSettings,
} from "./settings/AppearanceSettings";
import BatterySettings, { IBatterySettings } from "./settings/BatterySettings";
import DateTimeSettings, {
	IDatetimeSettings,
} from "./settings/DateTimeSettings";
import LatencySettings, { ILatencySettings } from "./settings/LatencySettings";
import VibrationSettings, {
	IVibrationSettings,
} from "./settings/VibrationSettings";

export interface ISettings {
	battery: IBatterySettings;
	latency: ILatencySettings;
	dateTime: IDatetimeSettings;
	vibration: IVibrationSettings;
	appearance: IAppearanceSettings;
}

enum TABS {
	VIBRATION = "vibration",
	BATTERY = "battery",
	LATENCY = "latency",
	DATETIME = "dateTime",
	APPEARANCE = "appearance",
}

export default class SettingsManager {
	private settingsElement: HTMLElement;
	private formWrapperElement: HTMLElement;
	private vibrationSettings: VibrationSettings;
	private batterySettings: BatterySettings;
	private latencySettings: LatencySettings;
	private dateTimeSettings: DateTimeSettings;
	private appearanceSettings: AppearanceSettings;
	private tabs = {
		[TABS.VIBRATION]: "Vibration",
		[TABS.BATTERY]: "Batterie",
		[TABS.LATENCY]: "Latence",
		[TABS.DATETIME]: "Date et heures",
		[TABS.APPEARANCE]: "Apparence",
	};
	private currentTab: TABS;

	constructor() {
		this.vibrationSettings = new VibrationSettings();
		this.batterySettings = new BatterySettings();
		this.latencySettings = new LatencySettings();
		this.dateTimeSettings = new DateTimeSettings();
		this.appearanceSettings = new AppearanceSettings();
		this.settingsElement = document.createElement("div");
		this.settingsElement.classList.add("settings");
		this.createSidebar();
		this.formWrapperElement = document.createElement("div");
		this.formWrapperElement.classList.add("settings__formWrapper");
		this.settingsElement.appendChild(this.formWrapperElement);
		if (!localStorage.getItem("settings")) this.saveSettings();
		this.handleTabChange(TABS.VIBRATION);
	}

	public saveSettings = () => {
		const settings: ISettings = {
			vibration: this.vibrationSettings.getSettings(),
			battery: this.batterySettings.getSettings(),
			latency: this.latencySettings.getSettings(),
			dateTime: this.dateTimeSettings.getSettings(),
			appearance: this.appearanceSettings.getSettings(),
		};

		localStorage.setItem("settings", JSON.stringify(settings));

		const event = new CustomEvent("settingsUpdated", {
			detail: { settings: settings },
		});
		window.dispatchEvent(event);
	};

	private handleTabChange = (tab: TABS) => {
		if (tab === this.currentTab) return;
		this.currentTab = tab;
		this.settingsElement
			.querySelectorAll(".settings__form")
			.forEach((form) => form.remove());
		this.createTabForm(tab);
	};

	private createSidebar = () => {
		const sidebar = document.createElement("ul");
		sidebar.classList.add("settings__sidebar");
		Object.entries(this.tabs).forEach(([key, value]) => {
			const sidebarItem = document.createElement("li");
			sidebarItem.textContent = value;
			sidebarItem.id = "settings_tab_item";
			sidebarItem.classList.add("settings__sidebarItem");
			sidebar.appendChild(sidebarItem);
			if (key === TABS.VIBRATION) sidebarItem.classList.add("active");
			sidebarItem.addEventListener("click", () => {
				this.handleTabChange(key as TABS);
				sidebar
					.querySelectorAll(".settings__sidebarItem")
					.forEach((item) => item.classList.remove("active"));
				sidebarItem.classList.add("active");
			});
		});
		this.settingsElement.append(sidebar);
	};

	private createFormButtons = (tab: TABS): HTMLElement => {
		const tabsApplyFunction = {
			[TABS.VIBRATION]: this.vibrationSettings.applySettings,
			[TABS.BATTERY]: this.batterySettings.applySettings,
			[TABS.LATENCY]: this.latencySettings.applySettings,
			[TABS.DATETIME]: this.dateTimeSettings.applySettings,
			[TABS.APPEARANCE]: this.appearanceSettings.applySettings,
		};

		const buttonsWrapper = document.createElement("div");
		buttonsWrapper.classList.add("buttonsWrapper");

		const applyButton = document.createElement("button");
		applyButton.textContent = "Appliquer";
		applyButton.classList.add("apply");
		const saveButton = document.createElement("button");
		saveButton.textContent = "Sauvegarder";
		saveButton.classList.add("save");

		applyButton.addEventListener("click", () => tabsApplyFunction[tab]());
		saveButton.addEventListener("click", () => this.saveSettings());

		buttonsWrapper.append(applyButton, saveButton);

		return buttonsWrapper;
	};

	private createTabForm = (tab: TABS): void => {
		const tabsForm = {
			[TABS.VIBRATION]: this.vibrationSettings.createFormElement,
			[TABS.BATTERY]: this.batterySettings.createFormElement,
			[TABS.LATENCY]: this.latencySettings.createFormElement,
			[TABS.DATETIME]: this.dateTimeSettings.createFormElement,
			[TABS.APPEARANCE]: this.appearanceSettings.createFormElement,
		};
		const form = tabsForm[tab]();
		const buttons = this.createFormButtons(tab);

		this.formWrapperElement
			.querySelectorAll(".buttonsWrapper")
			.forEach((form) => form.remove());

		this.formWrapperElement.append(form, buttons);
	};

	public getElement = (): HTMLElement => {
		return this.settingsElement;
	};
}
