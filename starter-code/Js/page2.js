const STORAGE_KEY = "tic-tac-toe-selection";
const CPU_DELAY = 400;
const CPU_BLOCK_CHANCE = 0.5;

const ICONS = {
	X: {
		outline:
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M51.12 1.269c.511 0 1.023.195 1.414.586l9.611 9.611c.391.391.586.903.586 1.415s-.195 1.023-.586 1.414L44.441 32l17.704 17.705c.391.39.586.902.586 1.414 0 .512-.195 1.024-.586 1.415l-9.611 9.611c-.391.391-.903.586-1.415.586a1.994 1.994 0 0 1-1.414-.586L32 44.441 14.295 62.145c-.39.391-.902.586-1.414.586a1.994 1.994 0 0 1-1.415-.586l-9.611-9.611a1.994 1.994 0 0 1-.586-1.415c0-.512.195-1.023.586-1.414L19.559 32 1.855 14.295a1.994 1.994 0 0 1-.586-1.414c0-.512.195-1.024.586-1.415l9.611-9.611c.391-.391.903-.586 1.415-.586s1.023.195 1.414.586L32 19.559 49.705 1.855c.39-.391.902-.586 1.414-.586Z" stroke="#31C3BD" stroke-width="2" fill="none"/></svg>',
		filled: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z" fill="#31C3BD" fill-rule="evenodd"/></svg>',
		path: "M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z",
		color: "#31C3BD",
		viewBox: "0 0 64 64",
	},
	O: {
		outline:
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 66"><path d="M33 1c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C15.327 65 1 50.673 1 33 1 15.327 15.327 1 33 1Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z" stroke="#F2B137" stroke-width="2" fill="none"/></svg>',
		filled: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z" fill="#F2B137"/></svg>',
		path: "M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z",
		color: "#F2B137",
		viewBox: "0 0 64 64",
	},
};

const cells = Array.from(
	document.querySelectorAll(".tictactoe-player-box.cell")
);

const state = {
	selection: { mark: "O", mode: "cpu" },
	currentMark: "X",
	isPlayerTurn: true,
	gameOver: false,
	scores: { X: 0, O: 0, ties: 0 },
};

const WINNING_COMBINATIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

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

function getEmptyCells() {
	return cells.filter((cell) => !cell.dataset.mark);
}

function getOppositeMark(mark) {
	return mark === "X" ? "O" : "X";
}

function getWinner() {
	for (const combo of WINNING_COMBINATIONS) {
		const [a, b, c] = combo;
		const mark = cells[a].dataset.mark;

		if (
			mark &&
			mark === cells[b].dataset.mark &&
			mark === cells[c].dataset.mark
		) {
			return { mark, combo };
		}
	}

	return null;
}

function updateScoreboard() {
	const records = document.querySelectorAll(".number-of-game-won");
	records[0].textContent = state.scores.X;
	records[1].textContent = state.scores.ties;
	records[2].textContent = state.scores.O;
}

function recordResult(mark) {
	if (mark) {
		state.scores[mark] += 1;
	} else {
		state.scores.ties += 1;
	}
	updateScoreboard();
}

function highlightWinningCells({ mark, combo }) {
	combo.forEach((index) => {
		const cell = cells[index];
		cell.style.backgroundColor = ICONS[mark].color;
		const path = cell.querySelector("svg path");
		if (path) {
			path.style.fill = "var(--slate-900)";
		}
	});
}

function showWinnerOverlay(winnerMark) {
	const winnerContainer = document.querySelector(".winner-container");
	const winnerCommentContainer = document.querySelector(
		".winner-comment-container"
	);
	const winnerComment = document.querySelector(".winner-comment");
	const roundImg = document.querySelector(".round-container img");
	const roundText = document.querySelector(".round-text");

	const playerWon = winnerMark === state.selection.mark;

	if (state.selection.mode === "cpu") {
		winnerComment.textContent = playerWon
			? "you won!"
			: "oh no, you lost...";
	} else {
		winnerComment.textContent = playerWon
			? "player1 wins!"
			: "player2 wins!";
	}

	roundImg.src = `./assets/icon-${winnerMark.toLowerCase()}.svg`;
	roundImg.alt = `winner-icon-${winnerMark.toLowerCase()}`;
	roundText.style.color = ICONS[winnerMark].color;

	winnerContainer.style.display = "flex";
	winnerCommentContainer.style.display = "flex";
}

function showTiedOverlay() {
	document.querySelector(".winner-container").style.display = "flex";
	document.querySelector(".round-tied-comment-container").style.display =
		"flex";
}

function checkGameEnd() {
	const result = getWinner();

	if (result) {
		state.gameOver = true;
		recordResult(result.mark);
		highlightWinningCells(result);
		showWinnerOverlay(result.mark);
		return true;
	}

	if (getEmptyCells().length === 0) {
		state.gameOver = true;
		recordResult(null);
		showTiedOverlay();
		return true;
	}

	return false;
}

