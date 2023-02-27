import Window from "./Window";

export default class Taskbar {
	private taskbarElement: HTMLElement;
	private windows: Window[];

	constructor() {
		this.taskbarElement = document.createElement("div");
		this.taskbarElement.classList.add("taskbar");

		this.windows = [];

		document.body.appendChild(this.taskbarElement);

		window.addEventListener<any>("windowFocus", (event: CustomEvent) =>
			this.setWindowActive(event.detail.id)
		);
	}

	public addWindow(window: Window) {
		const button = document.createElement("button");
		button.classList.add("taskbar-item");
		button.id = window.getId();
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

	private setWindowActive = (id: string) => {
		this.windows.forEach((window) => {
			if (window.getId() === id) {
				document
					.querySelectorAll(".taskbar-item")
					.forEach((w) => w.classList.remove("active"));
				document.querySelector(`.taskbar-item#${id}`)?.classList.add("active");
			}
		});
	};
}
