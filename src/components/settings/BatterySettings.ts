import { ISettings } from "../SettingsManager";

export interface IBatterySettings {
	showBattery: boolean;
	hapticFeedback: boolean;
}

export default class BatterySettings {
	settings: IBatterySettings;

	constructor() {
		const storedSettings: string | null = localStorage.getItem("settings");
		if (storedSettings) {
			this.settings = JSON.parse(storedSettings).battery;
		} else {
			this.settings = {
				showBattery: true,
				hapticFeedback: false,
			};
		}
	}

	public getSettings = () => {
		return this.settings;
	};

	public createFormElement = () => {
		const formElement = document.createElement("form");
		formElement.classList.add("settings__form", "settings__form--battery");

		// Checkbox to show/hide battery state
		const showBatteryInputWrapper = document.createElement("div");
		showBatteryInputWrapper.classList.add("inputGroup");
		const showBatteryCheckbox = document.createElement("input");
		showBatteryCheckbox.type = "checkbox";
		showBatteryCheckbox.id = "showBattery";
		showBatteryCheckbox.checked = this.settings.showBattery;
		const showBatteryLabel = document.createElement("label");
		showBatteryLabel.htmlFor = "showBattery";
		showBatteryLabel.textContent = "Afficher l'état de la batterie";
		showBatteryInputWrapper.append(showBatteryCheckbox, showBatteryLabel);

		showBatteryCheckbox.addEventListener("change", () => {
			this.setShowBattery();
		});

		formElement.append(showBatteryInputWrapper);

		return formElement;
	};

	private setShowBattery = () => {
		this.settings.showBattery = !this.settings.showBattery;
	};

	public applySettings = () => {
		const storedSettings = JSON.parse(
			localStorage.getItem("settings") as string
		);

		const newSettings: ISettings = {
			...storedSettings,
			battery: this.settings,
		};
		localStorage.setItem("settings", JSON.stringify(newSettings));
		const event = new CustomEvent("batterySettingsUpdated", {
			detail: { settings: this.settings },
		});
		window.dispatchEvent(event);
	};
}
