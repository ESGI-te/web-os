interface Settings {
	isDarkTheme: boolean;
	backgroundColor: string;
}

export default class AppearanceSettings {
	settings: Settings;

	constructor() {
		const storedSettings: string | null = localStorage.getItem("appearance");
		this.settings = storedSettings
			? JSON.parse(storedSettings)
			: {
					isDarkTheme: false,
					backgroundColor: "#FFFFFF",
			  };
	}

	public getSettings() {
		return this.settings;
	}

	public createFormElement() {
		const formElement = document.createElement("form");
		formElement.classList.add("settings__form", "settings__form--appearance");

		// Radio buttons to select theme
		const themeSettingsWrapper = document.createElement("div");
		themeSettingsWrapper.classList.add("form__section");
		const themeSettingsTitle = document.createElement("h3");
		themeSettingsTitle.textContent = "Choisir un thème";
		themeSettingsWrapper.appendChild(themeSettingsTitle);

		const themeInputWrapper = document.createElement("div");
		themeInputWrapper.classList.add("inputGroup");
		const lightThemeRadio = document.createElement("input");
		lightThemeRadio.type = "radio";
		lightThemeRadio.id = "lightTheme";
		lightThemeRadio.name = "theme";
		lightThemeRadio.value = "light";
		lightThemeRadio.checked = !this.settings.isDarkTheme;
		const lightThemeLabel = document.createElement("label");
		lightThemeLabel.htmlFor = "lightTheme";
		lightThemeLabel.textContent = "Mode clair";
		const darkThemeRadio = document.createElement("input");
		darkThemeRadio.type = "radio";
		darkThemeRadio.id = "darkTheme";
		darkThemeRadio.name = "theme";
		darkThemeRadio.value = "dark";
		darkThemeRadio.checked = this.settings.isDarkTheme;
		const darkThemeLabel = document.createElement("label");
		darkThemeLabel.htmlFor = "darkTheme";
		darkThemeLabel.textContent = "Mode sombre";
		themeInputWrapper.append(
			lightThemeRadio,
			lightThemeLabel,
			darkThemeRadio,
			darkThemeLabel
		);
		themeSettingsWrapper.appendChild(themeInputWrapper);
		lightThemeRadio.addEventListener("change", () => {
			this.setLightTheme();
		});

		darkThemeRadio.addEventListener("change", () => {
			this.setDarkTheme();
		});

		// Input to change background color
		const backgroundColorInputWrapper = document.createElement("div");
		backgroundColorInputWrapper.classList.add("inputGroup");
		const backgroundColorLabel = document.createElement("label");
		backgroundColorLabel.htmlFor = "backgroundColor";
		backgroundColorLabel.textContent = "Couleur de fond d'écran";
		const backgroundColorInput = document.createElement("input");
		backgroundColorInput.type = "color";
		backgroundColorInput.id = "backgroundColor";
		backgroundColorInput.value = this.settings.backgroundColor;
		backgroundColorInputWrapper.append(
			backgroundColorLabel,
			backgroundColorInput
		);

		backgroundColorInput.addEventListener("change", () => {
			this.setBackgroundColor(backgroundColorInput.value);
		});

		formElement.append(themeSettingsWrapper, backgroundColorInputWrapper);

		return formElement;
	}

	private setLightTheme() {
		this.settings.isDarkTheme = false;
	}

	private setDarkTheme() {
		this.settings.isDarkTheme = true;
	}

	private setBackgroundColor(color: string) {
		this.settings.backgroundColor = color;
	}
}
