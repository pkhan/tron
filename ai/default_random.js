var DefaultRandomAI = PlayerAI.extend({
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
})
