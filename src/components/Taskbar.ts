import Window from "./Window";

export default class Taskbar {
	private taskbarElement: HTMLElement;
	private windows: Window[];

	constructor() {
		this.taskbarElement = document.createElement("div");
		this.taskbarElement.classList.add("taskbar");

		this.windows = [];

		document.body.appendChild(this.taskbarElement);
	}

	public addWindow(window: Window) {
		const button = document.createElement("button");
		button.classList.add("taskbar-item");
		button.innerText = window.getTitle();

		button.addEventListener("click", () => {
			if (window.isOpen()) {
				window.close();
			} else {
				window.open();
			}
		});

		this.taskbarElement.appendChild(button);
		this.windows.push(window);
	}
}
