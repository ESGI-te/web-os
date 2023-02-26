interface Settings {
	isVibrationStateDisplay: boolean;
	hapticFeedback: boolean;
}

export default class VibrationSettings {
	settings: Settings;

	constructor() {
		const storedSettings: string | null = localStorage.getItem("vibration");
		this.settings = storedSettings
			? JSON.parse(storedSettings)
			: {
					isVibrationStateDisplay: true,
					hapticFeedback: false,
			  };
	}

	public getSettings() {
		return this.settings;
	}

	public createFormElement() {
		const formElement = document.createElement("form");
		formElement.classList.add("settings__form", "settings__form--vibration");

		// Checkbox to show/hide vibration state
		const isVibrationStateDisplayInputWrapper = document.createElement("div");
		isVibrationStateDisplayInputWrapper.classList.add("inputGroup");
		const isVibrationStateDisplayCheckbox = document.createElement("input");
		isVibrationStateDisplayCheckbox.type = "checkbox";
		isVibrationStateDisplayCheckbox.id = "isVibrationStateDisplay";
		isVibrationStateDisplayCheckbox.checked =
			this.settings.isVibrationStateDisplay;
		const isVibrationStateDisplayLabel = document.createElement("label");
		isVibrationStateDisplayLabel.htmlFor = "isVibrationStateDisplay";
		isVibrationStateDisplayLabel.textContent =
			"Afficher l'état de la vibration";
		isVibrationStateDisplayInputWrapper.append(
			isVibrationStateDisplayCheckbox,
			isVibrationStateDisplayLabel
		);

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

		isVibrationStateDisplayCheckbox.addEventListener("change", () => {
			this.setVibrationStateDisplay();
		});
		hapticFeedbackCheckbox.addEventListener("change", () => {
			this.setHapticFeedback();
		});

		formElement.append(
			isVibrationStateDisplayInputWrapper,
			hapticFeedbackInputWrapper
		);

		return formElement;
	}

	private setVibrationStateDisplay() {
		this.settings.isVibrationStateDisplay =
			!this.settings.isVibrationStateDisplay;
	}

	private setHapticFeedback() {
		this.settings.hapticFeedback = !this.settings.hapticFeedback;
	}
}
