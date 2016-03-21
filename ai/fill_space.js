var FillSpaceAI = PlayerAI.extend({
  shouldDoubleBack: false,
  lastMove: null,
  rightOf: {
    'n': 'e',
    'e': 's',
    's': 'w',
    'w': 'n'
  },
  leftOf: {
    'n': 'w',
    'e': 'n',
    's': 'e',
    'w': 's'
  },
  reset: function() {
    this.lastMove = null;
    this.shouldDoubleBack = false;
  },
  generateMove: function(gameState, grid, player) {
    var row = player.row;
    var col = player.col;
    var direction = player.direction;
    var nextMove = "stay";

    if(this.shouldDoubleBack) {
      var newDir = "n";
      if (this.lastMove == "left") {
        newDir = this.leftOf[direction];
      } else {
        newDir = this.rightOf[direction];
      }
      if(this.isOk(row, col, newDir, grid)) {
        nextMove = this.lastMove;
        this.shouldDoubleBack = false;
        return nextMove;
      }
    }

    if (!this.isOk(row, col, direction, grid)) {
      this.shouldDoubleBack = true;
      if (this.isOk(row, col, this.rightOf[direction], grid)) {
        nextMove = "right";
      }
      else {
        nextMove = "left";
      }
    }
    this.lastMove = nextMove;
    return nextMove
  },

  isOk: function(row, col, direction, grid) {
    var deltaX = 0;
    var deltaY = 0;
    switch(direction) {
      case 'n':
        deltaY = -1;
        break;
      case 'e':
        deltaX = 1;
        break;
      case 's':
        deltaY = 1;
        break;
      case 'w':
        deltaX = -1;
        break;
    }
    var nextCol = col + deltaX;
    var nextRow = row + deltaY;

    return !grid.isCellFilled(nextRow, nextCol);
  },
});
