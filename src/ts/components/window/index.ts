import { getUUID } from "../../utils/getUUID";

const $DESKTOP_CONTAINER = document.getElementById("app_main");

function create($windowContent: HTMLElement) {
	const id = getUUID();
	const $windowContainer = document.createElement("div");
	const $header = document.createElement("header");
	const $content = document.createElement("main");
	const $buttonContainer = document.createElement("div");
	const $closeButton = document.createElement("button");
	const $minimizeButton = document.createElement("button");
	const $enlargeButton = document.createElement("button");

	$windowContainer.id = "window_" + id;

	$windowContainer.className = "window";
	$header.className = "window__header";
	$content.className = "window__content";
	$buttonContainer.className = "window__header_buttons";

	$closeButton.textContent = "x";

	$closeButton.addEventListener("click", () => close(id));

	$buttonContainer.append($minimizeButton, $enlargeButton, $closeButton);
	$header.append($buttonContainer);
	$content.append($windowContent);
	$windowContainer.append($header, $content);
	$DESKTOP_CONTAINER?.append($windowContainer);

	return $windowContainer;
}

function close(id: string) {
	const window = document.getElementById(`window_${id}`);
	window?.remove();
}

export { create };