function updateTurnIndicator() {
	const svg = document.querySelector(".inner-next-player-icon-container svg");
	const { path } = ICONS[state.currentMark];
	svg.setAttribute("viewBox", ICONS[state.currentMark].viewBox);
	svg.innerHTML = `<path d="${path}" />`;
	svg.querySelector("path").style.fill = "var(--slate-300)";
}

function advanceTurn() {
	state.currentMark = getOppositeMark(state.currentMark);
	updateTurnIndicator();
}

function clearBoard() {
	cells.forEach((cell) => {
		delete cell.dataset.mark;
		cell.innerHTML = "";
		cell.style.backgroundColor = "";
	});
	document.querySelector(".winner-container").style.display = "none";
	document.querySelector(".winner-comment-container").style.display = "none";
	document.querySelector(".round-tied-comment-container").style.display =
		"none";
	state.currentMark = state.selection.mark;
	state.isPlayerTurn = true;
	state.gameOver = false;
	updateTurnIndicator();
}

function showPreview(cell) {
	if (state.gameOver || cell.dataset.mark || !state.isPlayerTurn) {
		return;
	}
	cell.innerHTML = ICONS[state.currentMark].outline;
}

function hidePreview(cell) {
	if (cell.dataset.mark) {
		return;
	}
	cell.innerHTML = "";
}

function placeMark(cell, mark) {
	cell.dataset.mark = mark;
	cell.innerHTML = ICONS[mark].filled;
}

function getWinningMove(board, mark) {
	for (const combo of WINNING_COMBINATIONS) {
		const [a, b, c] = combo;
		const marks = [board[a], board[b], board[c]];
		const emptyIndex = marks.indexOf(null);

		if (emptyIndex !== -1 && marks.filter((m) => m === mark).length === 2) {
			return combo[emptyIndex];
		}
	}

	return null;
}

function getEmptyIndexes(board) {
	return board.map((mark, index) => (mark ? -1 : index)).filter((i) => i >= 0);
}

function getBestMove() {
	const board = cells.map((cell) => cell.dataset.mark || null);
	const cpuMark = state.currentMark;
	const playerMark = getOppositeMark(cpuMark);

	const winningMove = getWinningMove(board, cpuMark);

	if (winningMove !== null) {
		return winningMove;
	}

	const blockingMove = getWinningMove(board, playerMark);

	if (blockingMove !== null && Math.random() < CPU_BLOCK_CHANCE) {
		return blockingMove;
	}

	const emptyIndexes = getEmptyIndexes(board);

	return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
}

function cpuMove() {
	const emptyCells = getEmptyCells();

	if (emptyCells.length === 0) {
		state.gameOver = true;
		return;
	}

	placeMark(cells[getBestMove()], state.currentMark);

	if (checkGameEnd()) {
		return;
	}

	advanceTurn();
}

function scheduleCpuMove() {
	state.isPlayerTurn = false;
	setTimeout(() => {
		cpuMove();
		state.isPlayerTurn = true;
	}, CPU_DELAY);
}

function onCellClick(event) {
	const cell = event.currentTarget;

	if (state.gameOver || cell.dataset.mark || !state.isPlayerTurn) {
		return;
	}

	placeMark(cell, state.currentMark);

	if (checkGameEnd()) {
		return;
	}

	advanceTurn();

	if (state.selection.mode === "cpu") {
		scheduleCpuMove();
	}
}

function initPage2() {
	state.selection = loadSelection();
	clearBoard();

	document
		.querySelector(".winner-comment-container .quit-btn")
		.addEventListener("click", () => {
			window.location.href = "../index.html";
		});
	document
		.querySelector(".winner-comment-container .nxt-btn")
		.addEventListener("click", clearBoard);
	document
		.querySelector(".round-tied-comment-container .quit-btn-container")
		.addEventListener("click", () => {
			window.location.href = "../index.html";
		});
	document
		.querySelector(".round-tied-comment-container .restart-btn-container")
		.addEventListener("click", clearBoard);

	document
		.querySelector(".reset-game-container")
		.addEventListener("click", () => {
			document.querySelector(".winner-container").style.display = "flex";
			document.querySelector(".restart-comment-container").style.display =
				"flex";
		});
	document
		.querySelector(".restart-comment-container .quit-btn-container")
		.addEventListener("click", () => {
			document.querySelector(".winner-container").style.display = "none";
			document.querySelector(".restart-comment-container").style.display =
				"none";
		});
	document
		.querySelector(".restart-comment-container .restart-btn-container")
		.addEventListener("click", () => {
			window.location.href = "../index.html";
		});

	cells.forEach((cell) => {
		cell.addEventListener("mouseenter", () => showPreview(cell));
		cell.addEventListener("mouseleave", () => hidePreview(cell));
		cell.addEventListener("click", onCellClick);
	});

	if (state.selection.mode === "cpu" && state.selection.mark === "O") {
		state.currentMark = getOppositeMark(state.currentMark);
		updateTurnIndicator();
		scheduleCpuMove();
	}
}

document.addEventListener("DOMContentLoaded", initPage2);
