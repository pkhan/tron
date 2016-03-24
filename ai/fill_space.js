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
  movement: {
    n: { x:0, y:-1 },
    e: { x:1, y:0 },
    s: { x:0, y:1 },
    w: { x:-1, y:0 },
  },

  reset: function() {
    this.lastMove = null;
    this.shouldDoubleBack = false;
  },

  turnToDir: function(currentDirection, turn) {
    if(turn == "left") {
      return this.leftOf[currentDirection];
    } else if (turn == "right") {
      return this.rightOf[currentDirection];
    }
    return currentDirection;
  },

  dirToTurn: function(currentDirection, newDirection) {
    var turn = "stay";
    switch (newDirection) {
      case currentDirection:
        turn = 'stay';
        break;
      case this.leftOf[currentDirection]:
        turn = 'left';
        break;
      case this.rightOf[currentDirection]:
        turn = 'right';
        break;
    }
    return turn;
  },

  playerNextMoves: function(players) {
    // Avoid game of chicken
    var self = this;
    console.log(players);
    nextPositions = [];
    _.each(players, function(player) {
      if(player.row && player.col && player.direction) {
        nextPositions.push(self.nextPos(player.row, player.col, player.direction));
      }
    });
    console.log(nextPositions);
    return nextPositions;
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
        nextMove;
      }
    } else {

      if (!this.isOk(row, col, direction, grid)) {
        this.shouldDoubleBack = true;
        if (this.isOk(row, col, this.rightOf[direction], grid)) {
          nextMove = "right";
        }
        else {
          nextMove = "left";
        }
      }

    }

    var nextDirection = this.turnToDir(nextMove);
    var weights = this.weightDirections(gameState, row, col, direction, grid);
    var max = 0;
    var bestDirection = direction;
    var weight;

    if(weights[nextMove] < 5) {
      for(dir in weights){
        weight = weights[dir];
        if(weight > max) {
          max = weight;
          bestDirection = dir;
        }
      }

      nextMove = this.dirToTurn(direction, bestDirection);
    }

    this.lastMove = nextMove;
    return nextMove;
  },

  weightDirections: function(gameState, row, col, direction, grid, weights, parent, depth) {
    if(!weights) {
      var weights = {};
    }
    if(!depth) {
      var depth = 0;
    }
    if(depth > 5) {
      return;
    }
    var directionToPosition = {};
    var finalWeights = {};
    var validDirections = [direction, this.leftOf[direction], this.rightOf[direction]];
    var self = this
    var nextPos, key;

    if(depth == 0) {
      var avoids = this.playerNextMoves(gameState.players);
      _.each(avoids, function(avoid) {
        key = avoid.row + "x" + avoid.col;
        weights[key] = 0;
      });
    }

    _.each(validDirections, function(dir) {
      nextPos = self.nextPos(row, col, dir);
      key = nextPos.row + "x" + nextPos.col;
      directionToPosition[dir] = key;

      if(weights[key] >= 0) {
        if(weights[key] >= 1 && parent) {
          weights[parent] += 1;
        }
        return;
      }

      weights[key] = 0;
      if(self.isPosOk(nextPos.row, nextPos.col, grid)) {
        weights[key] = 1;
        if(parent) {
          weights[parent] += 1;
        }
        var my_parent = parent || key;
        self.weightDirections(
          null,
          nextPos.row, 
          nextPos.col, 
          dir, 
          grid,
          weights,
          my_parent, 
          depth + 1
        );
      }
    });

    for(dir in directionToPosition){
      key = directionToPosition[dir];
      finalWeights[dir] = weights[key];
    }
    return finalWeights;
  },

  isOk: function(row, col, direction, grid) {
    var nextPos = this.nextPos(row, col, direction)
    return this.isPosOk(nextPos.row, nextPos.col, grid);
  },

  isPosOk: function(row, col, grid) {
    return !grid.isCellFilled(row, col);
  },

  nextPos: function(row, col, direction) {
    var movement = this.movement[direction];
    return {
      row: row + movement.y,
      col: col + movement.x
    }
  },


});
