;(function () {
  window.Serpent = window.Serpent || {};
  var Util = Serpent.Util;

  var Snake = window.Serpent.Snake = function Snake(game, id, dir, segments) {
    this.game = game;
    this.id = id;
    this.dir = dir;
    this.segments = segments;
    this.turnsSinceEatingApple = 3;
  };

  Snake.DIFFS = {
    'N': [-1, 0],
    'E': [0, 1],
    'S': [1, 0],
    'W': [0, -1]
  };

  Snake.HEADING = {
    'N': Math.PI / 2,
    'E': 0,
    'S': 3 * Math.PI / 2,
    'W': Math.PI
  };

  Snake.OPPOSITEDIRS = {
    'N': 'S',
    'E': 'W',
    'S': 'N',
    'W': 'E'
  };

  Snake.prototype.advance = function () {
    if (this.turnsSinceEatingApple > 2){
      this.segments.pop();
    } else {
      this.turnsSinceEatingApple++;
    }

    var nextPos = this.nextPos();
    var matchesWon;

    if (this.containsPos(nextPos) || (this.enemy() && this.enemy().containsPos(nextPos))) {
      var winner = this.enemy();
      matchesWon = parseInt($('.match-score-' + winner.id).text());
      $('.match-score-' + winner.id).text(matchesWon + 1);
      this.game.restart('Player ' + winner.id + ' wins this round!');
      return true; // breaks loop in calling function
    }
    else if (Util.arraysEqual(nextPos, this.game.apple)) {
      this.turnsSinceEatingApple = 0;
      var score = parseInt($('.score-' + this.id).text()) + 1;
      if (score === 4) {
        matchesWon = parseInt($('.match-score-' + this.id).text());
        $('.match-score-' + this.id).text(matchesWon + 1);
        this.game.restart('Player ' + this.id + ' wins this round!');
      }
      $('.score-' + this.id).text(score);
      this.game.setApple();
    }

    this.segments.unshift(nextPos);
  };

  Snake.prototype.appleAngle = function () {
    var appleX = this.game.apple[1];
    var appleY = this.game.apple[0];
    var nextPos = this.nextPos();
    var headX = nextPos[1];
    var headY = nextPos[0];
    var atan = Math.atan( (appleX - headX) / (headY - appleY) );
    return (headY < appleY) ? (Math.PI + atan) : atan;
  };

  Snake.prototype.changeDir = function (newDir) {
    if (this.alreadyChangedDir || newDir === this.oppositeDir()) { return; }
    this.dir = newDir;
    this.alreadyChangedDir = true;
  };

  Snake.prototype.containsPos = function (pos) {
    return this.segments.some(function (segment) {
      return segment.every(function (coord, i) {
        return coord === pos[i];
      });
    });
  };

  Snake.prototype.drawHead = function (pos) {
    var $head = this.game.cellAt(pos);
    var $leftEye = $('<div class="eye left">').
      append($('<div class="pupil snake-' + this.id + '">'));
    var $rightEye = $('<div class="eye right">').
      append($('<div class="pupil snake-' + this.id + '">'));
    $head.append($leftEye, $rightEye);
    $head.addClass('head ' + (this.dir || ''));
    $('.pupil.snake-' + this.id).css('transform', 'rotate(' + this.appleAngle() + 'rad)');
  };

  Snake.prototype.enemy = function () {
    var enemyId = this.id === 1 ? 2 : 1;
    return this.game['snake' + enemyId];
  };

  Snake.prototype.head = function () {
    return this.segments[0];
  };

  Snake.prototype.heading = function () {
    return Snake.HEADING[this.dir];
  };

  Snake.prototype.nextPos = function () {
    return this.nextPosInDir(this.dir);
  };

  Snake.prototype.nextPosInDir = function (dir) {
    var diff = Snake.DIFFS[dir];
    return this.game.wrap(Util.vectorSum(this.head(), diff));
  };

  Snake.prototype.oppositeDir = function () {
    return Snake.OPPOSITEDIRS[this.dir];
  };

  Snake.prototype.tail = function () {
    return this.segments.slice(-1)[0];
  };
}());
