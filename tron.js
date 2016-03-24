$(function(){
    // replace one of the FillSpaceAI or DefaultPlayerAIs with
    // LR/ZXPlayerAI to play the game
    window.game = new Game({
        gridLength: 61,
        frameRate: 60,
        players: 4,
        playerAI: [
            FillSpaceAI,
            FillSpaceAI,
            FillSpaceAI,
            FillSpaceAI
        ]
    });
    window.gridView = new GridView(game, 8);
    gridView.$styles.appendTo('body');
    gridView.render().$el.appendTo('body');
    $('#start-game').on('click', function() {
        game.start();
    });
    $('#stop-game').on('click', function() {
        game.stop();
    });
});

var Extendable = {
    extend: function(props) {
        var parent = this;
        var child = function() { return parent.apply(this); };
        child.prototype = new this;
        _.extend(child.prototype, props);
        _.extend(child, Extendable);
        return child;
    }
};

var PlayerAI = function() {};

_.extend(PlayerAI.prototype, {
    init: function() {},
    reset: function() {},
});

_.extend(PlayerAI, Extendable);

var HumanPlayerAI = PlayerAI.extend({
    left: 90,
    right: 88,
    reset: function() {
        this.nextMove = [];
    },
    init: function() {
        this.nextMove = [];
        var self = this;
        $("body").on("keydown", function(evt) {
            if(evt.which == self.left) {
                self.nextMove.push("left");
            }
            if(evt.which == self.right) {
                self.nextMove.push("right");
            }
        });
    },
    generateMove: function() {
        var nextMove = this.nextMove.shift();
        if (!nextMove) {
            nextMove = "stay";
        }
        return nextMove;
    }
});

var ZXPlayerAI = HumanPlayerAI.extend({
    left: 90,
    right: 88
});

var LRPlayerAI = HumanPlayerAI.extend({
    left: 37,
    right: 39
});

var DefaultPlayerAI = PlayerAI.extend({
    generateMove: function(gameState, grid, player) {
        var row = player.row;
        var col = player.col;
        var direction = player.direction;
        var options = [];
        if (!grid.isCellFilled(row - 1, col)) {
            //north OK
            switch(direction) {
                case 'n':
                    options.push('stay');
                    break;
                case 'w':
                    options.push('right');
                    break;
                case 'e':
                    options.push('left');
                    break;
            }
        }
        if (!grid.isCellFilled(row + 1, col)) {
            //south OK
            switch(direction) {
                case 's':
                    options.push('stay');
                    break;
                case 'e':
                    options.push('right');
                    break;
                case 'w':
                    options.push('left');
                    break;
            }
        }
        if (!grid.isCellFilled(row, col + 1)) {
            //east OK
            switch(direction) {
                case 'e':
                    options.push('stay');
                    break;
                case 's':
                    options.push('left');
                    break;
                case 'n':
                    options.push('right');
                    break;
            }
        }
        if (!grid.isCellFilled(row, col - 1)) {
            //west OK
            switch(direction) {
                case 'w':
                    options.push('stay');
                    break;
                case 'n':
                    options.push('left');
                    break;
                case 's':
                    options.push('right');
                    break;
            }
        }
        return _.shuffle(options)[0];
    }
});

var Events = {
    on: function(event, cb) {
        if (!this.callbacks) {
            this.callbacks = {};
        }
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(cb);
    },
    trigger: function(event) {
        var self = this;
        _.each(this.callbacks[event], function(cb) {
            cb.apply(self, self.toJSON());
        });
    }
};

var Cell = function(row, col) {
    this.row = row;
    this.col = col;
};

_.extend(Cell.prototype, {
    bike: false,
    playerNum: -1,
    toJSON: function() {
        return {
            bike: this.bike,
            playerNum: this.playerNum
        };
    }
}, Events);

var Player = function(number, ai) {
    this.number = number;
    this.ai = ai;
    this.score = 0;
};

