import { ISettings } from "./SettingsManager";

interface DisplayDateSettings {
	showDate?: boolean;
	showYear?: boolean;
	showMonth?: boolean;
	showDay?: boolean;
}

interface DisplayTimeSettings {
	showTime?: boolean;
	showHours?: boolean;
	showMinutes?: boolean;
	showSeconds?: boolean;
}

type DisplayDateTimeSettings = DisplayDateSettings & DisplayTimeSettings;

export default class Toolbar {
	private toolbarElement: HTMLElement;
	private vibrationStatusElement: HTMLElement;
	private batteryStatusElement: HTMLElement;
	private latencyStatusElement: HTMLElement;
	private toolbarDateElement: HTMLElement;
	private batterySettings = {
		showBattery: true,
	};
	private vibrationSettings = {
		showVibration: true,
	};
	private dateTimeSettings: DisplayDateTimeSettings = {
		showDate: true,
		showYear: true,
		showMonth: true,
		showDay: true,
		showTime: true,
		showHours: true,
		showMinutes: true,
		showSeconds: false,
	};
	private latencySettings = {
		showLatency: true,
		domainName: "https://pokeapi.co/api/v2/pokemon/charizard",
		refreshFrequency: 10000,
	};
	constructor() {
		this.toolbarElement = document.createElement("div");
		this.toolbarElement.classList.add("toolbar");
		this.toolbarDateElement = document.createElement("div");
		this.toolbarDateElement.classList.add("dateTime");
		const statusBarElement = this.createStatusBar();
		this.toolbarElement.append(this.toolbarDateElement, statusBarElement);
		const storedSettings: string | null = localStorage.getItem("settings");
		if (storedSettings) {
			const settings = JSON.parse(storedSettings);
			this.setSettings(settings);
		}

		this.updateDateTime();
		this.updateBatteryStatus();
		this.updateLatencyStatus();

		setInterval(() => {
			this.updateDateTime();
		}, 1000);

		setInterval(() => {
			this.updateLatencyStatus();
		}, this.latencySettings.refreshFrequency);

		setInterval(() => {
			this.updateBatteryStatus();
			this.updateVibrationStatus();
		}, 60000);

		this.attachEventListeners();

		document.body.appendChild(this.toolbarElement);
	}

	private attachEventListeners = () => {
		window.addEventListener<any>(
			"batterySettingsUpdated",
			(event: CustomEvent) => {
				const updatedSettings = event.detail.settings;
				if (this.batterySettings.showBattery === updatedSettings.showBattery)
					return;
				this.batterySettings = {
					showBattery: updatedSettings.showBattery,
				};
				this.updateBatteryStatus();
			}
		);
		window.addEventListener<any>(
			"vibrationSettingsUpdated",
			(event: CustomEvent) => {
				const updatedSettings = event.detail.settings;
				if (
					this.vibrationSettings.showVibration === updatedSettings.showVibration
				)
					return;
				this.vibrationSettings = {
					showVibration: updatedSettings.showVibration,
				};
				this.updateVibrationStatus();
			}
		);
		window.addEventListener<any>(
			"latencySettingsUpdated",
			(event: CustomEvent) => {
				const updatedSettings = event.detail.settings;
				if (this.latencySettings === updatedSettings.showLatency) return;
				this.latencySettings = updatedSettings;
				this.updateLatencyStatus();
			}
		);
		window.addEventListener<any>(
			"dateTimeSettingsUpdated",
			(event: CustomEvent) => {
				const updatedSettings: DisplayDateTimeSettings = event.detail.settings;
				if (this.dateTimeSettings === updatedSettings) return;
				this.dateTimeSettings = updatedSettings;
				this.updateDateTime();
			}
		);
		window.addEventListener<any>("settingsUpdated", (event: CustomEvent) => {
			const updatedSettings = event.detail.settings;
			if (!updatedSettings) return;
			this.setSettings(updatedSettings);
			this.updateDateTime();
			this.updateBatteryStatus();
			this.updateVibrationStatus();
			this.updateLatencyStatus();
		});
	};

	public getElement = (): HTMLElement => {
		return this.toolbarElement;
	};

