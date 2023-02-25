import Desktop from "./components/Desktop";
import "./styles/index.scss";

const desktop = new Desktop();

const windowContent1 = document.createElement("div");
windowContent1.textContent = "It works 1";

const windowContent2 = document.createElement("div");
windowContent2.textContent = "It works 2";

desktop.createWindow({
	title: "Window 1",
	x: 50,
	y: 50,
	width: 300,
	height: 200,
	content: windowContent1,
});
desktop.createWindow({
	title: "Window 2",
	x: 100,
	y: 100,
	width: 400,
	height: 250,
	content: windowContent2,
});
