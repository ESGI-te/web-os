import { ISettings } from "../SettingsManager";

export interface IAppearanceSettings {
	isDarkTheme: boolean;
	backgroundColor: string;
}

export default class AppearanceSettings {
	lightThemeRadio: HTMLInputElement;
	darkThemeRadio: HTMLInputElement;
	settings: IAppearanceSettings = {
		isDarkTheme: false,
		backgroundColor: "#FFFFFF",
	};

	constructor() {
		const storedSettings: string | null = localStorage.getItem("settings");
		if (storedSettings) {
			this.settings = JSON.parse(storedSettings).appearance;
		}
	}

	public getSettings = () => {
		return this.settings;
	};

	public createFormElement = () => {
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
		this.lightThemeRadio = document.createElement("input");
		this.lightThemeRadio.type = "radio";
		this.lightThemeRadio.id = "lightTheme";
		this.lightThemeRadio.name = "theme";
		this.lightThemeRadio.value = "light";
		this.lightThemeRadio.checked = !this.settings.isDarkTheme;
		const lightThemeLabel = document.createElement("label");
		lightThemeLabel.htmlFor = "lightTheme";
		lightThemeLabel.textContent = "Mode clair";

		this.darkThemeRadio = document.createElement("input");
		this.darkThemeRadio.type = "radio";
		this.darkThemeRadio.id = "darkTheme";
		this.darkThemeRadio.name = "theme";
		this.darkThemeRadio.value = "dark";
		this.darkThemeRadio.checked = this.settings.isDarkTheme;
		const darkThemeLabel = document.createElement("label");
		darkThemeLabel.htmlFor = "darkTheme";
		darkThemeLabel.textContent = "Mode sombre";
		themeInputWrapper.append(
			this.lightThemeRadio,
			lightThemeLabel,
			this.darkThemeRadio,
			darkThemeLabel
		);
		themeSettingsWrapper.appendChild(themeInputWrapper);
		this.lightThemeRadio.addEventListener("change", (e) => {
			const target = e.target as HTMLInputElement;
			this.setTheme(target.value);
		});

		this.darkThemeRadio.addEventListener("change", (e) => {
			const target = e.target as HTMLInputElement;
			this.setTheme(target.value);
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
	};

	private setTheme = (theme: string) => {
		this.settings.isDarkTheme = theme === "dark";
	};

	private setBackgroundColor(color: string) {
		this.settings.backgroundColor = color;
	}

	public applySettings = () => {
		const storedSettings = JSON.parse(
			localStorage.getItem("settings") as string
		);

		const newSettings: ISettings = {
			...storedSettings,
			appearance: this.settings,
		};
		localStorage.setItem("settings", JSON.stringify(newSettings));
		const event = new CustomEvent("appearanceSettingsUpdated", {
			detail: { settings: this.settings },
		});
		window.dispatchEvent(event);
	};
}