_.extend(Player.prototype, {
    alive: true,
    direction: 'n', //n, s, e, w
    points: 0,
    reset: function() {
        this.ai.reset();
    },
    move: function(gameState, grid) {
        var turn = this.ai.generateMove(gameState, grid, this);
        var direction = this.direction;
        switch (turn) {
            case 'left':
                switch(direction) {
                    case 'e':
                        this.direction = 'n';
                        this.row -= 1;
                        break;
                    case 'n':
                        this.direction = 'w';
                        this.col -= 1;
                        break;
                    case 's':
                        this.direction = 'e';
                        this.col += 1;
                        break;
                    case 'w':
                        this.direction = 's';
                        this.row +=1;
                        break;
                }
                break;
            case 'right':
                switch(direction) {
                    case 'e':
                        this.direction = 's';
                        this.row += 1;
                        break;
                    case 'n':
                        this.direction = 'e';
                        this.col += 1;
                        break;
                    case 's':
                        this.direction = 'w';
                        this.col -= 1;
                        break;
                    case 'w':
                        this.direction = 'n';
                        this.row -= 1;
                        break;
                }
                break;
            case 'stay':
                switch(direction) {
                    case 'e':
                        this.col += 1;
                        break;
                    case 'n':
                        this.row -= 1;
                        break;
                    case 's':
                        this.row += 1;
                        break;
                    case 'w':
                        this.col -= 1;
                        break;
                }
                break;
        }
    },
    toJSON: function() {
        return {
            number: this.number,
            row: this.row,
            col: this.col,
            direction: this.direction
        };
    }
}, Events);

var Grid = function(size) {
    this.size = size;
    this.cells = [];
    var cell, row, col;
    var numCells = size * size;
    this.numCells = numCells;
    for (var i = 0; i < numCells; i++) {
        row = Math.floor(i / size);
        col = i % size;
        cell = new Cell(row, col);
        this.cells.push(cell);
        // cell.on(this.trigger);
    }
};

_.extend(Grid.prototype, {
    getCell: function(row, col) {
        var index = (row * this.size) + col;
        return this.cells[index];
    },
    isCellFilled: function(row, col) {
        if ( row < 0 || col < 0 || col >= this.size || row >= this.size) {
            return true;
        }
        var cell = this.getCell(row, col);
        if(!cell) {
            return true;
        }
        return cell.playerNum > -1;
    },
    reset: function() {
        _.each(this.cells, function(cell) {
            cell.playerNum = -1;
            cell.bike = false;
        });
    },
    toJSON: function() {
        return {
            cells: _.invoke(this.cells, 'toJSON')
        };
    }
}, Events)

var Game = function(opts) {
    opts = opts || {};
    _.defaults(opts, {
        gridLength: 61, //cells
        players: 4,
        playerAI : [
            DefaultPlayerAI,
            DefaultPlayerAI,
            DefaultPlayerAI,
            DefaultPlayerAI
        ],
        frameRate: 4, //frames per second
        rounds: 10
    });
    this.frameRate = opts.frameRate;
    this.players = [];
    for (var i = 0; i < opts.players; i++) {
        var ai = new opts.playerAI[i]();
        ai.init();
        this.players.push(new Player(i, ai));
    }
    this.grid = new Grid(opts.gridLength);
};

