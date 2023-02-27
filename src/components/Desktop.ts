import Taskbar from "./Taskbar";
import Toolbar from "./Toolbar";
import Window, { WindowOptions } from "./Window";
import { IAppearanceSettings } from "./settings/AppearanceSettings";

export default class Desktop {
	private taskbar: Taskbar;
	private toolbar: Toolbar;
	private windows: Window[];
	private desktopElement: HTMLElement;
	private settings: IAppearanceSettings = {
		backgroundColor: "#FFFFFF",
		isDarkTheme: false,
	};

	constructor() {
		const storedSettings: string | null = localStorage.getItem("settings");
		if (storedSettings) {
			this.settings = JSON.parse(storedSettings).appearance;
		}

		this.toolbar = new Toolbar();
		this.windows = [];

		this.desktopElement = document.createElement("div");
		this.desktopElement.classList.add("desktop");
		this.desktopElement.style.backgroundColor = this.settings.backgroundColor;
		document.body.appendChild(this.desktopElement);

		this.taskbar = new Taskbar();

		window.addEventListener<any>(
			"appearanceSettingsUpdated",
			(event: CustomEvent) => {
				const updatedSettings = event.detail.settings;
				if (this.settings === updatedSettings) return;
				const { backgroundColor, isDarkTheme } = updatedSettings;
				this.setBackgroundColor(backgroundColor);
				this.setTheme(isDarkTheme);
			}
		);
	}

	public createWindow({
		title,
		x,
		y,
		width,
		height,
		content,
	}: WindowOptions): Window {
		const window = new Window({ title, x, y, width, height, content });
		this.windows.push(window);
		this.taskbar.addWindow(window);
		return window;
	}

	private setTheme = (isDarkTheme: boolean) => {
		if (this.settings.isDarkTheme === isDarkTheme) return;
		this.settings.isDarkTheme = isDarkTheme;
		isDarkTheme
			? document.body.classList.add("dark-theme")
			: document.body.classList.remove("dark-theme");
	};

	private setBackgroundColor = (backgroundColor: string) => {
		if (this.settings.backgroundColor === backgroundColor) return;
		this.desktopElement.style.backgroundColor = backgroundColor;
	};
}
