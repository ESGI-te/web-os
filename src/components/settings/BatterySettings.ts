interface Settings {
	isBatteryStateDisplay: boolean;
}

export default class BatterySettings {
	settings: Settings;

	constructor() {
		const storedSettings: string | null = localStorage.getItem("battery");
		this.settings = storedSettings
			? JSON.parse(storedSettings)
			: {
					isBatteryStateDisplay: true,
					hapticFeedback: false,
			  };
	}

	public getSettings() {
		return this.settings;
	}

	public createFormElement() {
		const formElement = document.createElement("form");
		formElement.classList.add("settings__form", "settings__form--battery");

		// Checkbox to show/hide battery state
		const isBatteryStateDisplayInputWrapper = document.createElement("div");
		isBatteryStateDisplayInputWrapper.classList.add("inputGroup");
		const isBatteryStateDisplayCheckbox = document.createElement("input");
		isBatteryStateDisplayCheckbox.type = "checkbox";
		isBatteryStateDisplayCheckbox.id = "isBatteryStateDisplay";
		isBatteryStateDisplayCheckbox.checked = this.settings.isBatteryStateDisplay;
		const isBatteryStateDisplayLabel = document.createElement("label");
		isBatteryStateDisplayLabel.htmlFor = "isBatteryStateDisplay";
		isBatteryStateDisplayLabel.textContent = "Afficher l'état de la batterie";
		isBatteryStateDisplayInputWrapper.appendChild(
			isBatteryStateDisplayCheckbox
		);
		isBatteryStateDisplayInputWrapper.appendChild(isBatteryStateDisplayLabel);

		// Event listeners
		isBatteryStateDisplayCheckbox.addEventListener("change", () => {
			this.setVibrationStateDisplay();
		});

		formElement.append(isBatteryStateDisplayInputWrapper);

		return formElement;
	}

	private setVibrationStateDisplay() {
		this.settings.isBatteryStateDisplay = !this.settings.isBatteryStateDisplay;
	}
}
