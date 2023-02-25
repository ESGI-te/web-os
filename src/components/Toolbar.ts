export default class Toolbar {
	private toolbarElement: HTMLElement;

	constructor() {
		this.toolbarElement = document.createElement("div");
		this.toolbarElement.classList.add("toolbar");

		this.updateTime();
		setInterval(() => {
			this.updateTime();
		}, 1000);

		document.body.appendChild(this.toolbarElement);
	}

	public getElement(): HTMLElement {
		return this.toolbarElement;
	}

	private updateTime() {
		const date = new Date();
		const time = date.toLocaleTimeString();
		const dateStr = date.toLocaleDateString();
		this.toolbarElement.innerHTML = `
        <span class="toolbar-time">${time}</span>
        <span class="toolbar-date">${dateStr}</span>
      `;
	}
}
