import Desktop from "./components/Desktop";
import SettingsManager from "./components/SettingsManager";
import "./styles/main.scss";
import Calculator from "./components/Calculator";
import TicTacToeGame from "./components/TicTacToe";

const desktop = new Desktop();
const ticTacToeGame = new TicTacToeGame();

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
	x: 0,
	y: 100,
<<<<<<< HEAD
	width: 550,
	height: 620,
=======
	width: 400,
	height: 600,
>>>>>>> 8a417da9b21cbdf9744fe94356e21e8e2e57e75d
	content: calculator.createCalculator(),
});
desktop.createWindow({
	title: "Tic Tac Toe",
	x: 50,
	y: 50,
<<<<<<< HEAD
	width: 325,
=======
	width: 320,
>>>>>>> 8a417da9b21cbdf9744fe94356e21e8e2e57e75d
	height: 430,
	content: ticTacToeGame.getElement(),
});
	
