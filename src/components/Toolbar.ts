export default class Toolbar {
	private toolbarElement: HTMLElement;
	private toolbarStateElement: HTMLElement;
	private toolbarDateElement: HTMLElement;

	constructor() {
		this.toolbarElement = document.createElement("div");
		this.toolbarElement.classList.add("toolbar");
		this.toolbarStateElement = document.createElement("div");
		this.toolbarDateElement = document.createElement("div");

		this.toolbarDateElement.classList.add("date");
		this.toolbarStateElement.classList.add("state");

		this.toolbarElement.append(
			this.toolbarDateElement,
			this.toolbarStateElement
		);
		setInterval(() => {
			this.updateTime();
			this.updateState();
		}, 1000);

		document.body.appendChild(this.toolbarElement);
	}

	public getElement(): HTMLElement {
		return this.toolbarElement;
	}

	private updateTime() {
		const date = new Date();
		const options = {
			day: "2-digit",
			month: "2-digit",
			year: "2-digit",
		};
		const dateStr = date.toLocaleDateString("fr-FR", options);
		const time = date.toLocaleTimeString("fr-FR", {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
		});

		this.toolbarDateElement.innerHTML = `
            <span class="toolbar-date">${dateStr}</span>
            <span class="toolbar-time">${time}</span>
        `;
	}

	private async updateState() {
		const isVibrating = navigator.vibrate ? navigator.vibrate(0) : false;
		const latency = this.getLatency();
		const battery = await this.getBattery();
		const batteryLevel = Math.floor(battery.level * 100);

		this.toolbarStateElement.innerHTML = `
        <span class="toolbar-vibration">${
					isVibrating ? "📳 Actif" : "📳 Inactif"
				}</span>
        <span class="toolbar-battery">🔋 ${batteryLevel ?? "unknown"}%</span>
        <span class="toolbar-latency">📶 ${latency}ms</span>`;
	}

	private getLatency() {
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
	}

	async getBattery() {
		try {
			return await navigator.getBattery();
		} catch (error) {
			console.log(error);
		}
	}
}
