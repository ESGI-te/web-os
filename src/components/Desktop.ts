import Taskbar from "./Taskbar";
import Toolbar from "./Toolbar";
import Window, { WindowOptions } from "./Window";

export default class Desktop {
	private taskbar: Taskbar;
	private toolbar: Toolbar;
	private windows: Window[];
	private desktopElement: HTMLElement;

	constructor() {
		this.toolbar = new Toolbar();
		this.windows = [];

		this.desktopElement = document.createElement("div");
		this.desktopElement.classList.add("desktop");
		document.body.appendChild(this.desktopElement);

		this.taskbar = new Taskbar();
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
}
