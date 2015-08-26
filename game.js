;(function () {
  window.Serpent = window.Serpent || {};

  var Game = window.Serpent.Game = function Game($el) {
    var self = this;

    this.$board = $el;
    this.rows = localStorage.getItem('rows') || Game.ROWS;
    this.cols = localStorage.getItem('cols') || Game.COLS;
    this.speed = localStorage.getItem('speed') || 1000 / Game.INTERVAL;

    $('.rows').val(this.rows);
    $('.cols').val(this.cols);
    $('.speed').val(this.speed);

    this.setupBoard();
    this.setupSnakes();
    this.setApple();

    this.ai = new Serpent.Ai(this);

    var ai1On = JSON.parse(localStorage.getItem('ai1On'));
    var ai2On = JSON.parse(localStorage.getItem('ai2On'));
    this.ai1On = ai1On === null ? true : ai1On;
    this.ai2On = ai2On === null ? false : ai2On;
    if (this.ai1On) { $('.player-1-ai').click() }
    if (this.ai2On) { $('.player-2-ai').click() }

    this.step();

    $(document).on('keydown', this.handleKeydown.bind(this));
    $('.speed').on('change', this.changeSpeed.bind(this));
    $('.rows').on('change', this.changeDim.bind(this, 'rows'));
    $('.cols').on('change', this.changeDim.bind(this, 'cols'));
    $('.toggle').on('toggle', function (event, aiState) {
      var $target = $(event.currentTarget);
      var playerId = $target.data('player');
      var aiKey = 'ai' + playerId + 'On';
      self[aiKey] = aiState;
      localStorage.setItem(aiKey, aiState);
    });
  };

  Game.CELL_SIZE = 30;
  Game.EYE_SIZE = 10;
  Game.INTERVAL = 125;
  Game.ROWS = 10;
  Game.COLS = 15;
  Game.ARROWDIRS = {
    37: 'W',
    38: 'N',
    39: 'E',
    40: 'S',

    65: 'W',
    87: 'N',
    68: 'E',
    83: 'S'
  };

  Game.prototype.cellAt = function (pos) {
    return $('#' + pos[0] + '-' + pos[1]);
  };

  Game.prototype.changeDim = function (dimension, event, size) {
    localStorage.setItem(dimension, size);
    this[dimension] = size;
    this.setupBoard();
    this.setApple();
  };

  Game.prototype.changeSpeed = function (event, speed) {
    localStorage.setItem('speed', speed);
    this.speed = speed;
    if (this.showingMessage) { return; }
    clearInterval(this.interval);
    this.interval = setInterval(this.step.bind(this), 1000 / speed);
  };

  Game.prototype.colorBody = function (pos, snakeNumber) {
    this.cellAt(pos).addClass('body snake-' + snakeNumber).empty();
    this.cellAt(pos).removeClass('head N E S W');
  };

  Game.prototype.handleKeydown = function (event) {
    var snake1ArrowKeys = [65, 68, 83, 87];
    var snake2ArrowKeys = [37, 38, 39, 40];
    var key = event.which;

    if (snake1ArrowKeys.indexOf(key) > -1) {
      event.preventDefault();

      if (this.ai1On) { return; }

      var newDir = Game.ARROWDIRS[key];
      this.snake1.changeDir(newDir);
    }
    else if (snake2ArrowKeys.indexOf(key) > -1) {
      event.preventDefault();

      if (this.ai2On) { return; }

      var newDir = Game.ARROWDIRS[key];
      this.snake2.changeDir(newDir);
    }
  };

  Game.prototype.randomApple = function (){
    var row = Math.floor(Math.random() * this.rows);
    var col = Math.floor(Math.random() * this.cols);
    var applePos = [row, col];
    while(this.snake1.containsPos(applePos)){
      row = Math.floor(Math.random() * this.rows);
      col = Math.floor(Math.random() * this.cols);
      applePos = [row, col];
    }
    return applePos;
  };

  Game.prototype.restart = function (message) {
    clearInterval(this.interval);
    setTimeout(function () {
      $('.cell').removeClass('snake-1 snake-2 head apple');
      $('.eye').remove();
      $('.score-1').text(0);
      $('.score-2').text(0);

      this.gameOver = false;
      this.setupSnakes();

      this.timeoutMessage(message, 3, function () {
        this.setApple();
        this.step();
        this.interval = setInterval(this.step.bind(this), 1000 / this.speed);
      }.bind(this));
    }.bind(this), 1000);
  };

  Game.prototype.setApple = function () {
    var oldApple = this.apple;
    oldApple && $('#' + oldApple[0] + '-' + oldApple[1]).removeClass('apple');
    var apple = this.apple = this.randomApple();
    $('#' + apple[0] + '-' + apple[1]).addClass('apple');
  };

  Game.prototype.setupBoard = function () {
    this.$board.empty();

    this.$board.css('width', Game.CELL_SIZE * this.cols);
    this.$board.css('height', Game.CELL_SIZE * this.rows);

    for (var row = 0; row < this.rows; row++) {
      var $row = $('<div class="row">');

      for (var col = 0; col < this.cols; col++) {
        $cell = $('<div class="cell">');
        $cell.attr('id', row + '-' + col);
        $row.append($cell);
      }

      this.$board.append($row);
    }
  };

  Game.prototype.setupSnakes = function () {
    this.snake1 = new Serpent.Snake(this, 1, 'E', [[1, 3], [1, 2], [1, 1]]);
    var row = this.rows - 2;
    var col = this.cols - 1;
    this.snake2 = new Serpent.Snake(this, 2, 'W',
      [[row, col - 3], [row, col - 2], [row, col - 1]]);
  };

  Game.prototype.start = function () {
    [this.snake1, this.snake2].forEach(function (snake, snakeIdx) {
      snake.segments.forEach(function (segment, i) {
        if (i === 0) { snake.drawHead(segment); }
        else { game.colorBody(segment, snakeIdx + 1); }
      });
    });
    this.interval = setInterval(this.step.bind(this), 1000 / this.speed);
  };

  Game.prototype.step = function () {
    var self = this;

    if (this.gameOver) { return; }
     // allow players to move again...
    this.snake1.alreadyChangedDir = false;
    this.snake2.alreadyChangedDir = false;

    if (this.ai1On) { this.ai.turn(this.snake1); };
    if (this.ai2On) { this.ai.turn(this.snake2); };

    // #some (rather than #forEach) allows breaking out of loop...
    [self.snake1, self.snake2].some(function (snake, i) {
      var oldHead = snake.head();
      var newHead = snake.nextPos();
      var tail = snake.tail();

      self.colorBody(oldHead, i + 1);
      snake.drawHead(newHead);
      self.uncolor(tail);

      return snake.advance(); // returns true if game is over to break loop
    });
  };

  Game.prototype.timeoutMessage = function (content, time, callback) {
    this.showingMessage = true;
    $message = $('<div class="message">');
    $content = $('<p class="content">' + content + '</p>');
    $countdown = $('<p>Restarting in <span class="countdown">' + time + '</span>...</p>');
    $message.append($content).append($countdown);
    this.$board.append($message);

    var interval = setInterval(function () {
      $('.countdown').text(--time);
    }, 1000);

    setTimeout(function () {
      clearInterval(interval);
      $message.remove();
      this.showingMessage = false;
      callback();
    }.bind(this), time * 1000);
  };

  Game.prototype.uncolor = function (pos) {
    $cell = this.cellAt(pos);
    $cell.removeClass('snake-1 snake-2');
  };

  Game.prototype.wrap = function (pos) {
    return pos.map(function (coord, i) {
      var max = (i === 0 ? this.rows - 1 : this.cols - 1);

      if (coord < 0) {
        return coord + max + 1;
      } else if (coord > max) {
        return coord - max - 1;
      } else {
        return coord;
      }
    }.bind(this));
  };
}());
