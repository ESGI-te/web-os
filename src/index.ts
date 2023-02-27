import Desktop from "./components/Desktop";
import SettingsManager from "./components/SettingsManager";
import "./styles/main.scss";
import Calculator from "./components/Calculator";

const desktop = new Desktop();

const windowContent1 = document.createElement("div");
windowContent1.textContent = "It works 1";

const settingsManager = new SettingsManager();

const calculator = new Calculator();

const windowContent2 = document.createElement("div");
windowContent2.textContent = "It works 2";

const windowContent3 = document.createElement("div");
windowContent3.textContent = "Calculatrice";



desktop.createWindow({
	title: "Paramètres",
	x: 50,
	y: 50,
	width: 600,
	height: 500,
	content: settingsManager.getElement(),
});
desktop.createWindow({
	title: "Window 2",
	x: 100,
	y: 100,
	width: 400,
	height: 250,
	content: windowContent2,
});

desktop.createWindow({
	title: "Calulator",
	x: 100,
	y: 100,
	width: 550,
	height: 620,
	content: calculator.createCalculator(),
});



