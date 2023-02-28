import { ISettings } from "../SettingsManager";

export interface IDatetimeSettings {
	showTime: boolean;
	showHours: boolean;
	showMinutes: boolean;
	showSeconds: boolean;
	showDate: boolean;
	showYear: boolean;
	showMonth: boolean;
	showDay: boolean;
}

export default class DateTimeSettings {
	settings: IDatetimeSettings = {
		showTime: true,
		showHours: true,
		showMinutes: true,
		showSeconds: false,
		showDate: true,
		showYear: true,
		showMonth: true,
		showDay: true,
	};

	constructor() {
		const storedSettings: string | null = localStorage.getItem("settings");
		if (storedSettings) {
			this.settings = JSON.parse(storedSettings).dateTime;
		}
	}

	public getSettings = () => {
		return this.settings;
	};

	public createFormElement = () => {
		const formElement = document.createElement("form");
		formElement.classList.add("settings__form", "settings__form--datetime");

		// Time settings inputs
		const timeSettingsWrapper = document.createElement("div");
		timeSettingsWrapper.classList.add("form__section");
		const timeSettingsTitle = document.createElement("h3");
		timeSettingsTitle.textContent = "Configurer l'affichage de la date";
		timeSettingsWrapper.appendChild(timeSettingsTitle);

		// Date display checkbox
		const showTimeInputWrapper = document.createElement("div");
		showTimeInputWrapper.classList.add("inputGroup");
		const showTimeCheckbox = document.createElement("input");
		showTimeCheckbox.type = "checkbox";
		showTimeCheckbox.id = "showTime";
		showTimeCheckbox.checked = true;
		const showTimeLabel = document.createElement("label");
		showTimeLabel.htmlFor = "showTime";
		showTimeLabel.textContent = "Afficher l'heure";
		showTimeInputWrapper.append(showTimeCheckbox, showTimeLabel);

		// Display hours checkbox
		const showHoursInputWrapper = document.createElement("div");
		showHoursInputWrapper.classList.add("inputGroup");
		const showHoursCheckbox = document.createElement("input");
		showHoursCheckbox.type = "checkbox";
		showHoursCheckbox.id = "showHours";
		showHoursCheckbox.checked = this.settings.showHours;
		const showHoursLabel = document.createElement("label");
		showHoursLabel.htmlFor = "showHours";
		showHoursLabel.textContent = "Afficher les heures";
		showHoursInputWrapper.append(showHoursCheckbox, showHoursLabel);

		// Display minutes checkbox
		const showMinutesInputWrapper = document.createElement("div");
		showMinutesInputWrapper.classList.add("inputGroup");
		const showMinutesCheckbox = document.createElement("input");
		showMinutesCheckbox.type = "checkbox";
		showMinutesCheckbox.id = "showMinutes";
		showMinutesCheckbox.checked = this.settings.showMinutes;
		const showMinutesLabel = document.createElement("label");
		showMinutesLabel.htmlFor = "showMinutes";
		showMinutesLabel.textContent = "Afficher les minutes";
		showMinutesInputWrapper.append(showMinutesCheckbox, showMinutesLabel);

		// Display seconds checkbox
		const showSecondsInputWrapper = document.createElement("div");
		showSecondsInputWrapper.classList.add("inputGroup");
		const showSecondsCheckbox = document.createElement("input");
		showSecondsCheckbox.type = "checkbox";
		showSecondsCheckbox.id = "showSeconds";
		showSecondsCheckbox.checked = this.settings.showSeconds;
		const showSecondsLabel = document.createElement("label");
		showSecondsLabel.htmlFor = "showSeconds";
		showSecondsLabel.textContent = "Afficher les secondes";
		showSecondsInputWrapper.append(showSecondsCheckbox, showSecondsLabel);

		timeSettingsWrapper.append(
			showTimeInputWrapper,
			showHoursInputWrapper,
			showMinutesInputWrapper,
			showSecondsInputWrapper
		);

		// Date settings inputs
		const dateSettingsWrapper = document.createElement("div");
		dateSettingsWrapper.classList.add("form__section");
		const dateSettingsTitle = document.createElement("h3");
		dateSettingsTitle.textContent = "Configurer l'affichage de l'heure";
		dateSettingsWrapper.appendChild(dateSettingsTitle);

		// Date display checkbox
		const showDateInputWrapper = document.createElement("div");
		showDateInputWrapper.classList.add("inputGroup");
		const showDateCheckbox = document.createElement("input");
		showDateCheckbox.type = "checkbox";
		showDateCheckbox.id = "showDate";
		showDateCheckbox.checked = true;
		const showDateLabel = document.createElement("label");
		showDateLabel.htmlFor = "showDate";
		showDateLabel.textContent = "Afficher la date";
		showDateInputWrapper.append(showDateCheckbox, showDateLabel);

		// Year display checkbox
		const showYearInputWrapper = document.createElement("div");
		showYearInputWrapper.classList.add("inputGroup");
		const showYearCheckbox = document.createElement("input");
		showYearCheckbox.type = "checkbox";
		showYearCheckbox.id = "showYear";
		showYearCheckbox.checked = true;
		const showYearLabel = document.createElement("label");
		showYearLabel.htmlFor = "showYear";
		showYearLabel.textContent = "Afficher l'année";
		showYearInputWrapper.append(showYearCheckbox, showYearLabel);

		// Month display checkbox
		const showMonthInputWrapper = document.createElement("div");
		showMonthInputWrapper.classList.add("inputGroup");
		const showMonthCheckbox = document.createElement("input");
		showMonthCheckbox.type = "checkbox";
		showMonthCheckbox.id = "showMonth";
		showMonthCheckbox.checked = true;
		const showMonthLabel = document.createElement("label");
		showMonthLabel.htmlFor = "showMonth";
		showMonthLabel.textContent = "Afficher le mois";
		showMonthInputWrapper.append(showMonthCheckbox, showMonthLabel);

		// Day display checkbox
		const showDayInputWrapper = document.createElement("div");
		showDayInputWrapper.classList.add("inputGroup");
		const showDayCheckbox = document.createElement("input");
		showDayCheckbox.type = "checkbox";
		showDayCheckbox.id = "showDay";
		showDayCheckbox.checked = true;
		const showDayLabel = document.createElement("label");
		showDayLabel.htmlFor = "showDay";
		showDayLabel.textContent = "Afficher le jour";
		showDayInputWrapper.append(showDayCheckbox, showDayLabel);

		// Append the inputs to the date section
		dateSettingsWrapper.append(
			showDateInputWrapper,
			showYearInputWrapper,
			showMonthInputWrapper,
			showDayInputWrapper
		);

		showTimeCheckbox.addEventListener("change", () => {
			this.setShowTime();
		});
		showHoursCheckbox.addEventListener("change", () => {
			this.setShowHours();
		});
		showMinutesCheckbox.addEventListener("change", () => {
			this.setShowMinutes();
		});
		showSecondsCheckbox.addEventListener("change", () => {
			this.setShowSeconds();
		});
		showDateCheckbox.addEventListener("change", () => {
			this.setShowDate();
		});
		showYearCheckbox.addEventListener("change", () => {
			this.setShowYear();
		});
		showMonthCheckbox.addEventListener("change", () => {
			this.setShowMonth();
		});
		showDayCheckbox.addEventListener("change", () => {
			this.setShowDay();
		});

		formElement.append(dateSettingsWrapper, timeSettingsWrapper);

		return formElement;
	};

	private setShowTime = () => {
		this.settings.showTime = !this.settings.showTime;
	};
	private setShowHours = () => {
		this.settings.showHours = !this.settings.showHours;
	};

	private setShowMinutes = () => {
		this.settings.showMinutes = !this.settings.showMinutes;
	};

	private setShowSeconds = () => {
		this.settings.showSeconds = !this.settings.showSeconds;
	};

	private setShowDate = () => {
		this.settings.showDate = !this.settings.showDate;
	};

	private setShowYear = () => {
		this.settings.showYear = !this.settings.showYear;
	};

	private setShowMonth = () => {
		this.settings.showMonth = !this.settings.showMonth;
	};

	private setShowDay = () => {
		this.settings.showDay = !this.settings.showDay;
	};
	public applySettings = () => {
		const storedSettings = JSON.parse(
			localStorage.getItem("settings") as string
		);

		const newSettings: ISettings = {
			...storedSettings,
			dateTime: this.settings,
		};
		localStorage.setItem("settings", JSON.stringify(newSettings));
		const event = new CustomEvent("dateTimeSettingsUpdated", {
			detail: { settings: this.settings },
		});
		window.dispatchEvent(event);
	};
}
