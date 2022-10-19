import { App, Window } from "./components";

window.addEventListener("load", App.init);
const $testContent = document.createElement("h2");
$testContent.textContent = "test window";
document
	.getElementById("test_window")
	?.addEventListener("click", () => Window.create($testContent));
