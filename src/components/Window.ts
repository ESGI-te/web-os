import { generateUUID } from "../helpers";

export interface WindowOptions {
	title: string;
	x: number;
	y: number;
	width: number;
	height: number;
	content: HTMLElement;
}

interface WindowInterface {
	isOpen(): boolean;
	getTitle(): string;
	getWindowElement(): HTMLElement;
	open(): void;
	close(): void;
	focus(): void;
}

class Window implements WindowInterface {
	private static activeWindow: Window | null = null;

	private windowElement: HTMLElement;
	private headerElement: HTMLElement;
	private bodyElement: HTMLElement;
	private closeButton: HTMLElement;
	private desktopElement: HTMLElement | null;
	private title: string;
	private id: string;

	private zIndex: number = 0;
	private x: number = 0;
	private y: number = 0;
	private isDragging: boolean = false;
	private dragStartX: number = 0;
	private dragStartY: number = 0;

	constructor({ title, x, y, width, height, content }: WindowOptions) {
		this.title = title;
		this.id = generateUUID();
		this.desktopElement = document.querySelector(".desktop");
		this.windowElement = document.createElement("div");
		this.windowElement.id = this.id;
		this.windowElement.style.zIndex = "0";
		this.windowElement.classList.add("window");
		this.windowElement.style.width = `${width}px`;
		this.windowElement.style.height = `${height}px`;
		this.windowElement.addEventListener("mousedown", () => {
			this.focus();
		});

		this.headerElement = document.createElement("div");
		this.headerElement.classList.add("window-header");
		this.headerElement.innerText = title;
		this.headerElement.addEventListener("mousedown", (e) => {
			if (e.button === 0) {
				this.isDragging = true;
				this.dragStartX = e.clientX;
				this.dragStartY = e.clientY;
			}
		});
		document.addEventListener("mousemove", (e) => {
			if (this.isDragging) {
				const dx = e.clientX - this.dragStartX;
				const dy = e.clientY - this.dragStartY;
				this.x += dx;
				this.y += dy;
				this.dragStartX = e.clientX;
				this.dragStartY = e.clientY;
				this.render();
			}
		});
		document.addEventListener("mouseup", () => {
			this.isDragging = false;
		});

		this.bodyElement = document.createElement("div");
		this.bodyElement.classList.add("window-body");

		this.bodyElement.appendChild(content);

		this.closeButton = document.createElement("button");
		this.closeButton.classList.add("window-close-button");
		this.closeButton.innerHTML = `
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g clip-path="url(#clip0_6_13431)">
			<path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#323232"/>
			</g>
			<defs>
			<clipPath id="clip0_6_13431">
			<rect width="20" height="20" fill="white"/>
			</clipPath>
			</defs>
			</svg>
		`;
		this.closeButton.addEventListener("click", () => {
			this.close();
		});

		this.headerElement.appendChild(this.closeButton);
		this.windowElement.appendChild(this.headerElement);
		this.windowElement.appendChild(this.bodyElement);

		this.x = x;
		this.y = y;
		this.render();
	}

	public open() {
		if (!this.desktopElement) return;
		this.desktopElement.appendChild(this.windowElement);
		this.focus();
	}

	public close() {
		if (!this.desktopElement) return;
		this.desktopElement.removeChild(this.windowElement);
		if (Window.activeWindow === this) {
			Window.activeWindow = null;
		}
	}

	public focus() {
		let maxZIndex = 0;
		const allWindows = document.getElementsByClassName("window");
		for (let i = 0; i < allWindows.length; i++) {
			const zIndex = parseInt((allWindows[i] as HTMLElement).style.zIndex);
			maxZIndex = Math.max(maxZIndex, zIndex);
		}

		if (Window.activeWindow !== this) {
			Window.activeWindow = this;
			this.zIndex = maxZIndex + 1;
		}

		this.windowElement.style.zIndex = `${this.zIndex}`;

		const event = new CustomEvent("windowFocus", {
			detail: { id: this.id },
		});
		window.dispatchEvent(event);
	}

	private render() {
		if (!this.desktopElement) return;

		const desktopWidth = this.desktopElement.offsetWidth;
		const desktopHeight = this.desktopElement.offsetHeight;

		const minX = 0;
		const minY = 20;
		const maxX = desktopWidth - parseInt(this.windowElement.style.width);
		const maxY = desktopHeight - parseInt(this.windowElement.style.height) + 20;

		if (this.x < minX) this.x = minX;
		if (this.x > maxX) this.x = maxX;
		if (this.y < minY) this.y = minY;
		if (this.y > maxY) this.y = maxY;

		this.windowElement.style.left = `${this.x}px`;
		this.windowElement.style.top = `${this.y}px`;
	}

	public isOpen(): boolean {
		return document.body.contains(this.windowElement);
	}

	public getTitle(): string {
		return this.title;
	}

	public getWindowElement() {
		return this.windowElement;
	}

	public getId() {
		return this.id;
	}
}

export default Window;
