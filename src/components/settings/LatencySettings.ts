import { ISettings } from "../SettingsManager";

export interface ILatencySettings {
	showLatency: boolean;
	domainName: string;
	refreshFrequency: number;
}

export default class LatencySettings {
	settings: ILatencySettings = {
		showLatency: true,
		domainName: "",
		refreshFrequency: 60000,
	};
	domainNameInput: HTMLInputElement;
	refreshFrequencyInput: HTMLInputElement;
	showLatencyCheckbox: HTMLInputElement;

	constructor() {
		const storedSettings: string | null = localStorage.getItem("settings");
		if (storedSettings) {
			this.settings = JSON.parse(storedSettings).latency;
		}
	}

	public getSettings = () => {
		return this.settings;
	};

	public createFormElement = () => {
		const formElement = document.createElement("form");
		formElement.classList.add("settings__form", "settings__form--latency");

		// Checkbox to show/hide latency state
		const showLatencyInputWrapper = document.createElement("div");
		showLatencyInputWrapper.classList.add("inputGroup");
		this.showLatencyCheckbox = document.createElement("input");
		this.showLatencyCheckbox.type = "checkbox";
		this.showLatencyCheckbox.id = "showLatency";
		this.showLatencyCheckbox.checked = this.settings.showLatency;
		const showLatencyLabel = document.createElement("label");
		showLatencyLabel.htmlFor = "showLatency";
		showLatencyLabel.textContent = "Afficher la latence réseau";
		showLatencyInputWrapper.append(this.showLatencyCheckbox, showLatencyLabel);

		// Domain name input
		const domainNameInputWrapper = document.createElement("div");
		domainNameInputWrapper.classList.add("inputGroup");
		this.domainNameInput = document.createElement("input");
		this.domainNameInput.type = "text";
		this.domainNameInput.id = "domainName";
		this.domainNameInput.disabled = !this.showLatencyCheckbox.checked;
		const domainNameLabel = document.createElement("label");
		domainNameLabel.htmlFor = "domainName";
		domainNameLabel.textContent = "Nom de domaine du serveur de ping";
		domainNameInputWrapper.append(domainNameLabel, this.domainNameInput);

		// Refresh frequency input
		const refreshFrequencyInputWrapper = document.createElement("div");
		refreshFrequencyInputWrapper.classList.add("inputGroup");
		this.refreshFrequencyInput = document.createElement("input");
		this.refreshFrequencyInput.type = "number";
		this.refreshFrequencyInput.id = "refreshFrequency";
		this.refreshFrequencyInput.disabled = !this.showLatencyCheckbox.checked;
		const refreshFrequencyLabel = document.createElement("label");
		refreshFrequencyLabel.htmlFor = "refreshFrequency";
		refreshFrequencyLabel.textContent = "Délai de rafraichissement (ms)";
		refreshFrequencyInputWrapper.append(
			refreshFrequencyLabel,
			this.refreshFrequencyInput
		);

		this.showLatencyCheckbox.addEventListener("change", () => {
			this.setShowLatency();
			this.domainNameInput.disabled = !this.showLatencyCheckbox.checked;
			this.refreshFrequencyInput.disabled = !this.showLatencyCheckbox.checked;
		});
		this.domainNameInput.addEventListener("change", (e) => {
			const target = e.target as HTMLInputElement;
			this.setDomainName(target.value);
		});
		this.refreshFrequencyInput.addEventListener("change", (e) => {
			const target = e.target as HTMLInputElement;
			this.setRefreshFrequency(target.value);
		});

		formElement.append(
			showLatencyInputWrapper,
			domainNameInputWrapper,
			refreshFrequencyInputWrapper
		);

		return formElement;
	};

	private setShowLatency = () => {
		this.settings.showLatency = this.showLatencyCheckbox.checked;
		this.domainNameInput.disabled = this.settings.showLatency;
		this.refreshFrequencyInput.disabled = this.settings.showLatency;
	};

	private setDomainName = (name: string) => {
		this.settings.domainName = name;
	};

	private setRefreshFrequency = (time: string) => {
		this.settings.refreshFrequency = parseInt(time);
	};
	public applySettings = () => {
		const storedSettings = JSON.parse(
			localStorage.getItem("settings") as string
		);

		const newSettings: ISettings = {
			...storedSettings,
			latency: this.settings,
		};
		localStorage.setItem("settings", JSON.stringify(newSettings));
		const event = new CustomEvent("latencySettingsUpdated", {
			detail: { settings: this.settings },
		});
		window.dispatchEvent(event);
	};
}
