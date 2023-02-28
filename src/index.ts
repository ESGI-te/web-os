import Desktop from "./components/Desktop";
import SettingsManager from "./components/SettingsManager";
import "./styles/main.scss";
import Calculator from "./components/Calculator";
import TicTacToeGame from "./components/TicTacToe";

const desktop = new Desktop();
const ticTacToeGame = new TicTacToeGame();

const settingsManager = new SettingsManager();

const calculator = new Calculator();

desktop.createWindow({
	title: "Paramètres",
	x: 50,
	y: 50,
	width: 600,
	height: 500,
	content: settingsManager.getElement(),
});

desktop.createWindow({
	title: "Calulator",
	x: 0,
	y: 100,
	width: 400,
	height: 600,
	content: calculator.createCalculator(),
});

desktop.createWindow({
	title: "Tic Tac Toe",
	x: 50,
	y: 50,
	width: 320,
	height: 430,
	content: ticTacToeGame.getElement(),
});
