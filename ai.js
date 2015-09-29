;(function () {
  window.Serpent = window.Serpent || {};

  var Ai = window.Serpent.Ai = function Ai(game) {
    var self = this;
    self.game = game;
    self.snake1 = game.snake1;
    self.snake2 = game.snake2;
  };

  Ai.prototype.collisionWillOccur = function (snake, dir) {
    nextPos = snake.nextPosInDir(dir);
    return _.includesArray(snake.segments, nextPos) ||
      _.includesArray(snake.enemy().segments, nextPos) ||
      _.arraysEqual(nextPos, snake.enemy().nextPos());
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
    // 2% chance random turn
    if (rand < 0.02) { newDir = _.sample(['N', 'E', 'S', 'W']); }
    // 48% chance stay straight
    else if (rand < 0.5) { newDir = snake.dir; }
    // turn N or S if it would help
    else if (appleRow < snakeRow && snake.dir !== 'N') { newDir = 'N'; }
    else if (appleRow > snakeRow && snake.dir !== 'S') { newDir = 'S'; }
    // turn E or W if it would help
    else if (appleCol > snakeCol && snake.dir !== 'E') { newDir = 'E'; }
    else if (appleCol < snakeCol && snake.dir !== 'W') { newDir = 'W'; }
    // we are heading toward the apple; continue toward it
    else { newDir = snake.dir; }

    if (this.collisionWillOccur(snake, newDir)) {
      newDir = this.turnLeftOrRight(newDir);
    }

    snake.changeDir(newDir);
  };

  Ai.prototype.turnLeftOrRight = function (dir) {
    if (dir === 'N' || dir === 'S') { return _.sample(['E', 'W']); }
    if (dir === 'E' || dir === 'W') { return _.sample(['N', 'S']); }
  };
}());
