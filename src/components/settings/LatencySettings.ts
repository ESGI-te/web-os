interface Settings {
	isLatencyStateDisplay: boolean;
	domainName: string;
	refreshFrequency: number;
}

export default class LatencySettings {
	settings: Settings;
	domainNameInput: HTMLInputElement;
	refreshFrequencyInput: HTMLInputElement;

	constructor() {
		const storedSettings: string | null = localStorage.getItem("latency");
		this.settings = storedSettings
			? JSON.parse(storedSettings)
			: {
					isLatencyStateDisplay: true,
					domainName: "",
			  };
	}

	public getSettings() {
		return this.settings;
	}

	public createFormElement() {
		const formElement = document.createElement("form");
		formElement.classList.add("settings__form", "settings__form--latency");

		// Checkbox to show/hide latency state
		const isLatencyStateDisplayInputWrapper = document.createElement("div");
		isLatencyStateDisplayInputWrapper.classList.add("inputGroup");
		const isLatencyStateDisplayCheckbox = document.createElement("input");
		isLatencyStateDisplayCheckbox.type = "checkbox";
		isLatencyStateDisplayCheckbox.id = "isLatencyStateDisplay";
		isLatencyStateDisplayCheckbox.checked =
			!this.settings.isLatencyStateDisplay;
		const isLatencyStateDisplayLabel = document.createElement("label");
		isLatencyStateDisplayLabel.htmlFor = "isLatencyStateDisplay";
		isLatencyStateDisplayLabel.textContent = "Afficher la latence réseau";
		isLatencyStateDisplayInputWrapper.append(
			isLatencyStateDisplayCheckbox,
			isLatencyStateDisplayLabel
		);

		// Domain name input
		const domainNameInputWrapper = document.createElement("div");
		domainNameInputWrapper.classList.add("inputGroup");
		this.domainNameInput = document.createElement("input");
		this.domainNameInput.type = "text";
		this.domainNameInput.id = "domainName";
		this.domainNameInput.disabled = this.settings.isLatencyStateDisplay;
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
		this.refreshFrequencyInput.disabled = this.settings.isLatencyStateDisplay;
		const refreshFrequencyLabel = document.createElement("label");
		refreshFrequencyLabel.htmlFor = "refreshFrequency";
		refreshFrequencyLabel.textContent = "Délai de rafraichissement (ms)";
		refreshFrequencyInputWrapper.append(
			refreshFrequencyLabel,
			this.refreshFrequencyInput
		);

		isLatencyStateDisplayCheckbox.addEventListener("change", () => {
			this.setVibrationStateDisplay();
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
			isLatencyStateDisplayInputWrapper,
			domainNameInputWrapper,
			refreshFrequencyInputWrapper
		);

		return formElement;
	}

	private setVibrationStateDisplay() {
		this.settings.isLatencyStateDisplay = !this.settings.isLatencyStateDisplay;
		this.domainNameInput.disabled = this.settings.isLatencyStateDisplay;
		this.refreshFrequencyInput.disabled = this.settings.isLatencyStateDisplay;
	}

	private setDomainName(name: string) {
		this.settings.domainName = name;
	}

	private setRefreshFrequency(time: string) {
		this.settings.refreshFrequency = parseInt(time);
	}
}
