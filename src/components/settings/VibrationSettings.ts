import { ISettings } from "../SettingsManager";

export interface IVibrationSettings {
	showVibration: boolean;
	hapticFeedback: boolean;
}

export default class VibrationSettings {
	settings: IVibrationSettings = {
		showVibration: true,
		hapticFeedback: true,
	};

	constructor() {
		const storedSettings: string | null = localStorage.getItem("settings");
		if (storedSettings) {
			this.settings = JSON.parse(storedSettings).vibration;
		}
	}

	public getSettings = () => {
		return this.settings;
	};

	public createFormElement = () => {
		const formElement = document.createElement("form");
		formElement.classList.add("settings__form", "settings__form--vibration");

		// Checkbox to show/hide vibration state
		const showVibrationInputWrapper = document.createElement("div");
		showVibrationInputWrapper.classList.add("inputGroup");
		const showVibrationCheckbox = document.createElement("input");
		showVibrationCheckbox.type = "checkbox";
		showVibrationCheckbox.id = "showVibration";
		showVibrationCheckbox.checked = this.settings.showVibration;
		const showVibrationLabel = document.createElement("label");
		showVibrationLabel.htmlFor = "showVibration";
		showVibrationLabel.textContent = "Afficher l'état de la vibration";
		showVibrationInputWrapper.append(showVibrationCheckbox, showVibrationLabel);

		// Checkbox to enable/disable haptic feedback
		const hapticFeedbackInputWrapper = document.createElement("div");
		hapticFeedbackInputWrapper.classList.add("inputGroup");
		const hapticFeedbackCheckbox = document.createElement("input");
		hapticFeedbackCheckbox.type = "checkbox";
		hapticFeedbackCheckbox.id = "hapticFeedback";
		hapticFeedbackCheckbox.checked = this.settings.hapticFeedback;
		const hapticFeedbackLabel = document.createElement("label");
		hapticFeedbackLabel.htmlFor = "hapticFeedback";
		hapticFeedbackLabel.textContent = "Activer les retours haptiques";
		hapticFeedbackInputWrapper.append(
			hapticFeedbackCheckbox,
			hapticFeedbackLabel
		);

		showVibrationCheckbox.addEventListener("change", () => {
			this.setShowVibration();
		});
		hapticFeedbackCheckbox.addEventListener("change", () => {
			this.setHapticFeedback();
		});

		formElement.append(showVibrationInputWrapper, hapticFeedbackInputWrapper);

		return formElement;
	};

	private setShowVibration = () => {
		this.settings.showVibration = !this.settings.showVibration;
	};

	private setHapticFeedback = () => {
		this.settings.hapticFeedback = !this.settings.hapticFeedback;
	};
	public applySettings = () => {
		const storedSettings = JSON.parse(
			localStorage.getItem("settings") as string
		);

		const newSettings: ISettings = {
			...storedSettings,
			vibration: this.settings,
		};
		localStorage.setItem("settings", JSON.stringify(newSettings));
		const event = new CustomEvent("vibrationSettingsUpdated", {
			detail: { settings: this.settings },
		});
		window.dispatchEvent(event);
	};
}
