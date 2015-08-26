;(function () {
  window.Serpent = window.Serpent || {};

  var Ai = window.Serpent.Ai = function Ai(game) {
    var self = this;
    self.game = game;
    self.snake1 = game.snake1;
    self.snake2 = game.snake2;
  };

  Ai.prototype.turn = function (snake) {
    var self = this;
    var head = snake.head();

    var appleRow = self.game.apple[0];
    var appleCol = self.game.apple[1];
    var snakeRow = head[0];
    var snakeCol = head[1];


    var newDir;
    var rand = Math.random();
    if (rand < 0.1) { newDir = _.sample(['N', 'E', 'S', 'W']); }
    else if (rand < 0.4) { newDir = snake.dir; }
    else if (appleRow < snakeRow && snake.dir !== 'N') { newDir = 'N'; }
    else if (appleRow > snakeRow && snake.dir !== 'S') { newDir = 'S'; }
    else {
      if (appleCol > snakeCol && snake.dir !== 'E') { newDir = 'E'; }
      else if (appleCol < snakeCol && snake.dir !== 'W') { newDir = 'W'; }
      else { newDir = snake.dir; } // continue course
    }

    snake.changeDir(newDir);
  };
}());
