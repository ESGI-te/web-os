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

const icons = {
	battery: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	<g clip-path="url(#clip0_6_9120)">
	<path d="M15.67 4H14V2H10V4H8.33C7.6 4 7 4.6 7 5.33V20.66C7 21.4 7.6 22 8.33 22H15.66C16.4 22 17 21.4 17 20.67V5.33C17 4.6 16.4 4 15.67 4Z" fill="#323232"/>
	</g>
	<defs>
	<clipPath id="clip0_6_9120">
	<rect width="24" height="24" fill="white"/>
	</clipPath>
	</defs>
	</svg>`,
	latency: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	<g clip-path="url(#clip0_6_13693)">
	<path d="M15.9 4.99999C15.73 4.99999 15.58 5.08999 15.49 5.22999L15.42 5.37999L10.24 17.03C10.08 17.32 9.98 17.64 9.98 17.99C9.98 19.1 10.88 20 11.99 20C12.95 20 13.76 19.32 13.95 18.41L13.96 18.38L16.4 5.49999C16.4 5.21999 16.18 4.99999 15.9 4.99999ZM1 8.99999L3 11C5.88 8.11999 9.79 6.91999 13.53 7.37999L14.72 4.69999C9.89 3.83999 4.74 5.26999 1 8.99999ZM21 11L23 8.99999C21.36 7.35999 19.45 6.17999 17.41 5.42999L16.88 8.24999C18.38 8.86999 19.78 9.77999 21 11ZM17 15L19 13C18.2 12.2 17.3 11.58 16.34 11.11L15.79 14.03C16.21 14.3 16.62 14.62 17 15ZM5 13L7 15C8.13 13.87 9.56 13.21 11.03 13L12.31 10.12C9.68 10.04 7.01 10.99 5 13Z" fill="#323232"/>
	</g>
	<defs>
	<clipPath id="clip0_6_13693">
	<rect width="24" height="24" fill="white"/>
	</clipPath>
	</defs>
	</svg>
	`,
	vibration: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	<g clip-path="url(#clip0_6_13657)">
	<path d="M0 15H2V9H0V15ZM3 17H5V7H3V17ZM22 9V15H24V9H22ZM19 17H21V7H19V17ZM16.5 3H7.5C6.67 3 6 3.67 6 4.5V19.5C6 20.33 6.67 21 7.5 21H16.5C17.33 21 18 20.33 18 19.5V4.5C18 3.67 17.33 3 16.5 3ZM16 19H8V5H16V19Z" fill="#323232"/>
	</g>
	<defs>
	<clipPath id="clip0_6_13657">
	<rect width="24" height="24" fill="white"/>
	</clipPath>
	</defs>
	</svg>
	
	`,
};

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

		this.vibrationStatusElement = document.createElement("div");
		this.vibrationStatusElement.innerHTML = `
			${icons.vibration}
			<span>${this.getVibrationStatus()}</span>
		`;

		this.batteryStatusElement = document.createElement("div");
		this.batteryStatusElement.innerHTML = `
			${icons.battery} 
			<span>unknown</span>
		`;
		this.latencyStatusElement = document.createElement("div");
		this.latencyStatusElement.innerHTML = `
			${icons.latency}
			<span>0ms</span>
		`;

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
		this.latencyStatusElement.style.display = "flex";
		const latencyStatus = await this.getLatencyStatus();
		this.latencyStatusElement.innerHTML = `
			${icons.latency}
			<span>${latencyStatus}ms</span>
		`;
	};

	private updateBatteryStatus = async () => {
		if (!this.batterySettings.showBattery) {
			this.batteryStatusElement.style.display = "none";
			return;
		}
		const batteryStatus = await this.getBatteryStatus();
		this.batteryStatusElement.style.display = "flex";
		this.batteryStatusElement.innerHTML = `
			${icons.battery}
			<span>${batteryStatus}</span>
		`;
	};

	private updateVibrationStatus() {
		if (!this.vibrationSettings.showVibration) {
			this.vibrationStatusElement.style.display = "none";
			return;
		}
		this.vibrationStatusElement.style.display = "flex";
		this.vibrationStatusElement.innerHTML = `
		${icons.vibration}
		<span>${this.getVibrationStatus()}</span>
	`;
	}

	private getLatencyStatus = async (): Promise<number> => {
		let frequency = 0;
		const startTime = Date.now();
		await fetch(this.latencySettings.domainName);
		frequency = Date.now() - startTime;

		return frequency;
	};

	private getVibrationStatus = (): string => {
		const isVibrating = navigator.vibrate ? navigator.vibrate(0) : false;
		return isVibrating ? "Actif" : "Inactif";
	};

	private getBatteryStatus = async () => {
		let batteryLevel = "";
		try {
			const battery = await navigator.getBattery();
			batteryLevel = `${Math.floor(battery.level * 100)}%`;
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