	private updateDateTime = () => {
		const date = new Date();

		const dateSettings = {
			showDate: this.dateTimeSettings.showDate,
			showYear: this.dateTimeSettings.showYear,
			showMonth: this.dateTimeSettings.showMonth,
			showDay: this.dateTimeSettings.showDay,
		};

		const timeSettings = {
			showTime: this.dateTimeSettings.showTime,
			showHours: this.dateTimeSettings.showHours,
			showMinutes: this.dateTimeSettings.showMinutes,
			showSeconds: this.dateTimeSettings.showSeconds,
		};

		const dateStr = this.formatDate(date, dateSettings);
		const timeStr = this.formatTime(date, timeSettings);

		this.toolbarDateElement.innerHTML = `
      <span class="toolbar-date">${dateStr}</span>
      <span class="toolbar-time">${timeStr}</span>
    `;
	};

	private formatDate = (date: Date, settings: DisplayDateSettings): string => {
		const day = settings.showDay
			? date.toLocaleDateString("fr-FR", { day: "2-digit" }) + " / "
			: "";
		const month = settings.showMonth
			? date.toLocaleDateString("fr-FR", { month: "2-digit" }) + " / "
			: "";
		const year = settings.showYear
			? date.toLocaleDateString("fr-FR", { year: "2-digit" })
			: "";
		// const separator = day || month ? " / " : "";
		return settings.showDate ? `${day}${month}${year}` : "";
	};

	private formatTime = (date: Date, settings: DisplayTimeSettings): string => {
		const hours = settings.showHours
			? date.getHours().toString().padStart(2, "0") + " : "
			: "";
		const minutes = settings.showMinutes
			? date.getMinutes().toString().padStart(2, "0") + " : "
			: "";
		const seconds = settings.showSeconds
			? date.getSeconds().toString().padStart(2, "0")
			: "";
		return settings.showTime ? `${hours}${minutes}${seconds}` : "";
	};

	private createStatusBar = () => {
		const statusBarElement = document.createElement("div");
		statusBarElement.classList.add("status");

		this.vibrationStatusElement = document.createElement("span");
		this.vibrationStatusElement.textContent = this.getVibrationStatus();

		this.batteryStatusElement = document.createElement("span");
		this.batteryStatusElement.textContent = "🔋 unknown";

		this.latencyStatusElement = document.createElement("span");
		this.latencyStatusElement.textContent = "📶 0ms";

		statusBarElement.append(
			this.vibrationStatusElement,
			this.batteryStatusElement,
			this.latencyStatusElement
		);

		return statusBarElement;
	};

	private updateLatencyStatus = async () => {
		if (!this.latencySettings.showLatency) {
			this.latencyStatusElement.style.display = "none";
			return;
		}
		this.latencyStatusElement.style.display = "block";
		this.latencyStatusElement.textContent = await this.getLatencyStatus();
	};

	private updateBatteryStatus = async () => {
		if (!this.batterySettings.showBattery) {
			this.batteryStatusElement.style.display = "none";
			return;
		}
		this.batteryStatusElement.style.display = "block";
		this.batteryStatusElement.textContent = await this.getBatteryStatus();
	};

	private updateVibrationStatus() {
		if (!this.vibrationSettings.showVibration) {
			this.vibrationStatusElement.style.display = "none";
			return;
		}
		this.vibrationStatusElement.style.display = "block";
		this.vibrationStatusElement.textContent = this.getVibrationStatus();
	}

	private getLatencyStatus = async (): Promise<string> => {
		let frequency = 0;
		const startTime = Date.now();
		await fetch(this.latencySettings.domainName);
		frequency = Date.now() - startTime;

		return `📶 ${frequency}ms`;
	};

	private getVibrationStatus = (): string => {
		const isVibrating = navigator.vibrate ? navigator.vibrate(0) : false;
		return isVibrating ? "📳 Actif" : "📳 Inactif";
	};

	private getBatteryStatus = async () => {
		let batteryLevel = "";
		try {
			const battery = await navigator.getBattery();
			batteryLevel = `🔋 ${Math.floor(battery.level * 100)}%`;
		} catch (error) {
			console.log(error);
		}
		return batteryLevel;
	};

	private setSettings = (settings: ISettings) => {
		const { battery, latency, vibration, dateTime } = settings;

		this.batterySettings = {
			showBattery: battery.showBattery,
		};
		this.vibrationSettings = {
			showVibration: vibration.showVibration,
		};
		this.latencySettings = {
			showLatency: latency.showLatency,
			domainName: latency.domainName,
			refreshFrequency: latency.refreshFrequency,
		};
		this.dateTimeSettings = {
			showDate: dateTime.showDate,
			showYear: dateTime.showYear,
			showMonth: dateTime.showMonth,
			showDay: dateTime.showDay,
			showTime: dateTime.showTime,
			showHours: dateTime.showHours,
			showMinutes: dateTime.showMinutes,
			showSeconds: dateTime.showSeconds,
		};
	};
}
