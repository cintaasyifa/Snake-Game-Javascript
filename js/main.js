const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const w = canvas.width;
const h = canvas.height;

const blockW = w / 48;
const blockH = h / 30;

const modal = document.getElementById('modal');
const modalOver = document.getElementById('modal-over');
const username = document.getElementById('username');
const btnstart = document.getElementById('play');

const btnrewind = document.getElementById('rewind');
const btncancel = document.getElementById('cancel');
const slider = document.getElementById('slider');

const score = document.querySelector('.score');
const time = document.querySelector('.timer');

const table = document.getElementById('table');
let history = [];
let leaderBoard = JSON.parse(localStorage.getItem('leaderBoard')) || [];


function activeBtn(value) {
	if (value == '') {
		btnstart.style.cursor = 'not-allowed';
		btnstart.disabled = true;
		return;
	}

	btnstart.style.cursor = 'pointer';
	btnstart.disabled = false;
}

function play() {
	modal.style.display = 'none';
	init();
}


function init() {
	timer = 0;
	game = new Game();

	main();
}

function main() {
	this.snakeInterval = setInterval(() => {
		ctx.clearRect(0, 0, blockW, blockH);
		game.drawBg();
		game.update();
	}, 250);

	this.addFoodInterval = setInterval(() => {
		while (game.food.length < 5) {
			game.food.push(new Food());

			game.food.forEach((f, i) => {
				game.snake.body.forEach((s, j) => {
					if (f.x == s.x && f.y == s.y) {
						game.food.pop();
					}
				});
			});
		}
	}, 3000);

	this.removeFoodInterval = setInterval(() => {
		if (game.food.length > 3) {
			game.food.shift();
		}
	}, 5000);

	//update waktu
	this.timeInterval = setInterval(() => {
		timer++;

		let hour = Math.floor(timer / 3600).toString();
		let mins = Math.floor((timer - (hour * 3600)) / 60).toString();
		let second = Math.floor(timer - ((hour * 3600) + (mins * 60))).toString();

		if (hour.length != 2) {
			hour = `0${hour}`;
		}
		
		if (mins.length != 2) {
			mins = `0${mins}`;
		}
		
		if (second.length != 2) {
			second = `0${second}`;
		}

		time.innerHTML = `Time: ${hour}:${mins}:${second}`;
	}, 1000);

//save history
	this.saveHistory = setInterval(() => {
		if (history.length >= 5) {
			history.shift();
		}

		history.push({
			snake: JSON.parse(JSON.stringify(game.snake)),
			food: JSON.parse(JSON.stringify(game.food)),
			score: game.score
		});
	}, 1000);
}
function activeRewind() {
	btncancel.style.display = 'block';
	slider.style.display = 'block';

	//clear all game
	clearInterval(this.snakeInterval);
	clearInterval(this.addFoodInterval);
	clearInterval(this.removeFoodInterval);
	clearInterval(this.timeInterval);
	clearInterval(this.saveHistory);
}

//histori
function rewind(val) {
	ctx.clearRect(0, 0, blockW, blockH);
	game.drawBg();

	history[val].snake.body.forEach((s) => {
		ctx.fillStyle = 'yellow';
		ctx.fillRect(s.x, s.y, blockW, blockH)
	});

	history[val].food.forEach((f) => {
		ctx.fillStyle = 'red';
		ctx.fillRect(f.x, f.y, blockW, blockH)
	});

	score.innerHTML = `Score: ${history[val].score}`;
}


function cancel() {
	btncancel.style.display = 'none';
	slider.style.display = 'none';

	main();
}