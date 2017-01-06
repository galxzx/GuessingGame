function Game (){
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();

}

function generateWinningNumber(){
	return Math.ceil(Math.random() * 100);
}

// function shuffle(arr){
// 	var newArr = [];
// 	var arrLen = arr.length;
// 	for(var i = 0; i < arrLen; i++){
// 		var randomIndex = Math.floor(Math.random() * arr.length);
// 		newArr.push(arr.splice(randomIndex,1).pop());
// 	}
// 	return newArr;
// }

//Knuth Fisher Yates Shuffule



function shuffle(arr) { //Fisher-Yates - https://bost.ocks.org/mike/shuffle/
   for(var i = arr.length-1; i > 0; i--) {
       var randomIndex = Math.floor(Math.random() * (i + 1));
       var temp = arr[i];
       arr[i] = arr[randomIndex];
       arr[randomIndex] = temp;
    }
    return arr;
}




Game.prototype.difference = function(){
	return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
	return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num) {
	if(num < 1 || num > 100 || typeof num != "number"){
		throw "That is an invalid guess.";
	}else{
		this.playersGuess = num;
		return this.checkGuess();
	}
}

Game.prototype.checkGuess = function(){
	if(this.playersGuess === this.winningNumber){
		$("#title").text("You Win");
		gameOver();
		$("#nextMessage").text("");
		return "You Win!"


	}else if(this.pastGuesses.indexOf(this.playersGuess) >= 0){
		return "You have already guessed that number.";

	}else {
		this.pastGuesses.push(this.playersGuess);
		$("#guess" + this.pastGuesses.length).text(this.playersGuess);
		if(this.pastGuesses.length === 5){
			$("#title").text("You Lose");
			gameOver();
			return "You Lose.";
		}else if(this.difference() < 10){
			return "You're burning up!";
		}else if(this.difference() < 25){
			return "You're lukewarm.";
		}else if(this.difference() < 50){
			return "You're a bit chilly.";
		}else if(this.difference() < 100){
			return "You're ice cold!"
		}
	}
}

Game.prototype.provideHint = function(){
	var hintArray = [this.winningNumber];
	hintArray.push(generateWinningNumber());
	hintArray.push(generateWinningNumber());
	return shuffle(hintArray);
}

function newGame(){
	return new Game();
}

function gameOver(){
	$("#message").text("Press Reset to Play Again!")
		$("#player-input").attr("disabled", "disabled");
		$("#submit").attr("disabled", "disabled");
		$("#hint").attr("disabled", "disabled");
		
}

function submittedGuess(currentGame){
	var guess = parseInt($("#player-input").val());
	var result = currentGame.playersGuessSubmission(guess);
	var direction = currentGame.isLower(guess)? "Guess Higher" : "Guess Lower";

	
	$("#player-input").val("");
	if(result == "You have already guessed that number."){
		$("h1").text("Guess Again!");
	}
	if(result != "You Win!" && result != "You Lose."){
		$("#nextMessage").text(result + " " + direction);
	}
}


$(document).ready(function() { 

	var currentGame = newGame();


	$("#submit").on("click", function(event){
		event.preventDefault();
		submittedGuess(currentGame);
	});

	$("#player-input").on("enter", function(event){
		event.preventDefault();
		submittedGuess(currentGame);
	});

	$("#hint").on("click", function(){
		var hints = currentGame.provideHint();
		$("#message").text("The correct guess is " + hints[0] + ", " + hints[1] + ", or " + hints[2]);
	});

	$("#reset").on("click", function(){
		currentGame = newGame();
		$(".guess").text("--");
		$("#title").text("Play the Guessing Game!");
		$("#message").text("Guess a number from 1 - 100");
		$("#nextMessage").text("");
		$("#player-input").attr("disabled", false);
		$("#submit").attr("disabled", false);
		$("#hint").attr("disabled", false);
	})

 });





























