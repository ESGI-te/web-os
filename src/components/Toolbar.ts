import { ISettings } from "./SettingsManager";

interface DisplayStatusBarSettings {
	showBattery?: boolean;
	showLatency?: boolean;
	showVibration?: boolean;
}
interface DisplayDateSettings {
	showDate?: boolean;
	showYear?: boolean;
	showMonth?: boolean;
	showDay?: boolean;
}

interface DisplayTimeSettings {
	showTime?: true;
	showHours?: boolean;
	showMinutes?: boolean;
	showSeconds?: boolean;
}

type DisplayDateTimeSettings = DisplayDateSettings & DisplayTimeSettings;

export default class Toolbar {
	private toolbarElement: HTMLElement;
	private toolbarStateElement: HTMLElement;
	private toolbarDateElement: HTMLElement;
	private statusBarSettings: DisplayStatusBarSettings = {
		showBattery: true,
		showLatency: true,
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
		showSeconds: true,
	};

	constructor() {
		this.toolbarElement = document.createElement("div");
		this.toolbarElement.classList.add("toolbar");
		this.toolbarStateElement = document.createElement("div");
		this.toolbarDateElement = document.createElement("div");

		this.toolbarDateElement.classList.add("dateTime");
		this.toolbarStateElement.classList.add("state");

		this.toolbarElement.append(
			this.toolbarDateElement,
			this.toolbarStateElement
		);
		const storedSettings: string | null = localStorage.getItem("settings");
		if (storedSettings) {
			const settings: ISettings = JSON.parse(storedSettings);
			this.statusBarSettings = {
				showBattery: settings.battery.showBattery,
				showLatency: settings.latency.showLatency,
				showVibration: settings.vibration.showVibration,
			};
		}

		this.updateDateTime();
		this.updateStatusBar();
		setInterval(() => {
			this.updateDateTime();
		}, 1000);

		setInterval(() => {
			this.updateStatusBar();
		}, 60000);

		this.attachEventListeners();

		document.body.appendChild(this.toolbarElement);
	}

	private attachEventListeners = () => {
		window.addEventListener<any>(
			"batterySettingsUpdated",
			(event: CustomEvent) => {
				const updatedSettings = event.detail.settings;
				this.statusBarSettings = {
					...this.statusBarSettings,
					showBattery: updatedSettings.showBattery,
				};
				this.updateStatusBar();
			}
		);
		window.addEventListener<any>(
			"vibrationSettingsUpdated",
			(event: CustomEvent) => {
				const updatedSettings = event.detail.settings;
				if (
					this.statusBarSettings.showVibration === updatedSettings.showVibration
				)
					return;
				this.statusBarSettings = {
					...this.statusBarSettings,
					showVibration: updatedSettings.showVibration,
				};
				this.updateStatusBar();
			}
		);
		window.addEventListener<any>(
			"latencySettingsUpdated",
			(event: CustomEvent) => {
				const updatedSettings = event.detail.settings;
				if (this.statusBarSettings.showLatency === updatedSettings.showLatency)
					return;
				this.statusBarSettings = {
					...this.statusBarSettings,
					showLatency: updatedSettings.showLatency,
				};
				this.updateStatusBar();
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
			this.statusBarSettings = {
				showLatency: updatedSettings.latency.showLatency,
				showVibration: updatedSettings.vibration.showVibration,
				showBattery: updatedSettings.battery.showBattery,
			};
			if (updatedSettings.dateTime !== this.dateTimeSettings) {
				this.dateTimeSettings = updatedSettings.dateTime;
				this.updateDateTime();
			}

			this.updateStatusBar();
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
			? date.toLocaleDateString("fr-FR", { day: "2-digit" })
			: "";
		const month = settings.showMonth
			? date.toLocaleDateString("fr-FR", { month: "2-digit" })
			: "";
		const year = settings.showYear
			? date.toLocaleDateString("fr-FR", { year: "2-digit" })
			: "";
		const separator = day && (month || year) ? " / " : "";
		return settings.showDate
			? `${day}${separator}${month}${separator}${year}`
			: "";
	};

	private formatTime = (date: Date, settings: DisplayTimeSettings): string => {
		const hours = settings.showHours
			? date.getHours().toString().padStart(2, "0")
			: "";
		const minutes = settings.showMinutes
			? date.getMinutes().toString().padStart(2, "0")
			: "";
		const seconds = settings.showSeconds
			? date.getSeconds().toString().padStart(2, "0")
			: "";
		const separator = hours && (minutes || seconds) ? " : " : "";
		return settings.showTime
			? `${hours}${separator}${minutes}${separator}${seconds}`
			: "";
	};

	private updateStatusBar = async () => {
		const { showBattery, showLatency, showVibration } = this.statusBarSettings;
		const isVibrating = navigator.vibrate ? navigator.vibrate(0) : false;
		const latency = this.getLatency();
		const battery = await this.getBattery();
		const batteryLevel = Math.floor(battery.level * 100);

		this.toolbarStateElement.innerHTML = `
        <span class="toolbar-vibration">${
					showVibration ? (isVibrating ? "📳 Actif" : "📳 Inactif") : ""
				}</span>
        <span class="toolbar-battery">${
					showBattery ? `🔋 ${batteryLevel}%` : ""
				}</span>
        <span class="toolbar-latency">${
					showLatency ? `📶 ${latency}ms` : ""
				}</span>`;
	};

	private getLatency = () => {
		let latency = 0;

		const observer = new PerformanceObserver((list) => {
			const entries = list.getEntries() as PerformanceNavigationTiming[];
			for (const entry of entries) {
				if (entry.name === "navigation") {
					latency = entry.responseEnd - entry.requestStart;
				}
			}
		});

		observer.observe({ type: "navigation", buffered: true });

		return latency;
	};

	getBattery = async () => {
		try {
			return await navigator.getBattery();
		} catch (error) {
			console.log(error);
		}
	};
}
