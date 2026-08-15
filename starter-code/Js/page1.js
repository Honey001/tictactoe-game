const STORAGE_KEY = "tic-tac-toe-selection";

const markButtons = document.querySelectorAll(
	".inner-player-opinion-btn-container .X-button, .inner-player-opinion-btn-container .O-button"
);
const modeButtons = document.querySelectorAll(
	".new-game-selection-option-container button"
);

function saveSelection(selection) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
}

function loadSelection() {
	const savedSelection = localStorage.getItem(STORAGE_KEY);

	if (!savedSelection) {
		return { mark: "O", mode: "cpu" };
	}

	try {
		return JSON.parse(savedSelection);
	} catch (error) {
		return { mark: "O", mode: "cpu" };
	}
}

function updateMarkSelection(mark) {
	markButtons.forEach((button) => {
		const isSelected =
			(mark === "X" && button.classList.contains("X-button")) ||
			(mark === "O" && button.classList.contains("O-button"));

		button.classList.toggle("is-selected", isSelected);
		button.setAttribute("aria-pressed", String(isSelected));
	});
}

function selectMark(mark) {
	const nextSelection = { ...loadSelection(), mark };
	saveSelection(nextSelection);
	updateMarkSelection(mark);
}

function selectMode(mode) {
	const nextSelection = { ...loadSelection(), mode };
	saveSelection(nextSelection);
	window.location.href = "./starter-code/page2.htm";
}

function initPage1() {
	const savedSelection = loadSelection();
	updateMarkSelection(savedSelection.mark);

	markButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const mark = button.classList.contains("X-button") ? "X" : "O";
			selectMark(mark);
		});
	});

	modeButtons.forEach((button) => {
		button.addEventListener("click", (event) => {
			event.preventDefault();
			const mode = button.dataset.mode || "cpu";
			selectMode(mode);
		});
	});
}

document.addEventListener("DOMContentLoaded", initPage1);