_.extend(Game.prototype, {
    round: 1,
    start: function() {
        var cell;
        this.grid.reset();
        this.trigger('start');

        this.players[0].row = 0;
        this.players[0].col = 30;
        this.players[0].direction = 's';
        this.players[0].alive = true;
        cell = this.grid.getCell(0, 30);
        cell.bike = true;
        cell.playerNum = 0;
        cell.trigger('update');

        this.players[1].row = 30;
        this.players[1].col = 60;
        this.players[1].direction = 'w';
        this.players[1].alive = true;
        cell = this.grid.getCell(30, 60);
        cell.bike = true;
        cell.playerNum = 1;
        cell.trigger('update');

        this.players[2].row = 60;
        this.players[2].col = 30;
        this.players[2].direction = 'n';
        this.players[2].alive = true;
        cell = this.grid.getCell(60, 30);
        cell.bike = true;
        cell.playerNum = 2;
        cell.trigger('update');

        this.players[3].row = 30;
        this.players[3].col = 0;
        this.players[3].direction = 'e';
        this.players[3].alive = true;
        cell = this.grid.getCell(30, 0);
        cell.bike = true;
        cell.playerNum = 3;
        cell.trigger('update');

        _.invoke(this.players, "reset");

        var self = this;
        this.interval = window.setInterval(function() {
            self.tick();
        }, 1000 / self.frameRate);
    },
    stop: function() {
        window.clearInterval(this.interval);
    },
    tick: function() {
        var cells = this.move();
        this.check(cells);
    },
    move: function() {
        var self = this;
        var cells = [];
        _.each(this.players, function(player) {
            cells.push(self.grid.getCell(player.row, player.col));
            player.move(self.toJSON(), self.grid);
        });
        return cells;
    },
    check: function(cells) {
        var self = this;
        var playerCount = this.players.length;
        var aliveCount = playerCount;
        var livingPlayer, died, cell;
        var playersOnSameCell = this.playersOnSameCell();

        _.each(playersOnSameCell, function(player) {
            aliveCount--;
            player.alive = false;
        });

        _.each(this.players, function(player, i) {
            if (!player.alive) {
                aliveCount--;
            } else {
                died = self.grid.isCellFilled(player.row, player.col);
                if (died) {
                    aliveCount--;
                    player.alive = false;
                } else if(player.alive) {
                    livingPlayer = player;
                    cells[i].bike = false;
                    cells[i].trigger('update');
                    var cell = self.grid.getCell(player.row, player.col);
                    cell.bike = true;
                    cell.playerNum = player.number;
                    cell.trigger('update');
                }
            }
        });
        if (aliveCount < 2) {
            this.win(livingPlayer);
        }
    },
    playersOnSameCell: function() {
        var matches = {};
        _.each(this.players, function(player) {
            var key = player.row + "X" + player.col;
            if(!matches[key]) {
                matches[key] = [];
            }
            matches[key].push(player);
        });
        var players = []
        for(key in matches) {
            if(matches[key].length > 1) {
                players = players.concat(matches[key]);
            }
        }
        return players;
    },
    win: function(player) {
        this.stop();
        if(player) {
            player.score++;
        }
        this.round++;
        this.trigger('win');
        var self = this;
        window.setTimeout(function() {
            self.start();
        }, 4000);
    },
    toJSON: function() {
        return {
            players: _.invoke(this.players, 'toJSON'),
            grid: this.grid.toJSON()
        };
    }
}, Events);

var ScoreBoard = function(game) {
    this.players = game.players;
    this.game = game;
    this.$el = $(".scoreboard");
    var self = this;
};

_.extend(ScoreBoard.prototype, {
    updateScores: function() {
        $scores = this.$el.find(".player h1");
        _.each(this.players, function(player, index) {
            $($scores[index]).text(player.score);
        });
        this.$el.find(".round h1").text(this.game.round);
    }
});

var CellView = function(cell) {
    this.cell = cell;
    this.$el = $('<div class="cell"></div>');
    var self = this;
    this.cell.on('update', function() {
        self.update();
    });
};

_.extend(CellView.prototype, {
    update: function() {
        var player = this.cell.playerNum;
        var bike = this.cell.bike;
        if(player > -1) {
            this.$el.addClass('tron' + (player + 1));
        }
        if(bike) {
            this.$el.addClass('bike');
        } else {
            this.$el.removeClass('bike');
        }
    }
});

var GridView = function(game, cellSize) {
    this.scoreboard = new ScoreBoard(game);
    this.game = game;
    this.cellSize = cellSize;
    this.$styles = $('<style type="text/css">.cell{ height: ' + (cellSize-1) + 'px; width: ' + (cellSize-1) + 'px;}.grid{ width: ' + (game.grid.size*cellSize) + 'px; height: ' + (game.grid.size*cellSize) + 'px;} </style>');
    this.cellViews = [];
    for (var i = 0; i < game.grid.numCells; i++) {
        this.cellViews.push(new CellView(game.grid.cells[i]));
    }
    var self = this;
    this.game.on('start', function() {
        self.reset();
    });
    this.game.on('win', function() {
        self.scoreboard.updateScores();
    });
};

_.extend(GridView.prototype, {
    $el: $('<div class="grid"></div>'),
    render: function() {
        var self = this;
        _.each(this.cellViews, function(cv) {
            self.$el.append(cv.$el);
        });
        return this;
    },
    reset: function() {
        this.$el.find('.cell')
        .removeClass('bike')
        .removeClass('tron1')
        .removeClass('tron2')
        .removeClass('tron3')
        .removeClass('tron4');
    }
});
